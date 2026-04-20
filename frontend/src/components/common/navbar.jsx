// navbar.jsx - Using simple CSS classes
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <FaBook />
          <span>BooksRent</span>
        </Link>

        <div className="nav-links">
          <Link to="/books">Livres</Link>

          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/my-rentals">Mes locations</Link>
              <Link to="/profile">
                <FaUser /> {user.name}
              </Link>
              <button onClick={handleLogout}>
                <FaSignOutAlt /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <FaSignInAlt /> Connexion
              </Link>
              <Link to="/register" className="register-btn">
                <FaUserPlus /> Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;