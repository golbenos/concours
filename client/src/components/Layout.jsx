import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useCallback } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

const exams = [
  { id: 'ensa', label: 'ENSA', desc: 'Écoles Nationales des Sciences Appliquées' },
  { id: 'ensam', label: 'ENSAM', desc: "École Nationale Supérieure d'Arts et Métiers" },
  { id: 'medecine', label: 'Médecine', desc: 'Facultés de Médecine et Pharmacie' },
];

function LangSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const langs = [{ code: 'fr', label: 'FR' }, { code: 'en', label: 'EN' }, { code: 'ar', label: 'AR' }];
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 duration-150">
        <span className="material-symbols-outlined text-gray-400">language</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 min-w-[80px] dark:bg-gray-900 dark:border-gray-700">
            {langs.map(({ code, label }) => (
              <button key={code} onClick={() => { i18n.changeLanguage(code); localStorage.setItem('lang', code); document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = code; setOpen(false); }}
                className={`w-full text-center px-3 py-1.5 font-caption text-caption transition hover:bg-gray-50 dark:text-gray-400 ${i18n.language === code ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>{label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ConcoursDropdown() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const active = location.pathname.startsWith('/exams');
  const timerRef = useRef(null);
  const delay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  const openWithDelay = useCallback(() => {
    delay();
    setOpen(true);
  }, [delay]);
  const closeWithDelay = useCallback(() => {
    timerRef.current = setTimeout(() => setOpen(false), 150);
  }, []);
  return (
    <div className="relative" onMouseEnter={openWithDelay} onMouseLeave={closeWithDelay}>
      <button onClick={() => setOpen(!open)} className={`font-label-md text-label-md transition-colors flex items-center gap-1 dark:text-gray-400 ${active ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-emerald-600'}`}>
        {t('exams')}
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>expand_more</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10 md:hidden" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-3 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 py-2 min-w-[280px] dark:bg-gray-900 dark:border-gray-700" onMouseEnter={openWithDelay} onMouseLeave={closeWithDelay}>
            {exams.map(ex => (
              <Link key={ex.id} to={`/exams/${ex.id}`} onClick={() => setOpen(false)} className="block px-4 py-2.5 hover:bg-emerald-50 transition dark:hover:bg-emerald-900/30">
                <div className="font-label-md text-label-md text-gray-800 dark:text-gray-100">{ex.label}</div>
                <div className="text-caption text-gray-400 mt-0.5 dark:text-gray-500">{ex.desc}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const isHome = location.pathname === '/';
  const { dark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-900 dark:shadow-gray-800/20">
        <nav className="flex justify-between items-center w-full px-mobile md:px-desktop max-w-container mx-auto h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-headline-md text-headline-md font-bold text-emerald-600">{t('app_name')}</Link>
            <div className="hidden md:flex items-center gap-6">
              <ConcoursDropdown />
              <Link to="/practice" className="font-label-md text-label-md text-gray-500 hover:text-emerald-600 transition-colors dark:text-gray-400 dark:hover:text-emerald-400">{t('practice')}</Link>
              <Link to="/tips" className="font-label-md text-label-md text-gray-500 hover:text-emerald-600 transition-colors dark:text-gray-400 dark:hover:text-emerald-400">{t('tips')}</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LangSwitcher />
            <button onClick={toggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 duration-150">
              <span className="material-symbols-outlined text-gray-400">{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 duration-150">
                    <span className="material-symbols-outlined text-gray-400">admin_panel_settings</span>
                  </Link>
                )}
                <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 duration-150">
                  <span className="material-symbols-outlined text-gray-400">account_circle</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 duration-150">
                  <span className="material-symbols-outlined text-gray-400">logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 duration-150">
                  <span className="material-symbols-outlined text-gray-400">account_circle</span>
                </Link>
                <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-label-md text-label-md transition-all active:scale-95">
                  {t('register')}
                </Link>
              </>
            )}
            <button className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 duration-150" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="material-symbols-outlined text-gray-400">{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 px-mobile py-4 flex flex-col gap-3 bg-white dark:border-gray-800 dark:bg-gray-900">
            <button onClick={() => setSubOpen(!subOpen)} className="font-label-md text-label-md text-gray-500 flex items-center gap-1 dark:text-gray-400">
              {t('exams')}
              <span className="material-symbols-outlined text-sm transition" style={{ transform: subOpen ? 'rotate(180deg)' : '' }}>expand_more</span>
            </button>
            {subOpen && (
            <div className="ml-4 pl-4 border-l-2 border-emerald-300 space-y-2">
              {exams.map(ex => (
                <Link key={ex.id} to={`/exams/${ex.id}`} onClick={() => setMenuOpen(false)} className="block text-caption text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400">{ex.label}</Link>
              ))}
            </div>
            )}
            <Link to="/practice" onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-gray-500 dark:text-gray-400">{t('practice')}</Link>
            <Link to="/tips" onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-gray-500 dark:text-gray-400">{t('tips')}</Link>
            <hr className="border-gray-100 dark:border-gray-700" />
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-gray-500 dark:text-gray-400">{t('admin')}</Link>}
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-gray-500 dark:text-gray-400">{user.name}</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="font-label-md text-label-md text-left text-red-500">{t('logout')}</button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="font-label-md text-label-md text-gray-500 dark:text-gray-400">{t('login')}</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-label-md text-label-md">{t('register')}</Link>
              </div>
            )}
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      {isHome && <footer className="bg-gray-100 mt-auto dark:bg-gray-900">
        <div className="w-full py-10 px-mobile md:px-desktop flex flex-col md:flex-row justify-between items-start gap-8 max-w-container mx-auto border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <span className="font-label-md text-label-md font-bold text-emerald-600 uppercase tracking-wider">{t('app_name')}</span>
            <p className="max-w-xs text-gray-400 font-caption text-caption dark:text-gray-500">L'outil indispensable pour votre réussite scolaire et professionnelle au Maroc.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full md:w-auto">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-gray-800 dark:text-gray-100">Plateforme</span>
              <a className="font-caption text-caption text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400" href="#">À propos</a>
              <a className="font-caption text-caption text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400" href="#">Contact</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-gray-800 dark:text-gray-100">Concours</span>
              {exams.map(ex => (
                <Link key={ex.id} to={`/exams/${ex.id}`} className="font-caption text-caption text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400">{ex.label}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-gray-800 dark:text-gray-100">Légal</span>
              <a className="font-caption text-caption text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400" href="#">Mentions Légales</a>
              <a className="font-caption text-caption text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400" href="#">Confidentialité</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-gray-800 dark:text-gray-100">Réseaux</span>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-gray-400 hover:text-emerald-600 cursor-pointer dark:text-gray-500 dark:hover:text-emerald-400">share</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-6 px-mobile md:px-desktop flex flex-col md:flex-row justify-between items-center gap-4 max-w-container mx-auto">
          <p className="text-gray-400 font-caption text-caption dark:text-gray-500">&copy; {new Date().getFullYear()} {t('app_name')}. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a className="text-gray-400 hover:text-emerald-600 font-caption text-caption dark:text-gray-500 dark:hover:text-emerald-400" href="#">Termes</a>
            <a className="text-gray-400 hover:text-emerald-600 font-caption text-caption dark:text-gray-500 dark:hover:text-emerald-400" href="#">Cookies</a>
          </div>
        </div>
      </footer>}
    </div>
  );
}
