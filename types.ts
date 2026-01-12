
export enum UserStatus {
  OBSERVER = 'Observer',
  INSIDER = 'Insider',
  TRENDSETTER = 'Trendsetter',
  ICON = 'Icon'
}

export type CategoryType = 'Apparel' | 'Outerwear' | 'Footwear' | 'Accessories' | 'Jewelry';
export type StyleType = 'Old Money' | 'Street' | 'Minimal' | 'Avant-Garde' | 'Cyberpunk' | 'Quiet Luxury';
export type EmotionType = 'Confidence' | 'Allure' | 'Intimidation' | 'Serenity' | 'Rebellion' | 'Euphoria';
export type ProductStatus = 'DEPLOYED' | 'ARCHIVED' | 'RESTRICTED';

export interface Product {
  id: string;
  name: string;
  description: string;
  statement: string;
  price: number;
  originalPrice?: number;
  image: string;
  mood: 'Bold' | 'Minimal' | 'Street' | 'Luxe';
  scarcityCount: number;
  socialCount: number;
  fitConfidence: number;
  category: CategoryType;
  styleTag: StyleType;
  emotionTag: EmotionType;
  isPreOrder?: boolean;
  // Synthetic Scarcity Fields
  isSurgeProtocol?: boolean;
  syntheticRequestCount?: number;
  lastMonthSales?: number;
  // Origin tracking
  origin?: 'admin' | 'supplier';
  supplierId?: string;
  status?: ProductStatus;
}

export interface EngagementRequest {
  id: string;
  type: 'BESPOKE' | 'SUPPLY';
  origin: string; // User handle or Studio name
  target?: string; // For bespoke, which item is being modified
  timestamp: string;
  status: 'PENDING' | 'AUTHORIZED' | 'PURGED' | 'FLAGGED';
  priority: 'CRITICAL' | 'STANDARD' | 'LOW';
  details: string;
}

export interface Supplier {
  id: string;
  name: string;
  region: string;
  specialty: string;
  status: 'OPERATIONAL' | 'RESTRICTED' | 'PENDING';
  resilienceScore: number;
  activeAssets: number;
  onboardedDate: string;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  points: number;
  diamonds: number;
  joinedDate: string;
  lastActive: string;
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'ALERT' | 'PROTOCOL' | 'STATUS';
  timestamp: string;
  read: boolean;
  targetTier?: UserStatus | 'ALL';
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  statement: string;
  products: Product[];
  price: number;
  originalPrice: number;
  image: string;
  tier: 'Core' | 'Elite' | 'Artifact';
}

export type OrderStatus = 'Processing' | 'Deployed' | 'Received' | 'Archived';

export interface Order {
  id: string;
  date: string;
  items: (Product | Bundle)[];
  total: number;
  status: OrderStatus;
  orderType: 'Standard' | 'Pre-order';
  pointsEarned: number;
}

export interface AppState {
  vault: Product[];
  cart: (Product | Bundle)[];
  status: UserStatus;
  points: number;
  diamonds: number;
  tickets: number;
  currentDropId: string;
}

export type View = 'landing' | 'auth' | 'home' | 'drops' | 'collections' | 'fit-finder' | 'vault' | 'profile' | 'product-detail' | 'orders' | 'cart' | 'famous-products' | 'try-on' | 'categories' | 'flash-sale' | 'game-room' | 'ensembles' | 'checkout' | 'custom-request' | 'admin' | 'admin-auth' | 'supply';
