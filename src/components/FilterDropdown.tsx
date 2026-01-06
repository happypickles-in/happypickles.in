import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Option = {
    label: string;
    value: string;
    icon?: any;
    iconColor?: string;
};

type Props = {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    align?: 'left' | 'right';
};

export default function FilterDropdown({
    label,
    value,
    options,
    onChange,
    align = 'left',
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        const handleScroll = () => {
            setOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchmove', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
        };
    }, []);


    const active = options.find(o => o.value === value);

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8E0D6] shadow-sm hover:shadow-md transition-all text-sm font-semibold text-[#2D1F14]"
            >
                {active?.icon && (
                    <active.icon
                        className={`w-4 h-4 ${active.iconColor || 'text-[#E67E22]'}`}
                    />
                )}
                <span className="whitespace-nowrap">
                    {active?.label || label}
                </span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className={`
            absolute z-50 mt-2
            ${align === 'right' ? 'right-0' : 'left-0'}
            w-max min-w-full
            max-w-[calc(100vw-2rem)]
            rounded-2xl bg-white
            shadow-xl border border-[#EEE]
            overflow-hidden
          `}
                >
                    {options.map(opt => {
                        const Icon = opt.icon;
                        const isActive = opt.value === value;

                        return (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  text-sm whitespace-nowrap transition-colors
                  ${isActive
                                        ? 'bg-[#FFF3E8] text-[#E67E22]'
                                        : 'hover:bg-[#FFF9F3] text-[#2D1F14]'
                                    }
                `}
                            >
                                {Icon && (
                                    <Icon
                                        className={`w-4 h-4 ${opt.iconColor || 'text-[#6B5A4A]'
                                            }`}
                                    />
                                )}
                                <span className="font-medium">{opt.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
