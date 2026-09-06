export type SupportedLanguage = 'en' | 'te' | 'ta' | 'kn' | 'ml' | 'bn' | 'or';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export type UserRole = 'artisan' | 'customer' | 'b2b' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  craftSpecialty?: string;
  businessName?: string;
  avatarUrl?: string;
}

export interface ProductionCostBreakdown {
  materialCost: number | null;
  laborCost: number | null;
  packagingCost: number | null;
  otherCosts: number | null;
  totalProductionCost: number | null;
  isComplete: boolean;
}

export interface SuggestedPriceRange {
  min: number;
  max: number;
  recommendedPrice?: number;
  explanation: string;
  productionCost?: ProductionCostBreakdown;
  artisanCurrentPrice?: number | null;
  hasEnoughInfo?: boolean;
  missingInformationMessage?: string;
  costBreakdown?: {
    materials: number;
    laborHours: number;
    laborRate: number;
    craftSkillMultiplier: number;
    suggestedMargin: number;
  };
}

export interface Product {
  id: string;
  title: string;
  category: string;
  material: string;
  size?: string;
  price: number;
  suggestedPriceRange?: SuggestedPriceRange;
  description: string;
  teluguOriginal?: string;
  originalImageUrl: string;
  enhancedImageUrl: string;
  cutoutImageUrl?: string;
  backgroundStyle: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  craftType?: string;
  makingTime?: string;
  rawMaterialCost?: number;
  laborCost?: number;
  laborHours?: number;
  packagingCost?: number;
  otherProductionCost?: number;
  artisanCurrentPrice?: number;
  recommendedPrice?: number;
  status: 'published' | 'draft' | 'under_review';
  createdAt: string;
  stock: number;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  artisanIds: string[];
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'upi' | 'card' | 'cod';
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface B2BRequirement {
  id: string;
  buyerId: string;
  companyName: string;
  title: string;
  category: string;
  quantityNeeded: number;
  targetBudgetPerUnit: number;
  targetDeliveryDate: string;
  description: string;
  proposalsCount: number;
  status: 'open' | 'matched' | 'in_progress' | 'fulfilled';
  createdAt: string;
}

export type AIProcessingStage =
  | 'idle'
  | 'detecting'
  | 'segmenting'
  | 'refining_mask'
  | 'checking_components'
  | 'validating'
  | 'compositing'
  | 'complete'
  | 'refinement_needed';

export interface AIProcessingResult {
  success: boolean;
  originalUrl: string;
  cutoutUrl: string;
  finalUrl: string;
  backgroundStyle: string;
  completenessScore: number;
  detectedCategory?: string;
  detectedMaterial?: string;
  recommendedBackground?: string;
  error?: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  description: string;
  categoryFit: string[];
  previewUrl: string;
  type: 'studio' | 'nature' | 'heritage' | 'luxury' | 'beige' | 'lifestyle' | 'transparent';
  shadowBlur: number;
  shadowOpacity: number;
  shadowYOffset: number;
  renderBackground: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}
