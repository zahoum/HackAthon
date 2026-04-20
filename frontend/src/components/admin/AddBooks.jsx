// AddBooks.jsx - Fixed with correct API endpoints
import React, { useState, useEffect } from 'react';
import { FaBook, FaUser, FaTag, FaPlus, FaCheck, FaSpinner, FaTrash, FaEdit } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/v1';

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
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
    'Mystery', 'Thriller', 'Romance', 'Biography',
    'History', 'Dystopian', 'Classic', 'Poetry'
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Fixed: Use /livres endpoint instead of /books
      const response = await fetch(`${API_URL}/livres`);
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
          headers: { 'Content-Type': 'application/json' },
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
          headers: { 'Content-Type': 'application/json' },
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

      await fetchBooks();
      setBookForm({ title: '', category: '', author: '' });
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setSubmitting(false);
    }
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
        await fetchBooks();
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
        <p style={{ marginTop: '1rem' }}>Loading books...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Books Management</h1>
          <p style={{ margin: '5px 0 0', color: '#666' }}>Add, edit, or remove books from the library</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <FaPlus /> Add New Book
          </button>
        )}
      </div>

      {successMessage && (
        <div style={{ background: '#c6f6d5', color: '#22543d', padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCheck /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ background: '#fed7d7', color: '#c53030', padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {showForm && (
        <div style={{ background: 'white', borderRadius: '15px', padding: '25px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
            <button onClick={handleCancel} style={{ background: 'none', border: 'none', fontSize: '30px', cursor: 'pointer' }}>×</button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><FaBook /> Book Title</label>
              <input type="text" name="title" placeholder="Enter book title" value={bookForm.title} onChange={handleInputChange} required
                style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><FaTag /> Category</label>
              <select name="category" value={bookForm.category} onChange={handleInputChange} required
                style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '10px' }}>
                <option value="">Select a category</option>
                {categories.map((cat, index) => (<option key={index} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><FaUser /> Author</label>
              <input type="text" name="author" placeholder="Enter author name" value={bookForm.author} onChange={handleInputChange} required
                style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '10px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                {submitting ? 'Processing...' : (editingId ? 'Update Book' : 'Add Book')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {books.map(book => (
          <div key={book._id} style={{ background: 'white', borderRadius: '15px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📖</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{book.title}</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>by {book.author}</p>
              <div>
                <span style={{ background: '#f0f0f0', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', color: '#667eea', fontWeight: '600' }}>{book.category || 'Uncategorized'}</span>
                {book.isRented === true ? (
                  <span style={{ marginLeft: '8px', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', background: '#fee2e2', color: '#dc2626' }}>📕 Indisponible</span>
                ) : (
                  <span style={{ marginLeft: '8px', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', background: '#d1fae5', color: '#065f46' }}>✅ Disponible</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => handleEdit(book)} style={{ background: '#667eea', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}><FaEdit /> Edit</button>
              <button onClick={() => handleDelete(book._id)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '15px', marginTop: '20px' }}>
          <FaBook style={{ fontSize: '64px', color: '#cbd5e0', marginBottom: '20px' }} />
          <h3>No Books Yet</h3>
          <p>Click the "Add New Book" button to start adding books to your library.</p>
        </div>
      )}
    </div>
  );
}