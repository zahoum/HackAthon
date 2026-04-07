import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaHandHoldingHeart, FaClock, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRentals: 0,
    activeRentals: 0,
    booksRead: 0
  });
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rentalsResponse] = await Promise.all([
          api.get('/rentals/my-rentals')
        ]);
        
        const rentals = rentalsResponse.data;
        const active = rentals.filter(r => r.status === 'active');
        
        setStats({
          totalRentals: rentals.length,
          activeRentals: active.length,
          booksRead: rentals.filter(r => r.status === 'returned').length
        });
        
        setRecentRentals(rentals.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: 'Livres loués',
      value: stats.totalRentals,
      icon: FaBook,
      color: 'bg-blue-500'
    },
    {
      title: 'En cours',
      value: stats.activeRentals,
      icon: FaHandHoldingHeart,
      color: 'bg-green-500'
    },
    {
      title: 'Livres lus',
      value: stats.booksRead,
      icon: FaChartLine,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.name} ! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Voici un résumé de votre activité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-full`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Locations récentes</h2>
            {recentRentals.length > 0 ? (
              <div className="space-y-4">
                {recentRentals.map((rental) => (
                  <div key={rental._id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-semibold">{rental.book?.title}</p>
                      <p className="text-sm text-gray-500">
                        Loué le {new Date(rental.rentalDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rental.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rental.status === 'active' ? 'En cours' : 'Retourné'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Vous n'avez pas encore de locations
              </p>
            )}
            <Link to="/my-rentals" className="block text-center mt-4 text-blue-600 hover:text-blue-800">
              Voir toutes mes locations →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="space-y-4">
              <Link
                to="/books"
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Explorer les livres
              </Link>
              <Link
                to="/return-book"
                className="block w-full text-center border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
              >
                Retourner un livre
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;