import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaSearch, FaBook } from 'react-icons/fa';

const ReturnBook = () => {
  const [activeRentals, setActiveRentals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveRentals();
  }, []);

  const fetchActiveRentals = async () => {
    try {
      const response = await api.get('/rentals/my-rentals');
      const active = response.data.filter(r => r.status === 'active');
      setActiveRentals(active);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId) => {
    if (window.confirm('Confirmer le retour de ce livre ?')) {
      try {
        await api.put(`/rentals/${rentalId}/return`);
        alert('Livre retourné avec succès !');
        fetchActiveRentals();
      } catch (error) {
        alert('Erreur lors du retour');
      }
    }
  };

  const filteredRentals = activeRentals.filter(rental =>
    rental.book.title.toLowerCase().includes(search.toLowerCase()) ||
    rental.book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Retourner un livre</h1>

          <div className="mb-6 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredRentals.length === 0 ? (
            <div className="text-center py-8">
              <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {search ? 'Aucun livre trouvé' : 'Aucun livre à retourner'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRentals.map((rental) => (
                <div key={rental._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{rental.book.title}</h3>
                    <p className="text-gray-600">par {rental.book.author}</p>
                    <p className="text-sm text-gray-500">
                      Loué le: {new Date(rental.rentalDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReturn(rental._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Retourner
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnBook;