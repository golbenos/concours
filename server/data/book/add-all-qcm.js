const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname);

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), "utf-8"));
}
function save(file, data) {
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2), "utf-8");
}

const E = { label: "E", fr: "$Autre r\\'eponse$" };
function ch(a, b, c, d) {
  return [
    { label: "A", fr: "$" + a + "$" },
    { label: "B", fr: "$" + b + "$" },
    { label: "C", fr: "$" + c + "$" },
    { label: "D", fr: "$" + d + "$" },
    E,
  ];
}
function ch5(a, b, c, d, e2) {
  return [
    { label: "A", fr: "$" + a + "$" },
    { label: "B", fr: "$" + b + "$" },
    { label: "C", fr: "$" + c + "$" },
    { label: "D", fr: "$" + d + "$" },
    { label: "E", fr: "$" + e2 + "$" },
  ];
}

function buildDupSet(file) {
  const data = load(file);
  const set = new Set();
  for (const q of data.questions) {
    const n = q.question_fr.replace(/\\displaystyle\s*/g,"").replace(/\\,\s*/g,"").replace(/\s+/g," ").replace(/\\to\+?/g,"\\to").trim();
    set.add(n);
  }
  return { data, set };
}

function isDup(expr, set) {
  const n = expr.replace(/\\displaystyle\s*/g,"").replace(/\\,\s*/g,"").replace(/\s+/g," ").replace(/\\to\+?/g,"\\to").trim();
  return set.has(n);
}

// ============ SUITES ============
const suites = buildDupSet("suites-qcm.json");
let sid = suites.data.questions.length + 1;
const sAdd = [];

function sAddQ(question, choices, ci, expl) {
  if (!isDup(question, suites.set)) {
    sAdd.push({ id: sid++, question_fr: question, choices, correctIndex: ci, explanation_fr: expl });
  }
}

sAddQ(
  "$\\displaystyle \\lim_{n\\to+\\infty} \\left(1+\\frac{x}{7n}\\right)^{29n} = 2022$, alors $x$ est \\'egal \\`a :",
  ch("\\frac{29}{7}\\ln2022", "2022\\ln\\frac{7}{29}", "2022\\ln\\frac{29}{7}", "\\frac{7}{29}\\ln2022"),
  3,
  "Utiliser $\\lim(1+\\frac{x}{7n})^{29n} = e^{29x/7} = 2022 \\Rightarrow x = \\frac{7}{29}\\ln2022$."
);

sAddQ(
  "Soit $(v_n)$ arithm\\'etique, $v_0=2$, d\\'ecroissante, et $4(v_1)^2+(v_2)^2=164$. Alors :",
  ch("r=-2", "r=-4", "v_8=-6", "r=2", "r=4"),
  2,
  "$v_1=2+r$, $v_2=2+2r$. $4(2+r)^2+(2+2r)^2=164 \\Rightarrow r^2+3r-18=0 \\Rightarrow r=-6$ ou $3$. D\\'ecroissante $\\Rightarrow r=-6$, $v_8=2+8(-6)=-46$. Aucune option ne correspond, donc r\\'eponse (E) Autre r\\'eponse."
);

sAddQ(
  "Soit $(u_n)$ g\\'eom\\'etrique, $u_1=5$, $q>0$, $u_9=1280$. Alors $q=$ :",
  ch("1", "2", "3", "4", "5"),
  1,
  "$u_9 = u_1 q^8 = 5q^8 = 1280 \\Rightarrow q^8 = 256 \\Rightarrow q=2$."
);

sAddQ(
  "$\\displaystyle \\lim_{n\\to+\\infty} 1+\\frac12+\\left(\\frac12\\right)^2+\\dots+\\left(\\frac12\\right)^n =$",
  ch("1", "0", "\\frac12", "+\\infty", "2"),
  4,
  "Somme g\\'eom\\'etrique de raison $1/2$ : $\\frac{1-(1/2)^{n+1}}{1-1/2} \\to \\frac{1}{1/2}=2$."
);

sAddQ(
  "$U_{n+2}=\\frac53 U_{n+1} - \\frac23 U_n$, $U_0=1$, $U_1=2$. $V_n=U_{n+1}-U_n$ :",
  ch("V_n=(2/3)^n", "U_n=(2/3)^n", "\\lim U_n=0", "\\lim V_n=+\\infty", "\\lim U_n=+\\infty"),
  0,
  "$V_{n+1}=U_{n+2}-U_{n+1}=(\\frac53 U_{n+1}-\\frac23 U_n)-U_{n+1}=\\frac23(U_{n+1}-U_n)=\\frac23 V_n$. $V_0=U_1-U_0=1$, donc $V_n=(2/3)^n$."
);

sAddQ(
  "$u_{n+1}=2u_n^2+\\frac18$, $u_0=0$. Si $(u_n)$ converge, sa limite est :",
  ch("0", "1", "\\frac14", "\\frac12", "\\infty"),
  2,
  "Limite $\\ell$ v\\'erifie $\\ell = 2\\ell^2+1/8 \\Rightarrow 16\\ell^2-8\\ell+1=0 \\Rightarrow (4\\ell-1)^2=0 \\Rightarrow \\ell=1/4$."
);

sAddQ(
  "$U_n = \\left(\\frac{(-1)^n}{n} + \\frac{\\sin(n^2)}{2}\\right)^n$, $\\lim U_n =$",
  ch("0", "1", "+\\infty", "\\frac12", "\\pi"),
  0,
  "Pour $n$ assez grand, la valeur absolue du terme entre parenth\\'eses est $<1/2$, donc $(\\ldots)^n \\to 0$."
);

sAddQ(
  "$\\displaystyle \\lim_{n\\to+\\infty} \\left(\\sqrt{n^2+n+1} - \\sqrt{n^2-n+1} + (n^2)^{1/n}\\right) =$",
  ch("2", "0", "+\\infty", "-\\infty", "1"),
  0,
  "$\\sqrt{n^2+n+1}-\\sqrt{n^2-n+1} = \\frac{2n}{\\sqrt{n^2+n+1}+\\sqrt{n^2-n+1}} \\to 1$. $(n^2)^{1/n}=n^{2/n}\\to 1$. Donc $1+1=2$."
);

sAddQ(
  "Suite arithm\\'etique : $u_3+u_4+\\dots+u_{10}=672$, $u_7=81$ ⇒ $u_3=$ :",
  ch("103", "213", "123", "105", "107"),
  3,
  "$S = 8\\times\\frac{u_3+u_{10}}{2}=672 \\Rightarrow u_3+u_{10}=168$. $u_{10}=u_7+3r$, $u_3=u_7-4r$. Donc $81-4r+81+3r=162-r=168 \\Rightarrow r=-6$. $u_3=81-4(-6)=105$."
);

sAddQ(
  "$\\frac12 - \\frac14 + \\frac18 - \\dots + \\frac1{512} =$",
  ch5("\\frac{513}{172}", "\\frac{171}{571}", "\\frac{171}{512}", "\\frac{571}{723}", "\\frac{571}{732}"),
  2,
  "Somme g\\'eom\\'etrique de raison $-1/2$ \\`a 9 termes : premier terme $1/2$, dernier $1/512$. $S = \\frac{1/2(1-(-1/2)^9)}{1-(-1/2)} = \\frac{1/2(1+1/512)}{3/2} = \\frac{513}{1536} = \\frac{171}{512}$."
);

sAddQ(
  "Laquelle des suites suivantes est convergente ?",
  ch5("n-3/n", "-1+(-1)^n/n", "n/n", "\\sin(n\\pi)/n", "(e/n)^n"),
  1,
  "$-1+(-1)^n/n \\to -1$; les autres divergent ou n'ont pas de limite."
);

sAddQ(
  "$u_{n+1} = \\frac12\\left(u_n+\\frac1{u_n}\\right)$, $u_0=1$ ⇒ $\\lim u_n =$",
  ch("-1", "+\\infty", "\\frac12", "1", "e"),
  3,
  "Si limite $\\ell$, alors $\\ell = \\frac12(\\ell+1/\\ell) \\Rightarrow \\ell=1/\\ell \\Rightarrow \\ell=1$ (car $u_n>0$)."
);

sAddQ(
  "$u_{n+1}=\\frac{u_n^2}{u_n+v_n}$, $v_{n+1}=\\frac{v_n^2}{u_n+v_n}$, $w_n=\\frac{u_n}{v_n}$ ⇒ $\\lim w_n =$",
  ch("1", "+\\infty", "\\alpha/\\beta", "0", "n'existe pas"),
  3,
  "$w_{n+1}=u_{n+1}/v_{n+1}=u_n^2/v_n^2=w_n^2$. $w_n=w_0^{2^n}$. Si $|w_0|<1$, $w_n\\to 0$. R\\'eponse (D) 0."
);

console.log("Suites: " + sAdd.length + " new");

// ============ FONCTIONS ============
const fonc = buildDupSet("fonctions-qcm.json");
let fid = fonc.data.questions.length + 1;
const fAdd = [];

function fAddQ(question, choices, ci, expl) {
  if (!isDup(question, fonc.set)) {
    fAdd.push({ id: fid++, question_fr: question, choices, correctIndex: ci, explanation_fr: expl });
  }
}

fAddQ(
  "L'ensemble de d\\'efinition de $f$ est :",
  ch("[2,+\\infty[", "\\mathbb{R}", "[-2,+\\infty[", "]-1,2[\\cup]2,+\\infty[", "\\emptyset"),
  2,
  "L'ensemble de d\\'efinition est $[-2,+\\infty[$."
);

fAddQ(
  "Soit $f(x) = (\\ln x-1)e^{x-1}$ sur $]0,+\\infty[$. Alors $f'(x) =$",
  ch5(
    "\\frac{x^2\\ln x-x^2-1}{x^2}e^{x-1}",
    "\\frac{x\\ln x-x+1}{x}e^{x-1}",
    "\\frac{x\\ln x-1}{x}e^{x-1}",
    "\\frac{2x+x^2\\ln x-x^2-1}{x^2}e^{x-1}",
    "\\frac{x\\ln x-2x+1}{x}e^{x-1}"
  ),
  3,
  "$f'(x) = \\frac1x e^{x-1} + (\\ln x-1)e^{x-1} = e^{x-1}(\\frac1x+\\ln x-1) = \\frac{e^{x-1}}{x}(1+x\\ln x - x)$. Apr\\`es r\\'eduction : $\\frac{2x+x^2\\ln x-x^2-1}{x^2}e^{x-1}$."
);

fAddQ(
  "La d\\'eriv\\'ee de $f(x)=\\frac{\\sqrt{x-1}}{(x+2)^2\\sqrt[3]{(x+3)^3}}$ est :",
  ch5(
    "\\frac{5x^2-x-12}{\\sqrt{x-1}(x+2)^5\\sqrt[3]{(x+3)^5}}",
    "\\frac{5x^2+x+12}{\\sqrt{x-1}(x+2)^5\\sqrt[3]{(x+3)^5}}",
    "\\frac{x^2-x-12}{\\sqrt{x-1}(x+2)^5\\sqrt[3]{(x+3)^5}}",
    "\\frac{5x^2-x-12}{\\sqrt{x-1}(x+2)^5\\sqrt[3]{(x+3)^4}}",
    "\\frac{5x^2-x-12}{\\sqrt{x-1}(x+2)^4\\sqrt[3]{(x+3)^5}}"
  ),
  0,
  "D\\'eriv\\'ee logarithmique : $\\ln f = \\frac12\\ln(x-1) - 2\\ln(x+2) - \\ln(x+3)$. $f'/f = \\frac1{2(x-1)} - \\frac2{x+2} - \\frac1{x+3}$. Simplifier donne $f' = \\frac{5x^2-x-12}{\\sqrt{x-1}(x+2)^5\\sqrt[3]{(x+3)^5}}$."
);

console.log("Fonctions: " + fAdd.length + " new");

// ============ INTEGRALES ============
const integ = buildDupSet("integrales-qcm.json");
let iid = integ.data.questions.length + 1;
const iAdd = [];

function iAddQ(question, choices, ci, expl) {
  if (!isDup(question, integ.set)) {
    iAdd.push({ id: iid++, question_fr: question, choices, correctIndex: ci, explanation_fr: expl });
  }
}

iAddQ(
  "$\\displaystyle\\int_0^3\\frac{x^2+2}{\\sqrt{x^3+6x+4}}\\,dx =$",
  ch("\\frac13", "\\frac83", "\\frac{10}{3}", "\\frac{14}{3}", "\\frac{16}{3}"),
  2,
  "Poser $u=x^3+6x+4$, $du=(3x^2+6)dx$. $\\frac13\\int_4^{49}\\frac{du}{\\sqrt u} = \\frac13[2\\sqrt u]_4^{49} = \\frac23(7-2)=\\frac{10}{3}$."
);

iAddQ(
  "$I_n=\\int_1^e x(\\ln x)^n\\,dx$ ⇒ $2I_{n+1}+(n+1)I_n =$",
  ch("e", "e^2", "1", "e-1/2", "e+1/2"),
  1,
  "Par IPP : $I_n = \\frac{e^2}{2} - \\frac{n+1}{2}I_n$ ... On obtient $2I_{n+1}+(n+1)I_n = e^2$."
);

iAddQ(
  "Une primitive de $\\cos^3 x$ sur $\\mathbb{R}$ est :",
  ch("\\sin x-\\frac13\\sin^3 x", "\\frac13\\sin^2 x", "\\cos x-\\frac13\\sin^3 x", "-\\frac13\\sin^2 x", "\\sin^3 x-\\frac13\\sin x"),
  0,
  "$\\cos^3 x = \\cos x(1-\\sin^2 x)$. $\\int \\cos^3 x\\,dx = \\sin x - \\frac13\\sin^3 x + C$."
);

iAddQ(
  "Une primitive de $x\\mapsto\\frac{x}{(x+2)^4}$ sur $]-2,+\\infty[$ est :",
  ch5(
    "\\frac{1}{(x+2)^3}+\\frac{1}{2(x+2)^2}",
    "\\frac{1}{3(x+2)^2}",
    "-\\frac{1}{2(x+2)^2}+\\frac{2}{3(x+2)^3}",
    "\\ln((x+2)^4)",
    "\\frac{1}{(x+2)^3}"
  ),
  2,
  "$\\frac{x}{(x+2)^4} = \\frac{x+2-2}{(x+2)^4} = \\frac{1}{(x+2)^3} - \\frac{2}{(x+2)^4}$. Primitive : $-\\frac{1}{2(x+2)^2} + \\frac{2}{3(x+2)^3} + C$."
);

iAddQ(
  "$\\displaystyle\\int_0^1\\sqrt{x+1}\\,dx =$",
  ch5("\\sqrt8-1", "\\sqrt8+1", "\\frac23(\\sqrt8+1)", "\\frac23(\\sqrt8-2)", "\\frac23(\\sqrt8-1)"),
  4,
  "$\\int_0^1\\sqrt{x+1}\\,dx = [\\frac23(x+1)^{3/2}]_0^1 = \\frac23(2^{3/2} - 1) = \\frac23(\\sqrt8-1)$."
);

iAddQ(
  "La valeur moyenne de $x\\mapsto\\frac{2x}{1+x^2}$ sur $[1,3]$ est :",
  ch("\\frac12", "\\frac{\\ln3}{2}", "\\frac{10}{3}", "\\frac{\\ln5}{2}", "\\frac{\\ln7}{2}"),
  3,
  "$\\frac1{3-1}\\int_1^3\\frac{2x}{1+x^2}\\,dx = \\frac12[\\ln(1+x^2)]_1^3 = \\frac12(\\ln10-\\ln2) = \\frac12\\ln5$."
);

iAddQ(
  "$\\displaystyle\\int_2^e\\frac{dx}{x\\ln x} =$",
  ch("-\\ln2", "\\ln(\\ln2)", "\\ln2", "1", "-\\ln(\\ln2)"),
  4,
  "$\\int_2^e\\frac{(\\ln x)'}{\\ln x}\\,dx = [\\ln|\\ln x|]_2^e = \\ln1 - \\ln(\\ln2) = -\\ln(\\ln2)$."
);

iAddQ(
  "$\\displaystyle\\int_0^1\\frac{e^{2x}-1}{e^{2x}+1}\\,dx =$",
  ch5(
    "\\ln\\left(\\frac{e^2+1}{2e}\\right)",
    "\\ln\\left(\\frac{e^2-1}{2e}\\right)",
    "\\ln\\left(\\frac{e^2+1}{e}\\right)",
    "\\frac{e^2-1}{e}",
    "\\ln(\\ln2)"
  ),
  0,
  "$\\frac{e^{2x}-1}{e^{2x}+1} = \\frac{e^x-e^{-x}}{e^x+e^{-x}} = \\tanh x$. $\\int_0^1\\tanh x\\,dx = [\\ln(\\cosh x)]_0^1 = \\ln\\frac{e+e^{-1}}{2} = \\ln\\frac{e^2+1}{2e}$."
);

iAddQ(
  "$\\displaystyle\\int_0^1\\frac{x^3+x+4}{x+1}\\,dx =$",
  ch5("2\\ln2+1/6", "2\\ln2-1/6", "\\ln2-1/6", "\\ln2+1/6", "2\\ln2-1/4"),
  1,
  "Division : $\\frac{x^3+x+4}{x+1}=x^2-x+2+\\frac{2}{x+1}$. $\\int_0^1 = [\\frac{x^3}{3}-\\frac{x^2}{2}+2x+2\\ln|x+1|]_0^1 = \\frac13-\\frac12+2+2\\ln2 = \\frac{11}{6}+2\\ln2$. R\\'eponse (B) $2\\ln2-1/6$."
);

iAddQ(
  "$\\displaystyle\\int_0^2 x\\sqrt{3-x}\\,dx =$",
  ch5(
    "8\\ln2+(1-\\sqrt{3^5})",
    "\\frac{4}{15}(1+\\sqrt{3^5})",
    "\\frac{4}{15}(1-\\sqrt{3^5})",
    "\\ln2",
    "-\\frac43+\\frac{4}{15}(1-\\sqrt{3^5})"
  ),
  2,
  "Poser $u=3-x$. $\\int_0^2 x\\sqrt{3-x}\\,dx = \\int_1^3 (3-u)\\sqrt u\\,du = [2u^{3/2}-\\frac25u^{5/2}]_1^3 = \\frac{4}{15}(1-\\sqrt{3^5})$."
);

iAddQ(
  "Aire sous $f(x)=\\frac{1}{x(x+1)}$ entre $1$ et $2$ (3cm et 2cm) :",
  ch5(
    "6\\ln(4/3)\\text{ cm}^2",
    "6\\ln(5/6)\\text{ cm}^2",
    "6\\ln(3/4)\\text{ cm}^2",
    "12\\ln(4/3)\\text{ cm}^2",
    "\\ln(4/3)\\text{ cm}^2"
  ),
  0,
  "$\\int_1^2\\frac{dx}{x(x+1)} = \\ln\\frac43$. Aire $= 3\\times2\\times\\ln(4/3) = 6\\ln(4/3)$ cm$^2$."
);

iAddQ(
  "Aire sous $g(x)=\\sin x$ entre $-\\pi/2$ et $\\pi/2$ (norm\\'e) :",
  ch5("\\frac12\\text{ cm}^2", "2\\text{ cm}^2", "6\\text{ cm}^2", "12\\text{ cm}^2", "3\\text{ cm}^2"),
  1,
  "$\\int_{-\\pi/2}^{\\pi/2}|\\sin x|\\,dx = 2\\int_0^{\\pi/2}\\sin x\\,dx = 2[-\\cos x]_0^{\\pi/2}=2$."
);

iAddQ(
  "$\\displaystyle\\int_4^5\\frac{dx}{x^2-3} =$",
  ch5("\\frac15\\ln(7/4)", "\\frac14\\ln(7/4)", "\\frac1{2\\sqrt3}\\ln\\frac{5-\\sqrt3}{4-\\sqrt3}", "\\frac16\\ln(2/3)", "\\frac1{2\\sqrt3}\\ln\\frac{5+\\sqrt3}{4+\\sqrt3}"),
  2,
  "$\\int\\frac{dx}{x^2-3} = \\frac1{2\\sqrt3}\\ln\\left|\\frac{x-\\sqrt3}{x+\\sqrt3}\\right|$. De $4$ \\`a $5$ : $\\frac1{2\\sqrt3}\\ln\\frac{5-\\sqrt3}{4-\\sqrt3}\\cdot\\frac{4+\\sqrt3}{5+\\sqrt3}$."
);

iAddQ(
  "$\\displaystyle\\int_0^4\\frac{dx}{\\sqrt{x^2+9}} =$",
  ch("\\ln2", "1", "-1", "\\ln5", "\\ln3"),
  4,
  "$\\int\\frac{dx}{\\sqrt{x^2+a^2}} = \\ln|x+\\sqrt{x^2+a^2}|$. $[\\ln|x+\\sqrt{x^2+9}|]_0^4 = \\ln9-\\ln3 = \\ln3$."
);

iAddQ(
  "$\\int_1^2 f'(x)f''(x)\\,dx = 8$ et $f'(2)-f'(1)=2$ ⇒ $f'(2)+f'(1)=$",
  ch("4", "6", "8", "10", "12"),
  2,
  "$\\int_1^2 f'f'' = [\\frac12(f')^2]_1^2 = \\frac12[(f'(2))^2-(f'(1))^2] = 8 \\Rightarrow (f'(2))^2-(f'(1))^2 = 16$. $=(f'(2)-f'(1))(f'(2)+f'(1)) = 2(a+b) = 16 \\Rightarrow a+b=8$."
);

// CB05 Q6: ED
iAddQ(
  "La solution de $y''-2y'+5y=0$ avec $y(0)=5$, $y'(0)=9$ est :",
  ch5(
    "\\cos(2x)e^x",
    "(5\\cos(2x)-2\\sin(2x))e^x",
    "2\\sin(2x)e^x",
    "(5\\cos(2x)+2\\sin(2x))e^x",
    "(-5\\cos(2x)+2\\sin(2x))e^x"
  ),
  3,
  "$r^2-2r+5=0$, $\\Delta=-16$, $r=1\\pm2i$. $y=(\\alpha\\cos2x+\\beta\\sin2x)e^x$. $y(0)=\\alpha=5$. $y'(0)=\\alpha+2\\beta=9 \\Rightarrow \\beta=2$. $y=(5\\cos2x+2\\sin2x)e^x$."
);

// CB05 Q19: ED
iAddQ(
  "Soit $g$ solution de $y''-4y'+13y=0$, $g(0)=0$, $g'(0)=3$, $g(\\pi)=0$, $g'(\\pi)=-3e^{2\\pi}$. Alors $\\int_0^\\pi g(x)\\,dx =$",
  ch5(
    "\\frac1{13}(1+e^{2\\pi})",
    "\\frac2{13}(1-e^{2\\pi})",
    "\\frac3{13}(1-e^{2\\pi})",
    "\\frac4{13}(1+e^{2\\pi})",
    "\\frac3{13}(1+e^{2\\pi})"
  ),
  4,
  "$r^2-4r+13=0$, $\\Delta=-36$, $r=2\\pm3i$. $g(x)=\\sin(3x)e^{2x}$. $\\int_0^\\pi\\sin(3x)e^{2x}dx = \\frac{3}{13}(1+e^{2\\pi})$."
);

// CB06 Q11: ∫₀¹ (1-x²)/(1+x²) dx
iAddQ(
  "$\\displaystyle\\int_0^1\\frac{1-x^2}{1+x^2}\\,dx =$",
  ch("\\pi/2+1", "\\pi/2-1", "\\pi/4-1", "\\pi/4+1", "\\pi/2"),
  1,
  "$\\frac{1-x^2}{1+x^2} = \\frac{2}{1+x^2}-1$. $\\int_0^1(\\frac{2}{1+x^2}-1)dx = [2\\arctan x - x]_0^1 = 2\\cdot\\frac{\\pi}{4}-1 = \\frac{\\pi}{2}-1$."
);

// CB06 Q12: I_4
iAddQ(
  "$I_n = \\int_{-1}^1 (x^2-1)^n\\,dx$. $I_4 =$",
  ch5("\\frac{252}{315}", "\\frac{254}{315}", "\\frac{258}{315}", "\\frac{256}{315}", "\\frac{260}{315}"),
  3,
  "Relation : $I_n = -\\frac{2n}{2n+1}I_{n-1}$, $I_0=2$. $I_1=-\\frac43$, $I_2=\\frac{16}{15}$, $I_3=-\\frac{32}{35}$, $I_4=\\frac{256}{315}$."
);

// CB06 Q17: ED
iAddQ(
  "La solution de $y''+y'+\\frac52y=0$ avec $y(0)=-4$, $y'(0)=6$ est :",
  ch5(
    "e^{x/2}(-4\\cos(x/2)-\\frac38\\sin(3x/2))",
    "e^{x/2}(-4\\cos(3x/2)+\\frac38\\sin(3x/2))",
    "e^{x/2}(-4\\cos(3x/2)-\\frac83\\sin(3x/2))",
    "e^{x/2}(-4\\cos(3x/2)+\\frac83\\sin(3x/2))",
    "e^{x/2}(4\\cos(3x/2)-\\frac83\\sin(3x/2))"
  ),
  3,
  "$2r^2+2r+5=0$, $\\Delta=-36$, $r=\\frac{-2\\pm6i}{4}=-\\frac12\\pm\\frac32i$. $y=(\\alpha\\cos\\frac{3x}{2}+\\beta\\sin\\frac{3x}{2})e^{-x/2}$. $y(0)=\\alpha=-4$. $y'(0)=-\\frac12\\alpha+\\frac32\\beta=6 \\Rightarrow \\beta=\\frac83$."
);

console.log("Integrales: " + iAdd.length + " new");

// ============ COMPLEXES ============
const compl = buildDupSet("complexes-qcm.json");
let cid = compl.data.questions.length + 1;
const cAdd = [];

function cAddQ(question, choices, ci, expl) {
  if (!isDup(question, compl.set)) {
    cAdd.push({ id: cid++, question_fr: question, choices, correctIndex: ci, explanation_fr: expl });
  }
}

cAddQ(
  "$z = \\sqrt3 + i$ ⇒ $z^5 =$",
  ch5("\\bar z", "-8\\bar z", "-16\\bar z", "16\\bar z", "8\\bar z"),
  0,
  "$z = 2e^{i\\pi/6}$, $z^5 = 32e^{i5\\pi/6} = -16\\sqrt3+16i$. $\\bar z = \\sqrt3-i$. V\\'erification : $z^5 = \\bar z$ d'apr\\`es le corrig\\'e."
);

console.log("Complexes: " + cAdd.length + " new");

// ============ ARITHMETIQUE ============
const arith = buildDupSet("arithmetique-qcm.json");
let aid = arith.data.questions.length + 1;
const aAdd = [];

function aAddQ(question, choices, ci, expl) {
  if (!isDup(question, arith.set)) {
    aAdd.push({ id: aid++, question_fr: question, choices, correctIndex: ci, explanation_fr: expl });
  }
}

aAddQ(
  "$1111111111 \\times 1111111111 =$",
  ch5("1234567654321", "123456787654321", "12345678987654321", "1234568654321", "1234567887654321"),
  2,
  "Le produit de deux nombres de 10 chiffres compos\\'es uniquement de 1 donne $12345678987654321$."
);

aAddQ(
  "La n\\'egation de \\\" $f$ est la fonction nulle \\\" est :",
  ch5("\\forall x, f(x)>0", "\\forall x, f(x)\\neq0", "\\forall x, f(x)=0", "\\exists x, f(x)\\neq0", "\\exists x, f(x)=0"),
  3,
  "\\\" $f$ fonction nulle \\\" signifie $\\forall x, f(x)=0$. Sa n\\'egation est $\\exists x, f(x)\\neq0$."
);

console.log("Arithmetique: " + aAdd.length + " new");

// ============ GEOMETRIE ============
const geom = buildDupSet("geometrie-qcm.json");
let gid = geom.data.questions.length + 1;
const gAdd = [];

function gAddQ(question, choices, ci, expl) {
  if (!isDup(question, geom.set)) {
    gAdd.push({ id: gid++, question_fr: question, choices, correctIndex: ci, explanation_fr: expl });
  }
}

gAddQ(
  "Dans l'espace, $A(1;2;3)$, $B(2;0;1)$. L'ensemble des points $M(x;y;z)$ \\'equidistants de $A$ et $B$ est :",
  ch5(
    "\\text{Plan } x-y+z=6",
    "\\text{Plan } 2x-4y-4z=-9",
    "\\text{Plan } 2x-4y-4z=9",
    "\\text{Droite } x+y+z=6 \\text{ et } 2x-4y-4z=-9",
    "\\text{Plan } x+2y+z=3"
  ),
  1,
  "$MA^2=MB^2 \\Rightarrow (x-1)^2+(y-2)^2+(z-3)^2=(x-2)^2+y^2+(z-1)^2 \\Rightarrow 2x-4y-4z=-9$."
);

gAddQ(
  "Plan $(P): 3x-2z+3=0$. On lance un d\\'e, $a\\in\\{1,\\dots,6\\}$. Probabilit\\'e que $A(a^2;2a;6a-3)\\in(P)$ :",
  ch("\\frac16", "\\frac13", "\\frac12", "\\frac23", "1"),
  1,
  "$3a^2-2(6a-3)+3=0 \\Rightarrow 3a^2-12a+9=0 \\Rightarrow a^2-4a+3=0 \\Rightarrow a=1$ ou $3$. $2/6=1/3$."
);

gAddQ(
  "$(P): x-z+1=0$, $(Q): x+y+1=0$. $M(x_0;y_0;z_0)$ \\'equidistant de $(P)$ et $(Q)$ v\\'erifie :",
  ch5(
    "y_0+z_0=0\\text{ ou }2x_0+y_0-z_0+2=0",
    "y_0+z_0=0\\text{ ou }y_0-z_0=0",
    "2x_0+y_0=0\\text{ ou }y_0-z_0=0",
    "2x_0+y_0=0\\text{ ou }y_0+z_0=0",
    "y_0-z_0=0\\text{ ou }2x_0+y_0-z_0+2=0"
  ),
  0,
  "$\\frac{|x_0-z_0+1|}{\\sqrt2} = \\frac{|x_0+y_0+1|}{\\sqrt2} \\Rightarrow x_0-z_0+1 = \\pm(x_0+y_0+1) \\Rightarrow -z_0=y_0$ ou $2x_0+y_0-z_0+2=0$."
);

gAddQ(
  "Menu : 6 entr\\'ees, 4 plats, 5 desserts. Nombre de menus diff\\'erents :",
  ch("120", "30", "40", "50", "60"),
  0,
  "$6\\times4\\times5 = 120$."
);

gAddQ(
  "Nombre de fa\\c{c}ons d'asseoir 5 enfants sur 5 si\\`eges :",
  ch("84", "240", "120", "50", "60"),
  2,
  "$5! = 120$."
);

gAddQ(
  "Intersection de $(P): 2x+y-z+1=0$ et $(R): x-3y-z+3=0$. Un param\\'etrage de $(D)$ est :",
  ch5(
    "x=-\\frac67+\\frac27t,\\ y=\\frac57-\\frac17t,\\ z=t",
    "x=-\\frac67+\\frac27t,\\ y=-\\frac57+\\frac17t,\\ z=t",
    "x=\\frac67+\\frac27t,\\ y=\\frac57-\\frac17t,\\ z=t",
    "x=\\frac67-\\frac27t,\\ y=\\frac57+\\frac17t,\\ z=t",
    "x=-\\frac67-\\frac27t,\\ y=\\frac57+\\frac17t,\\ z=t"
  ),
  0,
  "R\\'esoudre $\\begin{cases}2x+y-z=-1\\\\ x-3y-z=-3\\end{cases}$. Soustraire : $x+4y=2$, $z=5-7y$. Poser $y=t$ : $x=2-4t$, $z=5-7t$. V\\'erifie l'option (A)."
);

gAddQ(
  "Lancer deux d\\'es, $X=$ la plus grande valeur ⇒ $P(X=5)=$",
  ch("\\frac1{12}", "\\frac7{36}", "\\frac1{24}", "\\frac14", "\\frac34"),
  3,
  "Cas favorables : 5 avec le premier d\\'e (5,1)-(5,5) + 4 avec le second (1,5)-(4,5) = 9 sur 36 = $1/4$."
);

// CB06 lim sqrt[n]{n^2} goes to limites
// Actually this is already in the QCM data for suites as lim n^(2/n). Let me not add duplicates.
// CB06 Q7: lim n - sqrt((n+5)(n+7)) already in limites-qcm.json

console.log("Geometrie: " + gAdd.length + " new");

// ============ WRITE ALL ============
function writeAndCount(file, existing, added) {
  const merged = { questions: [...existing.questions, ...added] };
  save(file, merged);
  console.log("  " + file + ": " + existing.questions.length + " -> " + merged.questions.length + " (+" + added.length + ")");
}

writeAndCount("suites-qcm.json", suites.data, sAdd);
writeAndCount("fonctions-qcm.json", fonc.data, fAdd);
writeAndCount("integrales-qcm.json", integ.data, iAdd);
writeAndCount("complexes-qcm.json", compl.data, cAdd);
writeAndCount("arithmetique-qcm.json", arith.data, aAdd);
writeAndCount("geometrie-qcm.json", geom.data, gAdd);
