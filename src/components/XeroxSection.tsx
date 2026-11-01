import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Printer,
  Copy,
  Layers,
  FileText,
  Check,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

interface XeroxOption {
  id: string;
  category: 'bw_xerox' | 'color_xerox' | 'printing' | 'lamination';
  categoryLabel: string;
  name: string;
  nameTe?: string;
  rate?: number | null;
  pricingUnit?: string;
}

export const XeroxSection: React.FC = () => {
  const {
    t,
    language,
    setActiveView,
    shopSettings,
    xeroxServices,
  } = useShop();

  // Helper to get rate from admin configured xeroxServices if available
  const getServiceRate = (matchKey: string): { rate?: number | null; unit?: string } => {
    const found = xeroxServices.find((s) =>
      s.name.toLowerCase().includes(matchKey.toLowerCase())
    );
    if (found && !found.isPriceOnRequest && found.price != null && found.price > 0) {
      return { rate: found.price, unit: found.pricingUnit || 'per page' };
    }
    return { rate: null, unit: undefined };
  };

  // 7 standard options grouped into the 4 requested categories
  const optionsList: XeroxOption[] = [
    // 1. BLACK & WHITE XEROX
    {
      id: 'bw_single',
      category: 'bw_xerox',
      categoryLabel: t.bwXerox,
      name: 'Black & White Xerox – Single Side',
      nameTe: 'బ్లాక్ & వైట్ జిరాక్స్ – ఒక వైపు',
      ...getServiceRate('Black & White Xerox – Single Side'),
    },
    {
      id: 'bw_double',
      category: 'bw_xerox',
      categoryLabel: t.bwXerox,
      name: 'Black & White Xerox – Double Side',
      nameTe: 'బ్లాక్ & వైట్ జిరాక్స్ – రెండు వైపులా',
      ...getServiceRate('Black & White Xerox – Double Side'),
    },

    // 2. COLOUR XEROX
    {
      id: 'color_single',
      category: 'color_xerox',
      categoryLabel: t.colorXerox,
      name: 'Colour Xerox – Single Side',
      nameTe: 'రంగుల జిరాక్స్ – ఒక వైపు',
      ...getServiceRate('Colour Xerox – Single Side'),
    },
    {
      id: 'color_double',
      category: 'color_xerox',
      categoryLabel: t.colorXerox,
      name: 'Colour Xerox – Double Side',
      nameTe: 'రంగుల జిరాక్స్ – రెండు వైపులా',
      ...getServiceRate('Colour Xerox – Double Side'),
    },

    // 3. PRINTING
    {
      id: 'print_bw',
      category: 'printing',
      categoryLabel: t.printing,
      name: 'Black & White Printing',
      nameTe: 'బ్లాక్ & వైట్ ప్రింటింగ్',
      ...getServiceRate('Black & White Printing'),
    },
    {
      id: 'print_color',
      category: 'printing',
      categoryLabel: t.printing,
      name: 'Colour Printing',
      nameTe: 'రంగుల ప్రింటింగ్',
      ...getServiceRate('Colour Printing'),
    },

    // 4. LAMINATION
    {
      id: 'lamination',
      category: 'lamination',
      categoryLabel: t.lamination,
      name: 'Lamination',
      nameTe: 'లామినేషన్',
      ...getServiceRate('Lamination'),
    },
  ];

  // Selected Option IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Special Instructions text
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleOption = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedOptions = optionsList.filter((opt) => selectedIds.includes(opt.id));

  // Build WhatsApp Message
  const handleSendThroughWhatsApp = () => {
    if (selectedOptions.length === 0) {
      alert(
        language === 'te'
          ? 'దయచేసి కనీసం ఒక జిరాక్స్ లేదా ప్రింటింగ్ సేవను ఎంచుకోండి.'
          : 'Please select at least one Xerox or Printing option before sending.'
      );
      return;
    }

    const lines: string[] = [];
    lines.push(`🙏 *SREE DURGA MATA STATIONERY*`);
    lines.push(`📖 *BOOK STALL & FANCY ITEMS*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📋 *XEROX & PRINTING ENQUIRY / ORDER*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`*Selected Services:*`);

    selectedOptions.forEach((opt, index) => {
      const displayName = language === 'te' && opt.nameTe ? opt.nameTe : opt.name;
      const rateText =
        opt.rate != null && opt.rate > 0
          ? `₹${opt.rate} (${opt.pricingUnit || 'per page'})`
          : 'Rate Upon Request';
      lines.push(`${index + 1}. • ${displayName} — [${rateText}]`);
    });

    if (specialInstructions.trim()) {
      lines.push(`\n📝 *Special Instructions / Notes:*`);
      lines.push(`${specialInstructions.trim()}`);
    }

    lines.push(`\n━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📍 H. No. 69, Ilapur Rd, Durgamata Colony, Hyderabad`);
    lines.push(`Please confirm availability & delivery/pickup time.`);

    const cleanNumber = shopSettings.whatsapp.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#480000] text-amber-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation & Title */}
        <div className="border-b-2 border-[#D4AF37]/50 pb-6">
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
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFDF73] font-['Cinzel'] tracking-wide">
                {t.xeroxPrinting}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
                {language === 'te'
                  ? 'మీకు అవసరమైన జిరాక్స్ లేదా ప్రింటింగ్ సేవలను ఎంచుకోండి (ఒకటి కంటే ఎక్కువ కూడా ఎంచుకోవచ్చు)'
                  : 'Select the services you need using the boxes below (multiple selections supported)'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 SERVICE CATEGORIES & SELECTABLE BOXES */}
        <div className="space-y-8">
          {/* 1. BLACK & WHITE XEROX */}
          <div className="bg-[#560000] rounded-2xl p-5 sm:p-6 border-2 border-[#D4AF37]/60 shadow-xl space-y-4">
            <h2 className="text-base sm:text-lg font-black text-[#FFDF73] font-['Cinzel'] flex items-center gap-2 border-b border-[#D4AF37]/30 pb-2.5">
              <Copy className="w-4 h-4 text-[#FFDF73]" />
              <span>{t.bwXerox}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {optionsList
                .filter((o) => o.category === 'bw_xerox')
                .map((opt) => {
                  const isSelected = selectedIds.includes(opt.id);
                  const displayName = language === 'te' && opt.nameTe ? opt.nameTe : opt.name;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FFFDF9] border-[#D4AF37] ring-4 ring-[#FFDF73]/40 shadow-xl text-[#3A0000]'
                          : 'bg-[#400000] border-amber-900/60 hover:border-[#D4AF37] text-amber-100 hover:bg-[#480000]'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm sm:text-base leading-snug">
                          {displayName}
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#800000]' : 'text-[#FFDF73]'
                          }`}
                        >
                          {opt.rate != null && opt.rate > 0
                            ? `₹${opt.rate} / ${opt.pricingUnit || 'page'}`
                            : t.rateUponRequest}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition border ${
                          isSelected
                            ? 'bg-[#D4AF37] border-amber-500 text-[#400000]'
                            : 'bg-[#2E0000] border-amber-600/50 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 2. COLOUR XEROX */}
          <div className="bg-[#560000] rounded-2xl p-5 sm:p-6 border-2 border-[#D4AF37]/60 shadow-xl space-y-4">
            <h2 className="text-base sm:text-lg font-black text-[#FFDF73] font-['Cinzel'] flex items-center gap-2 border-b border-[#D4AF37]/30 pb-2.5">
              <Sparkles className="w-4 h-4 text-[#FFDF73]" />
              <span>{t.colorXerox}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {optionsList
                .filter((o) => o.category === 'color_xerox')
                .map((opt) => {
                  const isSelected = selectedIds.includes(opt.id);
                  const displayName = language === 'te' && opt.nameTe ? opt.nameTe : opt.name;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FFFDF9] border-[#D4AF37] ring-4 ring-[#FFDF73]/40 shadow-xl text-[#3A0000]'
                          : 'bg-[#400000] border-amber-900/60 hover:border-[#D4AF37] text-amber-100 hover:bg-[#480000]'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm sm:text-base leading-snug">
                          {displayName}
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#800000]' : 'text-[#FFDF73]'
                          }`}
                        >
                          {opt.rate != null && opt.rate > 0
                            ? `₹${opt.rate} / ${opt.pricingUnit || 'page'}`
                            : t.rateUponRequest}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition border ${
                          isSelected
                            ? 'bg-[#D4AF37] border-amber-500 text-[#400000]'
                            : 'bg-[#2E0000] border-amber-600/50 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 3. PRINTING */}
          <div className="bg-[#560000] rounded-2xl p-5 sm:p-6 border-2 border-[#D4AF37]/60 shadow-xl space-y-4">
            <h2 className="text-base sm:text-lg font-black text-[#FFDF73] font-['Cinzel'] flex items-center gap-2 border-b border-[#D4AF37]/30 pb-2.5">
              <Printer className="w-4 h-4 text-[#FFDF73]" />
              <span>{t.printing}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {optionsList
                .filter((o) => o.category === 'printing')
                .map((opt) => {
                  const isSelected = selectedIds.includes(opt.id);
                  const displayName = language === 'te' && opt.nameTe ? opt.nameTe : opt.name;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FFFDF9] border-[#D4AF37] ring-4 ring-[#FFDF73]/40 shadow-xl text-[#3A0000]'
                          : 'bg-[#400000] border-amber-900/60 hover:border-[#D4AF37] text-amber-100 hover:bg-[#480000]'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm sm:text-base leading-snug">
                          {displayName}
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#800000]' : 'text-[#FFDF73]'
                          }`}
                        >
                          {opt.rate != null && opt.rate > 0
                            ? `₹${opt.rate} / ${opt.pricingUnit || 'page'}`
                            : t.rateUponRequest}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition border ${
                          isSelected
                            ? 'bg-[#D4AF37] border-amber-500 text-[#400000]'
                            : 'bg-[#2E0000] border-amber-600/50 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 4. LAMINATION */}
          <div className="bg-[#560000] rounded-2xl p-5 sm:p-6 border-2 border-[#D4AF37]/60 shadow-xl space-y-4">
            <h2 className="text-base sm:text-lg font-black text-[#FFDF73] font-['Cinzel'] flex items-center gap-2 border-b border-[#D4AF37]/30 pb-2.5">
              <Layers className="w-4 h-4 text-[#FFDF73]" />
              <span>{t.lamination}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {optionsList
                .filter((o) => o.category === 'lamination')
                .map((opt) => {
                  const isSelected = selectedIds.includes(opt.id);
                  const displayName = language === 'te' && opt.nameTe ? opt.nameTe : opt.name;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FFFDF9] border-[#D4AF37] ring-4 ring-[#FFDF73]/40 shadow-xl text-[#3A0000]'
                          : 'bg-[#400000] border-amber-900/60 hover:border-[#D4AF37] text-amber-100 hover:bg-[#480000]'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm sm:text-base leading-snug">
                          {displayName}
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#800000]' : 'text-[#FFDF73]'
                          }`}
                        >
                          {opt.rate != null && opt.rate > 0
                            ? `₹${opt.rate} / ${opt.pricingUnit || 'document'}`
                            : t.rateUponRequest}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition border ${
                          isSelected
                            ? 'bg-[#D4AF37] border-amber-500 text-[#400000]'
                            : 'bg-[#2E0000] border-amber-600/50 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* SPECIAL INSTRUCTIONS */}
        <div className="bg-[#560000] rounded-2xl p-5 sm:p-6 border-2 border-[#D4AF37]/60 shadow-xl space-y-3">
          <label className="block text-sm sm:text-base font-extrabold text-[#FFDF73] font-['Cinzel']">
            {t.specialInstructionsTitle}
          </label>
          <textarea
            rows={3}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder={t.specialInstructionsPlaceholder}
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9] text-[#2D1810] focus:ring-2 focus:ring-[#D4AF37] focus:outline-none placeholder:text-gray-400 font-medium"
          />
        </div>

        {/* REVIEW REQUEST */}
        <div className="bg-[#FFFDF9] text-[#2D1810] rounded-2xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl space-y-6">
          <div className="border-b-2 border-amber-200 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#580000] font-['Cinzel'] tracking-wide">
              {t.reviewRequest}
            </h2>
            <span className="text-xs font-bold text-[#800000] bg-amber-100 px-3 py-1 rounded-full">
              {selectedOptions.length} {language === 'te' ? 'ఎంపికలు' : 'selected'}
            </span>
          </div>

          {selectedOptions.length === 0 ? (
            <div className="py-6 text-center text-xs sm:text-sm text-[#704938] space-y-1">
              <Info className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="font-bold">No services selected yet.</p>
              <p>Please click any of the service boxes above to select your required Xerox or Printing options.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#800000] mb-2">
                  {t.selectedServicesLabel}
                </p>
                <ul className="space-y-2">
                  {selectedOptions.map((opt) => {
                    const displayName = language === 'te' && opt.nameTe ? opt.nameTe : opt.name;
                    return (
                      <li
                        key={opt.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF5EE] border border-amber-200 text-xs sm:text-sm font-bold text-[#450000]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                          <span>{displayName}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#800000] font-semibold">
                            {opt.rate != null && opt.rate > 0
                              ? `₹${opt.rate} / ${opt.pricingUnit || 'page'}`
                              : t.rateUponRequest}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleOption(opt.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-bold underline"
                          >
                            {t.remove}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {specialInstructions.trim() && (
                <div className="p-3 bg-[#FAF5EE] rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-[#800000] block mb-0.5">Notes:</span>
                  <p className="text-[#553326] italic">"{specialInstructions.trim()}"</p>
                </div>
              )}

              {/* SEND THROUGH WHATSAPP BUTTON */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleSendThroughWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-black text-base shadow-xl transition transform active:scale-98 cursor-pointer border border-emerald-400/50"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{t.sendThroughWhatsApp}</span>
                </button>
                <p className="text-center text-[11px] text-[#704938] mt-2">
                  Opens WhatsApp directly with your prefilled selections to shop WhatsApp: {shopSettings.whatsapp}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
