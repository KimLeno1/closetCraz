
import { CategoryType, StyleType, EmotionType } from './types';

export interface CategoryDefinition {
  id: CategoryType;
  label: string;
  description: string;
}

export const MAIN_CATEGORIES: CategoryDefinition[] = [
  { id: 'Apparel', label: 'Apparel', description: 'Primary layers engineered for the human form.' },
  { id: 'Outerwear', label: 'Outerwear', description: 'Architectural shells for environmental dominance.' },
  { id: 'Footwear', label: 'Footwear', description: 'High-performance foundations for movement.' },
  { id: 'Accessories', label: 'Accessories', description: 'Tactical enhancements and technical carry.' },
  { id: 'Jewelry', label: 'Jewelry', description: 'Status markers and precious metal artifacts.' },
];

export const STYLE_LENSES: { id: StyleType; label: string }[] = [
  { id: 'Old Money', label: 'Old Money' },
  { id: 'Quiet Luxury', label: 'Quiet Luxury' },
  { id: 'Street', label: 'Streetwear' },
  { id: 'Minimal', label: 'Minimalist' },
  { id: 'Avant-Garde', label: 'Avant-Garde' },
  { id: 'Cyberpunk', label: 'Cyberpunk' },
];

export const EMOTION_LENSES: { id: EmotionType; label: string }[] = [
  { id: 'Confidence', label: 'Confidence' },
  { id: 'Allure', label: 'Allure' },
  { id: 'Intimidation', label: 'Intimidation' },
  { id: 'Serenity', label: 'Serenity' },
  { id: 'Rebellion', label: 'Rebellion' },
  { id: 'Euphoria', label: 'Euphoria' },
];
