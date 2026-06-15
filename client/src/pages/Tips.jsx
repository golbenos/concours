import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import MathRenderer from '../components/MathRenderer';
import LoadingSpinner from '../components/LoadingSpinner';

const icons = {
  suites: 'timeline',
  fonctions: 'functions',
  integrales: 'integration_instructions',
  complexes: 'neurology',
  arithmetique: '123',
  geometrie: 'category',
};

export default function Tips() {
  const { t } = useTranslation();
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tips, setTips] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const [bookRes, tipsRes] = await Promise.all([
          api.get('/data/book/book.json'),
          api.get('/tips')
        ]);
        const secs = bookRes.data.sections || [];
        setSections(secs);
        setTips(tipsRes.data || []);
        if (secs.length > 0) setActiveSection(secs[0].id);
      } catch (e) { console.error('Tips fetch error:', e); }
      setLoading(false);
    })();
  }, []);

  const toggleCourse = (idx) => {
    setExpandedCourse(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const activeSec = sections.find(s => s.id === activeSection);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto px-mobile py-10">
      <h1 className="font-headline-lg text-headline-lg text-gray-800 mb-1">{t('tips_title')}</h1>
      <p className="font-body-md text-body-md text-gray-400 mb-5">{t('tips_desc')}</p>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full font-caption text-caption transition ${
              activeSection === sec.id ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{icons[sec.id] || 'school'}</span>
            {sec.title_fr}
          </button>
        ))}
      </div>

      {activeSec && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleCourse('course')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                <span className="font-label-md text-label-md text-gray-700">{t('section_course')}</span>
              </div>
              <span className={`material-symbols-outlined text-gray-300 transition ${expandedCourse['course'] ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {expandedCourse['course'] && (
              <div className="px-4 pb-4 border-t border-gray-50">
                {activeSec.course?.length > 0 ? activeSec.course.map((sec, i) => (
                  <div key={i} className="mt-3">
                    <h3 className="font-label-md text-label-md text-gray-700 mb-2">{sec.title}</h3>
                    <ul className="space-y-1.5">
                      {sec.items.map((item, j) => (
                        <li key={j} className="font-body-md text-body-md text-gray-600 leading-relaxed"><MathRenderer html={item} /></li>
                      ))}
                    </ul>
                  </div>
                )) : (
                  <p className="font-body-md text-body-md text-gray-400 mt-3">Contenu du cours disponible prochainement.</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleCourse('astuces')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <span className="font-label-md text-label-md text-gray-700">{t('section_astuces_title')}</span>
              </div>
              <span className={`material-symbols-outlined text-gray-300 transition ${expandedCourse['astuces'] ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {expandedCourse['astuces'] && (
              <div className="px-4 pb-4 border-t border-gray-50">
                {tips.filter(t => activeSec.astuces?.some(c => t.category?.toLowerCase().includes(c.toLowerCase()))).map(tip => (
                  <div key={tip.id} className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <h4 className="font-label-md text-label-md text-amber-700 mb-1">{tip.title_fr}</h4>
                    <p className="font-body-md text-body-md text-gray-700 leading-relaxed"><MathRenderer html={tip.content_fr} /></p>
                    {tip.example_fr && (
                      <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200">
                        <span className="font-caption text-caption text-amber-500">Exemple : </span>
                        <span className="font-body-md text-body-md text-gray-600"><MathRenderer html={tip.example_fr} /></span>
                      </div>
                    )}
                  </div>
                ))}
                {tips.filter(t => activeSec.astuces?.some(c => t.category?.toLowerCase().includes(c.toLowerCase()))).length === 0 && (
                  <p className="font-body-md text-body-md text-gray-400 mt-3">Chargement des astuces...</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
