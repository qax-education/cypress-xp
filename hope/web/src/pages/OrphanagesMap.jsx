import React, { useEffect, useState } from 'react';

import { FiArrowRight, FiPlus } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Leaflet from 'leaflet';

import mapMarkerImg from '../assets/map-marker.svg';
import logoImg from '../assets/logo.svg';
import geek from '../assets/geek.svg';

import '../styles/pages/orphanages-map.css';

import api from '../services/api';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2]
});

function OrphanagesMap() {
  const [selectedPosition, setSelectedPosition] = useState();
  const [orphanages, setOrphanages] = useState([]);

  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        navigator.geolocation.getCurrentPosition(function (geo) {
          setSelectedPosition(geo.coords);
        });
        api.get('orphanages').then(response => {
          setOrphanages(response.data);
        });
        result.onchange = function () {
          console.log(result.state);
        };
      });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <Link to={'/'}>
            <img src={logoImg} alt="Hope" />
          </Link>
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita {':)'}</p>
        </header>

        <footer>
          <img src={geek} alt="Geek" />
          <span>Semeando esperança, colhendo sorrisos</span>
        </footer>
      </aside>

      {selectedPosition &&
        <MapContainer preferCanvas={true} center={[selectedPosition.latitude, selectedPosition?.longitude]} scrollWheelZoom={false} zoom={14} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {orphanages.map(orphanage => (
            <Marker key={orphanage._id} alt={orphanage.name} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]}>
              <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                {orphanage.name}
                <Link to={`/orphanages/${orphanage._id}`}>
                  <FiArrowRight size={20} color="#fff" />
                </Link>
              </Popup>
            </Marker>
          ))}
          
        </MapContainer>}

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
