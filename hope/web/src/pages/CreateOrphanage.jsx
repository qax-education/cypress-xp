import React, { useState, useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import { useNavigate } from "react-router-dom";

import * as Yup from "yup";

import Swal from "sweetalert2";
import { FiPlus, FiX } from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";

import api from "../services/api";

import "../styles/pages/create-orphanage.css";

const dataSchema = Yup.object().shape({
  name: Yup.string().required("Campo obrigatório"),
  description: Yup.string()
    .max(300, "Descrição muito longa, informe até 300 caracteres")
    .required("Campo obrigatório"),
  location: Yup.object().test("validator-location", function (location) {
    if (
      !location.latitude ||
      location.latitude === 0 ||
      !location.longitude ||
      location.longitude === 0
    ) {
      return this.createError({
        path: this.path,
        message: "Informe a localizaçao no mapa",
      });
    } else {
      return true;
    }
  }),
  images: Yup.array()
    .max(5, "Adicione até 5 fotos")
    .test("validator-images ", function (images) {
      if (images.length <= 0) {
        return this.createError({
          path: this.path,
          message: "Envie pelo menos uma foto",
        });
      } else {
        return true;
      }
    }),
  opening_hours: Yup.string().required("Campo obrigatório"),
});

export default function OrphanagesMap() {
  const navigate = useNavigate();

  const [loadPosition, setLoadPosition] = useState();
  const [selectedPosition, setSelectedPosition] = useState([0, 0]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [alertName, setAlertName] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [alertPosition, setAlertPosition] = useState("");
  const [alertImages, setAlertImages] = useState("");
  const [alertOh, setAlertOh] = useState("");

  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        navigator.geolocation.getCurrentPosition(function (geo) {
          setLoadPosition(geo.coords);
        });
        result.onchange = function () {
          console.log(result.state);
        };
      });
  }, []);

  const setLSLocation = (latitude, longitude) => {
    localStorage.setItem('hope-qa:latitude', latitude)
    localStorage.setItem('hope-qa:longitude', longitude)
  }

  const Markers = () => {
    useMapEvents({
      click(e) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
        setLSLocation(e.latlng.lat, e.latlng.lng)
      },
    });

    return selectedPosition ? (
      <Marker
        key={selectedPosition[0]}
        position={selectedPosition}
        icon={mapIcon}
        interactive={false}
      />
    ) : null;
  };

  function handleSelectImages(event) {
    if (!event.target.files) {
      return;
    }

    if (images.lenght >= 5) {
      return setImages('O limite máximo e de 5 fotos')
    }

    const selectedImages = Array.from(event.target.files);
    event.target.value = "";

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map((image) => {
      return { name: image.name, url: URL.createObjectURL(image) };
    });

    setPreviewImages(selectedImagesPreview);
  }

  function handleRemoveImage(image) {
    setPreviewImages(
      previewImages.map((image) => image).filter((img) => img.url !== image.url)
    );
    setImages(
      images.map((image) => image).filter((img) => img.name !== image.name)
    );
  }

  function resetAlerts() {
    setAlertName("");
    setAlertDescription("");
    setAlertPosition("");
    setAlertImages("");
    setAlertOh("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    resetAlerts();

    const payload = {
      name,
      description,
      location: {
        latitude: localStorage.getItem('hope-qa:latitude'),
        longitude: localStorage.getItem('hope-qa:longitude'),
      },
      images,
      opening_hours,
    };

    console.log(payload)

    try {
      await dataSchema.validate(payload, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((e) => {
          switch (e.path) {
            case "name":
              setAlertName(e.message);
              break;
            case "description":
              setAlertDescription(e.message);
              break;
            case "location":
              setAlertPosition(e.message);
              break;
            case "images":
              setAlertImages(e.message);
              break;
            case "opening_hours":
              setAlertOh(e.message);
              break;
            default:
              console.log('deu ruim')
              break;
          }
        });
      }
      return;
    }
    const data = new FormData();

    data.append("name", name);
    data.append("description", description);
    data.append("latitude", localStorage.getItem('hope-qa:latitude'));
    data.append("longitude", localStorage.getItem('hope-qa:longitude'));
    data.append("opening_hours", opening_hours);
    data.append("open_on_weekends", String(open_on_weekends));

    images.forEach((image) => {
      data.append("images", image);
    });

    await api
      .post("orphanages", data)
      .then((response) => {
        Swal.fire({
          title: "Uhull!",
          text: "Orfanato cadastrado com sucesso.",
          icon: "success",
          confirmButtonText: "Ok",
        });
        navigate("/map");
      })
      .catch((error) => {
        const { bcode } = error.response.data;
        if (bcode === 1001) {
          Swal.fire({
            title: "Oops!",
            html: `Já existe um cadastro com o nome: </br><i>${name}</i>`,
            icon: "warning",
            confirmButtonText: "Voltar",
          });
        } else {
          Swal.fire({
            title: "Oops!",
            html: `Ocorreu um erro desconhecido.</br>Veja o console do navegador :(`,
            icon: "error",
            confirmButtonText: "Voltar",
          });
        }
      });
  }
  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Cadastro</legend>

            {loadPosition && (
              <div className="map">
                <MapContainer
                  center={[loadPosition.latitude, loadPosition.longitude]}
                  scrollWheelZoom={false}
                  style={{ width: "100%", height: 280 }}
                  zoom={15}
                >
                  <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Markers />
                </MapContainer>
                {alertPosition && (
                  <small className="alert-error">{alertPosition}</small>
                )}
              </div>
            )}

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {alertName && <small className="alert-error">{alertName}</small>}
            </div>

            <div className="input-block">
              <label htmlFor="description">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              {alertDescription && (
                <small className="alert-error">{alertDescription}</small>
              )}
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) => {
                  return (
                    <div key={image.url}>
                      <span
                        className="remove-image"
                        onClick={() => handleRemoveImage(image)}
                      >
                        <FiX size={18} color="#ff669d" />
                      </span>
                      <img src={image.url} alt={name} className="new-image" />
                    </div>
                  );
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input
                multiple
                onChange={handleSelectImages}
                type="file"
                id="image[]"
              />

              {alertImages && (
                <small className="alert-error">{alertImages}</small>
              )}
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcinamento</label>
              <input
                id="opening_hours"
                name="opening_hours"
                value={opening_hours}
                onChange={(event) => setOpeningHours(event.target.value)}
              />
              {alertOh && <small className="alert-error">{alertOh}</small>}
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="save-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
