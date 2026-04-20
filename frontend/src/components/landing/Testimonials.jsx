// Testimonials.jsx - Complete working version
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Marie L.",
    role: "Student",
    comment: "Exceptional service! Books arrive quickly and in perfect condition.",
    rating: 5,
    avatar: "M"
  },
  {
    id: 2,
    name: "Thomas D.",
    role: "Professor",
    comment: "An excellent alternative to buying books. Highly recommend!",
    rating: 5,
    avatar: "T"
  },
  {
    id: 3,
    name: "Sophie M.",
    role: "Librarian",
    comment: "The platform is very intuitive and the selection is impressive.",
    rating: 5,
    avatar: "S"
  }
];

const Testimonials = () => {
  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'white'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.8rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          What Our Customers Say
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#4a5568',
          fontSize: '1.2rem',
          marginBottom: '3rem'
        }}>
          They trust us and share their experience
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} style={{
              background: '#f9fafb',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <FaQuoteLeft style={{
                fontSize: '2rem',
                color: '#667eea',
                opacity: 0.3,
                position: 'absolute',
                top: '1rem',
                left: '1rem'
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {testimonial.avatar}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.25rem',
                marginBottom: '1rem'
              }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} style={{ color: '#fbbf24' }} />
                ))}
              </div>
              <p style={{
                color: '#4b5563',
                lineHeight: '1.6',
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>
                "{testimonial.comment}"
              </p>
              <div>
                <p style={{
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  {testimonial.name}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;