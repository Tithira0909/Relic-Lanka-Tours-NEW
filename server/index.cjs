const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * DATABASE CONFIGURATION
 *
 * By default, this application uses SQLite for ease of setup and testing.
 * To use MySQL:
 * 1. Ensure you have a MySQL server running and a database created.
 * 2. Configure the .env file with DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.
 * 3. Comment out `const db = require('./db.cjs');`
 * 4. Uncomment `const db = require('./db_mysql.cjs');`
 */
const db = require('./db.cjs'); // SQLite
// const db = require('./db_mysql.cjs'); // MySQL

const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Initialize DB
if (db.init) {
    db.init();
}

app.use(cors());
app.use(bodyParser.json());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const users = await db.query("SELECT * FROM users WHERE username = ?", [username]);
      const user = users[0];

      if (!user) return res.status(400).send('User not found');

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) return res.status(400).send('Invalid password');

      const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
  } catch (err) {
      res.status(500).send(err.message);
  }
});

// Upload Route
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Return relative URL for the frontend
    const imageUrl = `/api/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// Proxy logic on frontend redirects /api/uploads to /uploads here if configured,
// OR we serve at /api/uploads if we want consistency.
// Let's serve static files at /api/uploads to match the return URL logic easily
// But wait, express static usually serves from root.
// If I use `app.use('/api/uploads', express.static(...))` it works.
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


// -- Tours --

// Get All Tours
app.get('/api/tours', async (req, res) => {
  try {
      const rows = await db.query("SELECT * FROM tours");
      const tours = rows.map(row => ({
            ...row,
            highlights: typeof row.highlights === 'string' ? JSON.parse(row.highlights) : row.highlights,
            inclusions: typeof row.inclusions === 'string' ? JSON.parse(row.inclusions) : row.inclusions,
            includedActivities: typeof row.includedActivities === 'string' ? JSON.parse(row.includedActivities) : row.includedActivities,
            destinations: typeof row.destinations === 'string' ? JSON.parse(row.destinations) : row.destinations,
            activities: typeof row.activities === 'string' ? JSON.parse(row.activities) : row.activities,
            itinerary: typeof row.itinerary === 'string' ? JSON.parse(row.itinerary) : row.itinerary
      }));
      res.json(tours);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Create Tour (Protected)
app.post('/api/tours', authenticateToken, async (req, res) => {
  const t = req.body;
  const sql = `INSERT INTO tours VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
      await db.query(sql, [
        t.id, t.title, t.location, t.price, t.days, t.nights, t.category, t.rating || 5, t.reviews || 0,
        t.image, t.description,
        JSON.stringify(t.highlights || []),
        JSON.stringify(t.inclusions || []),
        JSON.stringify(t.includedActivities || []),
        JSON.stringify(t.destinations || []),
        JSON.stringify(t.activities || []),
        JSON.stringify(t.itinerary || [])
      ]);
      res.status(201).json(t);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Update Tour (Protected)
app.put('/api/tours/:id', authenticateToken, async (req, res) => {
  const t = req.body;
  const { id } = req.params;

  const sql = `UPDATE tours SET
    title = ?, location = ?, price = ?, days = ?, nights = ?, category = ?,
    image = ?, description = ?, highlights = ?, inclusions = ?,
    includedActivities = ?, destinations = ?, activities = ?, itinerary = ?
    WHERE id = ?`;

  try {
      const result = await db.query(sql, [
        t.title, t.location, t.price, t.days, t.nights, t.category,
        t.image, t.description,
        JSON.stringify(t.highlights || []),
        JSON.stringify(t.inclusions || []),
        JSON.stringify(t.includedActivities || []),
        JSON.stringify(t.destinations || []),
        JSON.stringify(t.activities || []),
        JSON.stringify(t.itinerary || []),
        id
      ]);
      res.json({ message: "Tour updated", changes: result.affectedRows });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Delete Tour (Protected)
app.delete('/api/tours/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("DELETE FROM tours WHERE id = ?", [id]);
        res.json({ message: "Tour deleted", changes: result.affectedRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -- Gallery --

app.get('/api/gallery', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM gallery");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/gallery', authenticateToken, async (req, res) => {
    const { id, url, caption } = req.body;
    try {
        await db.query("INSERT INTO gallery (id, url, caption) VALUES (?, ?, ?)", [id, url, caption]);
        res.status(201).json({ id, url, caption });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM gallery WHERE id = ?", [req.params.id]);
        res.json({ message: "Image deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -- Settings --

app.get('/api/settings', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM settings");
        const settings = {};
        rows.forEach(row => settings[row.settings_key] = row.value);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
    const settings = req.body;
    try {
        // MySQL REPLACE INTO syntax works if primary key exists
        // Or ON DUPLICATE KEY UPDATE
        for (const key of Object.keys(settings)) {
            await db.query(
                "INSERT INTO settings (settings_key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?",
                [key, settings[key], settings[key]]
            );
        }
        res.json({ message: "Settings updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -- Map Pins --

app.get('/api/map_pins', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM map_pins");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/map_pins', authenticateToken, async (req, res) => {
    const { id, name, description, image, x, y } = req.body;
    try {
        await db.query("INSERT INTO map_pins (id, name, description, image, x, y) VALUES (?, ?, ?, ?, ?, ?)",
            [id, name, description, image, x, y]);
        res.status(201).json({ id, name, description, image, x, y });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/map_pins/:id', authenticateToken, async (req, res) => {
    const { name, description, image, x, y } = req.body;
    const { id } = req.params;
    try {
        await db.query("UPDATE map_pins SET name = ?, description = ?, image = ?, x = ?, y = ? WHERE id = ?",
            [name, description, image, x, y, id]);
        res.json({ message: "Map pin updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/map_pins/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM map_pins WHERE id = ?", [req.params.id]);
        res.json({ message: "Map pin deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// -- Reviews --

// Public: Get Approved Reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM reviews WHERE status = 'approved' ORDER BY date DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public: Submit Review
app.post('/api/reviews', upload.single('image'), async (req, res) => {
    const { name, role, rating, comment } = req.body;
    // req.file might be undefined if no image uploaded
    const image = req.file ? `/api/uploads/${req.file.filename}` : '';
    const id = Date.now().toString();
    const date = new Date().toISOString();
    const status = 'pending';

    try {
        await db.query("INSERT INTO reviews (id, name, role, rating, comment, image, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [id, name, role, rating, comment, image, status, date]);
        res.status(201).json({ message: "Review submitted for approval" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get All Reviews
app.get('/api/admin/reviews', authenticateToken, async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM reviews ORDER BY date DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update Review Status
app.put('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        await db.query("UPDATE reviews SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Review status updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete Review
app.delete('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);
        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
