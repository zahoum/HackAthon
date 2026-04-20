// Profile.jsx - Complete working version
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaSpinner, FaBook, FaHandHoldingHeart } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mail: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingStats, setFetchingStats] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userStats, setUserStats] = useState({
    totalRentals: 0,
    activeRentals: 0,
    booksRead: 0,
    memberSince: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        mail: user.mail || user.email || ''
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    const userId = user?._id || user?.id;
    
    if (!userId) {
      setFetchingStats(false);
      return;
    }
    
    try {
      setFetchingStats(true);
      
      // Fetch all rentals
      const response = await api.get('/rentedBooks');
      const allRentals = response.data;
      
      // Filter rentals for current user
      const userRentals = allRentals.filter(rental => {
        const rentalUserId = rental.userId?.toString();
        return rentalUserId === userId.toString();
      });
      
      // Get member since from first rental or use current date
      const memberSince = userRentals.length > 0 && userRentals[0].rentDate
        ? new Date(userRentals[0].rentDate).toLocaleDateString()
        : new Date().toLocaleDateString();
      
      setUserStats({
        totalRentals: userRentals.length,
        activeRentals: userRentals.filter(r => !r.isReturned).length,
        booksRead: userRentals.filter(r => r.isReturned).length,
        memberSince: memberSince
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setFetchingStats(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Note: You'll need to add a user update endpoint in your backend
      // For now, we'll just update the local state
      
      // Update local user data
      const updatedUser = {
        ...user,
        name: formData.name,
        mail: formData.mail,
        email: formData.mail
      };
      
      if (updateUser) {
        updateUser(updatedUser);
      } else {
        // Directly update localStorage if updateUser not available
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      mail: user?.mail || user?.email || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <FaUser style={{ fontSize: '48px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            {user.name}
          </h1>
          <p style={{ color: '#6b7280' }}>{user.mail || user.email}</p>
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#dc2626',
            padding: '0.75rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Profile Info Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>
                    <FaUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>
                    <FaEnvelope style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="mail"
                    value={formData.mail}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '10px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaSave />}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <FaUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Full Name
                  </p>
                  <p style={{ color: '#1f2937', fontWeight: '500' }}>{user.name}</p>
                </div>
                
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <FaEnvelope style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Email Address
                  </p>
                  <p style={{ color: '#1f2937', fontWeight: '500' }}>{user.mail || user.email}</p>
                </div>
                
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <FaCalendarAlt style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Member Since
                  </p>
                  <p style={{ color: '#1f2937', fontWeight: '500' }}>{userStats.memberSince}</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>
              Reading Statistics
            </h2>
            
            {fetchingStats ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <FaSpinner style={{ fontSize: '32px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#e0e7ff',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}>
                    <FaBook style={{ fontSize: '24px', color: '#667eea' }} />
                  </div>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#667eea' }}>{userStats.totalRentals}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Rentals</p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#d1fae5',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}>
                    <FaHandHoldingHeart style={{ fontSize: '24px', color: '#10b981' }} />
                  </div>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981' }}>{userStats.activeRentals}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Rentals</p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#ede9fe',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}>
                    <FaBook style={{ fontSize: '24px', color: '#8b5cf6' }} />
                  </div>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#8b5cf6' }}>{userStats.booksRead}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Books Read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;