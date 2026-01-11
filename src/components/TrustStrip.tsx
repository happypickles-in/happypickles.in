import { ChefHat, Flame, ShieldCheck, Star } from 'lucide-react';

const features = [
  { icon: ChefHat, text: '100% Homemade', subtext: 'Handcrafted in small batches' },
  { icon: Flame, text: 'Authentic Andhra Recipes', subtext: 'Straight from Godavari' },
  { icon: ShieldCheck, text: 'No Preservatives', subtext: 'Only pure, traditional ingredients' },
  { icon: Star, text: '4.9/5 Rated', subtext: 'Loved by pickle lovers across India' },
];

export default function TrustStrip() {
  return (
    <section className="py-12 bg-white border-y border-[#E8E0D6]">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="
          grid
          grid-cols-2
          md:grid-cols-2
          lg:grid-cols-4
          gap-y-10
          gap-x-8
          items-center
          justify-items-center
        ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center max-w-[220px]"
            >
              <div className="mx-auto inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#FFF9F3] to-[#F5EDE3] rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-[#D35400]" />
              </div>

              <h3 className="text-[#2D1F14] font-semibold mb-1">
                {feature.text}
              </h3>

              <p className="text-sm text-[#6B5A4A] leading-snug">
                {feature.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
