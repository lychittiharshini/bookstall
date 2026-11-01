import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FancyProduct } from '../types';
import {
  Sparkles,
  ArrowLeft,
  Search,
  Check,
  Plus,
  Minus,
  MessageCircle,
} from 'lucide-react';

interface SelectedFancyItem {
  product: FancyProduct;
  quantity: number;
}

export const FancySection: React.FC = () => {
  const {
    t,
    language,
    setActiveView,
    fancyCategories,
    fancyProducts,
    shopSettings,
  } = useShop();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedFancyItem>>({});
  const [fancyNotes, setFancyNotes] = useState('');

  const activeCategories = fancyCategories.filter((c) => c.isActive !== false);

  const filteredProducts = fancyProducts.filter((product) => {
    const matchesCategory =
      selectedCategoryId === 'all' ||
      product.categoryId === selectedCategoryId ||
      (product.categoryName &&
        activeCategories.find((c) => c.id === selectedCategoryId)?.name === product.categoryName);

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      (product.nameTe && product.nameTe.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.colors && product.colors.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleToggleSelectProduct = (product: FancyProduct) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[product.id]) {
        delete copy[product.id];
      } else {
        copy[product.id] = { product, quantity: 1 };
      }
      return copy;
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setSelectedItems((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: { ...existing, quantity: newQty },
      };
    });
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const selectedItemsList = Object.values(selectedItems);

  // Send through WhatsApp
  const handleSendThroughWhatsApp = () => {
    if (selectedItemsList.length === 0) {
      alert(
        language === 'te'
          ? 'దయచేసి కనీసం ఒక ఫ్యాన్సీ వస్తువును ఎంచుకోండి.'
          : 'Please select at least one fancy item before sending.'
      );
      return;
    }

    const lines: string[] = [];
    lines.push(`🙏 *SREE DURGA MATA STATIONERY*`);
    lines.push(`📖 *BOOK STALL & FANCY ITEMS*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`✨ *FANCY ITEMS ENQUIRY / ORDER*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`*Selected Items:*`);

    selectedItemsList.forEach((item, index) => {
      const p = item.product;
      const displayName = language === 'te' && p.nameTe ? p.nameTe : p.name;
      const rateText =
        p.price != null && !p.isPriceOnRequest
          ? `₹${p.price * item.quantity} (₹${p.price} each)`
          : 'Rate Upon Request';
      lines.push(`${index + 1}. • ${displayName} — Qty: ${item.quantity} [${rateText}]`);
    });

    if (fancyNotes.trim()) {
      lines.push(`\n📝 *Notes / Color & Size Preferences:*`);
      lines.push(`${fancyNotes.trim()}`);
    }

    lines.push(`\n━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📍 H. No. 69, Ilapur Rd, Durgamata Colony, Hyderabad`);
    lines.push(`Please confirm designs and availability.`);

    const cleanNumber = shopSettings.whatsapp.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#480000] text-amber-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Back Button */}
        <div className="border-b-2 border-[#D4AF37]/50 pb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FFDF73] hover:text-white transition mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backToServices}</span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-full bg-[#330000] border border-[#D4AF37] text-[#FFDF73]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFDF73] font-['Cinzel'] tracking-wide">
                  {t.fancyItems}
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
                  {language === 'te'
                    ? 'గాజులు, జుంకాలు, స్టిక్కర్ బొట్లు, హెయిర్ క్లిప్స్ మరియు మహిళల అలంకరణ వస్తువులు'
                    : 'Bangles, jhumkas, designer bindis, hair clutches, and accessories in Hyderabad'}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#D4AF37] bg-[#FFFDF9] text-[#2D1810] focus:ring-2 focus:ring-[#FFDF73] focus:outline-none"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex-shrink-0 transition border ${
              selectedCategoryId === 'all'
                ? 'bg-[#D4AF37] text-[#400000] border-[#FFF3B0] shadow-md'
                : 'bg-[#560000] text-amber-100 border-[#D4AF37]/40 hover:bg-[#620000]'
            }`}
          >
            {t.allCategories}
          </button>
          {activeCategories.map((cat) => {
            const displayName = language === 'te' && cat.nameTe ? cat.nameTe : cat.name;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex-shrink-0 transition border ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#400000] border-[#FFF3B0] shadow-md'
                    : 'bg-[#560000] text-amber-100 border-[#D4AF37]/40 hover:bg-[#620000]'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isSelected = Boolean(selectedItems[product.id]);
            const selectedQty = selectedItems[product.id]?.quantity || 1;
            const displayName = language === 'te' && product.nameTe ? product.nameTe : product.name;

            return (
              <div
                key={product.id}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between border-2 ${
                  isSelected
                    ? 'ring-4 ring-[#FFDF73] border-[#FFDF73] bg-[#FFFDF9] text-[#2D1810] shadow-2xl scale-[1.02]'
                    : 'border-[#D4AF37]/50 hover:border-[#D4AF37] bg-[#560000] text-amber-50 shadow-md'
                }`}
              >
                {/* Image with gold border */}
                <div className="relative h-52 overflow-hidden border-b-2 border-[#D4AF37]/80">
                  <img
                    src={product.image}
                    alt={displayName}
                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Gold Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#400000] text-xs font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1 border border-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>SELECTED</span>
                    </div>
                  )}

                  {/* Price Tag or Rate Upon Request */}
                  <div className="absolute bottom-3 left-3 bg-[#400000] text-[#FFDF73] text-xs font-black px-2.5 py-1 rounded-md border border-[#D4AF37] shadow">
                    {product.isPriceOnRequest || product.price == null
                      ? t.rateUponRequest
                      : `₹${product.price}`}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                      {product.categoryName}
                    </span>
                    <h3 className="font-extrabold text-sm leading-snug mt-0.5 line-clamp-2">
                      {displayName}
                    </h3>
                    <p
                      className={`text-xs mt-1 line-clamp-2 ${
                        isSelected ? 'text-[#503325]' : 'text-amber-100/80'
                      }`}
                    >
                      {product.description}
                    </p>
                    {product.colors && (
                      <p className="text-[11px] text-amber-300 font-semibold mt-1">
                        Colors: {product.colors}
                      </p>
                    )}
                  </div>

                  {/* Select & Quantity Bar */}
                  <div className="pt-2 border-t border-amber-900/30">
                    {isSelected ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center border border-[#800000] rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, -1)}
                            className="px-2.5 py-1 text-[#800000] font-black hover:bg-amber-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1 text-xs font-black text-[#800000]">
                            {selectedQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, 1)}
                            className="px-2.5 py-1 text-[#800000] font-black hover:bg-amber-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(product.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 underline"
                        >
                          {t.remove}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleSelectProduct(product)}
                        className="w-full py-2 px-3 rounded-xl bg-[#3D0000] hover:bg-[#D4AF37] text-[#FFDF73] hover:text-[#400000] font-bold text-xs uppercase tracking-wider border border-[#D4AF37]/40 transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Select Item</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* YOUR SELECTED ITEMS SUMMARY */}
        <div className="bg-[#FFFDF9] text-[#2D1810] rounded-2xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl space-y-6">
          <div className="border-b-2 border-amber-200 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#580000] font-['Cinzel'] tracking-wide">
              {t.yourSelectedItems}
            </h2>
            <span className="text-xs font-bold text-[#800000] bg-amber-100 px-3 py-1 rounded-full">
              {selectedItemsList.length} {language === 'te' ? 'వస్తువులు' : 'items'}
            </span>
          </div>

          {selectedItemsList.length === 0 ? (
            <p className="text-xs sm:text-sm text-[#704938] py-4 text-center">
              No fancy items selected yet. Click "Select Item" on any product above to add it to your order.
            </p>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-2.5">
                {selectedItemsList.map(({ product, quantity }) => {
                  const displayName = language === 'te' && product.nameTe ? product.nameTe : product.name;
                  return (
                    <li
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FAF5EE] border border-amber-200 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={displayName}
                          className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37]/50"
                        />
                        <div>
                          <p className="font-extrabold text-[#450000]">{displayName}</p>
                          <p className="text-xs text-[#800000] font-semibold">
                            {product.price != null && !product.isPriceOnRequest
                              ? `₹${product.price * quantity} (₹${product.price} × ${quantity})`
                              : t.rateUponRequest}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-amber-300 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, -1)}
                            className="px-2 py-0.5 text-xs font-black text-[#800000]"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-[#800000]">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(product.id, 1)}
                            className="px-2 py-0.5 text-xs font-black text-[#800000]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(product.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-bold underline"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#553326] mb-1">
                  {t.specialInstructionsTitle}
                </label>
                <textarea
                  rows={2}
                  value={fancyNotes}
                  onChange={(e) => setFancyNotes(e.target.value)}
                  placeholder="Mention bangle size (e.g. 2.4, 2.6, 2.8), color choice, or festival date..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-amber-300 bg-white"
                />
              </div>

              {/* SEND THROUGH WHATSAPP BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendThroughWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-black text-base shadow-xl transition transform active:scale-98 cursor-pointer border border-emerald-400/50"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{t.sendThroughWhatsApp}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
