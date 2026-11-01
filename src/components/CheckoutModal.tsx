import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Order, CartItem } from '../types';
import confetti from 'canvas-confetti';
import {
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  AlertCircle,
  Phone,
  User,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    t,
    language,
    cart,
    cartTotal,
    hasUnpricedItems,
    shopSettings,
    clearCart,
    setActiveView,
    lastOrder,
    setLastOrder,
  } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [preference, setPreference] = useState<'Store Pickup' | 'Local Delivery'>('Store Pickup');
  const [orderNotes, setOrderNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(lastOrder);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // If cart is empty and no recently submitted order, redirect back
  if (cart.length === 0 && !submittedOrder) {
    return (
      <div className="bg-[#FFFDF9] min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-amber-300 mb-4" />
        <h2 className="text-xl font-bold text-[#500000]">{t.emptyCart}</h2>
        <p className="text-sm text-[#6e4635] mt-1 max-w-sm">{t.emptyCartSub}</p>
        <button
          onClick={() => setActiveView('home')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-[#800000] text-[#FFDF73] font-bold text-sm"
        >
          {t.backToServices}
        </button>
      </div>
    );
  }

  // Generate Unique Order ID: SDM-YYYYMMDD-XXXX
  const generateOrderId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    return `SDM-${dateStr}-${randomHex}`;
  };

  // Build the complete WhatsApp Message Text
  const buildWhatsAppMessage = (order: Order): string => {
    const lines: string[] = [];

    lines.push(`🙏 *SRI DURGA MATA STATIONERY - ORDER*`);
    lines.push(`📖 *BOOK STALL & FANCY ITEMS*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🆔 *Order ID:* ${order.orderId}`);
    lines.push(`👤 *Customer:* ${order.customerName}`);
    lines.push(`📱 *Mobile:* ${order.customerMobile}`);
    lines.push(`📍 *Preference:* ${order.preference}`);
    lines.push(`📅 *Date:* ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📦 *ORDERED ITEMS & SERVICES:*`);

    order.items.forEach((item, index) => {
      if (item.type === 'xerox' && item.xeroxDetails) {
        const x = item.xeroxDetails;
        lines.push(`\n${index + 1}. 📄 *${item.name}*`);
        lines.push(`   • Type: ${x.colorMode === 'bw' ? 'Black & White' : 'Colour'}`);
        if (x.sidedness !== 'na') {
          lines.push(`   • Print: ${x.sidedness === 'single' ? 'Single Side' : 'Double Side'}`);
        }
        lines.push(`   • Pages & Copies: ${x.pages} pages × ${x.copies} copies`);
        if (x.laminationCount && x.laminationCount > 0) {
          lines.push(`   • Lamination: ${x.laminationCount} documents`);
        }
        if (x.instructions) {
          lines.push(`   • Special Note: "${x.instructions}"`);
        }
        if (x.isPriceOnRequest || x.estimatedCost == null) {
          lines.push(`   • Price: [Price Confirmation Requested]`);
        } else {
          lines.push(`   • Amount: ₹${x.estimatedCost}`);
        }
      } else {
        lines.push(`\n${index + 1}. 🏷️ *${item.name}* (Qty: ${item.quantity})`);
        if (item.selectedColor) {
          lines.push(`   • Color: ${item.selectedColor}`);
        }
        if (item.variants) {
          lines.push(`   • Option: ${item.variants}`);
        }
        if (item.isPriceOnRequest || item.price == null) {
          lines.push(`   • Price: [Ask for Price]`);
        } else {
          lines.push(`   • Amount: ₹${item.price * item.quantity} (₹${item.price} each)`);
        }
      }
    });

    lines.push(`\n━━━━━━━━━━━━━━━━━━━━━`);

    if (order.hasUnpricedItems) {
      lines.push(`💰 *Known Subtotal:* ₹${order.totalAmount || 0}`);
      lines.push(`⚠️ *Some items require price confirmation by shop owner.*`);
    } else {
      lines.push(`💰 *Total Amount:* ₹${order.totalAmount}`);
    }

    if (order.notes && order.notes.trim()) {
      lines.push(`\n📝 *Customer Notes:* ${order.notes.trim()}`);
    }

    lines.push(`\n📍 *Shop Address:* H. No. 69, Ilapur Rd, Durgamata Colony, Hyderabad`);
    lines.push(`Thank you for ordering with Sri Durga Mata Stationery!`);

    return lines.join('\n');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanName = customerName.trim();
    const cleanMobile = customerMobile.replace(/[^0-9]/g, '');

    if (!cleanName) {
      setErrorMessage(language === 'te' ? 'దయచేసి మీ పేరును నమోదు చేయండి' : 'Please enter your full name');
      return;
    }

    if (cleanMobile.length < 10) {
      setErrorMessage(
        language === 'te'
          ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const newOrder: Order = {
        orderId,
        customerName: cleanName,
        customerMobile: cleanMobile,
        preference,
        notes: orderNotes.trim(),
        status: 'New Order',
        items: [...cart],
        totalAmount: cartTotal,
        hasUnpricedItems,
        whatsappStatus: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. CRITICAL: Save complete order to Firestore database first
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      const savedOrder = { ...newOrder, id: docRef.id, orderDocId: docRef.id };

      setSubmittedOrder(savedOrder);
      setLastOrder(savedOrder);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#800000', '#D4AF37', '#FFDF73'],
      });

      // Clear the cart
      clearCart();

      // 2. Prepare WhatsApp message
      const messageText = buildWhatsAppMessage(savedOrder);
      const cleanShopWhatsApp = shopSettings.whatsapp.replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(messageText);
      const waUrl = `https://wa.me/${cleanShopWhatsApp}?text=${encodedMsg}`;

      // 3. Open WhatsApp with prefilled message
      window.open(waUrl, '_blank', 'noopener,noreferrer');

    } catch (err: unknown) {
      console.error('Order creation error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'orders');
      } catch (e: any) {
        setErrorMessage(
          'Failed to record order: ' + (e instanceof Error ? e.message : 'Please check internet connection')
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderText = () => {
    if (!submittedOrder) return;
    const text = buildWhatsAppMessage(submittedOrder);
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleOpenWhatsAppAgain = () => {
    if (!submittedOrder) return;
    const messageText = buildWhatsAppMessage(submittedOrder);
    const cleanShopWhatsApp = shopSettings.whatsapp.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(messageText);
    window.open(`https://wa.me/${cleanShopWhatsApp}?text=${encodedMsg}`, '_blank', 'noopener,noreferrer');
  };

  // SUCCESS VIEW: Order is saved in database, details ready
  if (submittedOrder) {
    return (
      <div className="bg-[#FFFDF9] min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
          {/* Success Banner */}
          <div className="bg-[#FFF9EE] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#800000]">
                {t.orderSuccessTitle}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#500000] font-['Cinzel'] mt-1">
                {language === 'te' ? 'మీ ఆర్డర్ నమోదైంది!' : 'Order Placed Successfully!'}
              </h1>
              <p className="text-sm text-[#664433] mt-2 max-w-xl mx-auto">
                {t.orderSuccessMsg}
              </p>
            </div>

            {/* Unique Order ID Card */}
            <div className="bg-white rounded-2xl p-4 border border-amber-300 max-w-md mx-auto shadow-sm flex items-center justify-between">
              <div className="text-left">
                <p className="text-[11px] font-bold uppercase text-amber-800">
                  {t.orderIdLabel}
                </p>
                <p className="text-lg font-mono font-black text-[#800000]">
                  {submittedOrder.orderId}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
                <span>Saved in DB</span>
              </div>
            </div>

            {/* WhatsApp Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleOpenWhatsAppAgain}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-900/20 transition transform active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.openWhatsAppAgain}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyOrderText}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#800000] font-bold text-sm border border-amber-300 transition"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedNotification ? t.copied : t.copyOrderDetails}</span>
              </button>
            </div>

            {/* Note */}
            <p className="text-xs text-[#7a5545] max-w-lg mx-auto">
              {language === 'te'
                ? 'వాట్సాప్ స్వయంచాలకంగా తెరవబడకపోతే, పైన ఉన్న బటన్ క్లిక్ చేయండి లేదా ఆర్డర్ వివరాలను కాపీ చేసి మా నంబర్‌కు పంపండి.'
                : 'If WhatsApp did not automatically open on your device, click the button above or copy the message and send it to our shop.'}
            </p>
          </div>

          {/* Stored Order Details Preview */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-[#500000] text-base border-b border-amber-100 pb-3 flex items-center justify-between">
              <span>{t.orderSummary}</span>
              <span className="text-xs text-amber-800 font-normal">
                Customer: {submittedOrder.customerName} ({submittedOrder.customerMobile})
              </span>
            </h3>

            <div className="divide-y divide-amber-100 text-xs sm:text-sm">
              {submittedOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-[#4A0000]">
                      {item.quantity}× {item.name}
                    </span>
                    {item.xeroxDetails && (
                      <p className="text-xs text-[#704938] mt-0.5">
                        {item.xeroxDetails.pages} pages, {item.xeroxDetails.copies} copies, {item.xeroxDetails.colorMode.toUpperCase()}
                      </p>
                    )}
                  </div>
                  <span className="font-black text-[#800000] flex-shrink-0">
                    {item.isPriceOnRequest || item.price == null ? t.askForPrice : `₹${item.price * item.quantity}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-amber-200 pt-3 flex items-center justify-between font-black text-sm sm:text-base text-[#800000]">
              <span>{t.total}</span>
              <span>
                {submittedOrder.hasUnpricedItems ? (
                  <span>₹{submittedOrder.totalAmount} + {t.priceOnRequest}</span>
                ) : (
                  `₹${submittedOrder.totalAmount}`
                )}
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setSubmittedOrder(null);
                setLastOrder(null);
                setActiveView('home');
              }}
              className="text-xs font-bold text-[#800000] hover:underline"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM VIEW
  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation */}
        <div>
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#800000] hover:text-[#5a0000] transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToServices}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#500000] font-['Cinzel']">
            {t.checkoutTitle}
          </h1>
          <p className="text-sm text-[#664433] mt-1">
            {language === 'te'
              ? 'మీ ఆర్డర్ వివరాలు సురక్షితంగా సేవ్ చేయబడి నేరుగా వాట్సాప్‌లో ఓపెన్ అవుతాయి'
              : 'Your order is recorded securely in our database and forwarded to WhatsApp for instant fulfillment'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Details Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-900/10 shadow-lg space-y-6"
          >
            <h2 className="text-base sm:text-lg font-black text-[#500000] font-['Cinzel'] border-b border-amber-100 pb-3">
              {language === 'te' ? 'కస్టమర్ వివరాలు' : 'Customer Information'}
            </h2>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-[#553326] uppercase tracking-wider mb-1.5">
                {t.customerName}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-amber-300 rounded-xl focus:ring-2 focus:ring-[#800000] focus:border-[#800000] bg-[#FFFDF9]"
                />
              </div>
            </div>

            {/* Mobile / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-[#553326] uppercase tracking-wider mb-1.5">
                {t.customerMobile}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9849012345"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-amber-300 rounded-xl focus:ring-2 focus:ring-[#800000] focus:border-[#800000] bg-[#FFFDF9]"
                />
              </div>
            </div>

            {/* Preference */}
            <div>
              <label className="block text-xs font-bold text-[#553326] uppercase tracking-wider mb-2">
                {t.orderPreference}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreference('Store Pickup')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    preference === 'Store Pickup'
                      ? 'bg-[#800000] text-[#FFDF73] border-[#800000] shadow'
                      : 'bg-[#FBF8F2] text-[#4a2e22] border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>{t.storePickup}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreference('Local Delivery')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    preference === 'Local Delivery'
                      ? 'bg-[#800000] text-[#FFDF73] border-[#800000] shadow'
                      : 'bg-[#FBF8F2] text-[#4a2e22] border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>{t.localDelivery}</span>
                </button>
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold text-[#553326] uppercase tracking-wider mb-1.5">
                {t.orderNotes}
              </label>
              <textarea
                rows={3}
                placeholder={t.orderNotesPlaceholder}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm border border-amber-300 rounded-xl focus:ring-2 focus:ring-[#800000] focus:border-[#800000] bg-[#FFFDF9]"
              />
            </div>

            {/* Prominent WhatsApp Placement Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-950/20 border border-emerald-400/40 transition transform active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 fill-current animate-pulse" />
              <span>{isSubmitting ? 'Recording Order...' : t.placeOrderWhatsApp}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#704938] font-medium text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'te'
                  ? 'ఆర్డర్ షాప్ డేటాబేస్‌లో సేవ్ చేయబడుతుంది & వాట్సాప్ తెరవబడుతుంది'
                  : 'Order is securely preserved in cloud database before WhatsApp launches'}
              </span>
            </div>
          </form>

          {/* Order Summary Column */}
          <div className="lg:col-span-5 bg-[#FAF5EA] p-6 rounded-2xl border-2 border-amber-300/80 shadow-md space-y-5">
            <h3 className="font-extrabold text-[#500000] text-base border-b border-amber-200 pb-3 flex items-center justify-between">
              <span>{t.orderSummary}</span>
              <span className="text-xs bg-amber-200 text-[#800000] px-2.5 py-0.5 rounded-full font-bold">
                {cart.length} items
              </span>
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-[#4A0000]">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-black text-[#800000]">
                      {item.isPriceOnRequest || item.price == null ? (
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                          {t.askForPrice}
                        </span>
                      ) : (
                        `₹${item.price * item.quantity}`
                      )}
                    </span>
                  </div>

                  {item.xeroxDetails && (
                    <div className="text-[11px] text-[#6e4635] flex flex-wrap gap-1">
                      <span>{item.xeroxDetails.pages} pgs</span> •{' '}
                      <span>{item.xeroxDetails.copies} cpy</span> •{' '}
                      <span>{item.xeroxDetails.colorMode.toUpperCase()}</span>
                      {item.xeroxDetails.instructions && (
                        <span className="block w-full italic text-[10px] text-amber-800">
                          "{item.xeroxDetails.instructions}"
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="border-t border-amber-200/80 pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#704938] font-semibold">
                <span>{t.subtotal}</span>
                <span className="text-base font-black text-[#800000]">
                  {hasUnpricedItems ? (
                    <span>₹{cartTotal} + {t.priceOnRequest}</span>
                  ) : (
                    `₹${cartTotal}`
                  )}
                </span>
              </div>

              {hasUnpricedItems && (
                <p className="text-[11px] text-amber-900 bg-amber-100 p-2 rounded-lg leading-tight">
                  {t.estimatedPriceNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
