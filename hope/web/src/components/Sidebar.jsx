import React from 'react';

import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import mapMarkerImg from '../assets/map-marker.svg';

import '../styles/components/sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  return (<aside className="app-sidebar">
    <img src={mapMarkerImg} alt="Hope" />

    <footer>
      <button type="button" onClick={() => navigate('/map')}>
        <FiArrowLeft size={24} color="rgba(0, 0, 0, 0.6)" />
      </button>
    </footer>
  </aside>);
}
