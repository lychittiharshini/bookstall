import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ShopSettings,
  CartItem,
  Order,
  Language,
  StationeryCategory,
  StationeryProduct,
  FancyCategory,
  FancyProduct,
  XeroxService,
  GalleryItem,
  Offer,
} from '../types';
import {
  db,
  auth,
  INITIAL_SHOP_SETTINGS,
  DEFAULT_XEROX_SERVICES,
  DEFAULT_STATIONERY_CATEGORIES,
  DEFAULT_STATIONERY_PRODUCTS,
  DEFAULT_FANCY_CATEGORIES,
  DEFAULT_FANCY_PRODUCTS,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_OFFERS,
  seedInitialDataIfEmpty,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { translations, TranslationKeys } from '../i18n/translations';

export type ActiveView = 'home' | 'xerox' | 'stationery' | 'fancy' | 'checkout' | 'admin';

interface ShopContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => Promise<void>;

  // Common Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  hasUnpricedItems: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Catalog Data
  stationeryCategories: StationeryCategory[];
  stationeryProducts: StationeryProduct[];
  fancyCategories: FancyCategory[];
  fancyProducts: FancyProduct[];
  xeroxServices: XeroxService[];
  galleryItems: GalleryItem[];
  offers: Offer[];
  orders: Order[];
  isLoadingData: boolean;

  // Admin and Auth
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  adminUsername: string | null;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdminUser: () => void;

  // Last Placed Order
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;

  // Data Refresh
  refreshAllData: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sdm_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sdm_lang', lang);
  };

  const t = translations[language];

  // Navigation View
  const [activeView, setActiveView] = useState<ActiveView>('home');

  // Shop Settings
  const [shopSettings, setShopSettings] = useState<ShopSettings>(INITIAL_SHOP_SETTINGS);

  // Common Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sdm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Catalog Lists
  const [stationeryCategories, setStationeryCategories] = useState<StationeryCategory[]>([]);
  const [stationeryProducts, setStationeryProducts] = useState<StationeryProduct[]>([]);
  const [fancyCategories, setFancyCategories] = useState<FancyCategory[]>([]);
  const [fancyProducts, setFancyProducts] = useState<FancyProduct[]>([]);
  const [xeroxServices, setXeroxServices] = useState<XeroxService[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Auth & Admin State
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('sdm_admin_authenticated') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState<string | null>(() => {
    return sessionStorage.getItem('sdm_admin_user') || (sessionStorage.getItem('sdm_admin_authenticated') === 'true' ? 'harshinilychitti' : null);
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const loginAdmin = (enteredUser: string, enteredPass: string): boolean => {
    const cleanUser = enteredUser.trim();
    if (cleanUser === 'harshinilychitti' && enteredPass === 'harshini@8019') {
      setIsAdmin(true);
      setAdminUsername('harshinilychitti');
      sessionStorage.setItem('sdm_admin_authenticated', 'true');
      sessionStorage.setItem('sdm_admin_user', 'harshinilychitti');
      return true;
    }
    return false;
  };

  const logoutAdminUser = () => {
    setIsAdmin(false);
    setAdminUsername(null);
    sessionStorage.removeItem('sdm_admin_authenticated');
    sessionStorage.removeItem('sdm_admin_user');
    setActiveView('home');
  };

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sdm_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Optional background Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isHarshini = currentUser.email === 'harshinisree72@gmail.com';
        const isShopOwner = currentUser.email === 'sreedurgamathabookstall@gmail.com';
        if (isHarshini || isShopOwner) {
          setIsAdmin(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Initial Boot Connection & Seeding
  useEffect(() => {
    testFirestoreConnection();
    seedInitialDataIfEmpty().then(() => {
      loadAllData();
    });
  }, []);

  // Listen to Settings
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'shop_info'),
      (snapshot) => {
        if (snapshot.exists()) {
          setShopSettings({ ...INITIAL_SHOP_SETTINGS, ...snapshot.data() } as ShopSettings);
        }
      },
      (error) => {
        console.warn('Snapshot settings note:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Listen to Orders if Admin
  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const orderList: Order[] = [];
        snapshot.forEach((d) => {
          orderList.push({ id: d.id, orderDocId: d.id, ...d.data() } as Order);
        });
        // Sort newest first
        orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(orderList);
      },
      (err) => {
        console.warn('Orders listener err:', err);
      }
    );
    return () => unsub();
  }, [isAdmin]);

  // Fetch all live collections
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      // Xerox services
      try {
        const xSnap = await getDocs(collection(db, 'xerox_services'));
        if (!xSnap.empty) {
          const xList: XeroxService[] = [];
          xSnap.forEach((d) => xList.push({ id: d.id, ...d.data() } as XeroxService));
          xList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setXeroxServices(xList);
        } else {
          setXeroxServices(DEFAULT_XEROX_SERVICES.map((s, idx) => ({ id: `default-${idx}`, ...s })));
        }
      } catch (err) {
        console.warn('Xerox load fallback:', err);
        setXeroxServices(DEFAULT_XEROX_SERVICES.map((s, idx) => ({ id: `default-${idx}`, ...s })));
      }

      // Stationery Categories
      try {
        const scSnap = await getDocs(collection(db, 'stationery_categories'));
        if (!scSnap.empty) {
          const scList: StationeryCategory[] = [];
          scSnap.forEach((d) => scList.push({ id: d.id, ...d.data() } as StationeryCategory));
          scList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setStationeryCategories(scList);
        } else {
          setStationeryCategories(DEFAULT_STATIONERY_CATEGORIES.map((c, idx) => ({ id: `sc-${idx}`, ...c })));
        }
      } catch (err) {
        setStationeryCategories(DEFAULT_STATIONERY_CATEGORIES.map((c, idx) => ({ id: `sc-${idx}`, ...c })));
      }

      // Stationery Products
      try {
        const spSnap = await getDocs(collection(db, 'stationery_products'));
        if (!spSnap.empty) {
          const spList: StationeryProduct[] = [];
          spSnap.forEach((d) => spList.push({ id: d.id, ...d.data() } as StationeryProduct));
          spList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setStationeryProducts(spList);
        } else {
          setStationeryProducts(DEFAULT_STATIONERY_PRODUCTS.map((p, idx) => ({ id: `sp-${idx}`, ...p })));
        }
      } catch (err) {
        setStationeryProducts(DEFAULT_STATIONERY_PRODUCTS.map((p, idx) => ({ id: `sp-${idx}`, ...p })));
      }

      // Fancy Categories
      try {
        const fcSnap = await getDocs(collection(db, 'fancy_categories'));
        if (!fcSnap.empty) {
          const fcList: FancyCategory[] = [];
          fcSnap.forEach((d) => fcList.push({ id: d.id, ...d.data() } as FancyCategory));
          fcList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setFancyCategories(fcList);
        } else {
          setFancyCategories(DEFAULT_FANCY_CATEGORIES.map((c, idx) => ({ id: `fc-${idx}`, ...c })));
        }
      } catch (err) {
        setFancyCategories(DEFAULT_FANCY_CATEGORIES.map((c, idx) => ({ id: `fc-${idx}`, ...c })));
      }

      // Fancy Products
      try {
        const fpSnap = await getDocs(collection(db, 'fancy_products'));
        if (!fpSnap.empty) {
          const fpList: FancyProduct[] = [];
          fpSnap.forEach((d) => fpList.push({ id: d.id, ...d.data() } as FancyProduct));
          fpList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setFancyProducts(fpList);
        } else {
          setFancyProducts(DEFAULT_FANCY_PRODUCTS.map((p, idx) => ({ id: `fp-${idx}`, ...p })));
        }
      } catch (err) {
        setFancyProducts(DEFAULT_FANCY_PRODUCTS.map((p, idx) => ({ id: `fp-${idx}`, ...p })));
      }

      // Gallery Items
      try {
        const gSnap = await getDocs(collection(db, 'gallery'));
        if (!gSnap.empty) {
          const gList: GalleryItem[] = [];
          gSnap.forEach((d) => gList.push({ id: d.id, ...d.data() } as GalleryItem));
          gList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setGalleryItems(gList);
        } else {
          setGalleryItems(DEFAULT_GALLERY_ITEMS.map((g, idx) => ({ id: `g-${idx}`, ...g })));
        }
      } catch (err) {
        setGalleryItems(DEFAULT_GALLERY_ITEMS.map((g, idx) => ({ id: `g-${idx}`, ...g })));
      }

      // Offers
      try {
        const oSnap = await getDocs(collection(db, 'offers'));
        if (!oSnap.empty) {
          const oList: Offer[] = [];
          oSnap.forEach((d) => oList.push({ id: d.id, ...d.data() } as Offer));
          setOffers(oList);
        } else {
          setOffers(DEFAULT_OFFERS.map((o, idx) => ({ id: `o-${idx}`, ...o })));
        }
      } catch (err) {
        setOffers(DEFAULT_OFFERS.map((o, idx) => ({ id: `o-${idx}`, ...o })));
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateShopSettings = async (settings: Partial<ShopSettings>) => {
    try {
      const updated = {
        ...shopSettings,
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'settings', 'shop_info'), updated);
      setShopSettings(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/shop_info');
    }
  };

  // Cart Operations
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // For Xerox items, each configuration might be unique; add as distinct or match ID
      const existingIndex = prev.findIndex((i) => i.cartItemId === item.cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal only for known prices
  let knownSubtotal = 0;
  let hasUnpriced = false;

  for (const item of cart) {
    if (item.type === 'xerox' && item.xeroxDetails) {
      if (item.xeroxDetails.isPriceOnRequest || item.xeroxDetails.estimatedCost == null) {
        hasUnpriced = true;
      } else {
        knownSubtotal += item.xeroxDetails.estimatedCost * item.quantity;
      }
    } else {
      if (item.isPriceOnRequest || item.price == null) {
        hasUnpriced = true;
      } else {
        knownSubtotal += item.price * item.quantity;
      }
    }
  }

  return (
    <ShopContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeView,
        setActiveView,
        shopSettings,
        updateShopSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal: knownSubtotal,
        hasUnpricedItems: hasUnpriced,
        isCartOpen,
        setIsCartOpen,
        stationeryCategories,
        stationeryProducts,
        fancyCategories,
        fancyProducts,
        xeroxServices,
        galleryItems,
        offers,
        orders,
        isLoadingData,
        user,
        isAdmin,
        isAuthLoading,
        adminUsername,
        loginAdmin,
        logoutAdminUser,
        lastOrder,
        setLastOrder,
        refreshAllData: loadAllData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
