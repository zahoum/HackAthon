// MyRentals.jsx - Updated with real backend data
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaCalendarCheck, FaUndo, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

const MyRentals = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returning, setReturning] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchRentals();
    }
  }, [user]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all rentals
      const response = await api.get('/rentedBooks');
      const allRentals = response.data;
      
      // Filter for current user
      const userRentals = allRentals.filter(rental => 
        rental.userId === user._id || rental.userId?.toString() === user._id?.toString()
      );
      
      // Fetch book details for each rental
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
              book: { title: 'Book Not Found', author: 'Unknown' },
              status: rental.isReturned ? 'returned' : 'active'
            };
          }
        })
      );
      
      setRentals(rentalsWithBooks);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setError('Failed to load your rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId, bookId) => {
    if (!window.confirm('Are you sure you want to return this book?')) {
      return;
    }
    
    setReturning(rentalId);
    
    try {
      // Update the rental record to mark as returned
      await api.put(`/emprunt/${rentalId}`, {
        isReturned: true
      });
      
      // Update the book's isRented status to false
      await api.put(`/livre/${bookId}`, {
        isRented: false
      });
      
      // Refresh the rentals list
      await fetchRentals();
      alert('Book returned successfully!');
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return the book. Please try again.');
    } finally {
      setReturning(null);
    }
  };

  const activeRentals = rentals.filter(r => r.status === 'active');
  const returnedRentals = rentals.filter(r => r.status === 'returned');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading your rentals...</p>
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
          My Rentals
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        {/* Active Rentals */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBook style={{ color: '#667eea' }} />
            Active Rentals ({activeRentals.length})
          </h2>
          
          {activeRentals.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ color: '#9ca3af' }}>No active rentals</p>
              <Link to="/books" style={{
                display: 'inline-block',
                marginTop: '1rem',
                color: '#667eea',
                textDecoration: 'none'
              }}>
                Browse books to rent →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeRentals.map((rental) => (
                <div key={rental._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                        {rental.book?.title}
                      </h3>
                      <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>by {rental.book?.author}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          <FaCalendarCheck />
                          <span>Rented: {new Date(rental.rentDate).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#f59e0b' }}>
                          <FaCalendarCheck />
                          <span>Due by: {new Date(rental.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleReturn(rental._id, rental.bookId)}
                      disabled={returning === rental._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        cursor: returning === rental._id ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        opacity: returning === rental._id ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (returning !== rental._id) e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        if (returning !== rental._id) e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {returning === rental._id ? (
                        <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <FaUndo />
                      )}
                      {returning === rental._id ? 'Processing...' : 'Return Book'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Returned Rentals */}
        {returnedRentals.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              History ({returnedRentals.length})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {returnedRentals.map((rental) => (
                <div key={rental._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  opacity: 0.75
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem', color: '#4b5563' }}>
                        {rental.book?.title}
                      </h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>by {rental.book?.author}</p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                        Returned on {rental.returnDate ? new Date(rental.returnDate).toLocaleDateString() : 'Date unknown'}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Returned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;