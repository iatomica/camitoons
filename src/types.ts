export interface Artwork {
  id: string;
  title: string;
  category: 'personajes' | 'fantasia' | 'infantil' | 'fanart' | 'concept' | 'bocetos';
  categoryLabel: string;
  description: string;
  imageUrl: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  tags: string[];
  year: number;
  client?: string;
  softwareUsed: string[];
  likesCount: number;
  viewsCount: number;
  isFeatured?: boolean;
  story?: string;
  colorPalette?: string[];
}

export interface CommissionOption {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDays: number;
  imageSample: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'artstation' | 'twitter';
  username: string;
  handle: string;
  avatarUrl: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  postUrl: string;
  videoPreview?: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  country: string;
  avatarUrl: string;
  text: string;
  rating: number;
  projectType: string;
}

export interface CommissionQuote {
  type: string;
  style: string;
  background: string;
  extraCharacters: number;
  commercialUse: boolean;
  expressDelivery: boolean;
  estimatedPrice: number;
  estimatedDays: number;
}
