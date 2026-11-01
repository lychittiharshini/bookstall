import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Printer,
  Sparkles,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    t,
    language,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartTotal,
    hasUnpricedItems,
    isCartOpen,
    setIsCartOpen,
    setActiveView,
  } = useShop();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col border-l-2 border-[#D4AF37]">
          {/* Header */}
          <div className="p-5 bg-[#800000] text-white flex items-center justify-between border-b border-amber-500/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#600000] rounded-xl text-[#FFDF73] border border-amber-500/40">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#FFFDF9] font-['Cinzel']">
                  {t.yourCart}
                </h2>
                <p className="text-xs text-amber-200">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in total
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-[#600000] transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="p-4 rounded-full bg-amber-50 text-amber-600">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <h3 className="text-base font-bold text-[#500000]">{t.emptyCart}</h3>
                <p className="text-xs text-[#6e4635] max-w-xs">{t.emptyCartSub}</p>
                <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveView('xerox');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#800000] text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t.xeroxPrinting}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveView('stationery');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#800000] text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.booksStationery}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveView('fancy');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#800000] text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.fancyItems}</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#734a39] pb-1 border-b border-amber-100">
                  <span>Selected items ({cart.length})</span>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => {
                  const isXerox = item.type === 'xerox' && item.xeroxDetails;
                  const x = item.xeroxDetails;

                  return (
                    <div
                      key={item.cartItemId}
                      className="bg-white rounded-xl p-3.5 border border-amber-200/80 shadow-sm space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-amber-100 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-extrabold text-[#4A0000] leading-snug truncate">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-gray-400 hover:text-red-600 transition p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Xerox Specific Badges */}
                          {isXerox && x && (
                            <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-[#800000] font-bold">
                                {x.colorMode === 'bw' ? 'B&W' : 'Colour'}
                              </span>
                              {x.sidedness !== 'na' && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-[#800000] font-bold">
                                  {x.sidedness === 'single' ? 'Single Side' : 'Double Side'}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">
                                {x.pages} pgs × {x.copies} cpy
                              </span>
                              {x.laminationCount && x.laminationCount > 0 ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                                  +{x.laminationCount} Lam.
                                </span>
                              ) : null}
                            </div>
                          )}

                          {/* Variant / Color tag if stationery or fancy */}
                          {!isXerox && (item.variants || item.selectedColor) && (
                            <p className="text-[11px] text-[#734a39] mt-0.5">
                              {item.selectedColor || item.variants}
                            </p>
                          )}

                          {isXerox && x?.instructions && (
                            <p className="text-[11px] text-[#6e4635] bg-amber-50 p-1.5 rounded border border-amber-100/60 mt-1 italic">
                              "{x.instructions}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between border-t border-amber-100/80 pt-2 text-xs">
                        <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden bg-amber-50/50">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-2 py-1 text-[#800000] hover:bg-amber-200 transition font-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-bold text-[#800000] min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2 py-1 text-[#800000] hover:bg-amber-200 transition font-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="text-right">
                          {item.isPriceOnRequest || item.price == null ? (
                            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                              {t.priceOnRequest}
                            </span>
                          ) : (
                            <span className="text-sm font-black text-[#800000]">
                              ₹{item.price * item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#FAF5EA] border-t-2 border-amber-300/80 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#6e4635] font-semibold">
                  <span>{t.subtotal}</span>
                  <span className="text-base font-black text-[#800000]">
                    {hasUnpricedItems ? (
                      <span className="flex items-center gap-1.5">
                        {cartTotal > 0 && <span>₹{cartTotal} + </span>}
                        <span className="text-xs bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded">
                          {t.priceOnRequest}
                        </span>
                      </span>
                    ) : (
                      `₹${cartTotal}`
                    )}
                  </span>
                </div>

                {hasUnpricedItems && (
                  <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-1.5 leading-snug">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-800 flex-shrink-0 mt-0.5" />
                    <span>{t.estimatedPriceNote}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#800000] to-[#A00000] hover:from-[#660000] hover:to-[#800000] text-[#FFDF73] font-black text-sm uppercase tracking-wider shadow-lg transition transform active:scale-98"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4 text-[#FFDF73]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
