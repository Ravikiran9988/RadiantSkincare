import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AIConsultation from '../components/AIConsultation';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AIConsultation />
      <Footer />
    </>
  );
}

export default Home;
