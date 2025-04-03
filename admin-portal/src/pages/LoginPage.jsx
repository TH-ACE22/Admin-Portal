import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import loginImage from '../assets/loginImage.png'; // Make sure the image exists

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic goes here...
    navigate('/dashboard');
  };

  return (
      <div className="login-container">
        {/* Blue Section */}
        <div className="blue-section">
          <img src={loginImage} alt="Login Visual" className="login-image" />
        </div>

        {/* White Section */}
        <div className="white-section">
          {/* Background Animation */}
          <div className="bubble-animation">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>

          {/* Login Card */}
          <div className="login-wrapper">
            <div className="login-card">
              <div className="form-header">
                <h2>Welcome Back!</h2>
                <p>Enter your credentials to access your account</p>
              </div>
              <form className="form-fields" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      required
                  />
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
