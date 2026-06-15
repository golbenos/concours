import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const icons = {
  ensa: 'school',
  ensam: 'engineering',
  medecine: 'local_hospital',
};

export default function Exams() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [examTypes, setExamTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/exams');
        setExamTypes(res.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto px-mobile py-10">
      <h1 className="font-headline-lg text-headline-lg text-gray-800 mb-1">{t('exams')}</h1>
      <p className="font-body-md text-body-md text-gray-400 mb-6">{t('select_exam')}</p>
      {examTypes.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-body-md text-body-md">{t('no_questions_topic')}</div>
      )}
      <div className="grid grid-cols-1 gap-3">
        {examTypes.map(ex => (
          <button
            key={ex.id}
            onClick={() => navigate(`/exams/${ex.id}`)}
            className="bg-white border border-gray-100 rounded-2xl p-5 text-left hover:border-emerald-300 hover:shadow-sm transition"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-emerald-500 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icons[ex.id] || 'school'}
              </span>
              <div className="min-w-0">
                <h2 className="font-headline-md text-headline-md text-gray-800 mb-0.5">{ex.name_fr}</h2>
                <p className="font-caption text-caption text-gray-400">{ex.description_fr || ''}</p>
                <span className="text-caption text-emerald-500 mt-1 inline-block">{ex.years?.length || 0} {t('years')}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
