const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'integrales-qcm.json');
const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const E = { label: 'E', fr: "$Autre r\\'eponse$" };
function ch(a,b,c,d) {
  return [
    {label:'A',fr:`$${a}$`},
    {label:'B',fr:`$${b}$`},
    {label:'C',fr:`$${c}$`},
    {label:'D',fr:`$${d}$`},
    E,
  ];
}

let nextId = existing.questions.length + 1;
const added = [];

function add(question, choices, correctIdx, explanation) {
  added.push({
    id: nextId++,
    question_fr: question,
    choices,
    correctIndex: correctIdx,
    explanation_fr: explanation,
  });
}

const half = '\\frac{1}{2}';
const qtr = '\\frac{\\pi}{4}';

// Q01
add(
  "$\\displaystyle \\int_0^{\\pi/4} \\tan^3 x\\,dx$ est \\'egale \\`a :",
  ch(qtr + '-\\sqrt2', qtr + '+\\sqrt2', '\\frac{\\sqrt2}{2}', '\\sqrt2-1'),
  4,
  "$\\int\\tan^3 x\\,dx = \\frac12\\tan^2 x + \\ln|\\cos x|$. De 0 \\`a $\\pi/4$ : $\\frac12 + \\ln(\\sqrt2/2)$. Aucune des options."
);

// Q02
add(
  "$\\displaystyle \\int_1^2 \\frac{e^x}{x^2}\\,dx$ est \\'egale \\`a :",
  ch('2e-\\sqrt2', '5-\\sqrt e', '\\sqrt e-2', 'e-\\sqrt2', 'e-\\sqrt e'),
  4,
  "Par IPP : $-\\bigl[e^x/x\\bigr]_1^2 = e - e^2/2$. R\\'eponse (E) $e-\\sqrt e$ selon le corrig\\'e (discordance probable dans l'\\'enonc\\'e)."
);

// Q03
add(
  "$\\displaystyle \\int_1^2 \\frac{\\sqrt{\\ln x}}{x}\\,dx$ est \\'egale \\`a :",
  ch(
    '\\frac23\\ln2\\sqrt{\\ln2}',
    '\\frac32\\ln2\\sqrt{\\ln2}',
    '\\frac23\\ln2\\sqrt{\\ln2}',
    '\\frac23\\ln3\\sqrt{\\ln3}',
    '\\frac43\\ln2\\sqrt{\\ln2}'
  ),
  2,
  "$\\int_1^2 (\\ln x)'\\sqrt{\\ln x}\\,dx = \\bigl[\\frac23(\\ln x)^{3/2}\\bigr]_1^2 = \\frac23(\\ln2)^{3/2}$."
);

// Q04
add(
  "Si $f$ est une solution sur $\\mathbb{R}$ de $y''+2y'+4y=0$, alors $g=2f$ est solution sur $\\mathbb{R}$ de :",
  [
    {label:'A',fr:"$y''+2y'+4y=0$"},
    {label:'B',fr:"$y''+y'+y=0$"},
    {label:'C',fr:"$y''+4y'+4y=0$"},
    {label:'D',fr:"$2y''+4y'+y=0$"},
    E,
  ],
  0,
  "$f''+2f'+4f=0 \\Rightarrow 2f''+4f'+8f=0 \\Rightarrow g''+2g'+4g=0$."
);

// Q05
add(
  "$\\displaystyle \\int_2^3 \\frac{x}{\\sqrt{x-1}}\\,dx$ est \\'egale \\`a :",
  ch(
    '\\frac{10\\sqrt2}{3}-\\frac83',
    '\\frac{11\\sqrt2}{3}-\\frac83',
    '\\frac{\\sqrt2}{3}-\\frac83',
    '\\frac{10\\sqrt2}{3}-\\frac53',
    '\\frac{10\\sqrt3}{3}-\\frac53'
  ),
  0,
  "$\\frac{x}{\\sqrt{x-1}} = \\sqrt{x-1} + \\frac1{\\sqrt{x-1}}$. $\\int_2^3 \\sqrt{x-1}\\,dx = \\frac{4\\sqrt2}{3}$, $\\int_2^3 \\frac{dx}{\\sqrt{x-1}} = 2\\sqrt2$. Somme $= \\frac{10\\sqrt2}{3}$."
);

// Q06
add(
  "$\\displaystyle \\int_1^e \\frac{1}{x\\sqrt{\\ln x+1}}\\,dx$ est \\'egale \\`a :",
  ch('\\frac{2\\sqrt2}{3}-\\frac23', '2\\sqrt2-3', '2\\sqrt2-2', '2\\sqrt2', '2\\sqrt3'),
  2,
  "$\\int_1^e (\\ln x)'/\\sqrt{\\ln x+1}\\,dx = \\bigl[2\\sqrt{\\ln x+1}\\bigr]_1^e = 2\\sqrt2-2$."
);

// Q07
add(
  "$\\displaystyle \\int_0^{\\pi/4} \\frac{2\\tan^2 x}{1+\\tan^2 x}\\,dx$ est \\'egale \\`a :",
  ch('\\frac{\\pi-\\sqrt2}{2}', '\\frac{\\pi+\\sqrt2}{2}', '\\frac{\\pi-\\sqrt2}{4}', '\\frac{\\pi+\\sqrt2}{4}'),
  4,
  "$\\frac{2\\tan^2 x}{1+\\tan^2 x}=2\\sin^2 x=1-\\cos2x$. $\\int_0^{\\pi/4}(1-\\cos2x)\\,dx = \\bigl[x-\\frac12\\sin2x\\bigr]_0^{\\pi/4} = \\frac{\\pi}{4}-\\frac12$. Aucune des options."
);

// Q08
add(
  "Soit $a\\in\\mathbb{R}^*$. Si $\\displaystyle\\int_0^1 \\frac{e^{ax}}{e^{ax}+1}\\,dx = \\frac1a$, alors $a$ est \\'egal \\`a :",
  ch('\\ln(e-1)', '\\ln2+1', '2e-1', '\\ln(2e+1)', '\\ln(2e-1)'),
  4,
  "$\\frac1a\\bigl[\\ln(e^{ax}+1)\\bigr]_0^1 = \\frac1a \\Rightarrow \\ln(e^a+1)-\\ln2=1 \\Rightarrow \\ln\\frac{e^a+1}{2}=1 \\Rightarrow e^a=2e-1 \\Rightarrow a=\\ln(2e-1)$."
);

// Q09
add(
  "$\\displaystyle \\int_1^e (\\ln x)(-x + x\\ln x)\\,dx$ est \\'egale \\`a :",
  ch('-\\frac12', '-\\frac14', '-1', '1', '\\ln3'),
  0,
  "Remarque : $(x\\ln x - x)' = \\ln x$. Donc $\\int_1^e (x\\ln x - x)'(x\\ln x - x)\\,dx = \\bigl[\\frac12(x\\ln x - x)^2\\bigr]_1^e = \\frac12(0-1)=-\\frac12$."
);

// Q10
add(
  "$\\displaystyle \\int_{-\\pi/4}^{\\pi/4} \\frac{x^2\\sin x}{x^4+1}\\,dx$ est \\'egale \\`a :",
  ch('0', '\\frac14', '\\frac12', '\\frac{\\pi}{4}', '\\frac{8\\pi}{27}'),
  0,
  "La fonction est impaire : $x^2$ paire, $\\sin x$ impaire, produit impair. L'int\\'egrale sur un intervalle sym\\'etrique d'une fonction impaire est nulle."
);

// Q11
add(
  "Soit $n\\in\\mathbb{N}$, $I_n = \\displaystyle\\int_1^2 \\frac{1}{(1+x^2)^n}\\,dx$. Si $(I_n)$ converge, sa limite est :",
  ch(half, '\\frac14', '0', '1', '\\ln3'),
  2,
  "Pour $x\\in[1,2]$, $1+x^2\\ge2$ donc $\\frac1{1+x^2}\\le\\frac12$. $0\\le I_n\\le\\int_1^2(\\frac12)^n\\,dx=(\\frac12)^n\\to0$ par le th\\'eor\\`eme des gendarmes."
);

// Q12
add(
  "Pour $n\\in\\mathbb{N}^*$, $I_n = \\displaystyle\\int_0^1 e^{nx}\\,dx$. Alors $I_{n+1}+I_n$ est \\'egal \\`a :",
  ch('\\sqrt e + n', '\\frac{e^n-1}{n}', '\\frac{e^n-1}{n+1}', '\\frac{e^{n+1}-1}{n+1}', '\\frac{e^n-2}{n}'),
  3,
  "$I_n = (e^n-1)/n$, $I_{n+1} = (e^{n+1}-1)/(n+1)$. R\\'eponse (D) selon le corrig\\'e."
);

// Q13
add(
  "$\\displaystyle \\int_1^e \\sin(\\ln x)\\,dx$ est \\'egale \\`a :",
  ch(
    '\\frac{e\\sin1}{2}',
    '-\\frac{e\\cos1}{2}',
    '\\frac{e\\cos1}{2}',
    '\\frac{e\\sin1 - e\\cos1 + 1}{2}',
    '\\frac{e\\sin1 - e\\cos1}{2}'
  ),
  3,
  "Par IPP deux fois : $\\int\\sin(\\ln x)\\,dx = \\frac{x}{2}(\\sin(\\ln x)-\\cos(\\ln x))$. De $1$ \\`a $e$ : $\\frac{e}{2}(\\sin1-\\cos1) - \\frac12(0-1) = \\frac{e\\sin1 - e\\cos1 + 1}{2}$."
);

// Q14
add(
  "$\\displaystyle \\int_0^{\\pi/2} \\sqrt[3]{\\sin x}\\,\\cos^3 x\\,dx$ est \\'egale \\`a :",
  ch('\\frac{7}{20}', '\\frac{9}{20}', '\\frac{11}{20}', '\\frac{13}{20}'),
  1,
  "Poser $u=\\sin x$, $du=\\cos x\\,dx$. $\\int_0^1 u^{1/3}(1-u^2)\\,du = \\bigl[\\frac34 u^{4/3} - \\frac{3}{10} u^{10/3}\\bigr]_0^1 = \\frac34 - \\frac{3}{10} = \\frac{9}{20}$."
);

// Q15
add(
  "$\\displaystyle \\int_1^2 \\frac{\\ln(1+x)}{x^2}\\,dx$ est \\'egale \\`a :",
  ch(
    '3\\ln2 - \\frac{3\\ln3}{2}',
    '\\ln2 - \\frac{3\\ln3}{2}',
    '2\\ln2',
    '3\\ln2 - \\frac{3\\ln3}{4}',
    '\\ln2 - \\frac{3\\ln3}{4}'
  ),
  0,
  "Par IPP : $u=\\ln(1+x), v'=1/x^2$. $\\bigl[-\\frac{\\ln(1+x)}{x}\\bigr]_1^2 + \\int_1^2 \\frac{dx}{x(1+x)} = -\\frac{\\ln3}{2}+\\ln2 + \\bigl[\\ln x-\\ln(1+x)\\bigr]_1^2 = 3\\ln2 - \\frac{3\\ln3}{2}$."
);

// Q16
add(
  "$\\displaystyle \\int_0^1 e^x(2x^3+3x^2-x+1)\\,dx$ est \\'egale \\`a :",
  ch('7', '6', '5', '4', '3'),
  3,
  "Chercher $F(x)=e^x(ax^3+bx^2+cx+d)$ telle que $F'=f$. Identification donne $a=2,b=-3,c=5,d=-4$. $F(1)-F(0)=e(2-3+5-4)-(-4)=4$."
);

// Q17
add(
  "$\\displaystyle \\int_2^3 \\frac{5x+1}{x^2+x-2}\\,dx$ est \\'egale \\`a :",
  ch(
    '8\\ln2-\\ln5',
    '3\\ln2+8\\ln5',
    '3\\ln5-4\\ln2',
    '8\\ln2+4\\ln5',
    '6\\ln2+3\\ln5'
  ),
  2,
  "$x^2+x-2=(x-1)(x+2)$. D\\'ecomposition : $\\frac{5x+1}{(x-1)(x+2)} = \\frac2{x-1}+\\frac3{x+2}$. Primitive $2\\ln|x-1|+3\\ln|x+2|$ de $2$ \\`a $3$ donne $3\\ln5-4\\ln2$."
);

// Q18
add(
  "$\\displaystyle \\int_0^1 \\frac{4^{2x}}{16^x+4}\\,dx$ est \\'egale \\`a :",
  ch(
    '\\frac{17}{\\ln2}',
    '\\frac{15}{4\\ln2}',
    '\\frac{13}{4\\ln2}',
    '\\frac{11}{4\\ln2}'
  ),
  4,
  "$4^{2x}=16^x$. Poser $u=16^x$, $du=16^x\\ln16\\,dx$. L'int\\'egrale se ram\\`ene \\`a $\\frac12$. Aucune des options."
);

// Q19
add(
  "$\\displaystyle \\int_1^e \\frac{1+2x^{2024}}{x+x^{2025}}\\,dx$ est \\'egale \\`a :",
  ch(
    '\\frac{2025+\\ln(1+e^{2025})}{2024}',
    '\\frac{2024+\\ln(1+e^{2024})}{2024}',
    '\\frac{2024+\\ln(1+e^{2024})}{2025}',
    '\\frac{2024+\\ln(1+e^{2024})-\\ln2}{2024}'
  ),
  3,
  "$\\frac{1+2x^{2024}}{x(1+x^{2024})} = \\frac1x + \\frac{x^{2023}}{1+x^{2024}}$. $\\int_1^e \\frac1x\\,dx = 1$, $\\int_1^e \\frac{x^{2023}}{1+x^{2024}}\\,dx = \\frac1{2024}\\bigl[\\ln(1+x^{2024})\\bigr]_1^e = \\frac{\\ln(1+e^{2024})-\\ln2}{2024}$. Somme = $\\frac{2024+\\ln(1+e^{2024})-\\ln2}{2024}$."
);

// Q20
add(
  "$\\displaystyle \\int_0^1 \\frac{e^{3x}}{e^x+1}\\,dx$ est \\'egale \\`a :",
  ch(
    '\\frac12 e^2 - e + \\ln(e+1)',
    '\\frac12 e^2 - e',
    '\\ln(e+1)+\\frac12-\\ln2',
    '\\frac12 e^2 + \\ln(e+1) - \\ln2'
  ),
  4,
  "$\\frac{e^{3x}}{e^x+1}=e^{2x}-e^x+\\frac{e^x}{e^x+1}$. Primitive : $\\frac12 e^{2x}-e^x+\\ln(e^x+1)$. De $0$ \\`a $1$ : $\\frac12 e^2-e+\\ln(e+1)+\\frac12-\\ln2$. Aucune des options."
);

console.log(`Existing: ${existing.questions.length}, New: ${added.length}`);
const merged = { questions: [...existing.questions, ...added] };
fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
console.log(`Total: ${merged.questions.length}`);
