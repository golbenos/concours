const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { initDb, getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/tips', require('./routes/tips'));
app.use('/api/admin', require('./routes/admin'));

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use('/api/data', express.static(path.join(__dirname, 'data')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

async function autoSeed() {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@concours.ma');
  if (existing) return;

  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)').run('admin@concours.ma', hash, 'admin', 'Admin');
  console.log('Admin créé: admin@concours.ma / admin123');

  const DATA_DIR = path.join(__dirname, 'data');
  const dirs = fs.readdirSync(DATA_DIR, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('.'));
  for (const dir of dirs) {
    const metaPath = path.join(DATA_DIR, dir.name, 'metadata.json');
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      db.prepare('INSERT OR IGNORE INTO exam_types (id, name_fr, name_en, name_ar, description_fr, icon) VALUES (?, ?, ?, ?, ?, ?)')
        .run(dir.name, meta.name_fr || dir.name, meta.name_en || '', meta.name_ar || '', meta.description_fr || '', meta.icon || '📚');
    }
  }

  const tips = [
    { category: 'Algèbre', title_fr: 'Produit remarquable', content_fr: '$(a+b)^2 = a^2 + 2ab + b^2$', example_fr: '$(x+3)^2 = x^2 + 6x + 9$' },
    { category: 'Algèbre', title_fr: 'Identité de Sophie Germain', content_fr: '$a^4 + 4b^4 = (a^2 + 2ab + 2b^2)(a^2 - 2ab + 2b^2)$' },
    { category: 'Algèbre', title_fr: 'Binôme de Newton', content_fr: '$(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k$' },
    { category: 'Analyse', title_fr: 'Limite exponentielle', content_fr: '$\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$' },
    { category: 'Analyse', title_fr: 'Croissances comparées', content_fr: '$\\lim_{x \\to +\\infty} \\frac{e^x}{x^n} = +\\infty$ et $\\lim_{x \\to +\\infty} \\frac{\\ln x}{x^n} = 0$' },
    { category: 'Trigonométrie', title_fr: 'Formule de Moivre', content_fr: '$(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$' },
    { category: 'Intégrales', title_fr: 'Intégration par parties', content_fr: '$\\int u\\,dv = uv - \\int v\\,du$' },
    { category: 'Nombres complexes', title_fr: 'Forme exponentielle', content_fr: '$z = re^{i\\theta}$ avec $r = |z|$ et $\\theta = \\arg(z)$' },
    { category: 'Probabilités', title_fr: 'Formule des probabilités totales', content_fr: '$P(B) = \\sum_i P(A_i)P(B|A_i)$' },
    { category: 'Suites', title_fr: 'Suite arithmético-géométrique', content_fr: '$u_{n+1} = a u_n + b$ converge si $|a| < 1$ vers $\\ell = \\frac{b}{1-a}$' },
    { category: 'Géométrie', title_fr: 'Distance point-plan', content_fr: '$d(M,P) = \\frac{|ax_M+by_M+cz_M+d|}{\\sqrt{a^2+b^2+c^2}}$' },
    { category: 'Arithmétique', title_fr: 'Petit théorème de Fermat', content_fr: 'Si $p$ premier et $p \\nmid a$, alors $a^{p-1} \\equiv 1 \\pmod{p}$' },
  ];

  for (const tip of tips) {
    db.prepare('INSERT OR IGNORE INTO tips (category, title_fr, content_fr, example_fr) VALUES (?, ?, ?, ?)')
      .run(tip.category, tip.title_fr, tip.content_fr, tip.example_fr || '');
  }
  console.log('Données initialisées automatiquement.');
}

initDb().then(async () => {
  await autoSeed();
  app.listen(PORT, () => {
    console.log(`Serveur Concours Maroc démarré sur http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Erreur d\'initialisation de la base de données:', err);
  process.exit(1);
});
