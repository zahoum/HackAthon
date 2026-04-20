// AdminDashboard.jsx - Fixed with correct API endpoints
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBook, FaCog, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import UsersManagement from './UsersManagement';
import AddBooks from './AddBooks';

const API_URL = 'http://localhost:5000/api/v1';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, totalRented: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch books - using correct /livres endpoint
      const booksResponse = await fetch(`${API_URL}/livres`);
      const books = booksResponse.ok ? await booksResponse.json() : [];
      
      // Fetch rentals
      const rentedResponse = await fetch(`${API_URL}/rentedBooks`);
      const rented = rentedResponse.ok ? await rentedResponse.json() : [];
      
      // For users - you need to add a GET /users endpoint in your backend
      // For now, we'll use a placeholder
      const usersResponse = await fetch(`${API_URL}/users`);
      const users = usersResponse.ok ? await usersResponse.json() : [];

      setStats({
        totalUsers: users.length,
        totalBooks: books.length,
        totalRented: rented.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    switch(activePage) {
      case 'users':
        return <UsersManagement />;
      case 'books':
        return <AddBooks />;
      default:
        return <DashboardHome stats={stats} loading={loading} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fb' }}>
      <div style={{ width: '280px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', display: 'flex', flexDirection: 'column', padding: '30px 20px', position: 'fixed', height: '100vh' }}>
        <div><h2 style={{ margin: '0 0 40px 0' }}>👑 Admin Panel</h2></div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActivePage('dashboard')} style={{ background: activePage === 'dashboard' ? 'white' : 'rgba(255,255,255,0.1)', color: activePage === 'dashboard' ? '#667eea' : 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaChartLine /> Dashboard
          </button>
          <button onClick={() => setActivePage('users')} style={{ background: activePage === 'users' ? 'white' : 'rgba(255,255,255,0.1)', color: activePage === 'users' ? '#667eea' : 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaUsers /> Users
          </button>
          <button onClick={() => setActivePage('books')} style={{ background: activePage === 'books' ? 'white' : 'rgba(255,255,255,0.1)', color: activePage === 'books' ? '#667eea' : 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaBook /> Add Books
          </button>
        </nav>
        <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
      
      <div style={{ flex: 1, marginLeft: '280px', padding: '30px' }}>
        {renderContent()}
      </div>
    </div>
  );
}

function DashboardHome({ stats, loading }) {
  const statsData = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#667eea' },
    { title: 'Total Books', value: stats.totalBooks, icon: '📚', color: '#48bb78' },
    { title: 'Active Loans', value: stats.totalRented, icon: '🔄', color: '#ed8936' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <FaSpinner style={{ fontSize: '48px', animation: 'spin 1s linear infinite', color: '#667eea' }} />
        <p>Loading dashboard...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Dashboard Overview</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>Welcome back, Admin! Here's what's happening today.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {statsData.map((stat, index) => (
          <div key={index} style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px', borderTop: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '48px' }}>{stat.icon}</div>
            <div>
              <h3 style={{ margin: 0, color: '#666', fontSize: '14px' }}>{stat.title}</h3>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}