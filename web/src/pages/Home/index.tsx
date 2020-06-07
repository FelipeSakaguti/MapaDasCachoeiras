import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';


import './styles.css';

import logo from '../../assets/logo.svg';

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Mapa das Cachoeiras" />
                </header>
                <main>
                    <h1>Seu localizador de cachoeiras.</h1>
                    <p>Encontre os melhores lugares para curtir um fim de semana em paz com os amigos.</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre uma cachoeira.</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home;