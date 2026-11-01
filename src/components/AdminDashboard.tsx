import React, { useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  signInAdminWithGoogle,
  logoutAdmin,
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import {
  StationeryCategory,
  StationeryProduct,
  FancyCategory,
  FancyProduct,
  XeroxService,
  GalleryItem,
} from '../types';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Printer,
  Image,
  Upload,
  Phone,
  Settings,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ShieldAlert,
  Save,
  X,
  FileImage,
  Star,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'gallery'
  | 'xerox_services'
  | 'stat_categories'
  | 'stat_products'
  | 'fancy_categories'
  | 'fancy_products'
  | 'shop_info';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    isAdmin,
    shopSettings,
    updateShopSettings,
    setActiveView,
    stationeryCategories,
    stationeryProducts,
    fancyCategories,
    fancyProducts,
    xeroxServices,
    galleryItems,
    refreshAllData,
  } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');
  const [authError, setAuthError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // File upload state for Gallery
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generic modal/drawer edit state
  const [editingItem, setEditingItem] = useState<{
    type: 'stat_cat' | 'stat_prod' | 'fancy_cat' | 'fancy_prod' | 'xerox' | 'gallery';
    data: any;
    isNew: boolean;
  } | null>(null);

  // Shop Info Form state
  const [infoForm, setInfoForm] = useState({
    shopName: shopSettings.shopName || 'SREE DURGA MATA STATIONERY',
    subtitle: shopSettings.subtitle || 'BOOK STALL & FANCY ITEMS',
    address: shopSettings.address,
    email: shopSettings.email,
    phone: shopSettings.phone,
    whatsapp: shopSettings.whatsapp,
    openingHours: shopSettings.openingHours,
    holidays: shopSettings.holidays,
    googleMapsUrl: shopSettings.googleMapsUrl,
  });

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInAdminWithGoogle();
      showSuccess('Authenticated successfully!');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setActiveView('home');
  };

  // -------------------------------------------------------------
  // GALLERY UPLOAD ENGINE: LOCAL FILE SELECT + DRAG AND DROP
  // -------------------------------------------------------------
  const processAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to JPEG data URL
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressed);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image file.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    let uploadedCount = 0;

    try {
      for (const file of validFiles) {
        const dataUrl = await processAndCompressImage(file);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        await addDoc(collection(db, 'gallery'), {
          title: nameWithoutExt || 'Shop Photograph',
          titleTe: '',
          caption: '',
          imageUrl: dataUrl,
          category: 'shop',
          isFeatured: false,
          displayOrder: galleryItems.length + uploadedCount + 1,
          createdAt: new Date().toISOString(),
        });

        uploadedCount++;
      }

      await refreshAllData();
      showSuccess(`Successfully uploaded ${uploadedCount} photograph(s) to gallery!`);
    } catch (err: any) {
      console.error(err);
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Toggle Featured status on gallery photo
  const handleToggleFeatured = async (item: GalleryItem) => {
    try {
      await updateDoc(doc(db, 'gallery', item.id), {
        isFeatured: !item.isFeatured,
      });
      await refreshAllData();
      showSuccess(`Updated featured status for "${item.title}"`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `gallery/${item.id}`);
    }
  };

  // Delete Action
  const handleDeleteDocument = async (col: string, id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete this ${label}?`)) return;
    try {
      await deleteDoc(doc(db, col, id));
      await refreshAllData();
      showSuccess(`Deleted ${label} successfully.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${col}/${id}`);
    }
  };

  // Save Modal Item
  const handleSaveModalItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const { type, data, isNew } = editingItem;

    try {
      if (type === 'gallery') {
        const payload = {
          title: data.title || 'Shop Photograph',
          titleTe: data.titleTe || '',
          caption: data.caption || '',
          imageUrl: data.imageUrl || '',
          category: data.category || 'shop',
          isFeatured: Boolean(data.isFeatured),
          displayOrder: Number(data.displayOrder) || 1,
        };
        if (isNew) {
          await addDoc(collection(db, 'gallery'), {
            ...payload,
            createdAt: new Date().toISOString(),
          });
        } else {
          await updateDoc(doc(db, 'gallery', data.id), payload);
        }
      } else if (type === 'xerox') {
        const payload = {
          name: data.name || 'Xerox Service',
          nameTe: data.nameTe || '',
          description: data.description || '',
          serviceType: data.serviceType || 'xerox',
          colorMode: data.colorMode || 'bw',
          sidedness: data.sidedness || 'single',
          price: data.price ? Number(data.price) : null,
          pricingUnit: data.pricingUnit || 'per page',
          isPriceOnRequest: Boolean(data.isPriceOnRequest),
          isActive: data.isActive !== false,
          image: data.image || '',
          displayOrder: Number(data.displayOrder) || 1,
        };
        if (isNew) {
          await addDoc(collection(db, 'xerox_services'), {
            ...payload,
            createdAt: new Date().toISOString(),
          });
        } else {
          await updateDoc(doc(db, 'xerox_services', data.id), payload);
        }
      } else if (type === 'stat_prod') {
        const payload = {
          name: data.name,
          nameTe: data.nameTe || '',
          description: data.description || '',
          categoryId: data.categoryId || '',
          categoryName: data.categoryName || '',
          price: data.price ? Number(data.price) : null,
          isPriceOnRequest: Boolean(data.isPriceOnRequest),
          isAvailable: data.isAvailable !== false,
          image: data.image || '',
          variants: data.variants || '',
          displayOrder: Number(data.displayOrder) || 1,
        };
        if (isNew) {
          await addDoc(collection(db, 'stationery_products'), {
            ...payload,
            createdAt: new Date().toISOString(),
          });
        } else {
          await updateDoc(doc(db, 'stationery_products', data.id), payload);
        }
      } else if (type === 'fancy_prod') {
        const payload = {
          name: data.name,
          nameTe: data.nameTe || '',
          description: data.description || '',
          categoryId: data.categoryId || '',
          categoryName: data.categoryName || '',
          price: data.price ? Number(data.price) : null,
          isPriceOnRequest: Boolean(data.isPriceOnRequest),
          isAvailable: data.isAvailable !== false,
          image: data.image || '',
          colors: data.colors || '',
          displayOrder: Number(data.displayOrder) || 1,
        };
        if (isNew) {
          await addDoc(collection(db, 'fancy_products'), {
            ...payload,
            createdAt: new Date().toISOString(),
          });
        } else {
          await updateDoc(doc(db, 'fancy_products', data.id), payload);
        }
      }

      await refreshAllData();
      setEditingItem(null);
      showSuccess('Saved successfully!');
    } catch (err: any) {
      alert('Error saving: ' + err.message);
    }
  };

  // Save Shop Info
  const handleSaveShopInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateShopSettings(infoForm);
      showSuccess('Shop contact and business hours updated!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // IF NOT LOGGED IN OR NOT ADMIN
  if (!user || !isAdmin) {
    return (
      <div className="bg-[#480000] min-h-screen py-16 px-4 flex items-center justify-center text-amber-50">
        <div className="max-w-md w-full bg-[#FFFDF9] text-[#2D1810] rounded-3xl p-8 border-2 border-[#D4AF37] shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#580000] text-[#FFDF73] flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#580000] font-['Cinzel']">
              Shop Admin Portal
            </h1>
            <p className="text-xs text-[#704938] mt-1">
              Sree Durga Mata Stationery • Book Stall & Fancy Items
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-semibold">
              {authError}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#580000] hover:bg-[#400000] text-[#FFDF73] font-black text-sm shadow-md transition border border-[#D4AF37]"
            >
              <span>Sign in with Google Admin</span>
            </button>

            <button
              onClick={() => setActiveView('home')}
              className="text-xs font-bold text-[#800000] hover:underline"
            >
              ← Return to Public Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#480000] text-amber-50 min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#580000] text-white px-4 sm:px-8 py-3 flex items-center justify-between border-b-2 border-[#D4AF37] sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="p-1.5 rounded-lg bg-[#400000] text-amber-200 hover:text-white transition"
            title="View Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black text-[#FFDF73] font-['Cinzel'] flex items-center gap-2">
              <span>SREE DURGA MATA STATIONERY</span>
              <span className="text-[10px] font-sans font-bold bg-[#D4AF37] text-[#400000] px-2 py-0.5 rounded uppercase">
                Admin
              </span>
            </h1>
            <p className="text-[10px] text-amber-200/80">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#400000] hover:bg-[#300000] text-amber-200 text-xs font-bold border border-amber-600/40 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Admin Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-[#560000] rounded-2xl border-2 border-[#D4AF37]/60 p-3 shadow-lg space-y-1.5 self-start">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition ${
              activeTab === 'gallery'
                ? 'bg-[#D4AF37] text-[#400000] shadow'
                : 'text-amber-100 hover:bg-[#620000]'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Gallery Photo Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('xerox_services')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition ${
              activeTab === 'xerox_services'
                ? 'bg-[#D4AF37] text-[#400000] shadow'
                : 'text-amber-100 hover:bg-[#620000]'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Xerox Rates & Services</span>
          </button>

          <button
            onClick={() => setActiveTab('stat_products')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition ${
              activeTab === 'stat_products'
                ? 'bg-[#D4AF37] text-[#400000] shadow'
                : 'text-amber-100 hover:bg-[#620000]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Books & Stationery Items</span>
          </button>

          <button
            onClick={() => setActiveTab('fancy_products')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition ${
              activeTab === 'fancy_products'
                ? 'bg-[#D4AF37] text-[#400000] shadow'
                : 'text-amber-100 hover:bg-[#620000]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Fancy Items Products</span>
          </button>

          <button
            onClick={() => setActiveTab('shop_info')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition ${
              activeTab === 'shop_info'
                ? 'bg-[#D4AF37] text-[#400000] shadow'
                : 'text-amber-100 hover:bg-[#620000]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Shop Info & Hours</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          {actionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB: GALLERY UPLOAD ENGINE */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#FFDF73] font-['Cinzel']">
                  Our Gallery – Photo Upload & Management
                </h2>
                <p className="text-xs text-amber-200/90 mt-1">
                  Upload authentic photographs of your shop, books, machines, and fancy items. Uploaded photos appear permanently on the public website.
                </p>
              </div>

              {/* UPLOAD BOX: OPTION 1 (DRAG AND DROP) + OPTION 2 (SELECT PHOTOS BUTTON) */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-8 rounded-2xl border-2 border-dashed transition-all duration-300 text-center space-y-4 ${
                  isDragging
                    ? 'border-[#FFDF73] bg-[#680000] scale-[1.01]'
                    : 'border-[#D4AF37]/60 bg-[#560000] hover:border-[#D4AF37]'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#400000] text-[#FFDF73] border border-[#D4AF37] mx-auto flex items-center justify-center shadow-lg">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#FFDF73]">
                    OPTION 1: Drag and Drop Photographs Here
                  </h3>
                  <p className="text-xs text-amber-100/80">
                    Drag pictures directly from your Desktop, Downloads, or Pictures folder and drop them here.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-16 bg-[#D4AF37]/40"></span>
                  <span className="text-xs text-amber-300 uppercase font-black">OR</span>
                  <span className="h-px w-16 bg-[#D4AF37]/40"></span>
                </div>

                {/* OPTION 2: SELECT PHOTOS FROM DEVICE BUTTON */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] hover:from-[#E5BE42] hover:to-[#E5BE42] text-[#400000] font-black text-sm uppercase tracking-wider shadow-xl transition transform active:scale-95 cursor-pointer border border-[#FFF3B0]"
                  >
                    <FileImage className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading Photos...' : 'SELECT PHOTOS FROM DEVICE'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-amber-200/70">
                  Multiple photographs supported (JPG, PNG, WebP). Images are stored permanently in cloud storage.
                </p>
              </div>

              {/* CURRENT UPLOADED GALLERY PHOTOGRAPHS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/40 pb-2">
                  <h3 className="text-base font-black text-[#FFDF73] font-['Cinzel']">
                    Current Uploaded Gallery ({galleryItems.length})
                  </h3>
                  <button
                    onClick={() =>
                      setEditingItem({
                        type: 'gallery',
                        isNew: true,
                        data: {
                          title: '',
                          caption: '',
                          imageUrl: '',
                          isFeatured: false,
                        },
                      })
                    }
                    className="text-xs font-bold text-[#FFDF73] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo by URL (Optional)</span>
                  </button>
                </div>

                {galleryItems.length === 0 ? (
                  <div className="bg-[#560000] p-8 rounded-2xl border border-[#D4AF37]/40 text-center space-y-2">
                    <p className="text-sm font-bold text-[#FFDF73]">No photographs uploaded yet.</p>
                    <p className="text-xs text-amber-200/80">
                      Use the "SELECT PHOTOS FROM DEVICE" button above to upload photos of your shop.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#560000] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-lg flex flex-col justify-between"
                      >
                        <div className="relative h-44">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item)}
                            className={`absolute top-2 right-2 p-1.5 rounded-lg transition ${
                              item.isFeatured
                                ? 'bg-[#D4AF37] text-[#400000]'
                                : 'bg-black/60 text-white hover:text-[#FFDF73]'
                            }`}
                            title="Toggle Featured on Homepage"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        <div className="p-3.5 space-y-1 text-xs">
                          <h4 className="font-extrabold text-[#FFDF73] text-sm line-clamp-1">
                            {item.title}
                          </h4>
                          {item.caption && (
                            <p className="text-amber-100/80 line-clamp-2">{item.caption}</p>
                          )}
                        </div>

                        <div className="p-3 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs">
                          <button
                            onClick={() =>
                              setEditingItem({
                                type: 'gallery',
                                isNew: false,
                                data: { ...item },
                              })
                            }
                            className="text-[#FFDF73] hover:underline font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Caption</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDocument('gallery', item.id, 'photograph')}
                            className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: XEROX RATES & SERVICES */}
          {activeTab === 'xerox_services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#FFDF73] font-['Cinzel']">
                    Xerox & Printing Rates
                  </h2>
                  <p className="text-xs text-amber-200/90">
                    Configure optional rates per page/copy, or mark as Rate Upon Request
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      type: 'xerox',
                      isNew: true,
                      data: {
                        name: '',
                        serviceType: 'xerox',
                        price: 2,
                        pricingUnit: 'per page',
                        isPriceOnRequest: false,
                        isActive: true,
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#D4AF37] text-[#400000] rounded-xl text-xs font-black shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {xeroxServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[#560000] p-4 rounded-xl border border-[#D4AF37] shadow flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-extrabold text-[#FFDF73] text-sm">{service.name}</h4>
                      <p className="text-amber-200 font-bold mt-1">
                        {service.isPriceOnRequest || service.price == null
                          ? 'Rate Upon Request'
                          : `₹${service.price} / ${service.pricingUnit}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setEditingItem({
                            type: 'xerox',
                            isNew: false,
                            data: { ...service },
                          })
                        }
                        className="p-1.5 text-amber-300 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument('xerox_services', service.id, 'service')}
                        className="p-1.5 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BOOKS & STATIONERY PRODUCTS */}
          {activeTab === 'stat_products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#FFDF73] font-['Cinzel']">
                    Books & Stationery Products
                  </h2>
                  <p className="text-xs text-amber-200/90">
                    Add or edit textbooks, notebooks, pens, and supplies
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      type: 'stat_prod',
                      isNew: true,
                      data: {
                        name: '',
                        categoryId: stationeryCategories[0]?.id || '',
                        categoryName: stationeryCategories[0]?.name || 'Books',
                        price: 60,
                        isPriceOnRequest: false,
                        isAvailable: true,
                        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#D4AF37] text-[#400000] rounded-xl text-xs font-black shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stationeryProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#560000] p-3.5 rounded-xl border border-[#D4AF37]/60 shadow flex items-center justify-between gap-3 text-xs"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]/50"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#FFDF73] truncate">{p.name}</h4>
                      <p className="text-amber-200 text-[11px]">
                        {p.isPriceOnRequest || p.price == null ? 'Rate Upon Request' : `₹${p.price}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          setEditingItem({
                            type: 'stat_prod',
                            isNew: false,
                            data: { ...p },
                          })
                        }
                        className="p-1 text-amber-300 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument('stationery_products', p.id, 'product')}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FANCY ITEMS */}
          {activeTab === 'fancy_products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#FFDF73] font-['Cinzel']">
                    Fancy Items Products
                  </h2>
                  <p className="text-xs text-amber-200/90">
                    Add or edit bangles, hair clips, bindis, jhumkas, and accessories
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingItem({
                      type: 'fancy_prod',
                      isNew: true,
                      data: {
                        name: '',
                        categoryId: fancyCategories[0]?.id || '',
                        categoryName: fancyCategories[0]?.name || 'Hair Clips',
                        price: 50,
                        isPriceOnRequest: false,
                        isAvailable: true,
                        image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=600&q=80',
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#D4AF37] text-[#400000] rounded-xl text-xs font-black shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Fancy Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fancyProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#560000] p-3.5 rounded-xl border border-[#D4AF37]/60 shadow flex items-center justify-between gap-3 text-xs"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]/50"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#FFDF73] truncate">{p.name}</h4>
                      <p className="text-amber-200 text-[11px]">
                        {p.isPriceOnRequest || p.price == null ? 'Rate Upon Request' : `₹${p.price}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          setEditingItem({
                            type: 'fancy_prod',
                            isNew: false,
                            data: { ...p },
                          })
                        }
                        className="p-1 text-amber-300 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument('fancy_products', p.id, 'item')}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SHOP INFO & HOURS */}
          {activeTab === 'shop_info' && (
            <div className="bg-[#560000] p-6 sm:p-8 rounded-2xl border-2 border-[#D4AF37] shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-black text-[#FFDF73] font-['Cinzel']">
                  Shop Information & WhatsApp Settings
                </h2>
                <p className="text-xs text-amber-200/90">
                  Update WhatsApp number, phone, opening hours, and address
                </p>
              </div>

              <form onSubmit={handleSaveShopInfo} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-amber-200 uppercase mb-1">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      value={infoForm.shopName}
                      onChange={(e) => setInfoForm({ ...infoForm, shopName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-200 uppercase mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={infoForm.subtitle}
                      onChange={(e) => setInfoForm({ ...infoForm, subtitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-amber-200 uppercase mb-1">
                      WhatsApp Number (For Customer Orders)
                    </label>
                    <input
                      type="text"
                      value={infoForm.whatsapp}
                      onChange={(e) => setInfoForm({ ...infoForm, whatsapp: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-200 uppercase mb-1">
                      Phone Number (Calls)
                    </label>
                    <input
                      type="text"
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-amber-200 uppercase mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={infoForm.openingHours}
                      onChange={(e) => setInfoForm({ ...infoForm, openingHours: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-200 uppercase mb-1">
                      Holidays / Timings
                    </label>
                    <input
                      type="text"
                      value={infoForm.holidays}
                      onChange={(e) => setInfoForm({ ...infoForm, holidays: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-amber-200 uppercase mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={infoForm.address}
                    onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-200 uppercase mb-1">
                    Google Maps CID Link
                  </label>
                  <input
                    type="text"
                    value={infoForm.googleMapsUrl}
                    onChange={(e) => setInfoForm({ ...infoForm, googleMapsUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-[#2D1810]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5BE42] text-[#400000] font-black shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Shop Information</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] text-[#2D1810] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-[#D4AF37] my-8">
            <div className="bg-[#580000] text-white p-4 flex items-center justify-between border-b-2 border-[#D4AF37]">
              <h3 className="font-bold text-sm text-[#FFDF73]">
                {editingItem.isNew ? 'Add' : 'Edit'} {editingItem.type.toUpperCase()}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-amber-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#553326] mb-1">Title / Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.data.title || editingItem.data.name || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      data: {
                        ...editingItem.data,
                        title: e.target.value,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-amber-300 rounded-lg bg-white"
                />
              </div>

              {editingItem.type === 'gallery' && (
                <div>
                  <label className="block font-bold text-[#553326] mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={editingItem.data.caption || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, caption: e.target.value },
                      })
                    }
                    className="w-full p-2 border border-amber-300 rounded-lg bg-white"
                  />
                </div>
              )}

              {/* Price / Rate Upon Request toggle */}
              {(editingItem.type === 'xerox' ||
                editingItem.type === 'stat_prod' ||
                editingItem.type === 'fancy_prod') && (
                <div className="grid grid-cols-2 gap-3 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <div>
                    <label className="block font-bold text-[#553326] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingItem.data.price ?? ''}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            price: e.target.value === '' ? null : Number(e.target.value),
                          },
                        })
                      }
                      className="w-full p-1.5 border border-amber-300 rounded bg-white"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#800000]">
                      <input
                        type="checkbox"
                        checked={Boolean(editingItem.data.isPriceOnRequest)}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: {
                              ...editingItem.data,
                              isPriceOnRequest: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Rate Upon Request</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#553326] mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingItem.data.imageUrl || editingItem.data.image || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      data: {
                        ...editingItem.data,
                        imageUrl: e.target.value,
                        image: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-amber-300 rounded-lg bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-gray-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#580000] text-[#FFDF73] font-bold rounded-xl border border-[#D4AF37]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
