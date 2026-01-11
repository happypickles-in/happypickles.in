import { useNavigate, useLocation } from 'react-router-dom';
import BonelessChicken from '../assets/nobg/BonelessChicken.webp';
import Putharekulu from '../assets/nobg/putharekulu.png';
import GonguraChickenPickle from '../assets/nobg/GonguraChickenPickle.webp';
import GonguraPrawns from '../assets/nobg/GonguraPrawns.webp';
import GummadiVadiyalu from '../assets/nobg/GummadiVadiyalu.webp';
import PindiVadiyalu from '../assets/nobg/PindiVadiyalu.webp';
import Karveypaaku from '../assets/nobg/Karveypaaku.webp';
import Mango from '../assets/nobg/Mango.webp';
import Lemon from '../assets/nobg/Lemon.webp';
import RedChilliPowder from '../assets/nobg/RedChilliPowder.webp';
import TurmericPowder from '../assets/nobg/TurmericPowder.webp';
import jadi from "../assets/nobg/jadi.png"
import rangoli from "../assets/nobg/rangoli.png"

export default function Categories() {

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
    <section id="categories" className="py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="text-center mb-4 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#2D1F14] mb-4">Explore Our Flavors</h2>
          <p className="text-lg text-[#6B5A4A] max-w-2xl mx-auto">
            Dive into every taste of Andhra — from fiery pickles to sweet delights.
          </p>
        </div>
        <div className="w-full">
          <div className="relative w-full aspect-square max-h-[50vh] rounded-full scale-[85%] md:scale-[120%]">
            {/* <img src={pentagon} className='w-82 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[54.5%]' alt="" /> */}
            <div className="absolute w-full aspect-square max-h-[50vh] spin rounded-full">
              <div className="products-card absolute top-1/2 left-1/2 translate-x-[75%] -translate-y-[90%]">
                <div onClick={() => goToCategory('non-veg')} className="w-32 h-32 product spin-reverse relative non-veg-card">
                  <img src={BonelessChicken} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 scale-90 -translate-x-[5%] -translate-y-[60%]' />
                  <img src={GonguraChickenPickle} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 scale-90 -translate-x-[95%] -translate-y-[60%]' />
                  <img src={GonguraPrawns} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%]' />
                  <p className='rounded-full absolute -bottom-5 left-1/2 -translate-x-1/2 overflow-y-visible w-24 text-center text-[14px]'>Non-Veg Pickles</p>
                </div>
              </div>
              <div className="products-card absolute top-1/2 left-1/2 -translate-x-[175%] -translate-y-[90%]">
                <div onClick={() => goToCategory('veg')} className="w-32 h-32 product spin-reverse relative veg-card">
                  <img src={Karveypaaku} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 scale-90 -translate-x-[5%] -translate-y-[60%]' />
                  <img src={Mango} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 scale-90 -translate-x-[95%] -translate-y-[60%]' />
                  <img src={Lemon} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%]' />
                  <p className='rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 overflow-y-visible w-24 text-center text-[14px]'>Veg Pickles</p>
                </div>
              </div>
              <div onClick={() => goToCategory('powder')} className="products-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[180%]">
                <div className="w-32 h-32 product spin-reverse relative powders">
                  <img src={RedChilliPowder} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 scale-90 -translate-x-[80%] -translate-y-[60%]' />
                  <img src={TurmericPowder} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-[40%]' />
                  <p className='rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 overflow-y-visible w-24 text-center text-[14px]'>Powders</p>
                </div>
              </div>
              <div onClick={() => goToCategory('snack')} className="products-card absolute top-1/2 left-1/2 translate-x-[26%] translate-y-[55%]">
                <div className="w-32 h-32 product spin-reverse relative snaacks">
                  <img src={GummadiVadiyalu} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 scale-90 -translate-x-[80%] -translate-y-[60%]' />
                  <img src={PindiVadiyalu} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-[40%]' />
                  <p className='rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 overflow-y-visible w-24 text-center text-[14px]'>Snacks</p>
                </div>
              </div>
              <div onClick={() => goToCategory('sweet')} className="products-card absolute top-1/2 left-1/2 -translate-x-[126%] translate-y-[55%]">
                <div className="w-32 h-32 product spin-reverse relative sweets">
                  <img src={Putharekulu} alt="" className='w-16 h-16 absolute top-1/2 left-1/2 scale-150 -translate-x-1/2 -translate-y-1/2' />
                  <p className='rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 overflow-y-visible w-24 text-center text-[14px]'>Sweets</p>
                </div>
              </div>
            </div>
            <div className="w-[165px] aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
              <img
                src={rangoli}
                alt="Rangoli Background"
                className="absolute spin-reverse inset-0 w-full h-full object-cover z-0"
              />
              <img
                src={jadi}
                alt="Jadi Pot"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            </div>


            <div className="aspect-square absolute top-1/2 left-1/2 -translate-x-[53%] -translate-y-[32%]">
              <div className="relative scale-[150%] ml-2">
                <span
                  className='font-amsterdam text-2xl transition-colors text-[#7a1f1f]'
                >
                  happy pickles
                </span>
                <span
                  className='absolute right-[16px] -bottom-[1px] font-amsterdam text-[9px] transition-colors block text-[#7a1f1f]'
                >
                  <span className="text-[4px] mr-[2px]">&</span> powders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
