// LandingPage.jsx - Supprimer Footer import et usage
import Hero from '../components/landing/Hero';
import FeaturedBooks from '../components/landing/FeaturedBooks';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <FeaturedBooks />
      <HowItWorks />
      <Testimonials />
    </>
  );
};

export default LandingPage;