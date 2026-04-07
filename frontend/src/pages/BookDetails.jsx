// BookDetails.jsx - Using simple CSS
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaMoneyBillWave, FaUser, FaBook } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      setBook({
        _id: id,
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        category: 'Fiction',
        description: 'Un classique de la littérature française...',
        price: 5,
        available: true,
        publishedYear: 1943,
        pages: 96,
        language: 'Français'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRenting(true);
    try {
      await api.post('/rentals', { bookId: book._id });
      alert('Livre loué avec succès !');
      navigate('/my-rentals');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la location');
    } finally {
      setRenting(false);
    }
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '3rem 0' }}>Chargement...</div>;
  }

  if (!book) {
    return <div className="text-center" style={{ padding: '3rem 0' }}>Livre non trouvé</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <img 
                src={book.cover || 'https://via.placeholder.com/400x600'} 
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div style={{ flex: '2', padding: '2rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{book.title}</h1>
              <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1rem' }}>par {book.author}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <FaBook style={{ marginRight: '0.5rem' }} />
                  <span>{book.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                  <span>{book.publishedYear}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  <span>{book.pages} pages</span>
                </div>
              </div>
              
              <p style={{ color: '#374151', marginBottom: '1.5rem' }}>{book.description}</p>
              
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '1.875rem', color: '#2563eb', fontWeight: 'bold' }}>{book.price}€</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>par mois</p>
                  </div>
                  
                  <button
                    onClick={handleRent}
                    disabled={!book.available || renting}
                    className={`btn ${book.available ? 'btn-primary' : ''}`}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: book.available ? '#2563eb' : '#9ca3af',
                      color: 'white',
                      border: 'none',
                      cursor: book.available ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {renting ? 'Location...' : book.available ? 'Louer ce livre' : 'Indisponible'}
                  </button>
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