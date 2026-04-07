// Footer.jsx
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert(`Merci de vous être inscrit avec: ${email}`);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>📚 BookZahoum</h3>
          <p>Votre bibliothèque en ligne pour louer des livres facilement et à petit prix.</p>
          <div className="social-links">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaEnvelope /></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul className="footer-links">
            <li><a href="/books">📖 Livres disponibles</a></li>
            <li><a href="/how-it-works">❓ Comment ça marche</a></li>
            <li><a href="/faq">💬 FAQ</a></li>
            <li><a href="/contact">📞 Contactez-nous</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <ul className="footer-links">
            <li><FaEnvelope /> contact@bookzahoum.com</li>
            <li><FaPhone /> +212 6 49339948</li>
            <li><FaMapMarkerAlt /> Alhoceima, Maroc</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Recevez nos offres exclusives</p>
          <form onSubmit={handleNewsletter} className="newsletter-form">
            <input 
              type="email" 
              placeholder="Votre email" 
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-button">
              <FaArrowRight />
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 BookZahoum. Tous droits réservés.</p>
        <p>Frontend powered by Zahoum Aissa & </p>
        <p>backend with arrach mohamed &</p>
        <p>database with merkhi mohamed </p>
        <p>| Made with ❤️ au Maroc</p>
      </div>
    </footer>
  );
};

export default Footer;