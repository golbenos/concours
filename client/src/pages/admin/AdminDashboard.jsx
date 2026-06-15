import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ exams: 0, questions: 0, tips: 0, users: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch { /* ignore */ }
    })();
  }, []);

  const cards = [
    { label: t('manage_exams'), value: stats.exams },
    { label: t('manage_questions'), value: stats.questions },
    { label: t('manage_tips'), value: stats.tips },
    { label: t('manage_users'), value: stats.users },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="font-headline-md text-headline-md text-gray-800 dark:text-gray-100">{c.value}</div>
          <div className="font-caption text-caption text-gray-400 dark:text-gray-500 mt-0.5">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
