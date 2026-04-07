// Testimonials.jsx
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Marie L.",
    role: "Étudiante",
    comment: "Service exceptionnel ! Les livres arrivent rapidement et en parfait état.",
    rating: 5,
    avatar: "M"
  },
  {
    id: 2,
    name: "Thomas D.",
    role: "Professeur",
    comment: "Une excellente alternative à l'achat de livres. Je recommande vivement !",
    rating: 5,
    avatar: "T"
  },
  {
    id: 3,
    name: "Sophie M.",
    role: "Bibliothécaire",
    comment: "La plateforme est très intuitive et le choix est impressionnant.",
    rating: 5,
    avatar: "S"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <h2 className="testimonials-title">Ce que nos clients disent</h2>
        <p className="testimonials-subtitle">Ils nous font confiance et partagent leur expérience</p>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <FaQuoteLeft className="testimonial-quote" />
              <div className="testimonial-avatar">
                {testimonial.avatar}
              </div>
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="testimonial-star" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.comment}"</p>
              <div className="testimonial-author">
                <p className="testimonial-name">{testimonial.name}</p>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;