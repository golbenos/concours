const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'limites-qcm.json');
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Normalize existing question strings for dup detection
const dupCheck = new Set();
for (const q of existing.questions) {
  const norm = q.question_fr
    .replace(/\\displaystyle\s*/g, '')
    .replace(/\\,\s*/g, '')
    .replace(/\\;?\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\\to\\+?/g, '\\to')
    .trim();
  dupCheck.add(norm);
}

function isDup(expr) {
  const norm = expr
    .replace(/\\displaystyle\s*/g, '')
    .replace(/\\,\s*/g, '')
    .replace(/\\;?\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\\to\\+?/g, '\\to')
    .trim();
  return dupCheck.has(norm);
}

const E = { label: 'E', fr: '$Autre r\\\'eponse$' };

function ch(a, b, c, d) {
  return [
    { label: 'A', fr: `$${a}$` },
    { label: 'B', fr: `$${b}$` },
    { label: 'C', fr: `$${c}$` },
    { label: 'D', fr: `$${d}$` },
    E,
  ];
}

let nextId = existing.questions.length + 1;
const added = [];

function add(expr, choices, correctIdx, explanation) {
  if (!isDup(expr)) {
    added.push({
      id: nextId++,
      question_fr: `$\\displaystyle ${expr} = $`,
      choices,
      correctIndex: correctIdx,
      explanation_fr: explanation,
    });
  }
}

// Utility strings
const two3 = '\\frac{2}{3}';
const half = '\\frac{1}{2}';
const sixth = '\\frac{1}{6}';
const third = '\\frac{1}{3}';

add(
  '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
  ch('0', '1', '\\infty', '-1'),
  1,
  'Limite classique fondamentale.'
);

add(
  '\\lim_{x \\to 5} \\frac{x^2 - 7x - 8}{x - 8}',
  ch('-13', '13', '0', '\\infty'),
  4,
  'En 5 : (25-35-8)/(5-8) = (-18)/(-3) = 6. Absent des options.'
);

add(
  '\\lim_{x \\to 4} \\frac{\\sqrt{x+5} - 3}{x-4}',
  ch(sixth, third, '0', '\\infty'),
  0,
  'Multiplier par le conjugue : (x+5-9)/[(x-4)(sqrt(x+5)+3)] = 1/(sqrt(x+5)+3) -> 1/6.'
);

add(
  '\\lim_{x \\to 0} \\frac{(1+x)^2 - 1}{(1+x)^3 - 1}',
  ch(two3, '1', '0', '\\infty'),
  0,
  '(2x+x^2)/(3x+3x^2+x^3) = (2+x)/(3+3x+x^2) -> 2/3.'
);

add(
  '\\lim_{x \\to 9} \\frac{\\sqrt{x} - 2}{x - 9}',
  ch(sixth, '\\frac{1}{4}', '0', '\\infty'),
  3,
  'En 9 : numerateur -> 1, denominateur -> 0, donc limite infinie.'
);

add(
  '\\lim_{x \\to 5} \\frac{x^2 + 27}{x + 3}',
  ch('-2', '2', '0', '\\infty'),
  4,
  'En 5 : (25+27)/(5+3) = 52/8 = 6,5. Absent des options.'
);

add(
  '\\lim_{x \\to 5} \\frac{2x^2 - 5x - 3}{x^2 - 2x - 3}',
  ch('\\frac{5}{3}', '\\frac{3}{5}', '0', '\\infty'),
  4,
  'En 5 : (50-25-3)/(25-10-3) = 22/12 = 11/6. Absent des options.'
);

add(
  '\\lim_{x \\to 4} \\frac{x^2 - 2x}{\\sqrt{x+2} - 2}',
  ch('8', '4', '0', '\\infty'),
  4,
  'Conjugue : x(x-2)(sqrt(x+2)+2)/(x-2) = x(sqrt(x+2)+2) -> 4(2+2)=16. Absent des options.'
);

add(
  '\\lim_{x \\to 1} \\frac{x^2 + 3x - 4}{2x + 10}',
  ch('0', '\\frac{1}{12}', sixth, '\\infty'),
  0,
  'En 1 : (1+3-4)/(2+10) = 0/12 = 0.'
);

add(
  '\\lim_{x \\to -2} \\frac{x^2 - 5x - 2}{x + 2}',
  ch('-9', '9', '0', '\\infty'),
  3,
  'En -2 : (4+10-2)/(-2+2) = 12/0 -> infini.'
);

add(
  '\\lim_{x \\to 9} \\frac{\\frac{1}{x^2} - 1}{x - 5}',
  ch('-\\frac{1}{81}', '\\frac{1}{81}', '0', '\\infty'),
  4,
  'En 9 : (1/81-1)/(9-5) = (-80/81)/4 = -20/81. Absent des options.'
);

add(
  '\\lim_{x \\to 9} \\frac{1 - \\cos x}{\\sin x}',
  ch('0', '1', '\\cot 9', '\\infty'),
  4,
  'cot 9 est propose mais faux. Aucune reponse correcte parmi les options.'
);

add(
  '\\lim_{x \\to 1} \\frac{1 - \\sqrt{x}}{1 - x^2}',
  ch(half, '-\\frac{1}{2}', '0', '\\infty'),
  4,
  '(1-sqrt(x))/(1-x^2) = 1/[(1+sqrt(x))(1+x)] -> 1/4. Absent des options.'
);

add(
  '\\lim_{x \\to 5} \\frac{\\frac{1}{x^2} - \\frac{1}{25}}{x^2 - 25}',
  ch('-\\frac{2}{625}', '\\frac{2}{625}', '0', '\\infty'),
  4,
  'Simplification : -1/(25x^2) -> -1/625. Absent des options.'
);

add(
  '\\lim_{x \\to 9} \\frac{\\sqrt{1+\\sqrt{x}} - 2}{x - 9}',
  ch('\\frac{1}{12}', sixth, '0', '\\infty'),
  4,
  'Conjugue : 1/[(sqrt(x)+3)(sqrt(1+sqrt(x))+2)] -> 1/24. Absent des options.'
);

add(
  '\\lim_{x \\to 0} \\frac{\\sin(3x)}{\\sin(2x)}',
  ch('\\frac{3}{2}', two3, '1', '\\infty'),
  0,
  'sin(3x)/sin(2x) ~ 3x/(2x) = 3/2.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{e^x}{x^2}',
  ch('0', '1', '\\infty', '-1'),
  2,
  'Exponentielle domine le polynome.'
);

add(
  '\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}',
  ch('6', '0', '\\infty', '-6'),
  0,
  'x^2-9 = (x-3)(x+3) -> x+3 -> 6.'
);

add(
  '\\lim_{x \\to 0} \\frac{\\sin x}{x^2}',
  ch('0', '1', '\\infty', '-1'),
  2,
  'sin x / x^2 ~ 1/x -> infini.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{x}{\\ln x}',
  ch('0', '1', '\\infty', '-1'),
  2,
  'x domine ln x.'
);

add(
  '\\lim_{x \\to 0} \\frac{e^x - 1}{x^2}',
  ch('0', half, '\\infty', '1'),
  2,
  'e^x-1 ~ x donc x/x^2 = 1/x -> infini.'
);

// Q23 = cos x - 1 / x^2 already exists
// Q24
add(
  '\\lim_{x \\to 1} \\frac{\\ln x}{x - 1}',
  ch('0', '1', '\\infty', '-1'),
  1,
  "Taux d'accroissement de ln x en 1."
);

add(
  '\\lim_{x \\to 0} \\frac{x - \\sin x}{x^3}',
  ch(sixth, '0', '\\infty', '-\\frac{1}{6}'),
  0,
  'Limite classique : sin x ~ x - x^3/6.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{3x^2 + 2x - 1}{x^2 + 5}',
  ch('3', '0', '\\infty', '1'),
  0,
  'Diviser par x^2 : (3+2/x-1/x^2)/(1+5/x^2) -> 3.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{\\sqrt{x^2 + 1}}{x + 1}',
  ch('1', '0', '\\infty', '-1'),
  0,
  '|x|sqrt(1+1/x^2)/(x+1) -> 1.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{5x^3 - 2x}{x^3 + 3x^2}',
  ch('5', '0', '\\infty', '1'),
  0,
  'Diviser par x^3 : (5-2/x^2)/(1+3/x) -> 5.'
);

add(
  '\\lim_{x \\to 0} \\frac{1 - \\cos(2x)}{x \\sin x}',
  ch('2', '0', '\\infty', '1'),
  0,
  '1-cos(2x) ~ 2x^2, x sin x ~ x^2 => 2.'
);

add(
  '\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x',
  ch('e', '0', '\\infty', '1'),
  0,
  'Limite fondamentale donnant e.'
);

add(
  '\\lim_{x \\to 0} \\frac{e^{2x} - 1}{e^x - 1}',
  ch('2', '0', '\\infty', '1'),
  0,
  'e^{2x}-1 ~ 2x, e^x-1 ~ x => 2.'
);

// Q32 = ln(1+x)/x already exists
// Q33
add(
  '\\lim_{x \\to \\infty} \\frac{\\ln(x^2)}{x}',
  ch('0', '1', '\\infty', '-1'),
  0,
  '2 ln x / x -> 0.'
);

// Q34 = tan x - x / x^3 already exists
// Q35
add(
  '\\lim_{x \\to \\infty} \\frac{x^2}{e^{2x}}',
  ch('0', '1', '\\infty', '-1'),
  0,
  'x^2/e^{2x} -> 0 par croissance comparee.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n} \\sin\\left(\\frac{k\\pi}{n}\\right)',
  ch('\\frac{2}{\\pi}', '0', '\\infty', '1'),
  0,
  'Somme de Riemann : int_0^1 sin(pi x) dx = 2/pi.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n} e^{k/n}',
  ch('e-1', '0', '\\infty', '1'),
  0,
  'int_0^1 e^x dx = e-1.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{k}{n^2}',
  ch(half, '0', '\\infty', '1'),
  0,
  '(1/n^2) * n(n+1)/2 -> 1/2.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{k}{n^2} \\cos\\left(\\frac{k}{n}\\right)',
  ch('\\sin 1', '0', '\\infty', '1'),
  4,
  'int_0^1 x cos x dx = sin 1 + cos 1 - 1. Aucune des options.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n} \\ln\\left(1 + \\frac{k}{n}\\right)',
  ch('\\ln 2', '0', '\\infty', '1'),
  4,
  'int_0^1 ln(1+x) dx = 2 ln 2 - 1. Aucune des options.'
);

add(
  '\\lim_{x \\to 0} \\frac{\\sin x - x}{x^2}',
  ch('0', '-\\frac{1}{6}', '\\infty', sixth),
  0,
  'sin x - x ~ -x^3/6, divise par x^2 -> 0.'
);

add(
  '\\lim_{x \\to 0} \\frac{x^2}{\\sin^2 x}',
  ch('1', '0', '\\infty', '-1'),
  0,
  '(x/sin x)^2 -> 1.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{\\ln x}{\\sqrt{x}}',
  ch('0', '1', '\\infty', '-1'),
  0,
  'Croissances comparees.'
);

add(
  '\\lim_{x \\to 0} \\frac{\\tan x}{x^2}',
  ch('\\infty', '0', '1', '-1'),
  0,
  'tan x ~ x donc 1/x -> infini.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{\\cos x}{x}',
  ch('0', '1', '\\infty', '-1'),
  0,
  'cos x borne, x -> inf => 0.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{k}{n^2} e^{-k/n}',
  ch('\\frac{1}{e-1}', '0', '\\infty', '1'),
  4,
  'int_0^1 x e^{-x} dx = 1 - 2/e. Aucune des options.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n} \\cdot \\frac{k}{n+k}',
  ch('1-\\ln 2', '0', '\\infty', '1'),
  0,
  'int_0^1 x/(1+x) dx = 1 - ln 2.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n} \\sqrt{\\frac{k}{n}}',
  ch(two3, '0', '\\infty', '1'),
  0,
  'int_0^1 sqrt(x) dx = 2/3.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n(1 + (k/n)^2)}',
  ch('\\frac{\\pi}{4}', '0', '\\infty', '1'),
  0,
  'int_0^1 dx/(1+x^2) = pi/4.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{k^2}{n^3}',
  ch(third, '0', '\\infty', '1'),
  0,
  'int_0^1 x^2 dx = 1/3.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{x^2 + \\sin x}{x^2 + 1}',
  ch('1', '0', '\\infty', '-1'),
  0,
  '(1+sin x/x^2)/(1+1/x^2) -> 1.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{4x + 3}{2x^2 - 1}',
  ch('0', '1', '\\infty', '-1'),
  0,
  'Degre numerateur < degre denominateur => 0.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{2^x}{x^3}',
  ch('\\infty', '0', '1', '-1'),
  0,
  'Exponentielle (base > 1) domine le polynome.'
);

add(
  '\\lim_{x \\to 0} \\frac{\\sin(4x)}{\\sin(2x)}',
  ch('2', '0', '\\infty', '1'),
  0,
  '4x/(2x) = 2.'
);

add(
  '\\lim_{x \\to \\infty} x \\ln\\left(1 + \\frac{2}{x}\\right)',
  ch('2', '0', '\\infty', '1'),
  0,
  'ln(1+2/x) ~ 2/x => x * 2/x = 2.'
);

add(
  '\\lim_{x \\to 0} \\frac{e^{2x} - e^x}{x}',
  ch('1', '0', '\\infty', '-1'),
  0,
  'e^{2x}-e^x = e^x(e^x-1) ~ 1*x => 1.'
);

add(
  '\\lim_{x \\to \\infty} \\frac{x^3}{e^{x/2}}',
  ch('0', '1', '\\infty', '-1'),
  0,
  'Exponentielle domine le polynome.'
);

add(
  '\\lim_{x \\to 0} \\frac{1 - \\cos(3x)}{x^2}',
  ch('\\frac{9}{2}', '0', '\\infty', '1'),
  0,
  '1-cos(3x) ~ 9x^2/2 => 9/2.'
);

add(
  '\\lim_{x \\to 0} \\frac{\\ln(1+2x)}{x}',
  ch('2', '0', '\\infty', '1'),
  0,
  'ln(1+2x) ~ 2x => 2.'
);

add(
  '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n} \\cos\\left(\\frac{k\\pi}{2n}\\right)',
  ch('\\frac{2}{\\pi}', '0', '\\infty', '1'),
  0,
  'int_0^1 cos(pi x/2) dx = 2/pi.'
);

// --- END OF NEW QUESTIONS ---

console.log(`Existing questions: ${existing.questions.length}`);
console.log(`New unique questions to add: ${added.length}`);
for (const a of added) {
  console.log(`  New Q${a.id}: ${a.question_fr.substring(0, 60)}...`);
}

const merged = {
  questions: [...existing.questions, ...added]
};

fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
console.log(`Total questions after merge: ${merged.questions.length}`);
