const express = require('express');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db');

const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');

function getExamTypes() {
  const db = getDb();
  let types = db.prepare('SELECT * FROM exam_types').all();
  if (types.length === 0) {
    const dirs = fs.readdirSync(DATA_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name);
    for (const dir of dirs) {
      const metaPath = path.join(DATA_DIR, dir, 'metadata.json');
      if (fs.existsSync(metaPath)) {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        db.prepare('INSERT OR IGNORE INTO exam_types (id, name_fr, name_en, name_ar, description_fr, icon) VALUES (?, ?, ?, ?, ?, ?)')
          .run(dir, meta.name_fr || dir, meta.name_en || '', meta.name_ar || '', meta.description_fr || '', meta.icon || '📚');
      }
    }
    types = db.prepare('SELECT * FROM exam_types').all();
  }
  return types;
}

router.get('/', (req, res) => {
  const types = getExamTypes();
  const result = types.map(t => {
    const metaPath = path.join(DATA_DIR, t.id, 'metadata.json');
    let years = [];
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      years = meta.years || [];
    }
    return { ...t, years };
  });
  res.json(result);
});

router.get('/topics', (req, res) => {
  const topicSet = new Set();
  const dirs = fs.readdirSync(DATA_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const dir of dirs) {
    const dirPath = path.join(DATA_DIR, dir.name);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'metadata.json');
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8'));
      if (data.subjects) {
        for (const subject of data.subjects) {
          if (subject.topics) subject.topics.forEach(t => topicSet.add(t));
          if (subject.questions) {
            for (const q of subject.questions) {
              if (q.topics) q.topics.forEach(t => topicSet.add(t));
            }
          }
        }
      }
    }
  }
  res.json(Array.from(topicSet).sort());
});

router.get('/:type', (req, res) => {
  const { type } = req.params;
  const metaPath = path.join(DATA_DIR, type, 'metadata.json');
  if (!fs.existsSync(metaPath)) return res.status(404).json({ error: 'Type d\'examen introuvable' });
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  res.json(meta);
});

router.get('/:type/years', (req, res) => {
  const { type } = req.params;
  const dirPath = path.join(DATA_DIR, type);
  if (!fs.existsSync(dirPath)) return res.status(404).json({ error: 'Type d\'examen introuvable' });
  const metaPath = path.join(dirPath, 'metadata.json');
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    return res.json(meta.years || []);
  }
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'metadata.json');
  const years = files.map(f => parseInt(f.replace('.json', ''))).filter(y => !isNaN(y)).sort((a, b) => b - a);
  res.json(years);
});

router.get('/:type/:year', (req, res) => {
  const { type, year } = req.params;
  const filePath = path.join(DATA_DIR, type, `${year}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Année introuvable' });
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const allQuestions = [];
  for (const subject of data.subjects || []) {
    for (const q of subject.questions || []) {
      allQuestions.push({ ...q, subjectName: subject.name_fr });
    }
  }
  res.json({ ...data, questions: allQuestions });
});

router.get('/:type/:year/questions/:id', (req, res) => {
  const { type, year, id } = req.params;
  const filePath = path.join(DATA_DIR, type, `${year}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Année introuvable' });
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const subject of data.subjects || []) {
    const q = (subject.questions || []).find(q => q.id === parseInt(id));
    if (q) return res.json(q);
  }
  res.status(404).json({ error: 'Question introuvable' });
});

router.get('/:type/:year/subject/:subject', (req, res) => {
  const { type, year, subject } = req.params;
  const filePath = path.join(DATA_DIR, type, `${year}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Année introuvable' });
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const sub = (data.subjects || []).find(s => s.name_fr === subject || s.name_en === subject);
  if (!sub) return res.status(404).json({ error: 'Matière introuvable' });
  res.json(sub);
});

router.get('/topic/theory/:topic', (req, res) => {
  const { topic } = req.params;
  const topicsPath = path.join(DATA_DIR, 'topics.json');
  if (!fs.existsSync(topicsPath)) return res.json({ sections: [] });
  const allTopics = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
  const topicData = allTopics[topic.toLowerCase()];
  if (!topicData) return res.json({ sections: [] });
  res.json(topicData);
});

router.get('/practice/topic/:topic', (req, res) => {
  const { topic } = req.params;
  const results = [];
  const dirs = fs.readdirSync(DATA_DIR, { withFileTypes: true }).filter(d => d.isDirectory());

  for (const dir of dirs) {
    const dirPath = path.join(DATA_DIR, dir.name);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'metadata.json');
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8'));
      for (const subject of data.subjects || []) {
        for (const q of subject.questions || []) {
          if (q.topics && q.topics.some(t => t.toLowerCase() === topic.toLowerCase())) {
            results.push({ ...q, examType: dir.name, year: data.year, subjectName: subject.name_fr });
          }
        }
      }
    }
  }
  res.json({ questions: results });
});

module.exports = router;
