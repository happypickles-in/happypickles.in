import { Phone, Instagram, Youtube, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import jadi from "../assets/nobg/jadi.png"
import rangoli from "../assets/nobg/rangoli.png"
export default function Footer() {

  const navigate = useNavigate();
  const location = useLocation();

  const goToCategory = (category: string) => {
    const query = category === 'all' ? '' : `?category=${category}`;

    // If already on homepage
    if (location.pathname === '/') {
      navigate(query);
    } else {
      // From policy / any other page → go home
      navigate(`/${query}`);
    }
  };

  return (
    <footer className="bg-[#2F251B] text-[#F5EDE3] py-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className='col-start-1 col-span-2 md:col-span-1 mx-auto'>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative h-14 aspect-square overflow-hidden">
                <img
                  src={rangoli}
                  className="absolute inset-0 w-full h-full object-cover spin"
                  alt=""
                />
                <img
                  src={jadi}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  alt=""
                />
              </div>
              <div className="relative scale-[115%] ml-2">
                <span
                  className={`font-amsterdam text-2xl transition-colors text-white`}
                >
                  happy pickles
                </span>
                <span
                  className={`absolute right-[16px] -bottom-[1px] font-amsterdam text-[9px] transition-colors block text-white`}
                >
                  <span className="text-[4px] mr-[2px]">&</span> powders
                </span>
              </div>
            </div>

            <p className="text-[#E8E0D6] mb-4 text-center md:text-left">
              Authentic Godavari Taste. Delivered.
            </p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/happypicklesbhimavaram" target='_blank'
                className="w-10 h-10 bg-white/10 hover:bg-[#D35400] rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@happypickles-s3t" target='_blank'
                className="w-10 h-10 bg-white/10 hover:bg-[#D35400] rounded-full flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-[#D35400] rounded-full flex items-center justify-center transition-colors"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="row-start-2 lg:row-start-1 lg:col-start-2 mx-auto">
            <h3 className="text-white font-semibold text-lg mb-4">Shop</h3>

            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => goToCategory('veg')}
                  className="text-[#E8E0D6] hover:text-white transition-colors text-left"
                >
                  Veg Pickles
                </button>
              </li>

              <li>
                <button
                  onClick={() => goToCategory('non-veg')}
                  className="text-[#E8E0D6] hover:text-white transition-colors text-left"
                >
                  Non-Veg Pickles
                </button>
              </li>

              <li>
                <button
                  onClick={() => goToCategory('powder')}
                  className="text-[#E8E0D6] hover:text-white transition-colors text-left"
                >
                  Powders
                </button>
              </li>

              <li>
                <button
                  onClick={() => goToCategory('snack')}
                  className="text-[#E8E0D6] hover:text-white transition-colors text-left"
                >
                  Snacks
                </button>
              </li>

              <li>
                <button
                  onClick={() => goToCategory('sweet')}
                  className="text-[#E8E0D6] hover:text-white transition-colors text-left"
                >
                  Sweets
                </button>
              </li>
            </ul>
          </div>

          <div className='row-start-2 lg:row-start-1 lg:col-start-3 mx-auto'>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-[#E8E0D6] hover:text-white transition-colors">About Us</a></li>
              <li><a href="#bestsellers" className="text-[#E8E0D6] hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#categories" className="text-[#E8E0D6] hover:text-white transition-colors">Categories</a></li>
              <li><a href="#menu" className="text-[#E8E0D6] hover:text-white transition-colors">Full Menu</a></li>
              <li><a href="#reviews" className="text-[#E8E0D6] hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>

          <div className='row-start-3 col-span-2 md:row-start-1 col-start-1 md:col-start-2 lg:col-start-4 mx-auto'>
            <h3 className="text-white font-semibold text-lg mb-4 text-center lg:text-left">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-[#E8E0D6] text-sm mb-1 text-center lg:text-left">Customer Support</p>
                  <a href="tel:+919030559088" className="flex flex-row gap-2 text-white font-semibold hover:text-[#F39C12] mb-2">
                    <Phone className="w-5 h-5 text-[#D35400] flex-shrink-0 mt-1" />
                    +91 90305 59088
                  </a>
                  <a href="tel:+919030559088" className="flex flex-row gap-2 text-white font-semibold hover:text-[#F39C12] mb-2">
                    <Phone className="w-5 h-5 text-[#D35400] flex-shrink-0 mt-1" />
                    +91 90305 59088
                  </a>
                  <a href="tel:+919030559088" className="flex flex-row gap-2 text-white font-semibold hover:text-[#F39C12] mb-2">
                    <Phone className="w-5 h-5 text-[#D35400] flex-shrink-0 mt-1" />
                    +91 90305 59088
                  </a>
                  <div className="flex flex-row gap-2 text-white font-semibold hover:text-[#F39C12] mb-2">
                    <MapPin className="w-5 h-5 text-[#D35400] flex-shrink-0 mt-1" />
                    Door no 19-16-132, Backside BMK Rice Mill
                    BHimavaram, West Godavari, A.P.
                    INDIA - 534201
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <p className="text-[#E8E0D6] text-sm">
              © 2024 Happy Pickles. All rights reserved. Made with love in Bhimavaram.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-[#E8E0D6] hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-[#E8E0D6] hover:text-white transition-colors">Shipping Policy</a>
              <a href="#" className="text-[#E8E0D6] hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#E8E0D6] hover:text-white transition-colors">Refund Policy</a>
              <a href="#" className="text-[#E8E0D6] hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
