import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { GalleryItem } from '../types';
import { Image, Eye, Sparkles, X } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { t, language, galleryItems } = useShop();
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // If no photos uploaded yet, show simple clean empty state as requested
  if (galleryItems.length === 0) {
    return (
      <section className="py-12 bg-[#440000] text-amber-50 border-t-2 border-[#D4AF37]/40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="h-0.5 w-10 bg-[#D4AF37]"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFDF73]">
              {t.ourGallery}
            </span>
            <span className="h-0.5 w-10 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#FFDF73] font-['Cinzel']">
            {t.ourGallery}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 max-w-md mx-auto">
            {t.galleryEmptyDesc}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 sm:py-18 bg-[#440000] text-amber-50 border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="h-0.5 w-10 bg-[#D4AF37]"></span>
            <Sparkles className="w-4 h-4 text-[#FFDF73] fill-[#FFDF73]" />
            <span className="h-0.5 w-10 bg-[#D4AF37]"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFDF73] font-['Cinzel'] tracking-wide">
            {t.ourGallery}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
            {t.gallerySubtitle}
          </p>
        </div>

        {/* Gallery Grid: Uploaded Photos with Elegant Gold Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryItems.map((item) => {
            const displayTitle = language === 'te' && item.titleTe ? item.titleTe : item.title;
            return (
              <div
                key={item.id}
                onClick={() => setPreviewItem(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl border-2 border-[#D4AF37] bg-[#330000] transition transform hover:-translate-y-1 duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>

                  {item.isFeatured && (
                    <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#4A0000] text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 border border-white">
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>{t.featured}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <div className="p-3 rounded-full bg-black/50 text-[#FFDF73] border border-[#D4AF37]">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#FFDF73] leading-snug">
                      {displayTitle}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-amber-100/90 mt-0.5 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Image Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative max-w-3xl w-full bg-[#FFFDF9] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-5 bg-[#FAF5EE] text-[#2D1810] border-t-2 border-amber-200">
              <h3 className="text-lg font-black text-[#580000] font-['Cinzel']">
                {language === 'te' && previewItem.titleTe ? previewItem.titleTe : previewItem.title}
              </h3>
              {previewItem.caption && (
                <p className="text-xs sm:text-sm text-[#503325] mt-1">
                  {previewItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
