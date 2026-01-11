import { Sparkles } from 'lucide-react';
import avakay from '../assets/avakaya.mp4';
import herotn from '../assets/hero.webp';
import { useState } from 'react';
export default function Hero() {
  const [videoStarted, setVideoStarted] = useState(false);
  return (
    <section className="relative h-[100vh] w-full overflow-hidden">

      <div className="absolute inset-0 w-full h-full overflow-hidden scale-[135%]">

        {/* Thumbnail (locks until video plays) */}
        {!videoStarted && (
          <img
            src={herotn}
            alt="Hero thumbnail"
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        )}

        {/* Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onPlay={() => setVideoStarted(true)}
          className="w-full h-full object-cover"
        >
          <source src={avakay} type="video/mp4" />
        </video>

      </div>

      {/* Mask / Overlay */}
      {/* <div className="absolute inset-0 bg-black/55 backdrop-brightness-[100%]" /> */}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-20 h-full flex items-center">
        <div className="text-center max-w-4xl mx-auto">

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-sm mt-4 md:mb-8">
            <Sparkles className="w-4 h-4 text-[#F39C12]" />
            <span className="text-sm font-medium text-[#2D1F14]">
              Trusted by 25,000+ families across India
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6">
            Taste the Soul of Godavari — Delivered Fresh to Your Doorstep
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-12 max-w-3xl mx-auto">
            Authentic, handmade Andhra pickles crafted in small batches using family
            recipes passed down for 3 generations. No preservatives. No shortcuts.
            Just bold, fiery flavor.
          </p>

          <div className="flex flex-row items-center justify-center gap-4">
            <a href="#bestsellers" className="px-8 py-4 rounded-xl font-semibold text-white bg-[#E67E22] hover:bg-[#CF6C13] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              Order Bestsellers
            </a>

            <a href="#menu" className="px-8 py-4 rounded-xl font-semibold text-[#2D1F14] bg-white border border-[#2D1F14]/15 hover:border-[#2D1F14]/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              Explore Full Menu
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
