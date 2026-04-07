// BooksList.jsx - With beautiful design
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaFilter, FaUser, FaBook, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});


const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBooks();
    fetchCategories();
  }, [search, category, user]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      const response = await api.get('/books', { params });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      // Mock data for demo
      setBooks([
        { _id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', category: 'Fiction', price: 5, available: true, pages: 96, cover: 'https://picsum.photos/300/400?random=1' },
        { _id: 2, title: '1984', author: 'George Orwell', category: 'Science Fiction', price: 6, available: true, pages: 328, cover: 'https://picsum.photos/300/400?random=2' },
        { _id: 3, title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', price: 7, available: false, pages: 412, cover: 'https://picsum.photos/300/400?random=3' },
        { _id: 4, title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', category: 'Fantasy', price: 8, available: true, pages: 320, cover: 'https://picsum.photos/300/400?random=4' },
        { _id: 5, title: 'Le Alchimiste', author: 'Paulo Coelho', category: 'Fiction', price: 6, available: true, pages: 208, cover: 'https://picsum.photos/300/400?random=5' },
        { _id: 6, title: 'Les Misérables', author: 'Victor Hugo', category: 'Classique', price: 9, available: true, pages: 1232, cover: 'https://picsum.photos/300/400?random=6' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/books/categories');
      setCategories(response.data);
    } catch (error) {
      setCategories(['Fiction', 'Science Fiction', 'Fantasy', 'Classique', 'Biography']);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="books-page">
      <div className="books-container">
        <div className="books-header">
          <h1 className="books-title">📚 Nos Livres</h1>
          <p className="books-subtitle">Découvrez notre collection de livres exceptionnels</p>
        </div>

        {/* Search and Filter */}
        <div className="search-container">
          <div className="search-wrapper">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un livre par titre ou auteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-wrapper">
              <FaFilter className="filter-icon" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="books-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="books-empty">
            <div className="empty-icon">📖</div>
            <h3 className="empty-title">Aucun livre trouvé</h3>
            <p className="empty-text">Essayez de modifier votre recherche ou vos filtres</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <div className={`book-badge ${book.available ? 'available' : 'unavailable'}`}>
                  {book.available ? 'Disponible' : 'Indisponible'}
                </div>
                <img 
                  src={book.cover || `https://picsum.photos/300/400?random=${book._id}`} 
                  alt={book.title}
                  className="book-image"
                />
                <div className="book-content">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">
                    <FaUser size={12} />
                    {book.author}
                  </p>
                  <span className="book-category">
                    <FaBook size={10} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    {book.category}
                  </span>
                  <div className="book-footer">
                    <div className="book-price">
                      <span className="price-amount">{book.price}€</span>
                      <span className="price-period">/mois</span>
                    </div>
                    <Link to={`/books/${book._id}`} className="book-link">
                      Voir détails
                      <FaArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;