import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ExamYears() {
  const { examId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/exams/${examId}`);
        setMeta(data);
      } catch { setError(t('error_occurred')); }
      setLoading(false);
    })();
  }, [examId, t]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500 dark:text-red-400 font-body-md text-body-md">{error}</div>;
  if (!meta) return <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-body-md text-body-md">{t('page_not_found')}</div>;

  return (
    <div className="max-w-2xl mx-auto px-mobile py-10">
      <button onClick={() => navigate('/exams')} className="font-caption text-caption text-emerald-600 hover:text-emerald-700 mb-4 inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {t('back')}
      </button>
      <h1 className="font-headline-lg text-headline-lg text-gray-800 dark:text-gray-100 mb-1">{meta.name_fr}</h1>
      <p className="font-body-md text-body-md text-gray-400 dark:text-gray-500 mb-6">{t('select_year')}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {meta.years?.sort((a, b) => b - a).map(year => (
          <button
            key={year}
            onClick={() => navigate(`/quiz/${examId}/${year}`)}
            className="bg-white border border-gray-100 rounded-xl py-5 text-center hover:border-emerald-300 hover:shadow-sm transition dark:bg-gray-900 dark:border-gray-800 dark:hover:border-emerald-600"
          >
            <span className="font-headline-md text-headline-md text-gray-700 dark:text-gray-200">{year}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
