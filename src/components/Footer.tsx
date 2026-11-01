import React from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, Phone, MessageCircle, Mail, Clock, Navigation, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, shopSettings, setActiveView } = useShop();

  const handleOpenGoogleMaps = () => {
    window.open(shopSettings.googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#3A0000] text-amber-100 border-t-2 border-[#D4AF37]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Brand & Motto */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-lg sm:text-xl font-black text-[#FFDF73] font-['Cinzel'] tracking-wide">
              {language === 'te' ? 'శ్రీ దుర్గా మాత స్టేషనరీ' : 'SREE DURGA MATA STATIONERY'}
            </h2>
            <p className="text-xs font-bold text-amber-200 tracking-wider uppercase">
              {language === 'te' ? 'బుక్ స్టాల్ & ఫ్యాన్సీ ఐటమ్స్' : 'BOOK STALL & FANCY ITEMS'}
            </p>

            <p className="text-xs sm:text-sm text-amber-100/90 italic font-medium leading-relaxed max-w-md pt-1">
              "{t.footerMotto}"
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4D0000] hover:bg-[#5E0000] text-[#FFDF73] text-xs font-bold border border-[#D4AF37]/50 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.getDirections}</span>
              </button>
            </div>
          </div>

          {/* Quick Sections */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFDF73]">
              {language === 'te' ? 'సేవలు' : 'Quick Options'}
            </h3>
            <ul className="space-y-1.5 text-xs text-amber-100/80">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('xerox')}
                  className="hover:text-[#FFDF73] transition"
                >
                  {t.xeroxPrinting}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('stationery')}
                  className="hover:text-[#FFDF73] transition"
                >
                  {t.booksStationery}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('fancy')}
                  className="hover:text-[#FFDF73] transition"
                >
                  {t.fancyItems}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-[#FFDF73] transition"
                >
                  {t.shopLocation}
                </button>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div className="lg:col-span-4 space-y-2.5 text-xs text-amber-100/90">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFDF73]">
              {language === 'te' ? 'సంప్రదించండి' : 'Store Information'}
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFDF73] flex-shrink-0 mt-0.5" />
                <span>{shopSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFDF73] flex-shrink-0" />
                <span>{shopSettings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFDF73] flex-shrink-0" />
                <a href={`tel:${shopSettings.phone}`} className="hover:text-white transition">
                  {shopSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: {shopSettings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFDF73] flex-shrink-0" />
                <a href={`mailto:${shopSettings.email}`} className="hover:text-white transition truncate">
                  {shopSettings.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tiny Discreet Admin Login at the absolute bottom */}
      <div className="bg-[#240000] py-3.5 px-4 sm:px-6 lg:px-8 border-t border-amber-950 text-[11px] text-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Sree Durga Mata Stationery. All rights reserved.</p>

        {/* Tiny discreet link */}
        <button
          type="button"
          onClick={() => setActiveView('admin')}
          className="text-[10px] text-amber-400/40 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
        >
          <Lock className="w-2.5 h-2.5" />
          <span>{t.adminLogin}</span>
        </button>
      </div>
    </footer>
  );
};
