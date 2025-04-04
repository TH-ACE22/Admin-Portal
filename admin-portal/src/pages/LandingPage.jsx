import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import loginImage from '../assets/loginImage.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    useEffect(() => {
        const rainLayer1 = document.querySelector('.rain-layer-1');
        const rainLayer2 = document.querySelector('.rain-layer-2');

        const createRaindrop = (layer, durationRange) => {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${durationRange[0] + Math.random() * (durationRange[1] - durationRange[0])}s`;
            layer.appendChild(drop);
            setTimeout(() => drop.remove(), 2000);
        };

        const interval1 = setInterval(() => createRaindrop(rainLayer1, [0.5, 1.2]), 100);
        const interval2 = setInterval(() => createRaindrop(rainLayer2, [1.2, 2.0]), 200);

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        };
    }, []);

    return (
        <div className="landing-container">
            {/* Background Effects */}
            <div className="background-effects">
                <div className="rain-layer rain-layer-1"></div>
                <div className="rain-layer rain-layer-2"></div>
            </div>

            {/* Content */}
            <div className="admin-landing-box fade-in-up">
                <img src={loginImage} alt="Admin Logo" className="animated-logo" />
                <h1 className="glitch-text">LEFATSHE LARONA</h1>
                <h2 className="admin-sub">ADMIN PORTAL INTERFACE</h2>
                <p className="admin-desc">
                    Initiating access protocols...<br />
                    Secure channels engaged. Real-time monitoring active.<br />
                    Navigate. Broadcast. Manage. Impact.
                </p>
                <button className="login-button" onClick={handleLoginRedirect}>
                    Launch Admin Console
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
