export interface TourDestination {
  name: string;
  description: string;
  image: string;
}

export interface TourActivity {
  name: string;
  image: string;
}

export interface HotelOption {
  name: string;
  image: string;
}

export interface Tour {
  id: string;
  title: string;
  location: string;
  price: number; // Base Adult Price
  price_child?: number; // Base Child Price
  price_luxury?: number;
  price_semi_luxury?: number;
  days: number;
  nights: number;
  category: 'Nature' | 'Culture' | 'Luxury' | 'Adventure';
  rating: number;
  reviews: number;
  image: string;
  video_url?: string;
  description: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string; images?: string[] }[];
  inclusions: string[];
  includedActivities: string[];
  destinations: TourDestination[];
  activities: TourActivity[];
  hotels_luxury?: HotelOption[];
  hotels_semi_luxury?: HotelOption[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: { x: number; y: number }; // Percentage for map placement
}

export interface FilterState {
  search: string;
  region: string;
  duration: string;
  budget: string;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  whatsapp: string; // Phone number for WhatsApp
  twitter?: string;
  youtube?: string;
  wechat_id?: string;
  wechat_qr?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface AppData {
  tours: Tour[];
  socialMedia: SocialMedia;
  gallery: GalleryImage[];
  heroImages: string[];
  whyChooseUsImages: string[];
  adventureBanner?: string;
}
