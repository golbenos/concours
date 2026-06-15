const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { initDb, getDb } = require('./db');

const DATA_DIR = path.join(__dirname, 'data');

async function seed() {
  await initDb();
  const db = getDb();

  const adminEmail = 'admin@concours.ma';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existing) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)').run(adminEmail, hash, 'admin', 'Admin');
    console.log('Admin créé: admin@concours.ma / admin123');
  }

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
    { category: 'Algèbre', title_fr: 'Binôme de Newton', content_fr: '$(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k$', example_fr: '$(1+x)^4 = 1 + 4x + 6x^2 + 4x^3 + x^4$' },
    { category: 'Analyse', title_fr: 'Limite exponentielle', content_fr: '$\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$', example_fr: '$\\lim_{x \\to 0} \\frac{e^{2x} - 1}{x} = 2$' },
    { category: 'Analyse', title_fr: 'Limite logarithmique', content_fr: '$\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1$', example_fr: '$\\lim_{x \\to 0} \\frac{\\ln(1+3x)}{x} = 3$' },
    { category: 'Analyse', title_fr: 'Croissances comparées', content_fr: '$\\lim_{x \\to +\\infty} \\frac{e^x}{x^n} = +\\infty$ et $\\lim_{x \\to +\\infty} \\frac{\\ln x}{x^n} = 0$' },
    { category: 'Analyse', title_fr: 'Développement limité de $e^x$', content_fr: '$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + o(x^3)$' },
    { category: 'Analyse', title_fr: 'DL de $\\ln(1+x)$', content_fr: '$\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + o(x^4)$' },
    { category: 'Analyse', title_fr: 'Limite de $(1+a/n)^n$', content_fr: '$\\lim_{n\\to+\\infty} (1 + \\frac{a}{n})^n = e^a$', example_fr: '$\\lim (1+2/n)^n = e^2$' },
    { category: 'Analyse', title_fr: 'Théorème des gendarmes', content_fr: 'Si $v_n \\le u_n \\le w_n$ et $\\lim v_n = \\lim w_n = \\ell$, alors $\\lim u_n = \\ell$' },
    { category: 'Analyse', title_fr: 'Fonction arctangente', content_fr: '$\\arctan\'(x) = \\frac{1}{1+x^2}$, $\\forall x>0 : \\arctan x + \\arctan(1/x) = \\pi/2$' },
    { category: 'Trigonométrie', title_fr: 'Formule d\'angle moitié', content_fr: '$\\cos^2\\theta = \\frac{1+\\cos 2\\theta}{2}$, $\\sin^2\\theta = \\frac{1-\\cos 2\\theta}{2}$' },
    { category: 'Trigonométrie', title_fr: 'Formule de Moivre', content_fr: '$(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$' },
    { category: 'Trigonométrie', title_fr: 'Transformation somme-produit', content_fr: '$\\sin p + \\sin q = 2\\sin\\frac{p+q}{2}\\cos\\frac{p-q}{2}$' },
    { category: 'Trigonométrie', title_fr: 'Formules d\'addition', content_fr: '$\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b$, $\\sin(a+b) = \\sin a \\cos b + \\cos a \\sin b$' },
    { category: 'Intégrales', title_fr: 'Intégration par parties', content_fr: '$\\int u\\,dv = uv - \\int v\\,du$', example_fr: '$\\int x e^x dx = x e^x - e^x + C$' },
    { category: 'Intégrales', title_fr: 'Changement de variable', content_fr: '$\\int_a^b f(\\varphi(t))\\varphi\'(t) dt = \\int_{\\varphi(a)}^{\\varphi(b)} f(u) du$' },
    { category: 'Intégrales', title_fr: 'Intégrale de Wallis', content_fr: '$\\int_0^{\\pi/2} \\sin^n x\\,dx = \\int_0^{\\pi/2} \\cos^n x\\,dx$' },
    { category: 'Intégrales', title_fr: 'Paritè et intégrale', content_fr: 'Si $f$ impaire $\\int_{-a}^a f = 0$. Si $f$ paire $\\int_{-a}^a f = 2\\int_0^a f$' },
    { category: 'Nombres complexes', title_fr: 'Forme exponentielle', content_fr: '$z = re^{i\\theta}$ avec $r = |z|$ et $\\theta = \\arg(z)$' },
    { category: 'Nombres complexes', title_fr: 'Racines n-ièmes de l\'unité', content_fr: '$\\omega_k = e^{2i\\pi k/n}$ pour $k = 0,1,\\ldots,n-1$' },
    { category: 'Nombres complexes', title_fr: 'Équations du second degré', content_fr: 'Si $\\Delta < 0$, $z = \\frac{-b \\pm i\\sqrt{-\\Delta}}{2a}$' },
    { category: 'Probabilités', title_fr: 'Formule des probabilités totales', content_fr: '$P(B) = \\sum_i P(A_i)P(B|A_i)$' },
    { category: 'Probabilités', title_fr: 'Formule de Bayes', content_fr: '$P(A_i|B) = \\frac{P(A_i)P(B|A_i)}{P(B)}$' },
    { category: 'Probabilités', title_fr: 'Dénombrement', content_fr: '$A_n^p = \\frac{n!}{(n-p)!}$, $C_n^p = \\frac{n!}{p!(n-p)!}$' },
    { category: 'Suites', title_fr: 'Théorème de Césaro', content_fr: 'Si $\\lim (u_{n+1}-u_n) = \\ell$ alors $\\lim \\frac{u_n}{n} = \\ell$' },
    { category: 'Suites', title_fr: 'Suite arithmético-géométrique', content_fr: '$u_{n+1} = a u_n + b$ converge si $|a| < 1$ vers $\\ell = \\frac{b}{1-a}$' },
    { category: 'Suites', title_fr: 'Règle d\'Alembert', content_fr: 'Si $\\lim \\frac{u_{n+1}}{u_n} = \\ell < 1$ alors $\\lim u_n = 0$' },
    { category: 'Suites', title_fr: 'Limites classiques', content_fr: '$\\lim \\frac{n^a}{e^{nb}} = 0$, $\\lim \\sqrt[n]{n} = 1$, $\\lim \\sqrt[n]{n!} = +\\infty$' },
    { category: 'Suites', title_fr: 'Formule somme géométrique', content_fr: '$\\sum_{k=0}^n q^k = \\frac{1-q^{n+1}}{1-q}$', example_fr: '$\\sum_{k=0}^{\\infty} q^k = \\frac{1}{1-q}$ pour $|q|<1$' },
    { category: 'Géométrie', title_fr: 'Distance point-plan', content_fr: '$d(M,P) = \\frac{|ax_M+by_M+cz_M+d|}{\\sqrt{a^2+b^2+c^2}}$' },
    { category: 'Géométrie', title_fr: 'Produit vectoriel', content_fr: '$\\vec{u}\\times\\vec{v}$ est orthogonal à $\\vec{u}$ et $\\vec{v}$, $||\\vec{u}\\times\\vec{v}|| = ||\\vec{u}||\\,||\\vec{v}||\\,\\sin\\theta$' },
    { category: 'Géométrie', title_fr: 'Sphère', content_fr: '$(x-a)^2+(y-b)^2+(z-c)^2 = R^2$, centre $\\Omega(a,b,c)$, rayon $R$' },
    { category: 'Arithmétique', title_fr: 'Petit théorème de Fermat', content_fr: 'Si $p$ premier et $p \\nmid a$, alors $a^{p-1} \\equiv 1 \\pmod{p}$' },
    { category: 'Arithmétique', title_fr: 'Théorème de Bézout', content_fr: '$\\gcd(a,b)=1 \\iff \\exists u,v : au+bv = 1$' },
    { category: 'Arithmétique', title_fr: 'Théorème de Gauss', content_fr: 'Si $\\gcd(a,b)=1$ et $a \\mid bc$, alors $a \\mid c$' },
  ];

  for (const tip of tips) {
    db.prepare('INSERT OR IGNORE INTO tips (category, title_fr, content_fr, example_fr) VALUES (?, ?, ?, ?)')
      .run(tip.category, tip.title_fr, tip.content_fr, tip.example_fr || '');
  }

  console.log('Base de données initialisée avec succès !');
  console.log(`- ${tips.length} astuces ajoutées`);
  console.log('- Compte admin: admin@concours.ma / admin123');
  process.exit(0);
}

seed().catch(err => {
  console.error('Erreur seed:', err);
  process.exit(1);
});
