// Login.jsx - Beautiful design
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { FaEnvelope, FaLock, FaBook, FaExclamationTriangle } from 'react-icons/fa';


let ipV4 = 'localhost';

const Login = () => {
  const [mail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // CHANGEMENT: Appel direct à l'API au lieu du contexte
      const response = await fetch(`http://${ipV4}:5000/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail: mail, password }), // mail au lieu de username
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email ou mot de passe incorrect');
      }

      // Stocker l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Appeler la fonction login du contexte si elle existe
      if (login) {
        await login(mail, password);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">📚</div>
          <h1 className="auth-title">Bienvenue</h1>
          <p className="auth-subtitle">Connectez-vous à votre compte</p>
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
              type="email"
              placeholder="Adresse email"
              value={mail}
              onChange={(e) => setEmail(e.target.value)}
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
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="auth-link">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
