import React from 'react';
import { useShop, ActiveView } from '../context/ShopContext';
import { Printer, BookOpen, Sparkles, ArrowRight, Check } from 'lucide-react';

interface SelectServiceProps {
  selectedServiceId?: 'xerox' | 'stationery' | 'fancy' | null;
  onSelectService?: (id: 'xerox' | 'stationery' | 'fancy') => void;
}

export const SelectService: React.FC<SelectServiceProps> = ({
  selectedServiceId,
  onSelectService,
}) => {
  const { language, setActiveView } = useShop();

  const services = [
    {
      id: 'xerox' as const,
      title: language === 'te' ? 'జిరాక్స్ & ప్రింటింగ్' : 'XEROX & PRINTING',
      desc:
        language === 'te'
          ? 'బ్లాక్ & వైట్ జిరాక్స్, రంగుల ప్రింట్స్, డాక్యుమెంట్లు మరియు లామినేషన్ సేవలు.'
          : 'High-speed Black & White photocopy, Color Xerox, laser document printing, and thermal lamination.',
      icon: Printer,
      categoryLabel: language === 'te' ? 'జిరాక్స్ & ప్రింట్' : 'FAST PHOTOCOPY & PRINT',
    },
    {
      id: 'stationery' as const,
      title: language === 'te' ? 'పుస్తకాలు & స్టేషనరీ' : 'BOOKS & STATIONERY',
      desc:
        language === 'te'
          ? 'స్కూల్ మరియు కాలేజీ పుస్తకాలు, క్లాస్‌మేట్ నోట్‌బుక్స్, పెన్నులు, ఎగ్జామ్ కిట్స్ మరియు ఆఫీస్ సామాగ్రి.'
          : 'School textbooks, state board guides, Classmate notebooks, fine pens, art supplies, and office stationery.',
      icon: BookOpen,
      categoryLabel: language === 'te' ? 'పుస్తకాలు & స్టేషనరీ' : 'SCHOOL & OFFICE SUPPLIES',
    },
    {
      id: 'fancy' as const,
      title: language === 'te' ? 'ఫ్యాన్సీ ఐటమ్స్' : 'FANCY ITEMS',
      desc:
        language === 'te'
          ? 'ట్రడిషనల్ వెల్వెట్ గాజులు, జుంకాలు, స్టిక్కర్ బొట్లు, హెయిర్ క్లచెస్, స్క్రంచీస్ మరియు అలంకరణ వస్తువులు.'
          : 'Traditional velvet bangles, antique jhumkas, designer sticker bindis, hair clips, scrunchies, and cosmetics.',
      icon: Sparkles,
      categoryLabel: language === 'te' ? 'ఫ్యాన్సీ & అలంకరణ' : 'ACCESSORIES & BEAUTY',
    },
  ];

  const handleCardClick = (id: 'xerox' | 'stationery' | 'fancy') => {
    if (onSelectService) {
      onSelectService(id);
    } else {
      setActiveView(id as ActiveView);
    }
  };

  return (
    <section
      id="select-the-service-section"
      className="py-10 sm:py-14 bg-[#420000] scroll-mt-16 text-amber-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* THREE SERVICE CARDS - EXACT COLOR COMBINATION & DESIGN SPEC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedServiceId === service.id;

            return (
              <div
                key={service.id}
                onClick={() => handleCardClick(service.id)}
                className={`group relative rounded-3xl p-7 sm:p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl ${
                  isSelected
                    ? 'bg-[#FFF9EA] border-2 border-[#FFDF73] ring-4 ring-[#FFDF73]/40 shadow-2xl scale-[1.02]'
                    : 'bg-[#FFFDF8] border border-[#D4AF37]/70 hover:border-[#D4AF37] hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                {/* Top Section: Icon block + Small category label */}
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    {/* Icon Block: Deep Maroon background with Golden Yellow icon */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#540000] flex items-center justify-center flex-shrink-0 shadow-md border border-[#D4AF37]/50 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFDF73]" />
                    </div>

                    {/* Small category label: Light Peach / Cream with Maroon text */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="bg-[#FCEEE6] text-[#6B0000] text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#F3D7C8] shadow-xs">
                        {service.categoryLabel}
                      </span>

                      {/* Selected State Indicator Badge */}
                      {isSelected && (
                        <span className="bg-[#D4AF37] text-[#420000] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>SELECTED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-2 pt-1">
                    {/* Card heading: Dark Navy / Deep Brown */}
                    <h3 className="text-xl sm:text-2xl font-black text-[#1F1E2C] font-['Cinzel'] tracking-wide group-hover:text-[#540000] transition-colors leading-tight">
                      {service.title}
                    </h3>

                    {/* Description text: Muted Dark Blue */}
                    <p className="text-xs sm:text-sm text-[#3C4A5E] leading-relaxed line-clamp-3 font-normal">
                      {service.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Section: Thin soft gold divider + Deep Maroon Action text + Circular Arrow Button */}
                <div className="pt-6 mt-6">
                  {/* Thin divider: Soft Gold */}
                  <div className="border-t border-[#E8D39E] mb-5"></div>

                  <div className="flex items-center justify-between gap-3">
                    {/* Action text: Deep Maroon */}
                    <span className="text-[#540000] font-black text-xs sm:text-sm tracking-wider uppercase group-hover:text-[#750000] transition-colors">
                      {isSelected ? 'View & Select Options' : 'Explore Options'}
                    </span>

                    {/* Arrow button: Deep Maroon with a Gold arrow */}
                    <div className="w-10 h-10 rounded-full bg-[#540000] group-hover:bg-[#6D0000] flex items-center justify-center flex-shrink-0 text-[#FFDF73] shadow-md border border-[#D4AF37]/60 group-hover:scale-110 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-[#FFDF73] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
