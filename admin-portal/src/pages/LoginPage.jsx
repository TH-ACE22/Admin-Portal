import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import loginImage from '../assets/loginImage.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add authentication logic.
    // If authentication is successful, navigate to the dashboard:
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      {/* Blue Section */}
      <div className="blue-section">
        <img src={loginImage} alt="Decorative" className="login-image" />
      </div>

      {/* White Section */}
      <div className="white-section">
        {/* Bubble animation filling the white section */}
        <div className="bubble-animation">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>

        {/* Login card wrapper */}
        <div className="login-wrapper">
          <div className="login-card">
            <div className="form-header">
              <h2>Welcome Back!</h2>
              <p>Enter your Credentials to access your account</p>
            </div>
            <form className="form-fields" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" />
                <div className="forgot-password">
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              </div>
              <button type="submit" className="login-button">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
