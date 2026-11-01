import React from 'react';
import { useShop } from '../context/ShopContext';
import { Clock, MapPin, Navigation } from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, shopSettings } = useShop();

  const handleOpenGoogleMaps = () => {
    window.open(shopSettings.googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#3E0000] via-[#460000] to-[#3A0000] text-amber-50 pt-4 pb-6 sm:py-6 border-b border-[#D4AF37]/50">
      {/* Subtle traditional festive glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute -top-10 left-10 w-72 h-72 rounded-full bg-amber-400 blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-yellow-500 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* HERO BANNER FRAME: Exact Traditional Temple Artwork Reference (image_f4a644e0.png) */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-[3px] border-[#D4AF37] bg-[#2E0000]">
          {/* Main Visual Banner Artwork */}
          <div className="relative w-full overflow-hidden bg-[#380000]">
            <img
              src="/assets/aistudio/image_f4a644e0.png"
              alt="Sree Durga Mata Stationery - Book Stall & Fancy Items Traditional Festive Banner"
              className="w-full h-auto object-contain sm:object-cover max-h-[580px] mx-auto block"
              loading="eager"
            />
          </div>

          {/* NARROW MAROON INFORMATION STRIP WITH GOLDEN ICONS AT THE BOTTOM */}
          <div className="bg-[#2D0000] border-t-2 border-[#D4AF37] py-2.5 sm:py-3 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-amber-200 text-xs sm:text-sm font-medium">
            {/* Opening Hours with Golden Clock Icon */}
            <div className="flex items-center gap-2 text-center sm:text-left">
              <Clock className="w-4 h-4 text-[#FFDF73] flex-shrink-0" />
              <span>
                <strong className="text-[#FFDF73] font-bold">Open Daily:</strong>{' '}
                {shopSettings.openingHours || '8:00 AM – 9:30 PM'}
              </span>
            </div>

            {/* Golden Dot Separator (hidden on mobile) */}
            <span className="hidden sm:inline text-[#D4AF37] text-base leading-none">•</span>

            {/* Shop Location with Golden MapPin Icon */}
            <div
              onClick={handleOpenGoogleMaps}
              className="flex items-center gap-2 cursor-pointer hover:text-white transition group text-center sm:text-right"
              title="Click for Google Maps Directions"
            >
              <MapPin className="w-4 h-4 text-[#FFDF73] flex-shrink-0 group-hover:scale-110 transition" />
              <span className="group-hover:underline">
                <strong className="text-[#FFDF73] font-bold">Location:</strong>{' '}
                {shopSettings.address || 'H. No. 69, Ilapur Rd, Durgamata Colony, Hyderabad'}
              </span>
              <Navigation className="w-3 h-3 text-[#FFDF73] opacity-75 group-hover:opacity-100 hidden md:inline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
