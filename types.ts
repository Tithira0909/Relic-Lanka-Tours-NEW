export interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  days: number;
  category: 'Nature' | 'Culture' | 'Luxury' | 'Adventure';
  rating: number;
  reviews: number;
  image: string;
  description: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
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