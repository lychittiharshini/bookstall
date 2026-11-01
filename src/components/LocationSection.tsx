import React from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, Navigation, Clock, Phone, Sparkles, ExternalLink } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { t, language, shopSettings } = useShop();

  const handleOpenGoogleMaps = () => {
    window.open(shopSettings.googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="location-section" className="py-14 sm:py-18 bg-[#4C0000] text-amber-50 scroll-mt-16 border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="h-0.5 w-12 bg-[#D4AF37]"></span>
            <Sparkles className="w-4 h-4 text-[#FFDF73] fill-[#FFDF73]" />
            <span className="h-0.5 w-12 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFDF73] font-['Cinzel'] tracking-wide">
            {t.shopLocation}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
            {shopSettings.address}
          </p>
        </div>

        {/* Two-Column Grid: Address Cards + Map with Gold Border */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Information Column in Cream Card */}
          <div className="lg:col-span-5 bg-[#FFFDF9] text-[#2D1810] p-6 sm:p-8 rounded-2xl border-2 border-[#D4AF37] shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Address Card */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-[#600000] text-[#FFDF73] flex-shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#800000]">
                    {t.addressLabel}
                  </h3>
                  <p className="mt-1 text-sm font-extrabold text-[#450000] leading-snug">
                    {shopSettings.address}
                  </p>
                  <p className="mt-1 text-[11px] text-[#704938] font-mono">
                    Coordinates: 17.53725, 78.321972
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-[#D4AF37] text-[#400000] flex-shrink-0 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#800000]">
                    {t.openingHoursLabel}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-[#450000]">
                    {shopSettings.openingHours}
                  </p>
                  <p className="text-xs text-[#704938]">
                    {shopSettings.holidays}
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-emerald-700 text-white flex-shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#800000]">
                    {t.contactLabel}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-[#450000]">
                    {shopSettings.phone}
                  </p>
                  <p className="text-xs text-[#704938]">
                    WhatsApp: {shopSettings.whatsapp}
                  </p>
                </div>
              </div>
            </div>

            {/* GET DIRECTIONS Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] hover:from-[#E5BE42] hover:to-[#E5BE42] text-[#400000] font-black text-sm uppercase tracking-wider shadow-xl transition transform active:scale-98 cursor-pointer border border-[#FFF3B0]"
              >
                <Navigation className="w-4 h-4 text-[#400000]" />
                <span>{t.getDirections}</span>
                <ExternalLink className="w-4 h-4 ml-0.5 opacity-80" />
              </button>
            </div>
          </div>

          {/* Map Column with Gold Border */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl relative min-h-[340px] bg-amber-50">
            <iframe
              title="Sree Durga Mata Stationery Map Location"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=78.311972%2C17.52725%2C78.331972%2C17.54725&layer=mapnik&marker=17.53725%2C78.321972`}
              className="w-full h-full min-h-[350px] border-0"
              loading="lazy"
            ></iframe>

            {/* Overlay badge */}
            <div className="absolute bottom-3 left-3 right-3 bg-[#4A0000]/95 backdrop-blur-md rounded-xl p-3 border border-[#D4AF37] shadow-lg flex items-center justify-between text-white">
              <div>
                <p className="text-xs font-black text-[#FFDF73]">
                  SREE DURGA MATA STATIONERY
                </p>
                <p className="text-[11px] text-amber-200 truncate">
                  Ilapur Rd, Durgamata Colony, Tanda, Hyderabad
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className="px-3 py-1 bg-[#D4AF37] text-[#400000] text-xs font-black rounded-lg hover:bg-yellow-400 transition flex-shrink-0"
              >
                Map Link →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
