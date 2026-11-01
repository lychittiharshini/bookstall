export type Language = 'en' | 'te';

export interface ShopSettings {
  id?: string;
  shopName: string;
  subtitle: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  holidays: string;
  googleMapsUrl: string;
  latitude: number;
  longitude: number;
  updatedAt?: string;
}

export interface StationeryCategory {
  id: string;
  name: string;
  nameTe?: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface StationeryProduct {
  id: string;
  name: string;
  nameTe?: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price?: number | null;
  isPriceOnRequest: boolean;
  isAvailable: boolean;
  image: string;
  variants?: string;
  displayOrder: number;
  createdAt?: string;
}

export interface FancyCategory {
  id: string;
  name: string;
  nameTe?: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface FancyProduct {
  id: string;
  name: string;
  nameTe?: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price?: number | null;
  isPriceOnRequest: boolean;
  isAvailable: boolean;
  image: string;
  colors?: string;
  variants?: string;
  displayOrder: number;
  createdAt?: string;
}

export interface XeroxService {
  id: string;
  name: string;
  nameTe?: string;
  description: string;
  serviceType: 'xerox' | 'printing' | 'lamination';
  colorMode: 'bw' | 'color';
  sidedness: 'single' | 'double' | 'na';
  price?: number | null; // price per unit (page/copy/item)
  pricingUnit: string; // e.g., 'per page', 'per side', 'per document'
  isPriceOnRequest: boolean;
  isActive: boolean;
  image: string;
  displayOrder: number;
  createdAt?: string;
}

export interface XeroxCartConfig {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  colorMode: string;
  sidedness: string;
  pages: number;
  copies: number;
  laminationCount?: number;
  pricePerPage?: number | null;
  pricingUnit: string;
  isPriceOnRequest: boolean;
  instructions?: string;
  estimatedCost?: number | null;
}

export interface CartItem {
  cartItemId: string;
  type: 'stationery' | 'fancy' | 'xerox';
  productId?: string;
  name: string;
  nameTe?: string;
  categoryName?: string;
  image: string;
  quantity: number;
  price?: number | null;
  isPriceOnRequest: boolean;
  variants?: string;
  selectedColor?: string;
  xeroxDetails?: XeroxCartConfig;
}

export type OrderStatus = 'New Order' | 'Confirmed' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  type: 'stationery' | 'fancy' | 'xerox';
  quantity: number;
  price?: number | null;
  isPriceOnRequest: boolean;
  xeroxDetails?: XeroxCartConfig;
}

export interface Order {
  id?: string;
  orderDocId?: string;
  orderId: string;
  customerName: string;
  customerMobile: string;
  preference: 'Store Pickup' | 'Local Delivery';
  notes?: string;
  status: OrderStatus;
  items: CartItem[];
  totalAmount?: number | null;
  hasUnpricedItems: boolean;
  whatsappStatus: 'Pending' | 'Sent' | 'Failed';
  createdAt: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleTe?: string;
  caption: string;
  imageUrl: string;
  category: 'shop' | 'xerox' | 'stationery' | 'fancy' | 'festival';
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface Offer {
  id: string;
  title: string;
  titleTe?: string;
  description: string;
  imageUrl: string;
  discountBadge: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: string;
}
