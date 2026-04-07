// FeaturedBooks.jsx - Fixed import paths
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaArrowRight, FaBookOpen, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'; 

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await api.get('/books?limit=4');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching featured books:', error);
        setBooks([
          { _id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', category: 'Fiction', price: 5, pages: 96, rating: 4.8, available: true },
          { _id: 2, title: '1984', author: 'George Orwell', category: 'Science Fiction', price: 6, pages: 328, rating: 4.9, available: true },
          { _id: 3, title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', price: 7, pages: 412, rating: 4.7, available: false },
          { _id: 4, title: 'Harry Potter', author: 'J.K. Rowling', category: 'Fantasy', price: 8, pages: 320, rating: 4.9, available: true },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedBooks();
  }, []);

  const handleSeeDetails = (bookId) => {
    if (user) {
      navigate(`/books/${bookId}`);
    } else {
      if (window.confirm('Veuillez vous connecter pour voir les détails du livre. Voulez-vous vous connecter maintenant ?')) {
        navigate('/login');
      }
    }
  };

  const handleViewAllBooks = () => {
    if (user) {
      navigate('/books');
    } else {
      if (window.confirm('Veuillez vous connecter ou vous inscrire pour voir tous les livres. Voulez-vous vous connecter maintenant ?')) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '1rem', color: 'white' }}>Chargement des livres...</p>
      </div>
    );
  }

  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.8rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          📚 Livres Populaires
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '1.2rem',
          marginBottom: '3rem'
        }}>
          Découvrez les livres les plus aimés par notre communauté
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {books.map((book) => (
            <div key={book._id} style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: book.available ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#9ca3af',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                zIndex: 10
              }}>
                {book.available ? 'Disponible' : 'Rupture'}
              </div>
              <img 
                src={book.cover || `https://picsum.photos/300/400?random=${book._id}`} 
                alt={book.title}
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ padding: '1.5rem', background: 'white' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  marginBottom: '0.5rem'
                }}>
                  {book.title}
                </h3>
                <p style={{
                  color: '#718096',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaUser size={12} />
                  {book.author}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#667eea'
                    }}>
                      {book.price}€
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#718096' }}>/mois</span>
                  </div>
                  <button
                    onClick={() => handleSeeDetails(book._id)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}>
                      Découvrir <FaArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleViewAllBooks}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'white',
              color: '#667eea',
              padding: '1rem 2rem',
              borderRadius: '3rem',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
              e.currentTarget.style.gap = '1rem';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              e.currentTarget.style.gap = '0.75rem';
            }}>
            Explorer tous les livres
            <FaArrowRight />
          </button>
          {!user && (
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
              🔒 Connectez-vous pour voir tous les livres disponibles
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;