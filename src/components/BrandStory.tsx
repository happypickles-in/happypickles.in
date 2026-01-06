import { Heart, Users, Award, TrendingUp } from 'lucide-react';
import jadi from "../assets/nobg/jadi.png"
import rangoli from "../assets/nobg/rangoli.png"
const stats = [
  { icon: Users, value: '25,000+', label: 'Happy Families' },
  { icon: Award, value: '3 Gen', label: 'Family Recipe' },
  { icon: TrendingUp, value: '4.9/5', label: 'Customer Rating' },
  { icon: Heart, value: '100%', label: 'Made With Love' },
];

export default function BrandStory() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-[#FFF9F3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative w-full aspect-[1/1] scale-[175%] md:scale-[250%] overflow-hidden">
            <div className="w-[165px] aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
              <img
                src={rangoli}
                alt="Rangoli Background"
                className="absolute spin inset-0 w-full h-full object-cover z-0"
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
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-[#D35400]" />
              <span className="text-sm font-semibold text-[#6B5A4A]">Our Story</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-semibold text-[#2D1F14] mb-6">
              From Godavari, With Love
            </h2>

            <div className="space-y-4 text-lg text-[#6B5A4A] leading-relaxed mb-8">
              <p>
                Happy Pickles was born from a simple belief: the flavors we grew up with should never be lost.
              </p>

              <p>
                Every jar is handmade by our family in Rajahmundry using recipes passed down for 3 generations. No machines. No preservatives. Just love, spice, and tradition.
              </p>

              <p className="font-semibold text-[#2D1F14]">
                Thank you for letting our family's tradition be a part of yours.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-5 shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D35400] to-[#C0392B] rounded-lg flex items-center justify-center">
                      <stat.icon className="min-w-5 min-h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-[#2D1F14]">{stat.value}</span>
                  </div>
                  <p className="text-sm text-[#6B5A4A]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
