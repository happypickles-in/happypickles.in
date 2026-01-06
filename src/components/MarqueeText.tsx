import { useEffect, useRef, useState } from 'react';

interface MarqueeTextProps {
  text: string;
  variant?: 'primary' | 'secondary';
}

export default function MarqueeText({
  text,
  variant = 'primary',
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const textWidth = textRef.current.scrollWidth;

    if (textWidth > containerWidth) {
      setDistance(textWidth - containerWidth);
    } else {
      setDistance(0);
    }
  }, [text]);

  const isSecondary = variant === 'secondary';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${isSecondary ? 'h-[24px]' : 'h-[21px] md:h-[25px]'
        }`}
    >
      <h3
        ref={textRef}
        className={`whitespace-nowrap inline-block ${isSecondary
            ? 'text-xs font-semibold text-[#2D1F14]/50'
            : 'text-base md:text-lg font-semibold text-[#2D1F14]'
          }`}
        style={
          distance > 0
            ? ({
              animation: `smart-marquee ${Math.max(
                8,
                distance / 18
              )}s ease-in-out infinite`,
              transform: 'translateX(0)',
              ['--marquee-distance' as any]: `-${distance}px`,
            })
            : undefined
        }
      >
        {text}
      </h3>

    </div>
  );
}
