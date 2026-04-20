// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBook, FaCog, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import UsersManagement from './UsersManagement';
import AddBooks from './AddBooks';

const API_URL = 'http://localhost:5000/api/v1';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalRented: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersResponse = await fetch(`${API_URL}/users`);
      const users = usersResponse.ok ? await usersResponse.json() : [];
      
      // Fetch books
      const booksResponse = await fetch(`${API_URL}/books`);
      const books = booksResponse.ok ? await booksResponse.json() : [];
      
      // Fetch rented books
      const rentedResponse = await fetch(`${API_URL}/rented`);
      const rented = rentedResponse.ok ? await rentedResponse.json() : [];

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
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>👑 Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <FaChartLine /> Dashboard
          </button>
          <button 
            className={`nav-item ${activePage === 'users' ? 'active' : ''}`}
            onClick={() => setActivePage('users')}
          >
            <FaUsers /> Users
          </button>
          <button 
            className={`nav-item ${activePage === 'books' ? 'active' : ''}`}
            onClick={() => setActivePage('books')}
          >
            <FaBook /> Add Books
          </button>
          <button className="nav-item">
            <FaCog /> Settings
          </button>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
      
      <div className="admin-content">
        {renderContent()}
      </div>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f5f7fb;
        }

        .admin-sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
        }

        .admin-logo h2 {
          margin: 0 0 40px 0;
          font-size: 24px;
        }

        .admin-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nav-item {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }

        .nav-item.active {
          background: white;
          color: #667eea;
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 20px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255, 0, 0, 0.3);
          border-color: rgba(255, 0, 0, 0.5);
        }

        .admin-content {
          flex: 1;
          margin-left: 280px;
          padding: 30px;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 80px;
          }
          
          .admin-logo h2 {
            font-size: 16px;
            text-align: center;
          }
          
          .nav-item span {
            display: none;
          }
          
          .logout-btn span {
            display: none;
          }
          
          .admin-content {
            margin-left: 80px;
          }
        }
      `}</style>
    </div>
  );
}

// Dashboard Home Component with real data
function DashboardHome({ stats, loading }) {
  const statsData = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#667eea' },
    { title: 'Total Books', value: stats.totalBooks, icon: '📚', color: '#48bb78' },
    { title: 'Active Loans', value: stats.totalRented, icon: '🔄', color: '#ed8936' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading dashboard...</p>
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
    <div>
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin! Here's what's happening today.</p>
      </div>
      
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-number">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #333;
          font-size: 32px;
        }

        .dashboard-header p {
          color: #666;
          margin-top: 5px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 48px;
        }

        .stat-info {
          flex: 1;
        }

        .stat-card h3 {
          margin: 0 0 5px 0;
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        .stat-number {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }
      `}</style>
    </div>
  );
}