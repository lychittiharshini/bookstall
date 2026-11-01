import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  ShopSettings,
  StationeryCategory,
  StationeryProduct,
  FancyCategory,
  FancyProduct,
  XeroxService,
  GalleryItem,
  Offer
} from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with dedicated Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// Error handling required by Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on Boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is currently running offline or connecting.');
    }
  }
}

// Auth Helper
export async function signInAdminWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-in failed', err);
    throw err;
  }
}

export async function logoutAdmin() {
  await signOut(auth);
}

// Default initial shop settings
export const INITIAL_SHOP_SETTINGS: ShopSettings = {
  shopName: 'SREE DURGA MATA STATIONERY',
  subtitle: 'BOOK STALL & FANCY ITEMS',
  address: 'H. No. 69, Ilapur Rd, Durgamata Colony, Tanda, Hyderabad, Telangana 502032, India.',
  email: 'sreedurgamathabookstall@gmail.com',
  phone: '+91 98493 21876',
  whatsapp: '+91 98493 21876',
  openingHours: 'Mon - Sun: 8:30 AM – 9:30 PM',
  holidays: 'Open all days (Festival timings may vary)',
  googleMapsUrl: 'https://www.google.com/maps?cid=15466284146933900210&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF',
  latitude: 17.53725,
  longitude: 78.321972,
  updatedAt: new Date().toISOString(),
};

// 8 Default Xerox & Printing Services required by prompt
export const DEFAULT_XEROX_SERVICES: Omit<XeroxService, 'id'>[] = [
  {
    name: 'Black & White Xerox – Single Side',
    nameTe: 'బ్లాక్ & వైట్ జిరాక్స్ – ఒక వైపు',
    description: 'Crisp, high-contrast B&W photocopying on high quality 75 GSM A4 paper.',
    serviceType: 'xerox',
    colorMode: 'bw',
    sidedness: 'single',
    price: 2,
    pricingUnit: 'per page',
    isPriceOnRequest: false,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    displayOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Black & White Xerox – Double Side',
    nameTe: 'బ్లాక్ & వైట్ జిరాక్స్ – రెండు వైపులా',
    description: 'Back-to-back B&W photocopy, ideal for notes, textbooks, and office records.',
    serviceType: 'xerox',
    colorMode: 'bw',
    sidedness: 'double',
    price: 3,
    pricingUnit: 'per sheet',
    isPriceOnRequest: false,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
    displayOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Colour Xerox – Single Side',
    nameTe: 'రంగుల జిరాక్స్ – ఒక వైపు',
    description: 'Vibrant full-color laser photocopy for certificates, diagrams, and projects.',
    serviceType: 'xerox',
    colorMode: 'color',
    sidedness: 'single',
    price: 10,
    pricingUnit: 'per page',
    isPriceOnRequest: false,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Colour Xerox – Double Side',
    nameTe: 'రంగుల జిరాక్స్ – రెండు వైపులా',
    description: 'Double-sided full color laser copy with sharp graphic reproduction.',
    serviceType: 'xerox',
    colorMode: 'color',
    sidedness: 'double',
    price: 18,
    pricingUnit: 'per sheet',
    isPriceOnRequest: false,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80',
    displayOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Black & White Printing',
    nameTe: 'బ్లాక్ & వైట్ ప్రింటింగ్ (డిజిటల్)',
    description: 'High-speed computer printout from PDF, Word, Email, or WhatsApp document.',
    serviceType: 'printing',
    colorMode: 'bw',
    sidedness: 'single',
    price: 5,
    pricingUnit: 'per page',
    isPriceOnRequest: false,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    displayOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Colour Printing',
    nameTe: 'రంగుల ప్రింటింగ్ (హై రెజల్యూషన్)',
    description: 'High-resolution color printouts for resumes, presentations, photos, & project reports.',
    serviceType: 'printing',
    colorMode: 'color',
    sidedness: 'single',
    price: 15,
    pricingUnit: 'per page',
    isPriceOnRequest: false,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    displayOrder: 6,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Document Printing',
    nameTe: 'డాక్యుమెంట్ ప్రింటింగ్ & స్పైరల్ బైండింగ్',
    description: 'Complete multi-page book/thesis document printing with optional staple/punching.',
    serviceType: 'printing',
    colorMode: 'bw',
    sidedness: 'double',
    price: null,
    pricingUnit: 'per page / volume',
    isPriceOnRequest: true,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    displayOrder: 7,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Lamination',
    nameTe: 'లామినేషన్ (డాక్యుమెంట్లు & సర్టిఫికెట్లు)',
    description: 'Heavy duty moisture & tear-resistant thermal lamination for certificates, IDs, and cards.',
    serviceType: 'lamination',
    colorMode: 'color',
    sidedness: 'na',
    price: 30,
    pricingUnit: 'per sheet (A4)',
    isPriceOnRequest: false,
    isActive: true,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    displayOrder: 8,
    createdAt: new Date().toISOString(),
  },
];

// Starter Stationery Categories
export const DEFAULT_STATIONERY_CATEGORIES: Omit<StationeryCategory, 'id'>[] = [
  {
    name: 'School Books & Guides',
    nameTe: 'స్కూల్ పుస్తకాలు & గైడ్స్',
    description: 'State board, CBSE textbooks, workbooks, and question banks for all standards.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Notebooks & Registers',
    nameTe: 'నోట్‌బుక్స్ & లాంగ్ బుక్స్',
    description: 'Single line, 4-line, broad rule, long books, graph books, and rough books.',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Pens, Pencils & Inks',
    nameTe: 'పెన్నులు, పెన్సిళ్లు & ఇంక్స్',
    description: 'Ballpoint, gel, fountain pens, mechanical pencils, refills, and highlighters.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Drawing & Painting Materials',
    nameTe: 'డ్రాయింగ్ & కలరింగ్ వస్తువులు',
    description: 'Crayons, oil pastels, water colours, sketch books, poster colours, and brushes.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'Art & Craft Supplies',
    nameTe: 'ఆర్ట్ & క్రాఫ్ట్ సామాగ్రి',
    description: 'Chart papers, glitter sheets, thermocol, glue, fevicol, scissors, and origami.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'School Accessories & Geometry Boxes',
    nameTe: 'స్కూల్ బ్యాగ్స్ & జామెట్రీ బాక్సులు',
    description: 'Compass boxes, exam pads, water bottles, lunch boxes, pouches, and name slips.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'Office & Business Stationery',
    nameTe: 'ఆఫీస్ & వాణిజ్య స్టేషనరీ',
    description: 'Files, folders, staplers, punch machines, sticky notes, calculators, and ledgers.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: 'Educational & Project Supplies',
    nameTe: 'ప్రాజెక్ట్ ఫైల్స్ & మోడల్ సామాగ్రి',
    description: 'Science project charts, maps, flash cards, modeling clay, and presentation folders.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    displayOrder: 8,
    isActive: true,
  },
];

// Starter Fancy Categories
export const DEFAULT_FANCY_CATEGORIES: Omit<FancyCategory, 'id'>[] = [
  {
    name: 'Hair Clips & Clutches',
    nameTe: 'హెయిర్ క్లిప్స్ & క్లచెస్',
    description: 'Stone clips, butterfly clips, claw clutches, and banana clips for daily & party wear.',
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=600&q=80',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Hair Bands & Headbands',
    nameTe: 'హెయిర్ బ్యాండ్స్ & హెడ్‌బ్యాండ్స్',
    description: 'Pearl hairbands, soft fabric floral bands, school uniform hair bands, and velvet bands.',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Scrunchies & Rubber Bands',
    nameTe: 'స్క్రంచీస్ & రబ్బర్ బ్యాండ్స్',
    description: 'Satin silk scrunchies, pastel elastic ties, organza scrunchies, and kids band sets.',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Earrings & Jhumkas',
    nameTe: 'కమ్మలు, జుంకాలు & డ్రాప్స్',
    description: 'Oxidized jhumkas, pearl studs, daily wear earrings, and traditional golden studs.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'Bangles & Bracelets',
    nameTe: 'గాజులు & బ్రేస్‌లెట్స్',
    description: 'Glass bangles, metal velvet bangles, silk thread bangles, and stone bracelets.',
    image: 'https://images.unsplash.com/photo-1611591475815-5b48e35cf8db?auto=format&fit=crop&w=600&q=80',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'Bindis & Kumkum Packets',
    nameTe: 'స్టిక్కర్ బొట్లు & కుంకుమ',
    description: 'Maroon round velvet bindis, stone bridal bindis, designer fancy sticker sheets.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'Safety Pins & Hair Pins',
    nameTe: 'సేఫ్టీ పిన్స్ & బాబీ పిన్స్',
    description: 'Golden saree pins, hijab brooch pins, black bobby pins, and Juda hair pins.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: "Women's Accessories & Cosmetics",
    nameTe: 'మహిళల మేకప్ & అలంకరణ వస్తువులు',
    description: 'Kajal, nail polish, lipsticks, compact powder, mehendi cones, and mirrors.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    displayOrder: 8,
    isActive: true,
  },
];

// Starter Products
export const DEFAULT_STATIONERY_PRODUCTS: Omit<StationeryProduct, 'id'>[] = [
  {
    name: 'Classmate Long Notebook 172 Pages (Ruled)',
    nameTe: 'క్లాస్‌మేట్ లాంగ్ నోట్‌బుక్ 172 పేజీలు',
    description: 'Smooth white paper, bound with pin, ideal for school and college notes.',
    categoryId: '',
    categoryName: 'Notebooks & Registers',
    price: 65,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
    variants: 'Ruled, Unruled',
    displayOrder: 1,
  },
  {
    name: 'Doms Smart Drawing Kit (Complete Set)',
    nameTe: 'డామ్స్ స్మార్ట్ డ్రాయింగ్ కిట్ సెట్',
    description: 'Includes oil pastels, wax crayons, colour pencils, water colour cakes & eraser.',
    categoryId: '',
    categoryName: 'Drawing & Painting Materials',
    price: 150,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    variants: 'Standard Kit',
    displayOrder: 2,
  },
  {
    name: 'Reynolds 045 Fine Carbure Ball Pen (Pack of 5)',
    nameTe: 'రేనాల్డ్స్ 045 బాల్ పెన్ (5 ప్యాక్)',
    description: 'Classic smooth writing ball pens with comfortable laser grip.',
    categoryId: '',
    categoryName: 'Pens, Pencils & Inks',
    price: 50,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    variants: 'Blue, Black, Red',
    displayOrder: 3,
  },
  {
    name: 'Camlin Exam Mathematical Drawing Instruments (Geometry Box)',
    nameTe: 'కామ్లిన్ మ్యాథమెటికల్ జామెట్రీ బాక్స్',
    description: 'Self-centering compass, divider, 15cm ruler, 2 set squares, and protractor.',
    categoryId: '',
    categoryName: 'School Accessories & Geometry Boxes',
    price: 120,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    variants: 'Metal Box',
    displayOrder: 4,
  },
  {
    name: 'Telangana State Board / CBSE Textbook Guides',
    nameTe: 'తెలంగాణ స్టేట్ బోర్డ్ / CBSE గైడ్స్',
    description: 'Available for Classes 1 to 10 in English & Telugu mediums.',
    categoryId: '',
    categoryName: 'School Books & Guides',
    price: null,
    isPriceOnRequest: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    variants: 'English Medium, Telugu Medium',
    displayOrder: 5,
  },
  {
    name: 'A4 Size Color Chart Papers (Pack of 10 Sheets)',
    nameTe: 'కలర్ చార్ట్ పేపర్స్ (10 షీట్లు)',
    description: 'Bright thick craft chart papers for school projects and poster making.',
    categoryId: '',
    categoryName: 'Art & Craft Supplies',
    price: 40,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    variants: 'Assorted Multi-colors',
    displayOrder: 6,
  },
  {
    name: 'Kangaroo Heavy Duty Stapler & Pin Pack',
    nameTe: 'కంగారూ స్టాప్లర్ & పిన్ బాక్స్',
    description: 'Metal body stapler with pins, binds up to 30 sheets smoothly.',
    categoryId: '',
    categoryName: 'Office & Business Stationery',
    price: 95,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    variants: 'Size No. 10',
    displayOrder: 7,
  },
];

export const DEFAULT_FANCY_PRODUCTS: Omit<FancyProduct, 'id'>[] = [
  {
    name: 'Premium Velvet & Stone Hair Clutchers (Pair)',
    nameTe: 'ప్రీమియం వెల్వెట్ & స్టోన్ హెయిర్ క్లచెస్',
    description: 'Sturdy grip spring clutcher with crystal stone embellishment.',
    categoryId: '',
    categoryName: 'Hair Clips & Clutches',
    price: 60,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=600&q=80',
    colors: 'Maroon, Black, Gold, Navy',
    displayOrder: 1,
  },
  {
    name: 'Pastel Satin Silk Scrunchies (Pack of 4)',
    nameTe: 'శాటిన్ సిల్క్ స్క్రంచీస్ (4 ప్యాక్)',
    description: 'Ultra-gentle hair ties that prevent hair breakage and creasing.',
    categoryId: '',
    categoryName: 'Scrunchies & Rubber Bands',
    price: 79,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=600&q=80',
    colors: 'Pink, Peach, Lavender, Cream',
    displayOrder: 2,
  },
  {
    name: 'Antique Gold & Pearl Jhumka Earrings',
    nameTe: 'యాంటిక్ గోల్డ్ & పెర్ల్ జుంకాలు',
    description: 'Traditional South Indian temple design lightweight jhumkas.',
    categoryId: '',
    categoryName: 'Earrings & Jhumkas',
    price: 120,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    variants: 'Gold Pearl, Matte Gold Ruby',
    displayOrder: 3,
  },
  {
    name: 'Traditional Velvet Metal Glass Bangles Set (24 Pcs)',
    nameTe: 'ట్రడిషనల్ వెల్వెట్ గాజులు సెట్ (24 గాజులు)',
    description: 'Rich velvet matte finished glass bangles for festive and wedding seasons.',
    categoryId: '',
    categoryName: 'Bangles & Bracelets',
    price: 90,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1611591475815-5b48e35cf8db?auto=format&fit=crop&w=600&q=80',
    variants: 'Size 2.4, 2.6, 2.8',
    colors: 'Deep Maroon, Royal Red, Emerald Green',
    displayOrder: 4,
  },
  {
    name: 'Shilpa Velvet Maroon Round Bindis (Card of 30)',
    nameTe: 'శిల్ప వెల్వెట్ మెరూన్ స్టిక్కర్ బొట్లు',
    description: 'Skin-friendly adhesive, long lasting deep maroon devotional bindi card.',
    categoryId: '',
    categoryName: 'Bindis & Kumkum Packets',
    price: 30,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    variants: 'Size 6, Size 7, Size 8',
    displayOrder: 5,
  },
  {
    name: 'Natural Organic Henna Mehendi Cones (Box of 3)',
    nameTe: 'నేచురల్ ఆర్గానిక్ మెహందీ కోన్స్',
    description: 'Dark, rich long-lasting brown stain with natural eucalyptus aroma.',
    categoryId: '',
    categoryName: "Women's Accessories & Cosmetics",
    price: 45,
    isPriceOnRequest: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    displayOrder: 6,
  },
];

// Starter Gallery Items
export const DEFAULT_GALLERY_ITEMS: Omit<GalleryItem, 'id'>[] = [
  {
    title: 'Sri Durga Mata Stationery - Front Entrance',
    titleTe: 'శ్రీ దుర్గా మాత స్టేషనరీ - ప్రవేశ ద్వారం',
    caption: 'Welcoming customers with full book stall, fancy jewelry, and xerox services in Hyderabad.',
    imageUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be7ff60b?auto=format&fit=crop&w=800&q=80',
    category: 'shop',
    isFeatured: true,
    displayOrder: 1,
  },
  {
    title: 'High Speed Digital Xerox & Color Copier',
    titleTe: 'హై స్పీడ్ డిజిటల్ జిరాక్స్ & ప్రింటింగ్ మెషిన్',
    caption: 'Commercial heavy-duty laser copier for crystal clear prints and instant double-side copies.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    category: 'xerox',
    isFeatured: true,
    displayOrder: 2,
  },
  {
    title: 'School Notebooks, Guides & Reference Stalls',
    titleTe: 'స్కూల్ నోట్‌బుక్స్ మరియు పుస్తకాల విభాగం',
    caption: 'Complete stock of Telugu and English medium school notebooks, guides, and exam stationery.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    category: 'stationery',
    isFeatured: true,
    displayOrder: 3,
  },
  {
    title: 'Fancy Bangles, Bindis & Hair Ornaments',
    titleTe: 'ఫ్యాన్సీ గాజులు, బొట్లు మరియు హెయిర్ యాక్సెసరీస్',
    caption: 'Extensive colorful collection of jhumkas, hair clips, bindis, and cosmetic accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1611591475815-5b48e35cf8db?auto=format&fit=crop&w=800&q=80',
    category: 'fancy',
    isFeatured: true,
    displayOrder: 4,
  },
  {
    title: 'Thermal Lamination & Project Binding Services',
    titleTe: 'లామినేషన్ & స్పైరల్ బైండింగ్ కౌంటర్',
    caption: 'Preserving certificates, government IDs, ration cards, and school projects with waterproof lamination.',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    category: 'xerox',
    isFeatured: false,
    displayOrder: 5,
  },
  {
    title: 'Diwali & Dussehra Festive Special Corner',
    titleTe: 'దసరా & దీపావళి పండుగ ప్రత్యేక విభాగం',
    caption: 'Rangoli colors, festive stickers, gift wrapping papers, and greeting cards.',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    category: 'festival',
    isFeatured: false,
    displayOrder: 6,
  },
];

// Starter Active Offers
export const DEFAULT_OFFERS: Omit<Offer, 'id'>[] = [
  {
    title: 'School Reopening & Bulk Xerox Special',
    titleTe: 'స్కూల్ రీఓపెనింగ్ & బల్క్ జిరాక్స్ ఆఫర్',
    description: 'Get special discounts on project printing above 50 pages & complete school notebook sets!',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    discountBadge: 'SPECIAL OFFER',
    startDate: '2026-06-01',
    endDate: '2027-12-31',
    isActive: true,
  },
  {
    title: 'Festival Fancy Accessories Combo',
    titleTe: 'పండుగ ఫ్యాన్సీ కాంబో ఆఫర్',
    description: 'Buy matching Velvet Bangles + Bindi Card and get complimentary Saree Pin sets.',
    imageUrl: 'https://images.unsplash.com/photo-1611591475815-5b48e35cf8db?auto=format&fit=crop&w=800&q=80',
    discountBadge: 'FESTIVAL SPECIAL',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    isActive: true,
  },
];

// Auto-seed Firestore if collection empty
export async function seedInitialDataIfEmpty() {
  try {
    // 1. Settings
    const settingsDoc = doc(db, 'settings', 'shop_info');
    try {
      const snap = await getDocs(collection(db, 'settings'));
      if (snap.empty) {
        await setDoc(settingsDoc, INITIAL_SHOP_SETTINGS);
      }
    } catch {
      // ignore
    }

    // 2. Xerox services
    try {
      const xeroxSnap = await getDocs(collection(db, 'xerox_services'));
      if (xeroxSnap.empty) {
        for (const s of DEFAULT_XEROX_SERVICES) {
          await addDoc(collection(db, 'xerox_services'), s);
        }
      }
    } catch {
      // ignore
    }

    // 3. Stationery categories
    let catMap: Record<string, string> = {};
    try {
      const statCatSnap = await getDocs(collection(db, 'stationery_categories'));
      if (statCatSnap.empty) {
        for (const c of DEFAULT_STATIONERY_CATEGORIES) {
          const docRef = await addDoc(collection(db, 'stationery_categories'), c);
          catMap[c.name] = docRef.id;
        }
      } else {
        statCatSnap.forEach((d) => {
          catMap[d.data().name] = d.id;
        });
      }
    } catch {
      // ignore
    }

    // 4. Stationery products
    try {
      const statProdSnap = await getDocs(collection(db, 'stationery_products'));
      if (statProdSnap.empty) {
        for (const p of DEFAULT_STATIONERY_PRODUCTS) {
          const assignedCatId = catMap[p.categoryName] || 'gen-cat';
          await addDoc(collection(db, 'stationery_products'), {
            ...p,
            categoryId: assignedCatId,
          });
        }
      }
    } catch {
      // ignore
    }

    // 5. Fancy categories
    let fancyCatMap: Record<string, string> = {};
    try {
      const fancyCatSnap = await getDocs(collection(db, 'fancy_categories'));
      if (fancyCatSnap.empty) {
        for (const c of DEFAULT_FANCY_CATEGORIES) {
          const docRef = await addDoc(collection(db, 'fancy_categories'), c);
          fancyCatMap[c.name] = docRef.id;
        }
      } else {
        fancyCatSnap.forEach((d) => {
          fancyCatMap[d.data().name] = d.id;
        });
      }
    } catch {
      // ignore
    }

    // 6. Fancy products
    try {
      const fancyProdSnap = await getDocs(collection(db, 'fancy_products'));
      if (fancyProdSnap.empty) {
        for (const p of DEFAULT_FANCY_PRODUCTS) {
          const assignedCatId = fancyCatMap[p.categoryName] || 'fancy-cat';
          await addDoc(collection(db, 'fancy_products'), {
            ...p,
            categoryId: assignedCatId,
          });
        }
      }
    } catch {
      // ignore
    }

    // 7. Gallery: Do not auto-seed fake photos. User will upload via Admin Portal.
    /*
    try {
      const gallerySnap = await getDocs(collection(db, 'gallery'));
      if (gallerySnap.empty) {
        // Left empty intentionally per user instructions
      }
    } catch {
      // ignore
    }
    */

    // 8. Offers
    try {
      const offersSnap = await getDocs(collection(db, 'offers'));
      if (offersSnap.empty) {
        for (const o of DEFAULT_OFFERS) {
          await addDoc(collection(db, 'offers'), o);
        }
      }
    } catch {
      // ignore
    }
  } catch (err) {
    console.error('Initial data seeding error (non-fatal):', err);
  }
}
