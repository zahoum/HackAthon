// BooksList.jsx - With beautiful design
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaFilter, FaUser, FaBook, FaArrowRight, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = '/livres'; // Using your existing endpoint
      const params = {};
      
      if (search) params.search = search;
      if (category) params.category = category;
      
      const response = await api.get(url, { params });
      console.log('Fetched books:', response.data);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from books
  const fetchCategories = async () => {
    try {
      const response = await api.get('/livres');
      const allBooks = response.data;
      // Extract unique categories
      const uniqueCategories = [...new Set(allBooks.map(book => book.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Default categories
      setCategories(['Fiction', 'Science Fiction', 'Fantasy', 'Classic', 'Biography', 'Mystery', 'Thriller']);
    }
  };

  // Filter books based on search and category
  const getFilteredBooks = () => {
    let filtered = books;
    
    if (search) {
      filtered = filtered.filter(book => 
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(book => book.category === category);
    }
    
    return filtered;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBooks();
    fetchCategories();
  }, [user]); // Only run when user changes

  // Refetch when search or category changes
  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [search, category]);

  if (!user) {
    return null;
  }

  const filteredBooks = getFilteredBooks();

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
            <FaSpinner className="loading-spinner" />
            <p>Chargement des livres...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="books-empty">
            <div className="empty-icon">📖</div>
            <h3 className="empty-title">Aucun livre trouvé</h3>
            <p className="empty-text">Essayez de modifier votre recherche ou vos filtres</p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <div className={`book-badge ${book.isRented === false ? 'available' : 'unavailable'}`}>
                  {book.isRented === false ? 'Disponible' : 'Indisponible'}
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
                    {book.category || 'Non catégorisé'}
                  </span>
                  <div className="book-footer">
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