const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db.cjs');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'supersecretkey'; // In production, use environment variable

app.use(cors());
app.use(bodyParser.json());

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
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).send(err.message);
    if (!user) return res.status(400).send('User not found');

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

// -- Tours --

// Get All Tours
app.get('/api/tours', (req, res) => {
  db.all("SELECT * FROM tours", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse JSON fields
    const tours = rows.map(row => ({
        ...row,
        highlights: JSON.parse(row.highlights),
        inclusions: JSON.parse(row.inclusions),
        includedActivities: JSON.parse(row.includedActivities),
        destinations: JSON.parse(row.destinations),
        activities: JSON.parse(row.activities),
        itinerary: JSON.parse(row.itinerary)
    }));
    res.json(tours);
  });
});

// Create Tour (Protected)
app.post('/api/tours', authenticateToken, (req, res) => {
  const t = req.body;
  const stmt = db.prepare(`INSERT INTO tours VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  try {
      stmt.run(
        t.id, t.title, t.location, t.price, t.days, t.nights, t.category, t.rating || 5, t.reviews || 0,
        t.image, t.description,
        JSON.stringify(t.highlights || []),
        JSON.stringify(t.inclusions || []),
        JSON.stringify(t.includedActivities || []),
        JSON.stringify(t.destinations || []),
        JSON.stringify(t.activities || []),
        JSON.stringify(t.itinerary || [])
      );
      stmt.finalize();
      res.status(201).json(t);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Update Tour (Protected)
app.put('/api/tours/:id', authenticateToken, (req, res) => {
  const t = req.body;
  const { id } = req.params;

  const sql = `UPDATE tours SET
    title = ?, location = ?, price = ?, days = ?, nights = ?, category = ?,
    image = ?, description = ?, highlights = ?, inclusions = ?,
    includedActivities = ?, destinations = ?, activities = ?, itinerary = ?
    WHERE id = ?`;

  db.run(sql, [
    t.title, t.location, t.price, t.days, t.nights, t.category,
    t.image, t.description,
    JSON.stringify(t.highlights || []),
    JSON.stringify(t.inclusions || []),
    JSON.stringify(t.includedActivities || []),
    JSON.stringify(t.destinations || []),
    JSON.stringify(t.activities || []),
    JSON.stringify(t.itinerary || []),
    id
  ], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Tour updated", changes: this.changes });
  });
});

// Delete Tour (Protected)
app.delete('/api/tours/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tours WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Tour deleted", changes: this.changes });
    });
});

// -- Gallery --

app.get('/api/gallery', (req, res) => {
    db.all("SELECT * FROM gallery", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/gallery', authenticateToken, (req, res) => {
    const { id, url, caption } = req.body;
    db.run("INSERT INTO gallery (id, url, caption) VALUES (?, ?, ?)", [id, url, caption], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id, url, caption });
    });
});

app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM gallery WHERE id = ?", req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Image deleted" });
    });
});

// -- Settings --

app.get('/api/settings', (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const settings = {};
        rows.forEach(row => settings[row.key] = row.value);
        res.json(settings);
    });
});

app.post('/api/settings', authenticateToken, (req, res) => {
    const settings = req.body; // Expect { key: value, key2: value2 }
    const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");

    Object.keys(settings).forEach(key => {
        stmt.run(key, settings[key]);
    });
    stmt.finalize();
    res.json({ message: "Settings updated" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
