// Dashboard.jsx - Fixed version
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaHandHoldingHeart, FaChartLine, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRentals: 0,
    activeRentals: 0,
    booksRead: 0
  });
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Get user ID from either _id or id field
      const userId = user?._id || user?.id;
      
      if (!userId) {
        console.log('No user ID available', user);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Fetch all rentals
        const response = await api.get('/rentedBooks');
        const allRentals = response.data;
        
        // Filter rentals for current user (comparing as strings)
        const userRentals = allRentals.filter(rental => {
          const rentalUserId = rental.userId?.toString();
          return rentalUserId === userId.toString();
        });
        
        console.log('User rentals:', userRentals);
        
        // Get book details for each rental
        const rentalsWithBooks = await Promise.all(
          userRentals.map(async (rental) => {
            try {
              const bookResponse = await api.get(`/livre/${rental.bookId}`);
              return {
                ...rental,
                book: bookResponse.data,
                status: rental.isReturned ? 'returned' : 'active',
                rentalDate: rental.rentDate,
                dueDate: rental.returnDate
              };
            } catch (err) {
              console.error('Error fetching book:', err);
              return {
                ...rental,
                book: { title: 'Unknown Book', author: 'Unknown Author' },
                status: rental.isReturned ? 'returned' : 'active'
              };
            }
          })
        );
        
        const active = rentalsWithBooks.filter(r => r.status === 'active');
        const returned = rentalsWithBooks.filter(r => r.status === 'returned');
        
        setStats({
          totalRentals: rentalsWithBooks.length,
          activeRentals: active.length,
          booksRead: returned.length
        });
        
        setRecentRentals(rentalsWithBooks.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const statsCards = [
    {
      title: 'Total Rentals',
      value: stats.totalRentals,
      icon: FaBook,
      color: '#667eea',
      bgColor: '#e0e7ff'
    },
    {
      title: 'Active Rentals',
      value: stats.activeRentals,
      icon: FaHandHoldingHeart,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Books Read',
      value: stats.booksRead,
      icon: FaChartLine,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading dashboard...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name || 'Reader'}! 👋
          </h1>
          <p style={{ color: '#6b7280' }}>Here's a summary of your reading activity</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {statsCards.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{stat.title}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>{stat.value}</p>
                </div>
                <div style={{ backgroundColor: stat.bgColor, padding: '0.75rem', borderRadius: '12px' }}>
                  <stat.icon style={{ color: stat.color, fontSize: '1.5rem' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Recent Rentals
            </h2>
            {recentRentals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentRentals.map((rental) => (
                  <div key={rental._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>{rental.book?.title || 'Unknown Book'}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Rented on {rental.rentDate ? new Date(rental.rentDate).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: rental.status === 'active' ? '#d1fae5' : '#f3f4f6',
                      color: rental.status === 'active' ? '#065f46' : '#4b5563'
                    }}>
                      {rental.status === 'active' ? 'Active' : 'Returned'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>
                No rentals yet
              </p>
            )}
            <Link to="/my-rentals" style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '1rem',
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              View all rentals →
            </Link>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/books" style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#667eea',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Browse Books
              </Link>
              <Link to="/my-rentals" style={{
                display: 'block',
                textAlign: 'center',
                border: '2px solid #667eea',
                color: '#667eea',
                padding: '0.75rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                My Rentals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;