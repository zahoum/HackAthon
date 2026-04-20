// ReturnBook.jsx - Complete working version
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaBook, FaUndo, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

const ReturnBook = () => {
  const { user } = useAuth();
  const [activeRentals, setActiveRentals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchActiveRentals();
    }
  }, [user]);

  const fetchActiveRentals = async () => {
    const userId = user?._id || user?.id;
    
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Fetch all rentals
      const response = await api.get('/rentedBooks');
      const allRentals = response.data;
      
      // Filter for current user's active rentals
      const userRentals = allRentals.filter(rental => {
        const rentalUserId = rental.userId?.toString();
        return rentalUserId === userId.toString() && !rental.isReturned;
      });
      
      // Fetch book details for each rental
      const rentalsWithBooks = await Promise.all(
        userRentals.map(async (rental) => {
          try {
            const bookResponse = await api.get(`/livre/${rental.bookId}`);
            return {
              ...rental,
              book: bookResponse.data,
              rentalDate: rental.rentDate,
              dueDate: rental.returnDate
            };
          } catch (err) {
            console.error('Error fetching book:', err);
            return {
              ...rental,
              book: { title: 'Book Not Found', author: 'Unknown' },
              rentalDate: rental.rentDate,
              dueDate: rental.returnDate
            };
          }
        })
      );
      
      setActiveRentals(rentalsWithBooks);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setError('Failed to load your active rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId, bookId) => {
    if (!window.confirm('Are you sure you want to return this book?')) {
      return;
    }
    
    setReturning(rentalId);
    setError('');
    
    try {
      // Update the rental record to mark as returned
      await api.put(`/emprunt/${rentalId}`, {
        isReturned: true
      });
      
      // Update the book's isRented status to false
      await api.put(`/livre/${bookId}`, {
        isRented: false
      });
      
      alert('Book returned successfully!');
      
      // Refresh the list
      await fetchActiveRentals();
    } catch (error) {
      console.error('Error returning book:', error);
      setError('Failed to return the book. Please try again.');
      alert('Failed to return the book. Please try again.');
    } finally {
      setReturning(null);
    }
  };

  const filteredRentals = activeRentals.filter(rental =>
    rental.book.title.toLowerCase().includes(search.toLowerCase()) ||
    rental.book.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading your rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Return a Book
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Select a book to return to the library
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Rentals List */}
          {filteredRentals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <FaBook style={{
                fontSize: '64px',
                color: '#d1d5db',
                marginBottom: '1rem'
              }} />
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {search ? 'No matching books found' : 'No books to return'}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                {search ? 'Try a different search term' : 'You don\'t have any active rentals'}
              </p>
              {!search && (
                <button
                  onClick={() => window.location.href = '/books'}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Browse Books
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredRentals.map((rental) => (
                <div key={rental._id} style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1rem',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {rental.book.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        by {rental.book.author}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                        <span>Rented: {rental.rentDate ? new Date(rental.rentDate).toLocaleDateString() : 'Unknown'}</span>
                        <span>Due: {rental.dueDate ? new Date(rental.dueDate).toLocaleDateString() : 'Unknown'}</span>
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
                        if (returning !== rental._id) e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        if (returning !== rental._id) e.currentTarget.style.transform = 'translateY(0)';
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

export default ReturnBook;