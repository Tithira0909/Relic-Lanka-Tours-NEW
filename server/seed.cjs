const db = require('./db_mysql.cjs');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Connect to DB and run seed
const seed = async () => {
    try {
        console.log('Seeding Database...');
        await db.init();

        // 1. Seed Admin User
        const passwordHash = bcrypt.hashSync('admin123', 10);
        // Using INSERT IGNORE or ON DUPLICATE KEY UPDATE to avoid errors if exists
        await db.query(`
            INSERT INTO users (username, password)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE password = ?
        `, ['admin', passwordHash, passwordHash]);
        console.log('Admin user seeded (admin/admin123).');

        // 2. Seed Initial Tours
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
            // Add more mock tours here if desired, for brevity keeping one example
        ];

        for (const t of initialTours) {
            await db.query(`
                INSERT INTO tours (id, title, location, price, days, nights, category, rating, reviews, image, description, highlights, inclusions, includedActivities, destinations, activities, itinerary)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE title = VALUES(title)
            `, [
                t.id, t.title, t.location, t.price, t.days, t.nights, t.category, t.rating, t.reviews,
                t.image, t.description,
                JSON.stringify(t.highlights),
                JSON.stringify(t.inclusions),
                JSON.stringify(t.includedActivities),
                JSON.stringify(t.destinations),
                JSON.stringify(t.activities),
                JSON.stringify(t.itinerary)
            ]);
        }
        console.log('Initial tours seeded.');

        // 3. Seed Settings
        const settings = {
            whatsapp: '94771234567',
            facebook: 'https://facebook.com/reliclankatours',
            instagram: 'https://instagram.com/reliclankatours',
            youtube: 'https://youtube.com/reliclankatours'
        };

        for (const [key, value] of Object.entries(settings)) {
            await db.query(`
                INSERT INTO settings (settings_key, value) VALUES (?, ?)
                ON DUPLICATE KEY UPDATE value = ?
            `, [key, value, value]);
        }
        console.log('Settings seeded.');

        console.log('Seeding complete. Press Ctrl+C to exit if this doesn\'t close automatically.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
