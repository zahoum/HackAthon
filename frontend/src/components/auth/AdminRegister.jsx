import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // The two variables for credentials
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = 'admin123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check credentials against the two variables
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setLoading(false);
      // Navigate to admin dashboard on success
      navigate('/admin-dashboard');
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">👑</div>
          <h1 className="auth-title">Admin Access</h1>
          <p className="auth-subtitle">Connectez-vous à votre compte administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" method="post">
          {error && (
            <div className="alert-error">
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Demo: username = <strong>admin</strong> | password = <strong>admin123</strong></p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 450px;
          transition: transform 0.3s ease;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-logo {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .auth-title {
          font-size: 28px;
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .auth-subtitle {
          color: #666;
          font-size: 14px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: #999;
          font-size: 18px;
        }

        .input-field {
          width: 100%;
          padding: 14px 15px 14px 45px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
        }

        .input-field:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .auth-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .alert-error {
          background: #fee;
          border-left: 4px solid #f44336;
          padding: 12px 15px;
          border-radius: 8px;
          color: #d32f2f;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .auth-footer {
          margin-top: 25px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
          font-size: 12px;
          color: #666;
        }

        .auth-footer strong {
          color: #667eea;
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 30px 20px;
          }
          
          .auth-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}