
import { Bundle } from './types';
import { PRODUCTS } from './constants';
import { ARCHIVE_PRODUCTS } from './extraMockData';

export const BUNDLES: Bundle[] = [
  {
    id: 'b1',
    name: 'The Midnight Architect',
    description: 'A complete silhouette transformation focused on structural dominance and shadow absorption.',
    statement: 'Master the void through form.',
    products: [PRODUCTS[0], PRODUCTS[2], PRODUCTS[3]], // Coat, Trousers, Boots
    originalPrice: 1980,
    price: 1550,
    image: 'https://images.unsplash.com/photo-1514332962725-728929944445?q=80&w=2070&auto=format&fit=crop',
    tier: 'Elite'
  },
  {
    id: 'b2',
    name: 'Neural Insurgent Set',
    description: 'High-tech optics paired with archival outerwear for the modern ghost.',
    statement: 'Visibility is a liability.',
    products: [PRODUCTS[4], ARCHIVE_PRODUCTS[0]], // Goggles, Parka
    originalPrice: 3600,
    price: 2900,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop',
    tier: 'Artifact'
  },
  {
    id: 'b3',
    name: 'Quiet Luxury Core',
    description: 'Essential status markers focusing on texture and material integrity.',
    statement: 'Loud presence. Silent price.',
    products: [PRODUCTS[1], PRODUCTS[5]], // Sweater, Ring
    originalPrice: 870,
    price: 680,
    image: 'https://images.unsplash.com/photo-1539109132314-3477524c7d4a?q=80&w=2070&auto=format&fit=crop',
    tier: 'Core'
  }
];
