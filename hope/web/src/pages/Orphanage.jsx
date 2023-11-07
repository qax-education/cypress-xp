import React, { useEffect, useState } from "react";

import { FiClock, FiInfo } from "react-icons/fi";

import { MapContainer as Map, Marker, TileLayer } from "react-leaflet";

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import mapIcon from '../utils/mapIcon';

import api from '../services/api';

import '../styles/pages/orphanage.css';

export default function Orphanage() {
  const navigate = useNavigate();

  const params = useParams();
  const [orphanage, setOrphanage] = useState();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {

    api.get(`orphanages/${params._id}`).then(response => {
      setOrphanage(response.data);
    }).catch((error) => {
      navigate('/404');
      console.log(error.response);
    });

  }, [params._id, navigate]);

  if (!orphanage) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={`http://localhost:3333/uploads/${orphanage.images[activeImageIndex].file_name}`} alt={orphanage.name} />

          <div className="images">
            {orphanage.images.map((image, index) => (<button key={image._id} className={activeImageIndex === index ? 'active' : ''} type="button" onClick={() => {
              setActiveImageIndex(index);
            }}>
              <img src={`http://localhost:3333/uploads/${image.file_name}`} alt={orphanage.name} />
            </button>))}
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.description}</p>

            <div className="map-container">
              <Map center={[orphanage.latitude, orphanage.longitude]} zoom={16} style={{ width: '100%', height: 280 }} dragging={false} touchZoom={false} zoomControl={false} scrollWheelZoom={false} doubleClickZoom={false}>
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (<div className="open-on-weekends">
                <FiInfo size={32} color="#39CC83" />
                Atendemos <br />
                fim de semana
              </div>) : (<div className="open-on-weekends dont-open">
                <FiInfo size={32} color="#FF6690" />
                Não Atendemos <br />
                fim de semana
              </div>)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
