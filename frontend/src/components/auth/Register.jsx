// Register.jsx - Beautiful design
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBook, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }
    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 'weak': return 'Mot de passe faible';
      case 'medium': return 'Mot de passe moyen';
      case 'strong': return 'Mot de passe fort';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      // CHANGEMENT: Appel direct à l'API au lieu du contexte
      const { confirmPassword, ...userData } = formData;
      
      const response = await fetch('http://192.168.1.37:5000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // { name, email, password, phone }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur d'inscription");
      }

      setSuccess('Inscription réussie ! Redirection...');
      
      // CHANGEMENT: Connecter automatiquement après inscription
      const loginResponse = await fetch('http://192.168.1.37:5000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        localStorage.setItem('user', JSON.stringify(loginData.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        if (register) {
          await register(userData);
        }
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">📖</div>
          <h1 className="auth-title">Rejoignez-nous</h1>
          <p className="auth-subtitle">Créez votre compte gratuitement</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="alert-error">
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          {success && (
            <div className="alert-success">
              <FaCheckCircle />
              {success}
            </div>
          )}

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Numéro de téléphone (optionnel)"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {passwordStrength && (
            <>
              <div className={`password-strength strength-${passwordStrength}`}></div>
              <div className="strength-text">{getStrengthText()}</div>
            </>
          )}

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Déjà inscrit ?{' '}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
