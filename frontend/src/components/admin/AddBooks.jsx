// AddBooks.jsx
import React, { useState, useEffect } from 'react';
import { FaBook, FaUser, FaTag, FaPlus, FaCheck, FaSpinner } from 'react-icons/fa';

const API_URL = 'http://localhost/api/v1';

export default function AddBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [bookForm, setBookForm] = useState({
    title: '',
    category: '',
    author: ''
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Romance',
    'Biography',
    'History',
    'Dystopian',
    'Classic',
    'Poetry'
  ];

  // Fetch books from database on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/books`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setErrorMessage('Failed to load books from database');
      setTimeout(() => setErrorMessage(''), 3000);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookForm({
      ...bookForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    
    if (!bookForm.title || !bookForm.category || !bookForm.author) {
      setErrorMessage('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        // UPDATE existing book
        const response = await fetch(`${API_URL}/livre/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: bookForm.title,
            author: bookForm.author,
            category: bookForm.category
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update book');
        }
        
        setSuccessMessage('Book updated successfully!');
      } else {
        // ADD new book
        const response = await fetch(`${API_URL}/livre`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: bookForm.title,
            author: bookForm.author,
            category: bookForm.category
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to add book');
        }
        
        setSuccessMessage('Book added successfully!');
      }

      // Refresh the book list
      await fetchBooks();
      
      // Reset form
      setBookForm({ title: '', category: '', author: '' });
      setEditingId(null);
      setShowForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const getRandomCover = () => {
    const covers = ['📖', '📚', '📕', '📗', '📘', '📙', '📓', '📒'];
    return covers[Math.floor(Math.random() * covers.length)];
  };

  const handleEdit = (book) => {
    setBookForm({
      title: book.title,
      category: book.category || '',
      author: book.author
    });
    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`${API_URL}/livre/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete book');
        }
        
        setSuccessMessage('Book deleted successfully!');
        await fetchBooks(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting book:', error);
        setErrorMessage('Failed to delete book');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleCancel = () => {
    setBookForm({ title: '', category: '', author: '' });
    setEditingId(null);
    setShowForm(false);
    setErrorMessage('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading books...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }
          .spinner {
            font-size: 48px;
            animation: spin 1s linear infinite;
            color: #667eea;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="add-books">
      <div className="page-header">
        <div>
          <h1>Books Management</h1>
          <p>Add, edit, or remove books from the library</p>
        </div>
        {!showForm && (
          <button className="btn-add" onClick={() => setShowForm(true)}>
            <FaPlus /> Add New Book
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          <FaCheck /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {showForm && (
        <div className="book-form-container">
          <div className="form-header">
            <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
            <button className="close-form" onClick={handleCancel}>×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="book-form">
            <div className="form-group">
              <label><FaBook /> Book Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter book title"
                value={bookForm.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label><FaTag /> Category</label>
              <select
                name="category"
                value={bookForm.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><FaUser /> Author</label>
              <input
                type="text"
                name="author"
                placeholder="Enter author name"
                value={bookForm.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Processing...' : (editingId ? 'Update Book' : 'Add Book')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="books-grid">
        {books.map(book => (
          <div key={book._id} className="book-card">
            <div className="book-cover">
              <span className="book-emoji">{getRandomCover()}</span>
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <span className="book-category">{book.category || 'Uncategorized'}</span>
              {book.isRented && <span className="rented-badge">Rented</span>}
            </div>
            <div className="book-actions">
              <button className="edit-btn" onClick={() => handleEdit(book)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !showForm && (
        <div className="empty-state">
          <FaBook className="empty-icon" />
          <h3>No Books Yet</h3>
          <p>Click the "Add New Book" button to start adding books to your library.</p>
        </div>
      )}

      <style jsx>{`
        .add-books {
          animation: fadeIn 0.5s ease;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          margin: 0;
          color: #333;
          font-size: 28px;
        }

        .page-header p {
          margin: 5px 0 0;
          color: #666;
        }

        .btn-add {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .success-message {
          background: #c6f6d5;
          color: #22543d;
          padding: 12px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideDown 0.3s ease;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 12px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideDown 0.3s ease;
        }

        .book-form-container {
          background: white;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .form-header h2 {
          margin: 0;
          color: #333;
        }

        .close-form {
          background: none;
          border: none;
          font-size: 30px;
          cursor: pointer;
          color: #999;
          transition: color 0.2s ease;
        }

        .close-form:hover {
          color: #333;
        }

        .book-form {
          display: grid;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #555;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .btn-cancel {
          background: #f5f5f5;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-cancel:hover {
          background: #e0e0e0;
        }

        .btn-submit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .book-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }

        .book-cover {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book-emoji {
          font-size: 32px;
        }

        .book-info {
          flex: 1;
        }

        .book-info h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #333;
        }

        .book-author {
          margin: 0 0 5px 0;
          font-size: 13px;
          color: #666;
        }

        .book-category {
          display: inline-block;
          background: #f0f0f0;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 11px;
          color: #667eea;
          font-weight: 600;
        }

        .rented-badge {
          display: inline-block;
          background: #fef5e7;
          color: #e67e22;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 5px;
        }

        .book-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .edit-btn, .delete-btn {
          padding: 5px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .edit-btn {
          background: #667eea;
          color: white;
        }

        .edit-btn:hover {
          background: #5a67d8;
          transform: scale(1.05);
        }

        .delete-btn {
          background: #f44336;
          color: white;
        }

        .delete-btn:hover {
          background: #da190b;
          transform: scale(1.05);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 15px;
          margin-top: 20px;
        }

        .empty-icon {
          font-size: 64px;
          color: #cbd5e0;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #4a5568;
        }

        .empty-state p {
          color: #718096;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}