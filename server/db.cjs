const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../ceylon.db');
const db = new sqlite3.Database(dbPath);

const init = () => {
    db.serialize(() => {
        // Users
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);

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
        db.run(`CREATE TABLE IF NOT EXISTS gallery (
            id TEXT PRIMARY KEY,
            url TEXT,
            caption TEXT
        )`);

        // Map Pins
        db.run(`CREATE TABLE IF NOT EXISTS map_pins (
            id TEXT PRIMARY KEY,
            name TEXT,
            description TEXT,
            image TEXT,
            x REAL,
            y REAL
        )`);

        // Settings
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            settings_key TEXT PRIMARY KEY,
            value TEXT
        )`);

        // Seed Settings
        db.get("SELECT count(*) as count FROM settings", [], (err, row) => {
             if (row && row.count === 0) {
                 const settings = {
                    whatsapp: '94771234567',
                    facebook: 'https://facebook.com/reliclankatours',
                    instagram: 'https://instagram.com/reliclankatours',
                    youtube: 'https://youtube.com/reliclankatours'
                };
                const stmt = db.prepare("INSERT INTO settings (settings_key, value) VALUES (?, ?)");
                for (const [key, value] of Object.entries(settings)) {
                    stmt.run(key, value);
                }
                stmt.finalize();
                console.log("Settings seeded.");
             }
        });

        // Seed Admin
        db.get("SELECT * FROM users WHERE username = ?", ["admin"], (err, row) => {
            if (!row) {
                const hash = bcrypt.hashSync("admin123", 10);
                db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", hash]);
                console.log("Admin user created (admin/admin123)");
            }
        });

        // Seed Initial Data (Optional - check if tours exist)
        db.get("SELECT count(*) as count FROM tours", [], (err, row) => {
            if (row && row.count === 0) {
                 const initialTour = {
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
                };

                const t = initialTour;
                db.run(`INSERT INTO tours VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    t.id, t.title, t.location, t.price, t.days, t.nights, t.category, t.rating, t.reviews,
                    t.image, t.description, t.highlights, t.inclusions, t.includedActivities,
                    t.destinations, t.activities, t.itinerary
                ]);
                console.log("Initial tour seeded.");
            }
        });
    });
    console.log('SQLite Database initialized.');
};

const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        const command = sql.trim().toUpperCase().split(' ')[0];

        if (command === 'SELECT') {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        } else {
            // Check for INSERT ... ON DUPLICATE KEY UPDATE (MySQL syntax)
            // SQLite uses INSERT OR REPLACE or ON CONFLICT
            if (sql.includes('ON DUPLICATE KEY UPDATE')) {
                // Crude translation for settings table specifically
                // "INSERT INTO settings (settings_key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?"
                // SQLite: "INSERT OR REPLACE INTO settings (settings_key, value) VALUES (?, ?)"
                if (sql.includes('settings')) {
                    const newSql = "INSERT OR REPLACE INTO settings (settings_key, value) VALUES (?, ?)";
                    // Params are [key, value, value]. We need [key, value]
                    const newParams = [params[0], params[1]];

                    db.run(newSql, newParams, function(err) {
                        if (err) reject(err);
                        else resolve({ affectedRows: this.changes, insertId: this.lastID });
                    });
                    return;
                }
            }

            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ affectedRows: this.changes, insertId: this.lastID });
            });
        }
    });
};

module.exports = { init, query };
