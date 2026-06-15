const fs = require('fs');
const path = require('path');

const TOPICS_FILE = path.join(__dirname, 'data', 'topics.json');
const ENSAM_2024 = path.join(__dirname, 'data', 'ensam', '2024.json');
const ENSAM_2025 = path.join(__dirname, 'data', 'ensam', '2025.json');
const BOOK_RAW = path.join(__dirname, 'data', 'book', 'book-raw.json');
const OUTPUT = path.join(__dirname, 'data', 'book', 'book.json');

const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8'));
const ensam2024 = JSON.parse(fs.readFileSync(ENSAM_2024, 'utf-8'));
const ensam2025 = JSON.parse(fs.readFileSync(ENSAM_2025, 'utf-8'));

const manualQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'manual.json'), 'utf-8'));
const suitesCourse = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'suites-course.json'), 'utf-8'));
const suitesQcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'suites-qcm.json'), 'utf-8'));
const fonctionsCourse = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'fonctions-course.json'), 'utf-8'));
const fonctionsQcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'fonctions-qcm.json'), 'utf-8'));
const integralesCourse = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'integrales-course.json'), 'utf-8'));
const integralesQcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'integrales-qcm.json'), 'utf-8'));
const complexesCourse = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'complexes-course.json'), 'utf-8'));
const complexesQcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'complexes-qcm.json'), 'utf-8'));
const arithmetiqueCourse = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'arithmetique-course.json'), 'utf-8'));
const arithmetiqueQcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'arithmetique-qcm.json'), 'utf-8'));
const geometrieCourse = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'geometrie-course.json'), 'utf-8'));
const geometrieQcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'geometrie-qcm.json'), 'utf-8'));
const limitesCourse = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'limites-course.json'), 'utf-8'));
const limitesQcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'limites-qcm.json'), 'utf-8'));
const cb1Course = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb1-course.json'), 'utf-8'));
const cb1Qcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb1-qcm.json'), 'utf-8'));
const cb2Course = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb2-course.json'), 'utf-8'));
const cb2Qcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb2-qcm.json'), 'utf-8'));
const cb3Course = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb3-course.json'), 'utf-8'));
const cb3Qcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb3-qcm.json'), 'utf-8'));
const cb4Course = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb4-course.json'), 'utf-8'));
const cb4Qcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb4-qcm.json'), 'utf-8'));
const cb5Course = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb5-course.json'), 'utf-8'));
const cb5Qcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb5-qcm.json'), 'utf-8'));
const cb6Course = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb6-course.json'), 'utf-8'));
const cb6Qcm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'book', 'cb6-qcm.json'), 'utf-8'));

const cleanQuestions = [
  ...(ensam2024.subjects?.[0]?.questions || []).map(q => ({ ...q, source: '2024' })),
  ...(ensam2025.subjects?.[0]?.questions || []).map(q => ({ ...q, source: '2025' })),
];

const courseMap = {
  suites: ['suites'],
  fonctions: ['analyse', 'trigonométrie'],
  integrales: ['intégrales'],
  complexes: ['nombres complexes'],
  arithmetique: ['algèbre', 'arithmétique', 'matrices'],
  geometrie: ['géométrie', 'probabilités'],
};

function getCourseForSection(sectionId) {
  const keys = courseMap[sectionId] || [];
  const content = [];
  for (const key of keys) {
    const topicData = topics[key];
    if (topicData) {
      for (const sec of topicData.sections || []) {
        content.push({ title: sec.title, items: sec.content });
      }
    }
  }
  return content;
}

function getCleanQuestionsForSection(sectionId) {
  const filterMap = {
    suites: q => q.topics?.includes('suites'),
    fonctions: q => q.topics?.some(t => ['analyse', 'trigonométrie', 'limites', 'dérivation', 'trigonométrie'].includes(t)),
    integrales: q => q.topics?.includes('intégrales'),
    complexes: q => q.topics?.includes('nombres complexes'),
    arithmetique: q => q.topics?.some(t => ['algèbre', 'arithmétique', 'matrices'].includes(t)),
    geometrie: q => q.topics?.some(t => ['géométrie', 'probabilités'].includes(t)),
  };
  const filter = filterMap[sectionId] || (() => false);
  const clean = cleanQuestions.filter(filter).map(q => ({
    id: q.id,
    question_fr: q.question_fr,
    choices: q.choices,
    correctIndex: q.correctIndex,
    explanation_fr: q.explanation_fr || '',
    difficulty: q.difficulty || 'moyen',
  }));
  const manual = manualQuestions[sectionId] || [];
  return [...clean, ...manual];
}

const sections = [
  {
    id: 'suites',
    title_fr: 'Suites numériques',
    icon: 'timeline',
    description: 'Suites arithmétiques et géométriques, convergence, Césaro, sommes',
    course: suitesCourse.course,
    astuces: ['Suites'],
    questions: suitesQcm.questions,
  },
  {
    id: 'fonctions',
    title_fr: 'Étude des fonctions',
    icon: 'functions',
    description: 'Continuité, dérivabilité, arctangente, trigonométrie, logarithme, exponentielle',
    course: fonctionsCourse.course,
    astuces: ['Analyse', 'Trigonométrie'],
    questions: fonctionsQcm.questions,
  },
  {
    id: 'integrales',
    title_fr: 'Calcul intégral',
    icon: 'integration_instructions',
    description: 'Primitives, intégration par parties, changement de variable, Wallis',
    course: integralesCourse.course,
    astuces: ['Intégrales'],
    questions: integralesQcm.questions,
  },
  {
    id: 'complexes',
    title_fr: 'Nombres complexes',
    icon: 'neurology',
    description: 'Forme algébrique et exponentielle, racines, équations, géométrie',
    course: complexesCourse.course,
    astuces: ['Nombres complexes'],
    questions: complexesQcm.questions,
  },
  {
    id: 'arithmetique',
    title_fr: 'Arithmétique & Matrices',
    icon: '123',
    description: 'Divisibilité, PGCD, congruence, Fermat, calcul matriciel',
    course: arithmetiqueCourse.course,
    astuces: ['Algèbre', 'Arithmétique'],
    questions: arithmetiqueQcm.questions,
  },
  {
    id: 'geometrie',
    title_fr: 'Géométrie & Probabilités',
    icon: 'category',
    description: 'Géométrie dans l\'espace, dénombrement, probabilités conditionnelles',
    course: geometrieCourse.course,
    astuces: ['Géométrie', 'Probabilités'],
    questions: geometrieQcm.questions,
  },
  {
    id: 'limites',
    title_fr: 'Limites de référence',
    icon: 'trending_up',
    description: 'Tableau des 100 limites classiques',
    course: limitesCourse.course,
    astuces: ['Limites'],
    questions: limitesQcm.questions,
  },
  {
    id: 'cb1',
    title_fr: 'Concours blanc 1',
    icon: 'school',
    description: '14 QCM : suites, complexes, limites, fonctions, int\u00e9grales, g\u00e9om\u00e9trie, probabilit\u00e9s',
    course: cb1Course.course,
    questions: cb1Qcm.questions,
  },
  {
    id: 'cb2',
    title_fr: 'Concours blanc 2',
    icon: 'school',
    description: '20 QCM : suites, complexes, limites, fonctions, int\u00e9grales, g\u00e9om\u00e9trie',
    course: cb2Course.course,
    questions: cb2Qcm.questions,
  },
  {
    id: 'cb3',
    title_fr: 'Concours blanc 3',
    icon: 'school',
    description: '20 QCM : suites, complexes, limites, fonctions, int\u00e9grales, g\u00e9om\u00e9trie',
    course: cb3Course.course,
    questions: cb3Qcm.questions,
  },
  {
    id: 'cb4',
    title_fr: 'Concours blanc 4',
    icon: 'school',
    description: '20 QCM : suites, complexes, limites, fonctions, int\u00e9grales, g\u00e9om\u00e9trie',
    course: cb4Course.course,
    questions: cb4Qcm.questions,
  },
  {
    id: 'cb5',
    title_fr: 'Concours blanc 5',
    icon: 'school',
    description: '15 QCM : suites, complexes, limites, fonctions, int\u00e9grales, g\u00e9om\u00e9trie, probabilit\u00e9s',
    course: cb5Course.course,
    questions: cb5Qcm.questions,
  },
  {
    id: 'cb6',
    title_fr: 'Concours blanc 6',
    icon: 'school',
    description: '32 QCM : suites, complexes, limites, fonctions, int\u00e9grales, g\u00e9om\u00e9trie, \u00e9quations',
    course: cb6Course.course,
    questions: cb6Qcm.questions,
  },
];

const output = { sections };
fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Built book.json with ${sections.length} sections`);
for (const sec of sections) {
  console.log(`  ${sec.id}: ${sec.questions.length} questions`);
}
