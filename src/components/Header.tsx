import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, MessageCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    shopSettings,
    setActiveView,
  } = useShop();

  const handleWhatsAppClick = () => {
    const cleanNumber = shopSettings.whatsapp.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      language === 'te'
        ? `నమస్తే శ్రీ దుర్గా మాత స్టేషనరీ! నేను మీ సర్వీసులు మరియు పుస్తకాల గురించి తెలుసుకోవాలనుకుంటున్నాను.`
        : `Hello Sree Durga Mata Stationery! I would like to inquire about your services and items.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#580000] text-white shadow-lg border-b-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Decorative Golden Circle with Golden Sparkle + Shop Name & Subtitle */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group min-w-0"
        >
          {/* 1. Small decorative golden circle containing a golden sparkle/sprinkle symbol */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#FFE58F] via-[#D4AF37] to-[#996515] p-[2px] shadow-md flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#580000] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFDF73] fill-[#FFDF73]" />
            </div>
          </div>

          {/* 2. Shop Name and Subtitle */}
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-wide text-white font-['Cinzel'] leading-tight truncate group-hover:text-[#FFDF73] transition">
              {language === 'te' ? 'శ్రీ దుర్గా మాత స్టేషనరీ' : 'SREE DURGA MATA STATIONERY'}
            </h1>
            <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#FFDF73] uppercase font-['Plus_Jakarta_Sans'] truncate">
              {language === 'te' ? 'బుక్ స్టాల్ & ఫ్యాన్సీ ఐటమ్స్' : 'BOOK STALL & FANCY ITEMS'}
            </p>
          </div>
        </div>

        {/* Right: Language Switcher + WhatsApp Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* 3. English | తెలుగు language switcher */}
          <div className="inline-flex rounded-lg p-0.5 bg-[#400000] border border-[#D4AF37]/50 shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-bold transition ${
                language === 'en'
                  ? 'bg-[#D4AF37] text-[#400000] shadow-sm'
                  : 'text-amber-100/90 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-bold font-['Noto_Sans_Telugu'] transition ${
                language === 'te'
                  ? 'bg-[#D4AF37] text-[#400000] shadow-sm'
                  : 'text-amber-100/90 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* 4. WhatsApp button */}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition transform active:scale-95 border border-emerald-400/40"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current flex-shrink-0" />
            <span className="hidden xs:inline">WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
};
