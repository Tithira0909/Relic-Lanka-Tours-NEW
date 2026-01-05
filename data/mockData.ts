import { Tour, Testimonial, Region } from '../types';

export const TOURS: Tour[] = [
  {
    id: '1',
    title: 'The Royal Ceylon Journey',
    location: 'Kandy & Nuwara Eliya',
    price: 1200,
    days: 7,
    category: 'Culture',
    rating: 4.9,
    reviews: 124,
    image: 'https://picsum.photos/800/600?random=1',
    description: 'Experience the ancient kingdoms and misty tea plantations in a private luxury tour designed for the discerning traveler.',
    highlights: ['Private Tea Tasting', 'Temple of the Tooth Relic', 'Scenic Train Ride', 'Luxury Boutique Stays'],
    inclusions: ['Accommodation', 'Transport', 'Breakfast', 'Guide'],
    includedActivities: ['Tea Tasting', 'Temple Visit'],
    destinations: [
        { name: 'Kandy', description: 'Hill capital', image: 'https://picsum.photos/800/600?random=101' },
        { name: 'Nuwara Eliya', description: 'Little England', image: 'https://picsum.photos/800/600?random=102' }
    ],
    activities: [
        { name: 'Train Ride', image: 'https://picsum.photos/800/600?random=201' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Colombo', description: 'VIP transfer to your boutique hotel. Evening city walk.' },
      { day: 2, title: 'Journey to Kandy', description: 'Visit the Elephant Orphanage en route to the hill capital.' },
      { day: 3, title: 'Sacred Temples', description: 'Exclusive morning ceremony access at the Temple of the Tooth.' },
      { day: 4, title: 'Tea Country', description: 'Scenic train ride to Nuwara Eliya through lush plantations.' },
      { day: 5, title: 'Little England', description: 'High tea at the Grand Hotel and Gregory Lake boat ride.' },
      { day: 6, title: 'Return to Coast', description: 'Drive down to the southern coast for a sunset beach dinner.' },
      { day: 7, title: 'Departure', description: 'Transfer to airport with souvenir shopping stop.' }
    ]
  },
  {
    id: '2',
    title: 'Wild Yala Safari',
    location: 'Yala National Park',
    price: 850,
    days: 4,
    category: 'Nature',
    rating: 4.8,
    reviews: 89,
    image: 'https://picsum.photos/800/600?random=2',
    description: 'Track leopards and elephants in their natural habitat while staying in eco-luxury glamping tents.',
    highlights: ['4x4 Jeep Safari', 'Luxury Glamping', 'Bonfire Dinner', 'Bird Watching'],
    inclusions: ['Camping', 'Jeep', 'All meals'],
    includedActivities: ['Morning Safari', 'Evening Safari'],
    destinations: [
        { name: 'Yala', description: 'National Park', image: 'https://picsum.photos/800/600?random=103' }
    ],
    activities: [
        { name: 'Safari', image: 'https://picsum.photos/800/600?random=202' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival at Camp', description: 'Check into your luxury tent bordering the national park.' },
      { day: 2, title: 'Morning Safari', description: 'Early morning game drive to spot the elusive leopard.' },
      { day: 3, title: 'Evening Safari', description: 'Sunset safari near the watering holes.' },
      { day: 4, title: 'Departure', description: 'Breakfast in the bush and departure.' }
    ]
  },
  {
    id: '3',
    title: 'Southern Coast Retreat',
    location: 'Galle & Mirissa',
    price: 1500,
    days: 6,
    category: 'Luxury',
    rating: 5.0,
    reviews: 56,
    image: 'https://picsum.photos/800/600?random=3',
    description: 'Unwind on pristine beaches and explore the colonial charm of Galle Fort.',
    highlights: ['Whale Watching', 'Private Villa', 'Galle Fort Tour', 'Seafood Gastronomy'],
    inclusions: ['Villa', 'Transport', 'Breakfast'],
    includedActivities: ['Whale Watching', 'Fort Tour'],
    destinations: [
        { name: 'Galle', description: 'Historic Fort', image: 'https://picsum.photos/800/600?random=104' },
        { name: 'Mirissa', description: 'Beautiful Beach', image: 'https://picsum.photos/800/600?random=105' }
    ],
    activities: [
        { name: 'Whale Watching', image: 'https://picsum.photos/800/600?random=203' }
    ],
    itinerary: [
      { day: 1, title: 'Welcome to Galle', description: 'Check into your private beachfront villa.' },
      { day: 2, title: 'Fort History', description: 'Guided walking tour of the UNESCO World Heritage Galle Fort.' },
      { day: 3, title: 'Whale Watching', description: 'Private boat excursion to see Blue Whales.' },
      { day: 4, title: 'Beach Leisure', description: 'Relax at Unawatuna or Jungle Beach.' },
      { day: 5, title: 'Spice & Cinnamon', description: 'Visit a local cinnamon plantation.' },
      { day: 6, title: 'Departure', description: 'Transfer to Colombo.' }
    ]
  },
  {
    id: '4',
    title: 'Sigiriya Adventure',
    location: 'Sigiriya & Dambulla',
    price: 600,
    days: 3,
    category: 'Adventure',
    rating: 4.7,
    reviews: 210,
    image: 'https://picsum.photos/800/600?random=4',
    description: 'Climb the Lion Rock fortress and explore ancient cave temples.',
    highlights: ['Sigiriya Rock Climb', 'Dambulla Cave Temple', 'Village Safari', 'Hot Air Ballooning'],
    inclusions: ['Hotel', 'Transport', 'Tickets'],
    includedActivities: ['Rock Climb', 'Cave Temple'],
    destinations: [
        { name: 'Sigiriya', description: 'Rock Fortress', image: 'https://picsum.photos/800/600?random=106' },
        { name: 'Dambulla', description: 'Cave Temple', image: 'https://picsum.photos/800/600?random=107' }
    ],
    activities: [
        { name: 'Climbing', image: 'https://picsum.photos/800/600?random=204' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Transfer to Sigiriya and evening village walk.' },
      { day: 2, title: 'The Climb', description: 'Early morning climb of Sigiriya Rock Fortress.' },
      { day: 3, title: 'Caves & Departure', description: 'Visit Dambulla Caves before heading back.' }
    ]
  },
    {
    id: '5',
    title: 'Ella Odyssey',
    location: 'Ella',
    price: 750,
    days: 4,
    category: 'Nature',
    rating: 4.8,
    reviews: 145,
    image: 'https://picsum.photos/800/600?random=5',
    description: 'Hiking, waterfalls, and breathtaking views in the hill country.',
    highlights: ['Nine Arch Bridge', 'Little Adams Peak', 'Ravana Falls', 'Cooking Class'],
    inclusions: ['Hotel', 'Transport', 'Breakfast'],
    includedActivities: ['Hiking', 'Cooking Class'],
    destinations: [
        { name: 'Ella', description: 'Scenic Hills', image: 'https://picsum.photos/800/600?random=108' }
    ],
    activities: [
        { name: 'Hiking', image: 'https://picsum.photos/800/600?random=205' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Ella', description: 'Check in to a hotel with a view of the Gap.' },
      { day: 2, title: 'Nine Arch Bridge', description: 'Morning hike to the famous bridge.' },
      { day: 3, title: 'Hiking Day', description: 'Little Adams Peak and Ella Rock.' },
      { day: 4, title: 'Departure', description: 'Visit waterfalls on the way out.' }
    ]
  },
  {
    id: '6',
    title: 'Cultural Triangle Grand',
    location: 'Anuradhapura & Polonnaruwa',
    price: 1100,
    days: 5,
    category: 'Culture',
    rating: 4.6,
    reviews: 78,
    image: 'https://picsum.photos/800/600?random=6',
    description: 'A deep dive into the ancient history and ruins of Sri Lanka.',
    highlights: ['Ancient Ruins', 'Bike Tours', 'Lake Sunset', 'Authentic Cuisine'],
    inclusions: ['Hotel', 'Transport', 'Tickets', 'Breakfast'],
    includedActivities: ['Ruins Tour', 'Bike Ride'],
    destinations: [
        { name: 'Anuradhapura', description: 'Ancient City', image: 'https://picsum.photos/800/600?random=109' },
        { name: 'Polonnaruwa', description: 'Medieval City', image: 'https://picsum.photos/800/600?random=110' }
    ],
    activities: [
        { name: 'Bike Tour', image: 'https://picsum.photos/800/600?random=206' }
    ],
    itinerary: [
      { day: 1, title: 'Anuradhapura', description: 'Explore the first capital of ancient Sri Lanka.' },
      { day: 2, title: 'Mihintale', description: 'Visit the cradle of Buddhism in Sri Lanka.' },
      { day: 3, title: 'Polonnaruwa', description: 'Bike tour through the medieval capital.' },
      { day: 4, title: 'Minneriya Safari', description: 'See the gathering of elephants.' },
      { day: 5, title: 'Departure', description: 'Transfer back to Colombo.' }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Eleanor Fant',
    role: 'Travel Photographer',
    text: "The most seamless travel experience I've ever had. Every detail was curated to perfection, from the boutique hotels to the private guides.",
    avatar: 'https://picsum.photos/100/100?random=10'
  },
  {
    id: '2',
    name: 'James Chen',
    role: 'Architect',
    text: "Sri Lanka's architecture is stunning, and this team knew exactly where to take me. The mixture of Bawa's modernism and ancient ruins was inspiring.",
    avatar: 'https://picsum.photos/100/100?random=11'
  },
  {
    id: '3',
    name: 'Sarah & Tom',
    role: 'Honeymooners',
    text: "A magical getaway. The private beach dinner in Mirissa was a highlight we will never forget. Highly recommended for couples.",
    avatar: 'https://picsum.photos/100/100?random=12'
  }
];

export const REGIONS: Region[] = [
  { id: '1', name: 'Colombo', description: 'Urban & Vibrant', image: '', coordinates: { x: 20, y: 65 } },
  { id: '2', name: 'Kandy', description: 'Cultural Heart', image: '', coordinates: { x: 45, y: 55 } },
  { id: '3', name: 'Galle', description: 'Colonial Charm', image: '', coordinates: { x: 30, y: 85 } },
  { id: '4', name: 'Sigiriya', description: 'Ancient Rock', image: '', coordinates: { x: 50, y: 40 } },
  { id: '5', name: 'Ella', description: 'Misty Hills', image: '', coordinates: { x: 60, y: 65 } },
  { id: '6', name: 'Yala', description: 'Wildlife Safari', image: '', coordinates: { x: 75, y: 80 } },
];
