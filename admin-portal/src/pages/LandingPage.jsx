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
        const lightning = document.querySelector('.lightning-flash');

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

        // Lightning effect loop
        const lightningLoop = setInterval(() => {
            lightning.classList.add('flash');
            setTimeout(() => {
                lightning.classList.remove('flash');
            }, 200 + Math.random() * 300); // random flash duration
        }, 5000 + Math.random() * 4000); // flash every 5-9s randomly

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
            clearInterval(lightningLoop);
        };
    }, []);

    return (
        <div className="landing-container">
            {/* Background Rain & Lightning */}
            <div className="background-effects">
                <div className="lightning-flash"></div>
                <div className="rain-layer rain-layer-1"></div>
                <div className="rain-layer rain-layer-2"></div>
            </div>

            {/* Content */}
            <div className="landing-content">
                <img src={loginImage} alt="Admin Portal Logo" className="animated-logo" />
                <h1 className="fade-in-up">Welcome, Admin!</h1>
                <h2 className="fade-in-up delay-1">Lefatshe Larona Admin Portal</h2>
                <p className="fade-in-up delay-2">
                    Experience the best admin dashboard in the world. Manage your system with precision, style,
                    and unparalleled performance. Welcome to Lefatshe Larona – where excellence meets innovation.
                </p>
                <button className="login-button fade-in-up delay-3" onClick={handleLoginRedirect}>
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
