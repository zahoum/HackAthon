// navbar.jsx - Updated with admin panel integration
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBook, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaCrown } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if user is admin (you can add a role field to user object)
  // For now, we'll check if email is admin or if there's an admin flag
  const isAdmin = user?.role === 'admin' || user?.mail === 'admin@example.com' || localStorage.getItem('isAdmin') === 'true';

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none'
        }}>
          <FaBook />
          <span>BooksRent</span>
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <Link to="/books" style={{
            color: 'white',
            textDecoration: 'none',
            transition: 'opacity 0.3s'
          }} onMouseEnter={(e) => e.target.style.opacity = '0.8'}
             onMouseLeave={(e) => e.target.style.opacity = '1'}>
            Books
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <FaTachometerAlt size={12} /> Dashboard
              </Link>
              
              <Link to="/my-rentals" style={{
                color: 'white',
                textDecoration: 'none'
              }}>
                My Rentals
              </Link>
              
              {/* Admin Panel Link - Only visible to admins */}
              {isAdmin && (
                <Link to="/admin" style={{
                  color: '#ffd700',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: 'bold',
                  background: 'rgba(255,215,0,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px'
                }}>
                  <FaCrown size={14} /> Admin Panel
                </Link>
              )}
              
              <Link to="/profile" style={{
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <FaUser /> {user.name?.split(' ')[0] || user.name}
              </Link>
              
              <button onClick={handleLogout} style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                 onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <FaSignInAlt /> Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;