import { ShieldCheck, CreditCard, Truck, Calendar, Home } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, text: '100% Secure Payments' },
  { icon: CreditCard, text: 'COD Available' },
  { icon: Calendar, text: 'Fresh Weekly Batches' },
  { icon: Home, text: 'Made in a Home Kitchen' },
];

export default function TrustBadges() {
  return (
    <section className="py-16 bg-white border-y border-[#E8E0D6]">
      <div className="max-w-7xl mx-auto px-5 lg:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 lg:gap-12">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFF9F3] to-[#F5EDE3] rounded-full flex items-center justify-center">
                <badge.icon className="w-6 h-6 text-[#D35400]" />
              </div>

              <span className="text-[#2D1F14] font-medium leading-snug">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
