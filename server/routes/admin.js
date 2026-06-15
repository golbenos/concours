const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, adminOnly);

const DATA_DIR = path.join(__dirname, '..', 'data');

router.get('/stats', (req, res) => {
  const db = getDb();
  const exams = db.prepare('SELECT COUNT(*) as c FROM exam_types').get().c;
  const tips = db.prepare('SELECT COUNT(*) as c FROM tips').get().c;
  const users = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  let questions = 0;
  const dirs = fs.readdirSync(DATA_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const dir of dirs) {
    const files = fs.readdirSync(path.join(DATA_DIR, dir.name)).filter(f => f.endsWith('.json') && f !== 'metadata.json');
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, dir.name, file), 'utf-8'));
      for (const subject of data.subjects || []) {
        questions += (subject.questions || []).length;
      }
    }
  }
  res.json({ exams, questions, tips, users });
});

router.get('/exams', (req, res) => {
  const db = getDb();
  const exams = db.prepare('SELECT * FROM exam_types').all();
  const enriched = exams.map(e => {
    const metaPath = path.join(DATA_DIR, e.id, 'metadata.json');
    let years = [];
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      years = meta.years || [];
    }
    return { ...e, years };
  });
  res.json(enriched);
});

router.post('/exams', (req, res) => {
  const { id, name_fr, name_en, name_ar, description_fr, icon } = req.body;
  if (!id || !name_fr) return res.status(400).json({ error: 'id et name_fr requis' });
  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO exam_types (id, name_fr, name_en, name_ar, description_fr, icon) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, name_fr, name_en || '', name_ar || '', description_fr || '', icon || '📚');
  const dirPath = path.join(DATA_DIR, id);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  const metaPath = path.join(dirPath, 'metadata.json');
  if (!fs.existsSync(metaPath)) {
    fs.writeFileSync(metaPath, JSON.stringify({ name_fr, name_en: name_en || '', name_ar: name_ar || '', years: [] }, null, 2));
  }
  res.status(201).json({ success: true });
});

router.put('/exams/:id', (req, res) => {
  const { id } = req.params;
  const { name_fr, name_en, name_ar, description_fr, icon } = req.body;
  const db = getDb();
  db.prepare('UPDATE exam_types SET name_fr=?, name_en=?, name_ar=?, description_fr=?, icon=? WHERE id=?')
    .run(name_fr, name_en || '', name_ar || '', description_fr || '', icon || '📚', id);
  res.json({ success: true });
});

router.delete('/exams/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM exam_types WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/questions/:examType', (req, res) => {
  const { examType } = req.params;
  const dirPath = path.join(DATA_DIR, examType);
  if (!fs.existsSync(dirPath)) return res.json([]);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'metadata.json');
  const all = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8'));
    for (const subject of data.subjects || []) {
      for (const q of subject.questions || []) {
        all.push({ ...q, year: data.year, examType, subjectName: subject.name_fr });
      }
    }
  }
  res.json(all);
});

router.post('/questions/:examType/:year', (req, res) => {
  const { examType, year } = req.params;
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question requise' });

  const filePath = path.join(DATA_DIR, examType, `${year}.json`);
  let data = { year: parseInt(year), subjects: [{ name_fr: 'Mathématiques', name_en: 'Mathematics', name_ar: 'الرياضيات', questions: [] }] };
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  if (!data.subjects) data.subjects = [{ name_fr: 'Mathématiques', name_en: 'Mathematics', name_ar: 'الرياضيات', questions: [] }];
  question.id = (data.subjects[0].questions.length || 0) + 1;
  data.subjects[0].questions.push(question);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  const metaPath = path.join(DATA_DIR, examType, 'metadata.json');
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    if (!meta.years.includes(parseInt(year))) {
      meta.years.push(parseInt(year));
      meta.years.sort((a, b) => a - b);
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    }
  }

  res.status(201).json({ success: true, id: question.id });
});

router.put('/questions/:examType/:year/:qId', (req, res) => {
  const { examType, year, qId } = req.params;
  const { question } = req.body;
  const filePath = path.join(DATA_DIR, examType, `${year}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier introuvable' });
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const subject of data.subjects || []) {
    const idx = (subject.questions || []).findIndex(q => q.id === parseInt(qId));
    if (idx !== -1) {
      subject.questions[idx] = { ...subject.questions[idx], ...question };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return res.json({ success: true });
    }
  }
  res.status(404).json({ error: 'Question introuvable' });
});

router.delete('/questions/:examType/:year/:qId', (req, res) => {
  const { examType, year, qId } = req.params;
  const filePath = path.join(DATA_DIR, examType, `${year}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Fichier introuvable' });
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const subject of data.subjects || []) {
    const idx = (subject.questions || []).findIndex(q => q.id === parseInt(qId));
    if (idx !== -1) {
      subject.questions.splice(idx, 1);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return res.json({ success: true });
    }
  }
  res.status(404).json({ error: 'Question introuvable' });
});

router.post('/tips', (req, res) => {
  const { category, content, title_fr, content_fr } = req.body;
  if (!content && !content_fr) return res.status(400).json({ error: 'Contenu requis' });
  const db = getDb();
  const result = db.prepare('INSERT INTO tips (category, title_fr, content_fr, content) VALUES (?, ?, ?, ?)')
    .run(category || 'general', title_fr || '', content_fr || content || '', content || content_fr || '');
  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/tips/:id', (req, res) => {
  const { category, content, content_fr } = req.body;
  const db = getDb();
  db.prepare('UPDATE tips SET category=?, content_fr=?, content=? WHERE id=?')
    .run(category || 'general', content_fr || content || '', content || content_fr || '', req.params.id);
  res.json({ success: true });
});

router.delete('/tips/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM tips WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/users', (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT id, email, role, name, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

router.put('/users/:id', (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Rôle invalide' });
  const db = getDb();
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ success: true });
});

module.exports = router;
