const express = require('express');
const { getDb } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, (req, res) => {
  const { exam_type, year, answers } = req.body;
  if (!exam_type || !year || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Données incomplètes' });
  }
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO progress (user_id, exam_type, year, question_id, chosen_index, is_correct, time_taken_seconds) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  for (const a of answers) {
    stmt.run(req.user.id, exam_type, year, a.question_id, a.selected ?? null, a.correct ? 1 : 0, a.time_spent || 0);
  }
  res.status(201).json({ success: true, count: answers.length });
});

router.get('/', verifyToken, (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM progress WHERE user_id = ? ORDER BY answered_at DESC').all(req.user.id);
  res.json(rows);
});

router.get('/stats', verifyToken, (req, res) => {
  const db = getDb();
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_questions,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
      COUNT(DISTINCT exam_type || '-' || year) as exams_taken
    FROM progress WHERE user_id = ?
  `).get(req.user.id);

  const total = stats.total_questions || 0;
  const correct = stats.correct_answers || 0;
  res.json({
    total_questions: total,
    correct_answers: correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    exams_taken: stats.exams_taken || 0
  });
});

module.exports = router;
