import React from 'react';
import { useShop } from '../context/ShopContext';
import { Tag, Sparkles, Calendar, ArrowRight } from 'lucide-react';

export const OffersSection: React.FC = () => {
  const { t, language, offers, setActiveView } = useShop();

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter only active and non-expired offers
  const activeOffers = offers.filter((offer) => {
    if (!offer.isActive) return false;
    if (offer.endDate && offer.endDate < todayStr) return false;
    if (offer.startDate && offer.startDate > todayStr) return false;
    return true;
  });

  // Display this section ONLY when active offers exist
  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9EE] to-[#FFFDF9] border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="h-0.5 w-10 bg-[#D4AF37]"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#800000]">
              {t.offersSpecials}
            </span>
            <span className="h-0.5 w-10 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4A0000] font-['Cinzel']">
            {t.offersSpecials}
          </h2>
          <p className="text-sm sm:text-base text-[#6b4433]">
            {t.offersSubtitle}
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeOffers.map((offer) => {
            const displayTitle = language === 'te' && offer.titleTe ? offer.titleTe : offer.title;
            return (
              <div
                key={offer.id}
                className="relative bg-white rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl flex flex-col sm:flex-row group"
              >
                {/* Offer Image */}
                <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-amber-100 flex-shrink-0">
                  <img
                    src={offer.imageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>

                  {offer.discountBadge && (
                    <div className="absolute top-3 left-3 bg-[#800000] text-[#FFDF73] text-[11px] font-black uppercase px-2.5 py-1 rounded shadow-md border border-amber-300">
                      {offer.discountBadge}
                    </div>
                  )}
                </div>

                {/* Offer Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>{language === 'te' ? 'ప్రత్యేక రాయితీ' : 'Festival Promotion'}</span>
                    </div>

                    <h3 className="mt-1 text-lg sm:text-xl font-black text-[#500000] font-['Cinzel'] leading-snug">
                      {displayTitle}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-[#503325] leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs text-[#704938]">
                    {offer.endDate && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#800000]" />
                        <span>Valid till: {offer.endDate}</span>
                      </span>
                    )}

                    <button
                      onClick={() => setActiveView('stationery')}
                      className="inline-flex items-center gap-1 font-bold text-[#800000] hover:text-[#500000] transition group-hover:translate-x-1 duration-200"
                    >
                      <span>{language === 'te' ? 'ఆర్డర్ చేయండి' : 'Shop Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
