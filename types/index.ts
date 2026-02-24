export type UserRole = 'customer' | 'partner';

export type ServiceCategory = 'laundry' | 'stitching';

export type PartnerType = 'laundry_store' | 'tailor' | 'designer' | 'delivery_rider';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  address?: string;
}

export interface LaundryStore {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  deliveryTime: string;
  address: string;
  isOpen: boolean;
  services: LaundryService[];
  tags: string[];
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  unit: string;
  icon: string;
}

export interface StitchingRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  title: string;
  description: string;
  outfitType: string;
  budget: number;
  images: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  bids: Bid[];
  deadline?: string;
}

export interface Bid {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerRating: number;
  price: number;
  daysToComplete: number;
  message: string;
  createdAt: string;
  isAccepted: boolean;
}

export interface Order {
  id: string;
  type: ServiceCategory;
  storeName: string;
  storeImage: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  storeId: string;
  storeName: string;
  serviceType: ServiceCategory;
}

// types/index.ts (add these to your existing types)

export interface Designer {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  speciality: string;
  rating: number;
  reviewCount: number;
  designCount: number;
  experience: string;
  location: string;
  bio: string;
  tags: string[];
  verified: boolean;
  email?: string;
  phone?: string;
}

export interface Design {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  category: string;
  subcategory?: string;
  tags: string[];
  designerId: string;
  designerName: string;
  designerAvatar: string;
  isTrending: boolean;
  isNew: boolean;
  likes: number;
  views: number;
  inquiries: number;
  status?: 'published' | 'draft';
  fabricType?: string;
  deliveryTime?: string;
}

export interface StudioDesign extends Design {
  status: 'published' | 'draft';
  views: number;
  inquiries: number;
  likes: number;
}
