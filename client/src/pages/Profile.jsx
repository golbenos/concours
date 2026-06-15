import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/progress/stats');
        setStats(data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto px-mobile py-10">
      <h1 className="font-headline-lg text-headline-lg text-gray-800 dark:text-gray-100 mb-6">{t('profile')}</h1>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="font-headline-md text-headline-md text-gray-800 dark:text-gray-100">{user.name}</h2>
        <p className="font-body-md text-body-md text-gray-400 dark:text-gray-500 mt-0.5">{user.email}</p>
        {user.role === 'admin' && <span className="inline-block mt-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-caption px-2 py-0.5 rounded font-medium">Admin</span>}
      </div>
      {loading ? <LoadingSpinner /> : stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center dark:bg-gray-900 dark:border-gray-800">
            <div className="font-headline-md text-headline-md text-gray-800 dark:text-gray-100">{stats.total_questions || 0}</div>
            <div className="font-caption text-caption text-gray-400 dark:text-gray-500 mt-0.5">{t('total_questions')}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center dark:bg-gray-900 dark:border-gray-800">
            <div className="font-headline-md text-headline-md text-emerald-600 dark:text-emerald-400">{stats.correct_answers || 0}</div>
            <div className="font-caption text-caption text-gray-400 dark:text-gray-500 mt-0.5">{t('correct_answers')}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center dark:bg-gray-900 dark:border-gray-800">
            <div className="font-headline-md text-headline-md text-emerald-600 dark:text-emerald-400">{stats.accuracy ? `${Math.round(stats.accuracy)}%` : '—'}</div>
            <div className="font-caption text-caption text-gray-400 dark:text-gray-500 mt-0.5">{t('accuracy')}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center dark:bg-gray-900 dark:border-gray-800">
            <div className="font-headline-md text-headline-md text-gray-800 dark:text-gray-100">{stats.exams_taken || 0}</div>
            <div className="font-caption text-caption text-gray-400 dark:text-gray-500 mt-0.5">{t('exams')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
