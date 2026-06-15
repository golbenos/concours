const fs = require('fs');
const path = require('path');

const BOOK_FILE = path.join(__dirname, '..', 'ENSA-ENSAM_Maths_Complete.txt');
const OUTPUT_DIR = path.join(__dirname, 'data', 'book');

const raw = fs.readFileSync(BOOK_FILE, 'utf-8');
const lines = raw.split('\n');

const sections = [
  { id: 'suites', label: 'Suites numériques', tests: [0, 1], courseStart: 0, courseEnd: 239 },
  { id: 'fonctions', label: 'Étude des fonctions', tests: [2, 3], courseStart: 1110, courseEnd: 1348 },
  { id: 'integrales', label: 'Calcul d\'intégrales', tests: [4, 5], courseStart: 2322, courseEnd: 2450 },
  { id: 'complexes', label: 'Nombres complexes', tests: [6, 7], courseStart: 3268, courseEnd: 3443 },
  { id: 'arithmetique', label: 'Arithmétique & Matrices', tests: [8], courseStart: 4235, courseEnd: 4344 },
  { id: 'geometrie', label: 'Géométrie & Probabilités', tests: [9], courseStart: 4698, courseEnd: 4847 },
];

const testRanges = [
  { qStart: 241, qEnd: 343, sStart: 344, sEnd: 612 },
  { qStart: 613, qEnd: 757, sStart: 758, sEnd: 1109 },
  { qStart: 1349, qEnd: 1503, sStart: 1504, sEnd: 1792 },
  { qStart: 1793, qEnd: 1955, sStart: 1956, sEnd: 2321 },
  { qStart: 2451, qEnd: 2580, sStart: 2581, sEnd: 2845 },
  { qStart: 2846, qEnd: 2981, sStart: 2982, sEnd: 3266 },
  { qStart: 3444, qEnd: 3614, sStart: 3615, sEnd: 3826 },
  { qStart: 3827, qEnd: 3970, sStart: 3971, sEnd: 4234 },
  { qStart: 4345, qEnd: 4479, sStart: 4480, sEnd: 4697 },
  { qStart: 4848, qEnd: 5024, sStart: 5025, sEnd: 5317 },
];

const mockRanges = [
  { qStart: 5318, qEnd: 5657, label: 'Concours Blanc 1' },
  { qStart: 5658, qEnd: 6075, label: 'Concours Blanc 2' },
  { qStart: 6076, qEnd: 6242, label: 'Concours Blanc 3 (Sans Correction)' },
];

function extractQuestions(qStart, qEnd, sStart, sEnd) {
  const questions = [];
  let current = null;
  const answerLines = lines.slice(sStart - 1, sEnd).join('\n');

  for (let i = qStart - 1; i < qEnd; i++) {
    const line = lines[i];
    const qMatch = line.match(/^\s*(\d{1,2})\s+(.+)/);
    if (qMatch) {
      if (current) questions.push(current);
      current = { id: parseInt(qMatch[1]), text: qMatch[2].trim(), choices: [], answer: null };
    } else if (current) {
      const choiceMatch = line.match(/□\s*([A-Da-d])\s+(.+)/);
      if (choiceMatch) {
        current.choices.push({ label: choiceMatch[1].toUpperCase(), text: choiceMatch[2].trim() });
      } else {
        const nextQ = line.match(/^\s*\d{1,2}\s/);
        if (!nextQ && line.trim()) {
          current.text += ' ' + line.trim();
        }
      }
    }
  }
  if (current) questions.push(current);

  const answerLabels = ['A', 'B', 'C', 'D'];
  for (const q of questions) {
    const ansRegex = new RegExp(`bonne r[ée]ponse est\\s*([A-Da-d])\\s*.*?(?:\\n|$)`, 'i');
    const ansMatch = answerLines.match(ansRegex);
    if (ansMatch) {
      q.answer = answerLabels.indexOf(ansMatch[1].toUpperCase());
    }
  }

  return questions;
}

function extractCourse(start, end) {
  const content = [];
  for (let i = start - 1; i < end; i++) {
    const line = lines[i]?.trim();
    if (line && !line.match(/^={2,}|Chapitre|Mathématiques|Testez-vous|Consignes|Ce questionnaire|L'utilisation/)) {
      content.push(line);
    }
  }
  return content;
}

const bookData = { sections: [] };

for (const sec of sections) {
  const secQuestions = [];
  for (const testIdx of sec.tests) {
    const tr = testRanges[testIdx];
    const qs = extractQuestions(tr.qStart, tr.qEnd, tr.sStart, tr.sEnd);
    secQuestions.push(...qs);
  }

  const courseContent = extractCourse(sec.courseStart, sec.courseEnd);

  bookData.sections.push({
    id: sec.id,
    title_fr: sec.label,
    course: courseContent.slice(0, 50),
    astuces: courseContent.filter(l => l.match(/astuce|Astuce|^[IV]+/i)),
    questions: secQuestions,
  });
}

bookData.mockExams = mockRanges.map(m => ({
  label: m.label,
  questions: extractQuestions(m.qStart, m.qEnd, m.qEnd, m.qEnd + 50),
}));

fs.writeFileSync(path.join(OUTPUT_DIR, 'book.json'), JSON.stringify(bookData, null, 2), 'utf-8');
console.log(`Extracted: ${bookData.sections.reduce((s, sec) => s + sec.questions.length, 0)} questions total`);
console.log(`Mock exams: ${bookData.mockExams.reduce((s, m) => s + m.questions.length, 0)} questions`);
console.log('Saved to data/book/book.json');
