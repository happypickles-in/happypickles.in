// src/App.tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Bestsellers from './components/Bestsellers';
import Categories from './components/Categories';
import FullMenu from './components/FullMenu';
import Reviews from './components/Reviews';
import Offer from './components/Offer';
import BrandStory from './components/BrandStory';
import TrustBadges from './components/TrustBadges';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import CartDrawer from './components/CartDrawer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <CartProvider>
        <CartDrawer />
        <Navbar />
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
      </CartProvider>
    </div>
  );
}
