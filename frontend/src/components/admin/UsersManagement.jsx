// UsersManagement.jsx - Fixed with correct API endpoints
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaEnvelope, FaSpinner, FaUserCheck } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/v1';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', mail: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Note: You need to add a GET /users endpoint in your backend
      // For now, we'll show a message
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        // If endpoint doesn't exist, show mock data for demonstration
        setUsers([]);
        setErrorMessage('Users endpoint not implemented yet. Please add GET /api/v1/users to your backend.');
      } else {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Users endpoint not found. Please add GET /api/v1/users to your backend.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_URL}/user/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete user');
        setSuccessMessage('User deleted successfully!');
        await fetchUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting user:', error);
        setErrorMessage('Failed to delete user');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.mail || !newUser.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUser.name, mail: newUser.mail, password: newUser.password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add user');
      }

      setSuccessMessage('User added successfully!');
      await fetchUsers();
      setNewUser({ name: '', mail: '', password: '' });
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding user:', error);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setNewUser({ name: '', mail: '', password: '' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
        <p>Loading users...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Users Management</h1>
          <p style={{ margin: '5px 0 0', color: '#666' }}>Manage all registered users from the database</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUserPlus /> Add New User
        </button>
      </div>

      {successMessage && (
        <div style={{ background: '#c6f6d5', color: '#22543d', padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaUserCheck /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ background: '#fed7d7', color: '#c53030', padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '25px' }}>
        <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 15px 12px 45px', border: '2px solid #e1e5e9', borderRadius: '12px' }} />
      </div>

      <div style={{ background: 'white', borderRadius: '15px', overflowX: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f7f9fc' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #e1e5e9' }}>
                <td style={{ padding: '15px' }}>{user._id?.slice(-6) || 'N/A'}</td>
                <td style={{ padding: '15px' }}><strong>{user.name}</strong></td>
                <td style={{ padding: '15px' }}><FaEnvelope style={{ marginRight: '8px', color: '#667eea' }} /> {user.mail}</td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => handleDeleteUser(user._id)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}><FaTrash /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}><p>No users found.</p></div>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeModal}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <div style={{ marginBottom: '20px' }}>
              <label>Full Name</label>
              <input type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '2px solid #e1e5e9', borderRadius: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Email Address</label>
              <input type="email" value={newUser.mail} onChange={(e) => setNewUser({...newUser, mail: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '2px solid #e1e5e9', borderRadius: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Password</label>
              <input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '2px solid #e1e5e9', borderRadius: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={closeModal} style={{ background: '#f5f5f5', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddUser} style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}