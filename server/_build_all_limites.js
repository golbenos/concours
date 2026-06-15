const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, 'data', 'book');

// ---- Remove section V from fonctions-course.json ----
const fcPath = path.join(base, 'fonctions-course.json');
const fc = JSON.parse(fs.readFileSync(fcPath, 'utf-8'));
fc.course = fc.course.filter(s => !s.title.includes('Limites'));
fs.writeFileSync(fcPath, JSON.stringify(fc, null, 2) + '\n', 'utf-8');
console.log('Removed section V from fonctions-course.json');

// ---- Create limites-course.json ----
const limitesCourse = {
  course: [{
    title: "Tableau de référence — 100 limites classiques",
    items: [
      "Méthodes autorisées (2BAC SM) : factorisation, conjugué, théorème des gendarmes, limites usuelles $\\sin x/x$, $(e^x-1)/x$, $\\ln(1+x)/x$, $\\arctan x/x$, croissances comparées, règle de l'Hôpital pour $0/0$ ou $\\infty/\\infty$.",
      "**Rappels** : $\\lim_{x\\to0}\\frac{\\sin x}{x}=1$, $\\lim_{x\\to0}\\frac{e^x-1}{x}=1$, $\\lim_{x\\to0}\\frac{\\ln(1+x)}{x}=1$, $\\lim_{x\\to0}\\frac{\\arctan x}{x}=1$, $\\lim_{x\\to+\\infty}\\frac{\\ln x}{x}=0$, $\\lim_{x\\to+\\infty}x^n e^{-x}=0$.",
      "**Règle de L'Hôpital** : Pour $\\frac{0}{0}$ ou $\\frac{\\infty}{\\infty}$, si $\\lim f'/g'$ existe, alors $\\lim f/g = \\lim f'/g'$.",
      "**Techniques** : multiplier par le conjugué pour les racines, $\\sin x\\sim x$, $\\cos x-1\\sim -x^2/2$, factoriser le terme dominant en $\\infty$.",
      "**Forme $f^g$** : écrire $\\ln y = g\\ln f$ et étudier la limite."
    ]
  }]
};
fs.writeFileSync(path.join(base, 'limites-course.json'), JSON.stringify(limitesCourse, null, 2) + '\n', 'utf-8');
console.log('Created limites-course.json');

// ---- Create limites-qcm.json ----
const data = [
  ["\\lim_{x\\to0}\\frac{\\sin(2x)-\\sin(x)}{\\sin(2x)+\\sin(x)}", "\\frac13", ["\\frac13","+\\infty","0","2","Autre r\\'eponse"], "Factoriser $\\sin x$ : $\\frac{\\sin x(2\\cos x-1)}{\\sin x(2\\cos x+1)}=\\frac{2\\cos x-1}{2\\cos x+1}\\to\\frac13$"],
  ["\\lim_{x\\to\\pi/2}(\\pi-2x)\\tan x", "2", ["0","+\\infty","2","\\pi","Autre r\\'eponse"], "Poser $t=\\pi/2-x\\to0$, $\\tan x=\\cot t\\sim1/t$ ⇒ $2t\\cdot1/t=2$"],
  ["\\lim_{x\\to+\\infty}\\frac{\\pi\\sin(\\pi+\\sqrt{x})}{\\sqrt{x^3+x+1}}", "0", ["1","+\\infty","0","\\pi","Autre r\\'eponse"], "$|\\sin|\\le1$, d\\'eno $\\to+\\infty$ ⇒ gendarmes"],
  ["\\lim_{x\\to0}\\frac{\\sqrt{x+1}-\\sqrt{1-x}}{\\sin x}", "1", ["1","+\\infty","0","2","Autre r\\'eponse"], "Conjugu\\'e : $\\frac{2x}{\\sin x(\\sqrt{x+1}+\\sqrt{1-x})}\\to\\frac{2}{1\\cdot2}=1$"],
  ["\\lim_{x\\to+\\infty}\\frac{\\sin^2x-\\cos^3x}{x}", "0", ["1","+\\infty","0","2","Autre r\\'eponse"], "Num born\\'e $[-1,1]$, d\\'eno $\\to+\\infty$"],
  ["\\lim_{x\\to0^+}(\\sin x)^x", "1", ["1","+\\infty","0","e","Autre r\\'eponse"], "$\\ln y=x\\ln(\\sin x)$ ; $\\sin x\\sim x$ ⇒ $x\\ln x\\to0$ ⇒ $y\\to e^0=1$"],
  ["\\lim_{x\\to0^+}x^{\\ln(3x)}", "+\\infty", ["2","+\\infty","0","e","Autre r\\'eponse"], "$\\ln y=\\ln(3x)\\ln x\\to(-\\infty)(-\\infty)=+\\infty$ ⇒ $y\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}\\frac{2^x}{\\ln(x^2+1)}", "+\\infty", ["2","+\\infty","e","1","Autre r\\'eponse"], "Exp domine log"],
  ["\\lim_{x\\to1^+}\\ln x\\cdot\\ln(\\ln x)", "0", ["0","+\\infty","1","-\\infty","Autre r\\'eponse"], "Poser $t=\\ln x\\to0^+$ ⇒ $t\\ln t\\to0$"],
  ["\\lim_{x\\to0^+}x\\ln(x^2-x)", "0", ["0","+\\infty","e","1","Autre r\\'eponse"], "$x^2-x\\sim -x$ ⇒ $\\ln(x^2-x)\\sim\\ln x$ ⇒ $x\\ln x\\to0$"],
  ["\\lim_{x\\to1^-}\\frac{1}{x^2-1}e^{-1/(x-1)}", "-\\infty", ["e^2","+\\infty","0","e^{-1}","Autre r\\'eponse"], "$t=x-1\\to0^-$ ; $x^2-1\\sim2t$ ; $\\frac{1}{2t}\\to-\\infty$, $e^{-1/t}\\to+\\infty$ ⇒ prod $-\\infty$"],
  ["\\lim_{x\\to0}\\frac{x}{\\sin x}", "1", ["1","+\\infty","e","3","Autre r\\'eponse"], "$\\lim_{u\\to0}\\frac{\\sin u}{u}=1$ ⇒ inverse $\\to1$"],
  ["\\lim_{x\\to a}\\frac{xf(a)-af(x)}{x-a}", "f(a)-af'(a)", ["f(a)","f'(a)","f(a)-af(a)","f(a)-af'(a)","Autre r\\'eponse"], "$\\frac{(x-a)f(a)-a(f(x)-f(a))}{x-a}\\to f(a)-af'(a)$"],
  ["\\lim_{x\\to2}\\frac{x-2}{\\ln x}", "2", ["1","\\frac12","0","e","Autre r\\'eponse"], "H\\^opital : $\\frac{1}{1/x}=x\\to2$"],
  ["\\lim_{x\\to0}\\frac{2025x}{e^{2024x}-e^{2023x}}", "2025", ["2025","1","2025e","0","Autre r\\'eponse"], "$e^{2023x}(e^x-1)\\sim e^{2023x}x$ ⇒ $\\frac{2025x}{e^{2023x}x}\\to2025$"],
  ["\\lim_{x\\to0}\\frac{\\sqrt{x+1}-1}{\\ln(e+x)-1}", "\\frac{e}{2}", ["2","e","0","e^{-1}","Autre r\\'eponse"], "$\\sqrt{x+1}-1\\sim x/2$, $\\ln(e+x)-1=\\ln(1+x/e)\\sim x/e$ ⇒ $\\frac{1/2}{1/e}=e/2$"],
  ["\\lim_{x\\to1}\\frac{x^2-1}{\\ln x}", "2", ["1","\\frac23","\\frac32","0","Autre r\\'eponse"], "H\\^opital : $\\frac{2x}{1/x}=2x^2\\to2$"],
  ["\\lim_{x\\to0}\\frac{\\sqrt{3x}\\ln(1+x)}{\\sqrt{x+x^2}-\\sqrt{x}}", "2\\sqrt3", ["2\\sqrt3","1","3\\sqrt2","\\frac16","Autre r\\'eponse"], "$\\sqrt{x+x^2}-\\sqrt{x}=\\sqrt{x}(\\sqrt{1+x}-1)\\sim x^{3/2}/2$ ; num $\\sim\\sqrt3\\,x^{3/2}$"],
  ["\\lim_{x\\to1}\\frac{\\tan(\\pi x)+\\dots+\\tan(n\\pi x)}{\\tan(\\pi x)}", "\\frac{n(n+1)}{2}", ["0","\\pi","1/\\pi","1","Autre r\\'eponse"], "$\\tan(k\\pi x)\\sim k\\pi(x-1)$ ; somme $\\sim\\pi(x-1)\\frac{n(n+1)}{2}$"],
  ["\\lim_{x\\to0}\\frac{e^x-1}{x^3-3x-2}", "0", ["e","0","-\\infty","\\frac12","Autre r\\'eponse"], "Num $\\sim x\\to0$, d\\'eno $\\to-2\\neq0$"],
  ["\\lim_{x\\to1}\\frac{x^3-3x-2}{\\ln(\\cos(3x))}", "+\\infty", ["0","\\frac23","+\\infty","-\\infty","Autre r\\'eponse"], "Num $\\to-4$, d\\'eno $\\to\\ln(\\cos3)<0$ ⇒ $+\\infty$"],
  ["\\lim_{x\\to0}\\frac{\\sin^2(2x)}{\\ln(\\cos(3x))}", "-\\frac{8}{9}", ["-\\infty","0","0","0","Autre r\\'eponse"], "$\\sin^2(2x)\\sim4x^2$, $\\ln(\\cos(3x))\\sim-\\frac{9x^2}{2}$ ⇒ $\\frac{4}{-9/2}=-8/9$"],
  ["\\lim_{x\\to0}\\frac{\\ln x-1}{x}", "-\\infty", ["1","2","0","+\\infty","Autre r\\'eponse"], "$\\ln x\\to-\\infty$, $x\\to0^+$"],
  ["\\lim_{x\\to1}\\frac{\\ln(\\cos^{-1}x)}{x-1}", "0", ["0","\\frac{\\pi}{6}","\\frac{\\pi}{3}","1","Autre r\\'eponse"], "$t=\\cos^{-1}x\\to0$, croissances compar\\'ees"],
  ["\\lim_{x\\to1}\\frac{x+x^2+\\dots+x^n-n}{x-1}", "\\frac{n(n+1)}{2}", ["n","\\frac{n(n+1)}{2}","0","\\frac{n(n+2)}{2}","Autre r\\'eponse"], "Taux : $f'(1)=1+2+\\dots+n$"],
  ["\\lim_{x\\to0}\\frac{1-\\cos x}{x}", "0", ["\\frac{n(n+1)}{2}","\\frac{n(n+2)}{2}","n^2","0","Autre r\\'eponse"], "$1-\\cos x\\sim x^2/2$ ⇒ $x/2\\to0$"],
  ["\\lim_{x\\to0}\\frac{\\ln(\\cos2x)}{x^2}", "-2", ["\\frac49","0","-\\infty","1","Autre r\\'eponse"], "$\\cos2x\\sim1-2x^2$, $\\ln(1-2x^2)\\sim-2x^2$"],
  ["\\lim_{x\\to+\\infty}x\\ln(1+\\frac1x)", "1", ["+\\infty","-\\infty","1","0","Autre r\\'eponse"], "$\\ln(1+1/x)\\sim1/x$"],
  ["\\lim_{x\\to+\\infty}\\ln(x^2+1)-x", "-\\infty", ["+\\infty","0","-\\infty","","Autre r\\'eponse"], "$\\ln(x^2+1)\\sim2\\ln x$, $2\\ln x-x\\to-\\infty$"],
  ["\\lim_{x\\to+\\infty}x(e^{\\sqrt{x^2+1}}-x-1)", "\\frac12", ["+\\infty","+\\infty","1","\\frac12","Autre r\\'eponse"], "$\\sqrt{x^2+1}\\sim x+\\frac1{2x}$, poser $u=1/(2x)$"],
  ["\\lim_{x\\to+\\infty}\\sqrt{x^{2024}+2023}-\\sqrt{x^{2024}}", "0", ["0","-\\infty","1","+\\infty","Autre r\\'eponse"], "Conjugu\\'e : $\\frac{2023}{\\sqrt{x^{2024}+2023}+\\sqrt{x^{2024}}}\\to0$"],
  ["\\lim_{x\\to+\\infty}\\sqrt{a^2x^2+bx}+x-ax", "\\frac{b}{2a}", ["+\\infty","\\frac{b+1}{2a}","0","-\\infty","Autre r\\'eponse"], "$\\sqrt{a^2x^2+bx}=ax\\sqrt{1+\\frac{b}{a^2x}}\\sim ax+\\frac{b}{2a}$ (si $a=1$)"],
  ["\\lim_{x\\to+\\infty}\\frac{x+x^2+\\dots+x^{2024}}{\\ln x}", "+\\infty", ["+\\infty","0","\\frac{2024\\cdot2025}{2}","2024","Autre r\\'eponse"], "$x^{2024}/\\ln x\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}(1+\\frac1x+\\frac1{x^2})^{2x}", "e^2", ["-\\infty","0","+\\infty","e^2","Autre r\\'eponse"], "$(1+1/x+o(1/x))^{2x}\\to e^2$"],
  ["\\lim_{x\\to a}\\frac{\\sqrt{a+2x}-\\sqrt{3a}}{\\sqrt{x}-\\sqrt{a}}", "\\frac{2\\sqrt{a}}{\\sqrt3}", ["3\\sqrt2","2a","\\sqrt3","2\\sqrt{3a}","Autre r\\'eponse"], "Conjugu\\'es ou taux d'accroissement"],
  ["\\lim_{x\\to0}\\frac{x-2}{e^{2x}-1}", "-\\infty", ["1","2","+\\infty","e","Autre r\\'eponse"], "Num $\\to-2$, $e^{2x}-1\\sim2x\\to0$ ⇒ $-\\infty$"],
  ["\\lim_{n\\to\\infty}n-\\sqrt{n^2-n}", "\\frac12", ["\\frac12","0","\\frac13","+\\infty","Autre r\\'eponse"], "Conjugu\\'e : $\\frac{n}{n+\\sqrt{n^2-n}}\\to\\frac12$"],
  ["\\lim_{n\\to\\infty}(\\sqrt{n^2+n+1}-\\sqrt{n^2-n+1})n^2", "+\\infty", ["0","2","-\\infty","+\\infty","Autre r\\'eponse"], "Diff $\\sim1$ ⇒ $n^2\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}\\frac{1+x\\ln\\sqrt{1+a/x}}{x}", "0", ["0","0","a+1","2a^2","Autre r\\'eponse"], "$\\ln\\sqrt{1+a/x}\\sim a/(2x)$ ⇒ num $\\to1+a/2$, /$x\\to0$"],
  ["\\lim_{n\\to\\infty}\\frac{\\sqrt{n^2}}{n}", "1", ["+\\infty","0","1","-\\infty","Autre r\\'eponse"], "$\\sqrt{n^2}=n$"],
  ["\\lim_{n\\to\\infty}n-\\sqrt{(n+5)(n+7)}", "-6", ["-\\infty","+\\infty","0","-6","Autre r\\'eponse"], "$\\sqrt{n^2+12n+35}\\sim n+6$"],
  ["\\lim_{x\\to+\\infty}\\sqrt{9x^2-x+1}-3x", "-\\frac16", ["1","-6","-\\infty","+\\infty","Autre r\\'eponse"], "$\\sqrt{9x^2-x+1}=3x\\sqrt{1-\\frac1{9x}}\\sim3x-\\frac16$"],
  ["\\lim_{x\\to2}\\frac{x-1}{x\\ln(x^2)}", "\\frac1{4\\ln2}", ["0","\\frac12","+\\infty","-\\infty","Autre r\\'eponse"], "$\\ln(x^2)=2\\ln x\\to2\\ln2$"],
  ["\\lim_{n\\to\\infty}(1+\\frac{3}{n+2024})^{n+2024}", "e^3", ["+\\infty","e^3","0","\\frac13","Autre r\\'eponse"], "$(1+3/m)^m\\to e^3$"],
  ["\\lim_{n\\to\\infty}n(\\frac1{4n}-\\frac34)", "-\\infty", ["+\\infty","\\ln(3/4)","-\\infty","","Autre r\\'eponse"], "$\\frac1{4n}-\\frac34\\to-\\frac34$ ⇒ $n\\cdot(-3/4)\\to-\\infty$"],
  ["\\lim_{x\\to0^+}\\frac{\\sqrt{x}}{\\sqrt{x}+2\\sqrt{x}}", "\\frac13", ["-\\infty","0","0","+\\infty","Autre r\\'eponse"], "$\\frac{\\sqrt{x}}{3\\sqrt{x}} = \\frac13$"],
  ["\\lim_{n\\to\\infty}\\frac{n^3}{2^n}", "0", ["\\ln2","+\\infty","0","-\\infty","Autre r\\'eponse"], "Exp l'emporte"],
  ["\\lim_{x\\to+\\infty}\\frac{e^{x+1}-2^x}{e^{x+1}+2^x}", "1", ["\\ln2","1","+\\infty","0","Autre r\\'eponse"], "Diviser par $e^{x+1}$ : $\\frac{1-(2/e)^{x+1}e}{1+(2/e)^{x+1}e}\\to1$"],
  ["\\lim_{x\\to+\\infty}3^x e^{-3x}", "0", ["0","+\\infty","e","-\\infty","Autre r\\'eponse"], "$(3/e^3)^x\\to0$ car $3/e^3<1$"],
  ["\\lim_{x\\to+\\infty}\\frac{2^x}{\\ln(x^2+1)}", "+\\infty", ["+\\infty","\\frac13","0","-\\infty","Autre r\\'eponse"], "Exp $\\gg$ log"],
  ["\\lim_{x\\to0^+}\\ln(x^2+x)", "-\\infty", ["0","\\frac13","1","1","Autre r\\'eponse"], "$x^2+x\\sim x$ ⇒ $\\ln x\\to-\\infty$"],
  ["\\lim_{x\\to0}\\frac{\\sqrt{x+1}-\\sqrt{x}+1}{x}", "+\\infty", ["+\\infty","\\frac12","1","0","Autre r\\'eponse"], "Num $\\to2$, d\\'eno $\\to0$ ⇒ $+\\infty$"],
  ["\\lim_{n\\to\\infty}\\frac{n+1}{\\sqrt{n}-2}", "+\\infty", ["0","1","+\\infty","e","Autre r\\'eponse"], "$\\frac{n}{\\sqrt{n}}=\\sqrt{n}\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}\\frac{\\ln x}{\\ln(x+3)}", "1", ["e^{-3}","0","e^2","-\\infty","Autre r\\'eponse"], "$\\frac{\\ln x}{\\ln x+\\ln(1+3/x)}\\to1$"],
  ["\\lim_{x\\to0}\\frac{(\\sin x)^{1/2}}{x}", "+\\infty", ["+\\infty","e^2","-\\infty","","Autre r\\'eponse"], "$\\sin x\\sim x$ ⇒ $x^{-1/2}\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}\\sqrt{x+1}-\\sqrt{x}+\\sqrt{x}", "+\\infty", ["-\\infty","0","+\\infty","Autre r\\'eponse",""], "$\\sqrt{x+1}-\\sqrt{x}\\to0$, reste $\\sqrt{x}\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}\\sqrt{x+\\sqrt{x+\\sqrt{x}}}-\\sqrt{x+\\sqrt{x}}", "0", ["+\\infty","-\\infty","0","1","Autre r\\'eponse"], "Conjugu\\'e ⇒ $\\to0$"],
  ["\\lim_{x\\to+\\infty}\\sqrt{x+\\sqrt{x+\\sqrt{x}}}-\\sqrt{x}", "\\frac12", ["-\\infty","+\\infty","0","\\frac12","Autre r\\'eponse"], "It\\'erer $\\sqrt{x+\\sqrt{x}}\\sim\\sqrt{x}+\\frac12$"],
  ["\\lim_{x\\to0}x\\ln\\left(\\frac{\\sqrt{x}+1}{1-x}\\right)", "0", ["+\\infty","e","0","","Autre r\\'eponse"], "Fraction $\\to1$, produit $x\\cdot0\\to0$"],
  ["\\lim_{x\\to+\\infty}\\left(1+\\frac{2024}{x-1}\\right)^x", "e^{2024}", ["e^{2024}","0","-\\infty","e^3","Autre r\\'eponse"], "$\\ln L\\sim x\\cdot\\frac{2024}{x-1}\\to2024$"],
  ["\\lim_{n\\to\\infty}\\sum_{k=1}^n\\frac1{n^2+k^2}", "0", ["\\ln2","\\frac12","\\ln2","\\frac12","Autre r\\'eponse"], "Chaque terme $\\le1/n^2$, somme $\\le1/n\\to0$"],
  ["\\lim_{x\\to0^+}\\ln(1+\\sqrt{x})+e^{2x}-1", "0", ["+\\infty","2","3","","Autre r\\'eponse"], "Chaque terme $\\to0$"],
  ["\\lim_{x\\to+\\infty}\\frac{\\pi/2-\\arctan x}{1/(2x+1)}", "2", ["+\\infty","e","\\pi/2","-1","Autre r\\'eponse"], "$\\pi/2-\\arctan x=\\arctan(1/x)\\sim1/x$, d\\'eno $\\sim1/(2x)$"],
  ["\\lim_{x\\to0^+}e^{-x}-\\cos(\\sqrt{x})", "0", ["e","-\\infty","0","\\frac32","Autre r\\'eponse"], "$e^{-x}\\to1$, $\\cos(\\sqrt{x})\\to1$"],
  ["\\lim_{x\\to+\\infty}\\left(\\frac{2x}{x^2}\\right)^x", "0", ["-\\infty","0","e^2","","Autre r\\'eponse"], "Pour $x>2$, $0<2/x<1$ ⇒ $\\to0$"],
  ["\\lim_{n\\to\\infty}\\frac{1}{2k+n}", "0", ["\\ln\\sqrt2","0","\\ln\\sqrt3","\\ln3","Autre r\\'eponse"], "D\\'eno $\\to\\infty$"],
  ["\\lim_{n\\to\\infty}\\frac{\\sin^2n-\\cos^2n}{n}", "0", ["0","2","-\\infty","Autre r\\'eponse",""], "Num born\\'e $[-1,1]$"],
  ["\\lim_{x\\to0}\\frac{\\sqrt[3]{x+343}-7}{\\sin(2024x)}", "\\frac1{2024\\cdot147}", ["0","2024","2024\\times3","2024\\times3\\times49","Autre r\\'eponse"], "$\\sqrt[3]{x+343}-7\\sim\\frac{x}{3\\cdot49}$"],
  ["\\lim_{n\\to\\infty}\\left(1+\\frac{2n}{7n}\\right)^{29n}", "+\\infty", ["\\frac{29}{7}","2022","\\frac{7}{29}\\ln2022","\\frac{29}{7}\\ln2022","Autre r\\'eponse"], "Base $9/7>1$, exp $\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}x^{1/x}", "1", ["0","+\\infty","e","1","Autre r\\'eponse"], "$\\ln y=\\frac{\\ln x}{x}\\to0$"],
  ["\\lim_{x\\to+\\infty}\\left(\\frac{3x-1}{3x+2}\\right)^{2x-1}", "e^{-2}", ["e^2","+\\infty","0","e^{-1}","Autre r\\'eponse"], "$1-\\frac{3}{3x+2}$ ⇒ $\\ln L\\sim2x\\cdot(-\\frac{3}{3x})=-2$"],
  ["\\lim_{x\\to0}(\\arctan x)^{1/x}", "0", ["e^2","+\\infty","e","0","Autre r\\'eponse"], "$\\arctan x\\sim x$, $(x)^{1/x}\\to0$"],
  ["\\lim_{n\\to\\infty}\\left(\\frac1n\\right)^{n^2}", "0", ["1","+\\infty","0","e","Autre r\\'eponse"], "$=e^{-n^2\\ln n}\\to0$"],
  ["\\lim_{x\\to+\\infty}\\left(1+\\frac1{\\sqrt{x}}\\right)^{-\\sqrt{x}}", "e^{-1}", ["0","+\\infty","e","e^{-1}","Autre r\\'eponse"], "$(1+1/t)^{-t}\\to e^{-1}$, $t=\\sqrt{x}$"],
  ["\\lim_{x\\to0^+}\\frac{\\ln x}{1-\\ln x}", "1", ["+\\infty","-\\infty","1","-1","Autre r\\'eponse"], "Diviser par $\\ln x$ : $\\frac{1}{1/\\ln x-1}\\to1$"],
  ["\\lim_{x\\to+\\infty}(x^{-x}+e^{-x}+1)", "1", ["0","+\\infty","1","-\\infty","Autre r\\'eponse"], "$x^{-x}\\to0$, $e^{-x}\\to0$ ⇒ $1$"],
  ["\\lim_{x\\to0}\\left(\\frac{\\sin x}{\\ln(1+x)}\\right)^{-\\sin x}", "1", ["-\\infty","0","-1","+\\infty","Autre r\\'eponse"], "Base $\\to1$, exp $\\to0$ ⇒ $1^0=1$"],
  ["\\lim_{x\\to+\\infty}\\frac{x^2+\\ln x}{\\ln x}", "+\\infty", ["+\\infty","0","-1","-\\infty","Autre r\\'eponse"], "$x^2/\\ln x\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}(\\sqrt{x^2+1}-x)^{-x}", "+\\infty", ["1","2","0","3","Autre r\\'eponse"], "$\\sqrt{x^2+1}-x\\sim1/(2x)$ ⇒ $(2x)^x\\to+\\infty$"],
  ["\\lim_{x\\to0}\\frac{\\ln(1-x)-3x}{e^{-x}-1}", "4", ["-4","-\\infty","-2","+\\infty","Autre r\\'eponse"], "$\\ln(1-x)\\sim-x-x^2/2$ ; num $\\sim-4x$ ; $e^{-x}-1\\sim-x$ ⇒ $(-4x)/(-x)=4$"],
  ["\\lim_{x\\to0}\\frac{e^{8x}-e^{2x}+x^2}{x^2-2x}", "-3", ["-4","-1","0","+\\infty","Autre r\\'eponse"], "$e^{8x}\\sim1+8x+32x^2$, $e^{2x}\\sim1+2x+2x^2$ ; num $\\sim6x$ ⇒ $6x/(-2x)=-3$"],
  ["\\lim_{x\\to0}\\frac{e^x-1}{x}", "1", ["4","1","2","4\\sqrt3","Autre r\\'eponse"], "Classique"],
  ["\\lim_{x\\to0}\\frac{2e^x-e^{2x}-1}{x^2}", "-1", ["+\\infty","\\frac12","\\frac13","0","Autre r\\'eponse"], "$2(1+x+x^2/2)-(1+2x+2x^2)-1=-x^2$"],
  ["\\lim_{x\\to0}\\frac{\\ln(x+1)}{x}", "1", ["2","1","0","+\\infty","Autre r\\'eponse"], "Classique"],
  ["\\lim_{x\\to0}\\frac{\\tan x-x}{x^3}", "\\frac13", ["3","-\\infty","+\\infty","0","Autre r\\'eponse"], "$\\tan x=x+\\frac{x^3}3+o(x^3)$"],
  ["\\lim_{x\\to+\\infty}x\\ln(1+1/x)", "1", ["1","-\\infty","+\\infty","-1","Autre r\\'eponse"], "$\\ln(1+1/x)\\sim1/x$"],
  ["\\lim_{x\\to0}\\frac{\\cos x-1}{x^2}", "-\\frac12", ["0","+\\infty","-\\infty","1","Autre r\\'eponse"], "$\\cos x-1=-2\\sin^2(x/2)\\sim-x^2/2$"],
  ["\\lim_{n\\to\\infty}\\frac{2^{2n}+2}{4^n+1}", "1", ["+\\infty","\\frac32","\\frac32","3","Autre r\\'eponse"], "$2^{2n}=4^n$ ⇒ $\\frac{1+2/4^n}{1+1/4^n}\\to1$"],
  ["\\lim_{x\\to1}\\frac{\\sqrt{x^2+6x-7}}{x-1}", "+\\infty", ["\\sqrt2","\\sqrt2","3\\sqrt2","+\\infty","Autre r\\'eponse"], "$x^2+6x-7=(x-1)(x+7)$ ⇒ $\\frac{\\sqrt{x+7}}{\\sqrt{x-1}}\\to+\\infty$"],
  ["\\lim_{x\\to+\\infty}\\ln(e^x-1)^2+1", "+\\infty", ["1","+\\infty","0","\\frac12","Autre r\\'eponse"], "$(e^x-1)^2\\sim e^{2x}$, $\\ln e^{2x}=2x\\to+\\infty$"],
  ["\\lim_{x\\to0^+}x^x", "1", ["0","1","2","3","Autre r\\'eponse"], "$\\ln y=x\\ln x\\to0$ ⇒ $y\\to1$"],
  ["\\lim_{x\\to0}(e^x+3x)^{2x}", "1", ["e^2","0","1","e","Autre r\\'eponse"], "Base $\\to1$, exp $\\to0$ ⇒ $1^0=1$"],
  ["\\lim_{x\\to-\\infty}x^2e^x-x^2", "-\\infty", ["0","1","-1","+\\infty","Autre r\\'eponse"], "$x^2e^x\\to0$, $-x^2\\to-\\infty$"],
  ["\\lim_{x\\to+\\infty}\\frac{\\ln x}{x}", "0", ["1","0","-1","e^2","Autre r\\'eponse"], "Classique"],
  ["\\lim_{x\\to0}(2-\\cos x)^{\\sqrt{\\cos2x}}", "1", ["+\\infty","e^3","1","-1","Autre r\\'eponse"], "$2-\\cos x\\to1$, exp $\\to1$ ⇒ $1^1=1$"],
  ["\\lim_{x\\to+\\infty}x\\sin(1/x)", "1", ["-\\infty","+\\infty","1","0","Autre r\\'eponse"], "$\\sin(1/x)\\sim1/x$"],
  ["\\lim_{x\\to\\pi/2}(1+\\cos2x)^{\\tan x}", "0", ["+\\infty","\\pi/2","0","1","Autre r\\'eponse"], "$1+\\cos2x=2\\cos^2x\\to0$, $\\tan x\\to+\\infty$ ⇒ $0^{+\\infty}=0$"],
  ["\\lim_{x\\to+\\infty}\\frac{\\sqrt{2x^2+1}-\\sqrt{x+1}}{x}", "\\sqrt2", ["0","+\\infty","1/\\sqrt2","\\sqrt2","Autre r\\'eponse"], "$\\frac{\\sqrt{2x^2+1}}{x}\\to\\sqrt2$, $\\frac{\\sqrt{x+1}}{x}\\to0$"],
  ["\\lim_{x\\to0}\\frac{\\tan x-\\sin x}{x^3}", "\\frac12", ["\\frac12","1","0","\\pi/2","Autre r\\'eponse"], "$\\tan x-\\sin x=\\frac{\\sin x(1-\\cos x)}{\\cos x}\\sim\\frac{x\\cdot(x^2/2)}{1}=x^3/2$"],
  ["\\lim_{x\\to1}\\frac{\\sum_{k=1}^{100}x^k-100}{x-1}", "5050", ["100","50","+\\infty","5050","Autre r\\'eponse"], "$f'(1)=1+2+\\dots+100=5050$"]
];

const questions = data.map((row, i) => {
  const [limit, answer, opts, solution] = row;
  const matchIdx = opts.findIndex(o => o === answer);
  const correctIndex = matchIdx >= 0 ? matchIdx : 4;
  return {
    id: i + 1,
    question_fr: `$\\displaystyle ${limit} = $`,
    choices: [
      { label: "A", fr: `$${opts[0]}$` },
      { label: "B", fr: `$${opts[1]}$` },
      { label: "C", fr: `$${opts[2]}$` },
      { label: "D", fr: opts[3] ? `$${opts[3]}$` : "Aucune" },
      { label: "E", fr: opts[4] ? `$${opts[4]}$` : "Aucune" }
    ],
    correctIndex,
    explanation_fr: solution
  };
});

fs.writeFileSync(path.join(base, 'limites-qcm.json'), JSON.stringify({ questions }, null, 2) + '\n', 'utf-8');
console.log('Created limites-qcm.json with ' + questions.length + ' questions');
