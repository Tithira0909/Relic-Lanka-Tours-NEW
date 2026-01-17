const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ceylon_travel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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
    // ... add other tours similarly if needed
  ];

// Initialize DB Function
const initDB = async () => {
    try {
        const connection = await pool.getConnection();

        // Users
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);

        // Tours
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tours (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255),
                location VARCHAR(255),
                price INT,
                days INT,
                nights INT,
                category VARCHAR(50),
                rating FLOAT,
                reviews INT,
                image TEXT,
                description TEXT,
                highlights JSON,
                inclusions JSON,
                includedActivities JSON,
                destinations JSON,
                activities JSON,
                itinerary JSON
            )
        `);

        // Gallery
        await connection.query(`
            CREATE TABLE IF NOT EXISTS gallery (
                id VARCHAR(255) PRIMARY KEY,
                url TEXT,
                caption TEXT
            )
        `);

        // Settings
        await connection.query(`
            CREATE TABLE IF NOT EXISTS settings (
                settings_key VARCHAR(255) PRIMARY KEY,
                value TEXT
            )
        `);

        // Seed Admin (Check if exists first)
        const [users] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
        if (users.length === 0) {
             // Hash logic would be here, but we assume called from main app or separate seeder
             // For now we skip insert here to avoid cyclic dependency on bcrypt if strictly db file
             console.log('Admin user check complete (create via seeder if missing).');
        }

        connection.release();
        console.log("MySQL Database Initialized.");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

// Wrapper to mimic sqlite interface slightly for easier refactoring
const db = {
    query: async (sql, params) => {
        const [results] = await pool.execute(sql, params);
        return results;
    },
    init: initDB,
    pool: pool
};

module.exports = db;
