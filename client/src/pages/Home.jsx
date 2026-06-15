import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 800" fill="none">
        <defs>
          <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0fdf4" />
          </linearGradient>
        </defs>
        <rect width="1440" height="800" fill="url(#hero-grad)" />
        <g opacity="0.15">
          <circle cx="1200" cy="100" r="180" fill="#10b981" />
          <circle cx="200" cy="650" r="250" fill="#10b981" />
          <circle cx="700" cy="50" r="120" fill="#34d399" />
          <circle cx="100" cy="200" r="80" fill="#059669" />
          <circle cx="1300" cy="500" r="140" fill="#34d399" />
        </g>
        <g opacity="0.08" className="animate-float" style={{ animationDelay: '0s' }}>
          <rect x="1100" y="300" width="40" height="40" rx="8" fill="#10b981" />
        </g>
        <g opacity="0.08" className="animate-float" style={{ animationDuration: '4s' }}>
          <rect x="300" y="400" width="24" height="24" rx="6" fill="#059669" />
        </g>
        <g opacity="0.08" className="animate-float" style={{ animationDuration: '5s' }}>
          <circle cx="900" cy="200" r="15" fill="#10b981" />
        </g>
        <g opacity="0.06" className="animate-float" style={{ animationDuration: '3.5s' }}>
          <circle cx="500" cy="150" r="10" fill="#34d399" />
        </g>
        <g opacity="0.06" className="animate-float" style={{ animationDuration: '4.5s' }}>
          <circle cx="1000" cy="600" r="12" fill="#059669" />
        </g>
        <g style={{ animation: 'pulse-subtle 3s ease-in-out infinite' }}>
          <circle cx="200" cy="300" r="4" fill="#10b981" />
          <circle cx="1150" cy="400" r="3" fill="#34d399" />
          <circle cx="600" cy="350" r="3" fill="#10b981" />
          <circle cx="800" cy="500" r="4" fill="#059669" />
          <circle cx="400" cy="550" r="2" fill="#34d399" />
          <circle cx="1050" cy="200" r="2" fill="#10b981" />
        </g>
        <path d="M0 600 Q 360 520 720 600 T 1440 600 L1440 800 L0 800 Z" fill="#ffffff" opacity="0.4" />
        <path d="M0 650 Q 360 580 720 650 T 1440 650 L1440 800 L0 800 Z" fill="#ffffff" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/admin/stats'); setStats(data); } catch {}
    })();
    setVisible(true);
  }, []);

  return (
    <div>
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 w-full px-mobile md:px-desktop max-w-container mx-auto py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-display text-display text-gray-900 max-w-xl">
              Réussissez vos concours nationaux <span className="text-emerald-600">(ENSA, ENSAM, Médecine)</span>
            </h1>
            <p className="font-body-lg text-body-lg text-gray-500 max-w-lg">
              La plateforme de référence pour les bacheliers marocains. Accédez à des milliers de questions, des corrigés types et suivez votre évolution en temps réel.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/hub" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-all hover:shadow-lg active:scale-95">
                S'entraîner maintenant
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/practice" className="bg-white border border-gray-300 px-8 py-4 rounded-xl font-label-md text-label-md text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                Entraînement par thème
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-emerald-50/50 relative z-10 border-y border-gray-100">
        <div className="px-mobile md:px-desktop max-w-container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
            </div>
            <div>
              <p className="font-headline-md text-headline-md text-gray-800">{stats ? `${stats.questions}+ Questions` : 'Chargement...'}</p>
              <p className="font-body-md text-body-md text-gray-400">Spécial ENSA</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
            </div>
            <div>
              <p className="font-headline-md text-headline-md text-gray-800">{stats ? `${stats.exams}+ Années` : 'Chargement...'}</p>
              <p className="font-body-md text-body-md text-gray-400">D'examens archivés</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>translate</span>
            </div>
            <div>
              <p className="font-headline-md text-headline-md text-gray-800">3 Langues</p>
              <p className="font-body-md text-body-md text-gray-400">Français, Arabe, Anglais</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-mobile md:px-desktop max-w-container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-caption">Pourquoi nous choisir ?</span>
          <h2 className="font-headline-lg text-headline-lg text-gray-800">Une méthode d'apprentissage éprouvée</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'timer', title: 'Simulations réelles', desc: "Entraînez-vous dans les conditions réelles des concours avec un chronomètre intégré et une interface fidèle aux épreuves officielles." },
            { icon: 'check_circle', title: 'Correction détaillée', desc: 'Chaque question est accompagnée d\'une explication pédagogique complète pour comprendre vos erreurs et progresser rapidement.' },
            { icon: 'trending_up', title: 'Suivi de progression', desc: 'Visualisez vos points forts et points faibles par matière grâce à notre tableau de bord analytique intelligent.' },
          ].map((f, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="mb-6 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">{f.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed font-body-md text-body-md">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-emerald-50 mb-20 overflow-hidden">
        <div className="px-mobile md:px-desktop max-w-container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <h2 className="font-headline-lg text-headline-lg text-gray-800">Prêt à décrocher votre admission ?</h2>
            <p className="font-body-lg text-body-lg text-gray-400">Rejoignez plus de 15,000 étudiants qui se préparent quotidiennement sur Concours Maroc.</p>
          </div>
          <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-colors shadow-lg active:scale-95 whitespace-nowrap inline-flex items-center gap-2">
            Créer mon compte gratuit
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
