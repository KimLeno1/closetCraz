
import { Product } from './types';

export interface Editorial {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  image: string;
  readTime: string;
  author: string;
}

export interface TrendReport {
  id: string;
  name: string;
  description: string;
  relevance: number; // 0-100 percentage
}

export const ARCHIVE_PRODUCTS: Product[] = [
  {
    id: 'a1',
    name: 'Void Parallel Parka',
    description: 'Triple-phase technical silk architecture integrated with internal thermal regulators and bio-adaptive ventilation matrices.',
    statement: 'Command the atmosphere.',
    price: 2400,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1544022613-e87cd75a7846?q=80&w=1000&auto=format&fit=crop',
    mood: 'Bold',
    scarcityCount: 1,
    socialCount: 12,
    fitConfidence: 98,
    category: 'Outerwear',
    styleTag: 'Cyberpunk',
    emotionTag: 'Intimidation',
    isPreOrder: true
  },
  {
    id: 'a2',
    name: 'Symmetry Glass Heel',
    description: 'Optically clear acrylic foundation reinforced with titanium struts, supporting a translucent hide-membrane for absolute structural transparency.',
    statement: 'Structural invisibility.',
    price: 1850,
    originalPrice: 2600,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    mood: 'Luxe',
    scarcityCount: 2,
    socialCount: 88,
    fitConfidence: 85,
    category: 'Footwear',
    styleTag: 'Avant-Garde',
    emotionTag: 'Allure',
    isPreOrder: true
  },
  {
    id: 'a3',
    name: 'Looming Shadow Cloak',
    description: 'An ultra-dense obsidian wool weave engineered to trap 99.8% of photons, effectively creating a mobile zone of environmental occlusion.',
    statement: 'Silence the spectrum.',
    price: 3100,
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1539109132314-3477524c7d4a?q=80&w=1000&auto=format&fit=crop',
    mood: 'Luxe',
    scarcityCount: 1,
    socialCount: 45,
    fitConfidence: 99,
    category: 'Outerwear',
    styleTag: 'Minimal',
    emotionTag: 'Serenity',
    isPreOrder: true
  }
];

export const EDITORIALS: Editorial[] = [
  {
    id: 'ed1',
    title: 'The Architecture of Silence',
    subtitle: 'Minimalist silhouettes for the new era.',
    excerpt: 'In a world of noise, the loudest statement is the one left unsaid. We explore the rise of brutalist tailoring and silent luxury.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop',
    readTime: '4 min',
    author: 'V. Sterling'
  },
  {
    id: 'ed2',
    title: 'Synthetic Identity',
    subtitle: 'Digital twins and tactile fabrics.',
    excerpt: 'As our lives move further into the ether, the importance of weight and texture becomes paramount. How fabric reconnects us.',
    image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1000&auto=format&fit=crop',
    readTime: '6 min',
    author: 'Elena Rossi'
  },
  {
    id: 'ed3',
    title: 'Vandalism as Art',
    subtitle: 'Deconstructed luxury and intentional wear.',
    excerpt: 'True luxury isn\'t pristine. It\'s lived in. We examine the rise of intentional aging and deconstruction in high-fashion.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    readTime: '5 min',
    author: 'Julian Thorne'
  },
  {
    id: 'ed4',
    title: 'Monochromatic Rebellion',
    subtitle: 'The power of a single tone.',
    excerpt: 'Stripping away color forces a confrontation with form. A deep dive into the psychology of the all-black wardrobe.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    readTime: '3 min',
    author: 'S. Koda'
  }
];

export const TREND_REPORTS: TrendReport[] = [
  {
    id: 'tr1',
    name: 'Neo-Brutalism',
    description: 'Sharp angles, concrete palettes, and uncompromising structures derived from architectural movements.',
    relevance: 94
  },
  {
    id: 'tr2',
    name: 'Ghost Tailoring',
    description: 'Deconstructed seams and semi-translucent layering that creates a phantom-like silhouette.',
    relevance: 78
  },
  {
    id: 'tr3',
    name: 'Utility Noir',
    description: 'High-function technical wear reimagined for evening status. Practicality meets absolute darkness.',
    relevance: 82
  },
  {
    id: 'tr4',
    name: 'Hyper-Fluidity',
    description: 'Oversized drapes and liquid-like fabrics that defy traditional gender-defined silhouettes.',
    relevance: 65
  },
  {
    id: 'tr5',
    name: 'Anarchist Luxe',
    description: 'Raw materials like untreated leather and distressed denim paired with high-jewelry accents.',
    relevance: 89
  }
];
