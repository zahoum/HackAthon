import { useState, useEffect } from 'react';
import { FaBook, FaCalendarCheck, FaUndo } from 'react-icons/fa';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get('/rentals/my-rentals');
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      // Mock data
      setRentals([
        {
          _id: 1,
          book: { title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry' },
          rentalDate: '2024-01-15',
          dueDate: '2024-02-15',
          status: 'active',
          price: 5
        },
        {
          _id: 2,
          book: { title: '1984', author: 'George Orwell' },
          rentalDate: '2024-01-01',
          dueDate: '2024-02-01',
          status: 'returned',
          price: 6
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId) => {
    if (window.confirm('Voulez-vous vraiment retourner ce livre ?')) {
      try {
        await api.put(`/rentals/${rentalId}/return`);
        fetchRentals(); // Refresh list
        alert('Livre retourné avec succès !');
      } catch (error) {
        alert('Erreur lors du retour');
      }
    }
  };

  const activeRentals = rentals.filter(r => r.status === 'active');
  const returnedRentals = rentals.filter(r => r.status === 'returned');

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes locations</h1>

        {/* Active Rentals */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaBook className="mr-2 text-blue-600" />
            Locations en cours ({activeRentals.length})
          </h2>
          
          {activeRentals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Aucune location en cours</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeRentals.map((rental) => (
                <div key={rental._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{rental.book.title}</h3>
                      <p className="text-gray-600 mb-2">par {rental.book.author}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarCheck className="mr-1" />
                        <span>Loué le: {new Date(rental.rentalDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FaCalendarCheck className="mr-1" />
                        <span>À retourner avant: {new Date(rental.dueDate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-blue-600 font-semibold mt-2">{rental.price}€ / mois</p>
                    </div>
                    
                    <button
                      onClick={() => handleReturn(rental._id)}
                      className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <FaUndo className="mr-2" />
                      Retourner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Returned Rentals */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Historique ({returnedRentals.length})
          </h2>
          
          {returnedRentals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Aucun livre retourné</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {returnedRentals.map((rental) => (
                <div key={rental._id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{rental.book.title}</h3>
                      <p className="text-gray-600">par {rental.book.author}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Retourné le: {new Date(rental.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                      Retourné
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRentals;