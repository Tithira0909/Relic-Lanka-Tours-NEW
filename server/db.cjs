const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./ceylon.db');

const initialTours = [
  {
    id: '1',
    title: 'The Royal Ceylon Journey',
    location: 'Kandy & Nuwara Eliya',
    price: 1200,
    days: 7,
    nights: 6,
    category: 'Culture',
    rating: 4.9,
    reviews: 124,
    image: 'https://picsum.photos/800/600?random=1',
    description: 'Experience the ancient kingdoms and misty tea plantations in a private luxury tour designed for the discerning traveler.',
    highlights: JSON.stringify(['Private Tea Tasting', 'Temple of the Tooth Relic', 'Scenic Train Ride', 'Luxury Boutique Stays']),
    inclusions: JSON.stringify(['Accommodation', 'Transport', 'Breakfast', 'Guide']),
    includedActivities: JSON.stringify(['Tea Tasting', 'Temple Visit']),
    destinations: JSON.stringify([
        { name: 'Kandy', description: 'Hill capital', image: 'https://picsum.photos/800/600?random=101' },
        { name: 'Nuwara Eliya', description: 'Little England', image: 'https://picsum.photos/800/600?random=102' }
    ]),
    activities: JSON.stringify([
        { name: 'Train Ride', image: 'https://picsum.photos/800/600?random=201' }
    ]),
    itinerary: JSON.stringify([
      { day: 1, title: 'Arrival in Colombo', description: 'VIP transfer to your boutique hotel. Evening city walk.' },
      { day: 2, title: 'Journey to Kandy', description: 'Visit the Elephant Orphanage en route to the hill capital.' },
      { day: 3, title: 'Sacred Temples', description: 'Exclusive morning ceremony access at the Temple of the Tooth.' },
      { day: 4, title: 'Tea Country', description: 'Scenic train ride to Nuwara Eliya through lush plantations.' },
      { day: 5, title: 'Little England', description: 'High tea at the Grand Hotel and Gregory Lake boat ride.' },
      { day: 6, title: 'Return to Coast', description: 'Drive down to the southern coast for a sunset beach dinner.' },
      { day: 7, title: 'Departure', description: 'Transfer to airport with souvenir shopping stop.' }
    ])
  },
  {
    id: '2',
    title: 'Wild Yala Safari',
    location: 'Yala National Park',
    price: 850,
    days: 4,
    nights: 3,
    category: 'Nature',
    rating: 4.8,
    reviews: 89,
    image: 'https://picsum.photos/800/600?random=2',
    description: 'Track leopards and elephants in their natural habitat while staying in eco-luxury glamping tents.',
    highlights: JSON.stringify(['4x4 Jeep Safari', 'Luxury Glamping', 'Bonfire Dinner', 'Bird Watching']),
    inclusions: JSON.stringify(['Camping', 'Jeep', 'All meals']),
    includedActivities: JSON.stringify(['Morning Safari', 'Evening Safari']),
    destinations: JSON.stringify([
        { name: 'Yala', description: 'National Park', image: 'https://picsum.photos/800/600?random=103' }
    ]),
    activities: JSON.stringify([
        { name: 'Safari', image: 'https://picsum.photos/800/600?random=202' }
    ]),
    itinerary: JSON.stringify([
      { day: 1, title: 'Arrival at Camp', description: 'Check into your luxury tent bordering the national park.' },
      { day: 2, title: 'Morning Safari', description: 'Early morning game drive to spot the elusive leopard.' },
      { day: 3, title: 'Evening Safari', description: 'Sunset safari near the watering holes.' },
      { day: 4, title: 'Departure', description: 'Breakfast in the bush and departure.' }
    ])
  },
  {
    id: '3',
    title: 'Southern Coast Retreat',
    location: 'Galle & Mirissa',
    price: 1500,
    days: 6,
    nights: 5,
    category: 'Luxury',
    rating: 5.0,
    reviews: 56,
    image: 'https://picsum.photos/800/600?random=3',
    description: 'Unwind on pristine beaches and explore the colonial charm of Galle Fort.',
    highlights: JSON.stringify(['Whale Watching', 'Private Villa', 'Galle Fort Tour', 'Seafood Gastronomy']),
    inclusions: JSON.stringify(['Villa', 'Transport', 'Breakfast']),
    includedActivities: JSON.stringify(['Whale Watching', 'Fort Tour']),
    destinations: JSON.stringify([
        { name: 'Galle', description: 'Historic Fort', image: 'https://picsum.photos/800/600?random=104' },
        { name: 'Mirissa', description: 'Beautiful Beach', image: 'https://picsum.photos/800/600?random=105' }
    ]),
    activities: JSON.stringify([
        { name: 'Whale Watching', image: 'https://picsum.photos/800/600?random=203' }
    ]),
    itinerary: JSON.stringify([
      { day: 1, title: 'Welcome to Galle', description: 'Check into your private beachfront villa.' },
      { day: 2, title: 'Fort History', description: 'Guided walking tour of the UNESCO World Heritage Galle Fort.' },
      { day: 3, title: 'Whale Watching', description: 'Private boat excursion to see Blue Whales.' },
      { day: 4, title: 'Beach Leisure', description: 'Relax at Unawatuna or Jungle Beach.' },
      { day: 5, title: 'Spice & Cinnamon', description: 'Visit a local cinnamon plantation.' },
      { day: 6, title: 'Departure', description: 'Transfer to Colombo.' }
    ])
  }
];

db.serialize(() => {
  // Users
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");

  // Tours
  db.run(`CREATE TABLE IF NOT EXISTS tours (
    id TEXT PRIMARY KEY,
    title TEXT,
    location TEXT,
    price INTEGER,
    days INTEGER,
    nights INTEGER,
    category TEXT,
    rating REAL,
    reviews INTEGER,
    image TEXT,
    description TEXT,
    highlights TEXT,
    inclusions TEXT,
    includedActivities TEXT,
    destinations TEXT,
    activities TEXT,
    itinerary TEXT
  )`);

  // Gallery
  db.run("CREATE TABLE IF NOT EXISTS gallery (id TEXT PRIMARY KEY, url TEXT, caption TEXT)");

  // Settings
  db.run("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)");

  // Seed Admin User
  const passwordHash = bcrypt.hashSync('admin123', 10);
  db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ['admin', passwordHash]);

  // Seed Tours
  const stmt = db.prepare("INSERT OR REPLACE INTO tours VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  initialTours.forEach(tour => {
    stmt.run(
        tour.id, tour.title, tour.location, tour.price, tour.days, tour.nights, tour.category, tour.rating, tour.reviews,
        tour.image, tour.description, tour.highlights, tour.inclusions, tour.includedActivities,
        tour.destinations, tour.activities, tour.itinerary
    );
  });
  stmt.finalize();

  // Seed Settings
  const settingsStmt = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  settingsStmt.run('whatsapp', '94771234567');
  settingsStmt.run('facebook', 'https://facebook.com');
  settingsStmt.run('instagram', 'https://instagram.com');
  settingsStmt.finalize();

  // Seed Gallery
  const galleryStmt = db.prepare("INSERT OR IGNORE INTO gallery (id, url, caption) VALUES (?, ?, ?)");
  galleryStmt.run('1', 'https://picsum.photos/800/600?random=20', 'Beautiful Sunset');
  galleryStmt.run('2', 'https://picsum.photos/800/600?random=21', 'Mountain View');
  galleryStmt.finalize();

  console.log("Database initialized and seeded.");
});

module.exports = db;
