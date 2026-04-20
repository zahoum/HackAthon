// BookDetails.jsx - Clean version
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaUser, FaBook, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  // Debug: Log user when it changes
  useEffect(() => {
    console.log('Auth user updated:', user);
  }, [user]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/livre/${id}`);
      console.log('Book details:', response.data);
      setBook(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Failed to load book details. Please try again.');
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async () => {
    console.log('=== RENT BUTTON CLICKED ===');
    console.log('Current user from context:', user);
    
    if (!user) {
      alert('Please login first to rent books');
      navigate('/login');
      return;
    }

    // Get user ID - it should be in user._id
    const userId = user._id;
    
    if (!userId) {
      console.error('No user ID found. User object:', user);
      alert('Your session is invalid. Please logout and login again.');
      // Try to reload from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser._id) {
            console.log('Found user in localStorage, but not in context. Please refresh the page.');
            alert('Please refresh the page and try again.');
          }
        } catch(e) {}
      }
      navigate('/login');
      return;
    }

    // Validate ObjectId format
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    
    if (!isValidObjectId(userId)) {
      console.error('Invalid userId format:', userId);
      alert('Invalid user session. Please logout and login again.');
      logout();
      navigate('/login');
      return;
    }

    if (!book?._id) {
      alert('Book information is missing');
      return;
    }

    if (book.isRented === true) {
      alert('This book is already rented!');
      return;
    }

    setRenting(true);
    setError('');
    
    try {
      const rentDate = new Date();
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);
      
      const borrowData = {
        bookId: book._id.toString(),
        userId: userId.toString(),
        rentDate: rentDate.toISOString(),
        returnDate: returnDate.toISOString()
      };
      
      console.log('Sending borrow data:', borrowData);
      
      const response = await api.post('/emprunt', borrowData);
      console.log('Success! Response:', response.data);
      
      // Update local book state
      setBook({ ...book, isRented: true });
      
      alert('Book rented successfully! You have 14 days to return it.');
      navigate('/my-rentals');
    } catch (error) {
      console.error('Error renting book:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Error renting the book';
      setError(errorMessage);
      alert(`Failed to rent book: ${errorMessage}`);
    } finally {
      setRenting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
          <p>Loading...</p>
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

  if (error || !book) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '48px' }}>⚠️</div>
          <h3>{error || 'Book not found'}</h3>
          <button 
            onClick={() => navigate('/books')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = book.isRented === false || book.isRented === undefined;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <button 
          onClick={() => navigate('/books')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <FaArrowLeft /> Back to Books
        </button>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '15px', 
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f3f4f6' }}>
              <div style={{ 
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
              }}>
                <span style={{ fontSize: '120px' }}>📖</span>
              </div>
            </div>
            
            <div style={{ flex: '2', padding: '2rem' }}>
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: isAvailable ? '#d1fae5' : '#fee2e2',
                    color: isAvailable ? '#065f46' : '#991b1b'
                  }}>
                    {isAvailable ? '✅ Disponible' : '📕 Indisponible'}
                  </span>
                </div>
                
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                  {book.title}
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                  by {book.author}
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                    <FaBook />
                    <span>{book.category || 'Non catégorisé'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                    <FaUser />
                    <span>{book.author}</span>
                  </div>
                </div>
                
                <p style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6' }}>
                  {book.description || 'No description available for this book.'}
                </p>
                
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Rental Period</p>
                      <p style={{ fontSize: '1rem', color: '#374151' }}>14 days</p>
                    </div>
                    
                    <button
                      onClick={handleRent}
                      disabled={!isAvailable || renting}
                      style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: isAvailable ? '#667eea' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        opacity: renting ? 0.7 : 1
                      }}
                    >
                      {renting ? 'Processing...' : (isAvailable ? 'Rent this Book' : 'Not Available')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;