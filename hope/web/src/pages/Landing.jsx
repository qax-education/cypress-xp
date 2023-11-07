import React from 'react';

import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../styles/pages/landing.css';

import logoImg from '../assets/logo.svg';

function Landing() {
  return (<div id="page-landing">
    <div className="content-wrapper">
      <img src={logoImg} alt="Hope" />

      <main>
        <h1>Semeando esperança, colhendo sorrisos</h1>
        <p>Visite orfanatos e mude <br /> o dia de muitas crianças.</p>

        <Link to="/map" className="enter-app">
          <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
        </Link>
      </main>
    </div>
  </div>);
}

export default Landing;
