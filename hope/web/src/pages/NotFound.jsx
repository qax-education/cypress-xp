import React from 'react';

import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../styles/pages/notfound.css';

function Landing() {
  return (<div id="not-found">
    <div className="content-wrapper">
      <main>
        <h1>Oops!</h1>
        <p>A página que você procura <br /> não existe ou está em manutenção.</p>

        <Link to="/map" className="enter-app">
          <FiArrowLeft size={26} color="rgba(0, 0, 0, 0.6)" />
        </Link>
      </main>
    </div>
  </div>);
}

export default Landing;
