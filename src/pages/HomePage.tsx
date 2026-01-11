// src/pages/HomePage.tsx
import React from 'react';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import Bestsellers from '../components/Bestsellers';
import Categories from '../components/Categories';
import FullMenu from '../components/FullMenu';
import Reviews from '../components/Reviews';
import Offer from '../components/Offer';
import BrandStory from '../components/BrandStory';
import TrustBadges from '../components/TrustBadges';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <TrustStrip />
      <Bestsellers />
      <Categories />
      <FullMenu />
      <Reviews />
      <Offer />
      <BrandStory />
      <TrustBadges />
      <Footer />
    </div>
  );
}
