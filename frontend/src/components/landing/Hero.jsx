// Hero.jsx - Using simple CSS
import { Link } from 'react-router-dom';
import { FaBookOpen, FaSearch, FaHandHoldingHeart } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h1>Louez des livres facilement</h1>
            <p>
              Découvrez des milliers de livres à louer. Retournez-les quand vous voulez. 
              La bibliothèque moderne à portée de clic.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/books" className="btn btn-primary">
                Explorer les livres
              </Link>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <FaBookOpen style={{ fontSize: '2rem', marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>5000+ Livres</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Large sélection</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <FaSearch style={{ fontSize: '2rem', marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Recherche facile</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Trouvez votre livre</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <FaHandHoldingHeart style={{ fontSize: '2rem', marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Livraison rapide</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Sous 48h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;