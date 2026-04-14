// UsersManagement.jsx
import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaEnvelope, FaCalendar } from 'react-icons/fa';

export default function UsersManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'admin', joinDate: '2024-01-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'user', joinDate: '2024-03-05' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        ...newUser,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'user' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="users-management">
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p>Manage all registered users</p>
        </div>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          <FaUserPlus /> Add New User
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><strong>{user.name}</strong></td>
                <td><FaEnvelope className="email-icon" /> {user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td><FaCalendar /> {user.joinDate}</td>
                <td className="actions">
                  <button className="action-btn edit-btn" title="Edit">
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleAddUser}>Add User</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .users-management {
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
          transition: transform 0.2s ease;
        }

        .btn-add:hover {
          transform: translateY(-2px);
        }

        .search-bar {
          position: relative;
          margin-bottom: 25px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .users-table-container {
          background: white;
          border-radius: 15px;
          overflow-x: auto;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: #f7f9fc;
        }

        .users-table th {
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #e1e5e9;
        }

        .users-table td {
          padding: 15px;
          border-bottom: 1px solid #e1e5e9;
        }

        .users-table tbody tr:hover {
          background: #f7f9fc;
        }

        .email-icon {
          margin-right: 8px;
          color: #667eea;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .role-user {
          background: #e3f2fd;
          color: #1976d2;
        }

        .role-admin {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 5px;
          transition: all 0.2s ease;
        }

        .edit-btn {
          color: #667eea;
        }

        .edit-btn:hover {
          background: #e8eaff;
          transform: scale(1.1);
        }

        .delete-btn {
          color: #f44336;
        }

        .delete-btn:hover {
          background: #ffe5e5;
          transform: scale(1.1);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          animation: slideUp 0.3s ease;
        }

        .modal-content h2 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 25px;
        }

        .btn-cancel {
          background: #f5f5f5;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-submit {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
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