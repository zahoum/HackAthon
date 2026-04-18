// navbar.jsx - Using simple CSS classes
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaBookOpen, FaShoppingCart, FaCrown } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show navbar on admin dashboard if you want a clean admin panel
  // But if you want to keep it, we'll make it work
  const isAdminPage = location.pathname.startsWith('/admin');

  // If on admin page, you might want to hide or simplify the navbar
  if (isAdminPage) {
    return (
      <nav className="navbar admin-navbar">
        <div className="container">
          <Link to="/admin/dashboard" className="logo">
            <FaCrown />
            <span>Admin Panel</span>
          </Link>
          <div className="nav-links">
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Déconnexion
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <FaBook />
          <span>BookZahoum</span>
        </Link>

        <div className="nav-links">
          <Link to="/books" className="nav-link">
            <FaBookOpen />
            <span>Livres</span>
          </Link>

          {user ? (
            <>
              {/* Show different dashboard based on role */}
              {isAdmin ? (
                <Link to="/admin/dashboard" className="nav-link">
                  <FaCrown />
                  <span>Admin Dashboard</span>
                </Link>
              ) : (
                <Link to="/dashboard" className="nav-link">
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </Link>
              )}
              
              <Link to="/my-rentals" className="nav-link">
                <FaShoppingCart />
                <span>Mes locations</span>
              </Link>
              
              <Link to="/profile" className="nav-link user-link">
                <FaUser />
                <span>{user.name || user.mail?.split('@')[0]}</span>
              </Link>
              
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-link">
                <FaSignInAlt />
                <span>Connexion</span>
              </Link>
              <Link to="/register" className="register-btn">
                <FaUserPlus />
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .admin-navbar {
          background: linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          transition: transform 0.2s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo svg {
          font-size: 1.8rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .user-link {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 20px;
        }

        .login-link {
          background: rgba(255, 255, 255, 0.1);
        }

        .register-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: #667eea;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .logout-button:hover {
          background: rgba(255, 0, 0, 0.3);
          border-color: rgba(255, 0, 0, 0.5);
          transform: translateY(-2px);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .nav-links {
            gap: 10px;
          }
          
          .nav-link span,
          .logout-button span,
          .register-btn span {
            display: none;
          }
          
          .nav-link svg,
          .logout-button svg,
          .register-btn svg {
            font-size: 1.2rem;
          }
          
          .logo span {
            font-size: 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;