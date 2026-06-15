import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminExams() {
  const { t } = useTranslation();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/admin/exams'); setExams(data); } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-3">
      {exams.map(ex => (
        <details key={ex.id} className="bg-white border border-gray-100 rounded-2xl">
          <summary className="p-4 font-headline-md text-headline-md cursor-pointer hover:bg-gray-50 rounded-2xl text-gray-800">{ex.name_fr} ({ex.years?.length || 0} years)</summary>
          <div className="px-4 pb-4">
            <p className="font-body-md text-body-md text-gray-400 mb-3">{ex.description_fr}</p>
            <div className="flex flex-wrap gap-1.5">
              {ex.years?.sort((a, b) => b - a).map(y => (
                <span key={y} className="bg-gray-50 text-gray-500 font-caption text-caption px-2 py-0.5 rounded">{y}</span>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
