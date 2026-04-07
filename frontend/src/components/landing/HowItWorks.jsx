// HowItWorks.jsx - Version corrigée
import { FaSearch, FaHandHoldingHeart, FaBook, FaUndo } from 'react-icons/fa';

const steps = [
  {
    icon: FaSearch,
    title: "Cherchez",
    description: "Parcourez notre catalogue de milliers de livres"
  },
  {
    icon: FaHandHoldingHeart,
    title: "Choisissez",
    description: "Sélectionnez le livre que vous voulez louer"
  },
  {
    icon: FaBook,
    title: "Recevez",
    description: "Le livre est livré chez vous en 48h"
  },
  {
    icon: FaUndo,
    title: "Retournez",
    description: "Retournez le livre quand vous avez fini"
  }
];

const HowItWorks = () => {
  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
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
          Comment ça marche ?
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#4a5568',
          fontSize: '1.2rem',
          marginBottom: '3rem'
        }}>
          Louer un livre n'a jamais été aussi simple
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {steps.map((step, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
              }}>
                {index + 1}
              </div>
              <div style={{
                fontSize: '3rem',
                margin: '1rem 0',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <step.icon />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '1rem 0',
                color: '#2d3748'
              }}>
                {step.title}
              </h3>
              <p style={{
                color: '#718096',
                lineHeight: '1.6'
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;