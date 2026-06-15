const express = require('express');
const { getDb } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  const db = getDb();
  let rows;
  if (category) {
    rows = db.prepare('SELECT * FROM tips WHERE category = ? ORDER BY category, title_fr').all(category);
  } else {
    rows = db.prepare('SELECT * FROM tips ORDER BY category, title_fr').all();
  }
  res.json(rows);
});

router.get('/categories', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT category FROM tips ORDER BY category').all();
  res.json(rows.map(r => r.category));
});

router.get('/bookmarks', verifyToken, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT t.id as tip_id FROM tips t JOIN bookmarks b ON t.id = b.tip_id
    WHERE b.user_id = ? ORDER BY b.created_at DESC
  `).all(req.user.id);
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const tip = db.prepare('SELECT * FROM tips WHERE id = ?').get(req.params.id);
  if (!tip) return res.status(404).json({ error: 'Astuce introuvable' });
  res.json(tip);
});

router.post('/bookmarks', verifyToken, (req, res) => {
  const { tip_id } = req.body;
  if (!tip_id) return res.status(400).json({ error: 'tip_id requis' });
  const db = getDb();
  try {
    db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, tip_id) VALUES (?, ?)').run(req.user.id, tip_id);
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete('/bookmarks/:tipId', verifyToken, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND tip_id = ?').run(req.user.id, req.params.tipId);
  res.json({ success: true });
});

module.exports = router;
