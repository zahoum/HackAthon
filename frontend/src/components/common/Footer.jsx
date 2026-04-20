// Footer.jsx

//I added some icons to make the footer more visually appealing and user-friendly
//I imported also the css file to style the footer and make it more attractive and responsive, I used flexbox to arrange the sections and media queries to adjust the layout for smaller screens
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight, FaLaptopCode, FaServer, FaDatabase } from 'react-icons/fa';
import { useState } from 'react';
import '../../App.css';

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
          <h3>📚 Books Rent</h3>
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
            <li><FaEnvelope /> contact@BooksRent.com</li>
            <li><FaPhone /> +212 6 49339948</li>
            <li><FaMapMarkerAlt /> Al Hoceima, Maroc</li>
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
        <p>&copy; 2026 <a className='footer-link' href="https://booksrent.vercel.app" target="_blank" rel="noopener noreferrer">Books Rent</a>. Tous droits réservés.</p>
        <p className="crafted">Crafted with ❤️ by :</p>

        <div className="footer-team">
          <div className="footer-item" >
            <FaLaptopCode className="icon" /> 
            <a href="https://aissazahoum.vercel.app/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Aissa ZAHOUM
            </a>
          </div>


          {/* simple changes in collaborators links */}
          <div className="footer-item">
            <FaServer className="icon" />
            <a href="https://arrachmohammed.dev/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Mohammed ARRACH
            </a>
          </div>

          <div className="footer-item">
            <FaDatabase className="icon" />
            <a href="https://mohamedmarkhi.vercel.app/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Mohamed MARKHI
            </a>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;