// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import '../styles/LoginPage.css';
import loginImage from '../assets/loginImage.png';

// Utility to extract a useful error message from a Response
async function parseError(response) {
  let message = 'An unexpected error occurred';
  try {
    const data = await response.json();
    message = data?.message || data?.error_description || JSON.stringify(data);
  } catch {
    try {
      message = await response.text();
    } catch {
      /* swallow */
    }
  }
  return message;
}

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Auto-redirect if already logged in

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.trim(), password })
          }
      );

      if (!res.ok) {
        if (res.status === 403) {
          setError('Your account is not authorized to access this application.');
        } else {
          const msg = await parseError(res);
          setError(msg);
        }
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch {
        setError('Received malformed response from server.');
        return;
      }

      const {
        accessToken,
        refreshToken,
        mongoUserId,
        keycloakUserId,
        email: respEmail,
        fullName,
        role: appRole
      } = data;

      // persist
      localStorage.setItem('accessToken',    accessToken);
      localStorage.setItem('refreshToken',   refreshToken);
      localStorage.setItem('userId',         mongoUserId);
      localStorage.setItem('keycloakUserId', keycloakUserId);
      localStorage.setItem('username',       username.trim());
      localStorage.setItem('email',          respEmail);
      localStorage.setItem('fullName',       fullName);
      localStorage.setItem('appRole',        appRole);

      // redirect by role
      if (appRole === 'ROLE_ADMIN') {
        navigate('/admin-dashboard', { replace: true });
      } else if (appRole === 'GOVERNMENT_OFFICIAL' || appRole === 'ROLE_GOVERNMENT_OFFICIAL') {
        navigate('/government-dashboard', { replace: true });
      } else {
        setError('Your role does not have access to this application.');
      }

    } catch (err) {
      console.error('Network or unexpected error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-container">
        <div className="blue-section">
          <img src={loginImage} alt="Login Visual" className="login-image" />
        </div>
        <div className="white-section">
          <div className="bubble-animation">
            {[...Array(5)].map((_, i) => <div key={i} className="bubble" />)}
          </div>
          <div className="login-wrapper">
            <div className="login-card">
              <div className="form-header">
                <h2>Welcome Back!</h2>
                <p>Enter your credentials to access your account</p>
              </div>
              <form onSubmit={handleSubmit} className="form-fields" noValidate>
                {error && <div className="error-message" role="alert">{error}</div>}
                <div className="form-group">
                  <label htmlFor="username">Username or Email</label>
                  <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter your username or email"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
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
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                  />
                  <div className="forgot-password">
                    <a href="/forgot-password">Forgot Password?</a>
                  </div>
                </div>
                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                  {loading ? 'Logging in…' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
