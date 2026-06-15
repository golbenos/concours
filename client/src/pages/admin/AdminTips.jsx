import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminTips() {
  const { t } = useTranslation();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadTips = async () => {
    try { const { data } = await api.get('/tips'); setTips(data); } catch { /* ignore */ }
    setLoading(false);
  };
  useEffect(() => { loadTips(); }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/tips/${editing}`, { content, category });
      } else {
        await api.post('/admin/tips', { content, category });
      }
      setContent('');
      setCategory('general');
      setEditing(null);
      await loadTips();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm(t('confirm_delete'))) return;
    try { await api.delete(`/admin/tips/${id}`); await loadTips(); } catch { /* ignore */ }
  };

  const startEdit = (tip) => {
    setContent(tip.content);
    setCategory(tip.category || 'general');
    setEditing(tip.id);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 mb-5">
        <h3 className="font-headline-md text-headline-md mb-3 text-gray-800 dark:text-gray-100">{editing ? t('edit') : t('add_tip')}</h3>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={2} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3 bg-white dark:bg-gray-900" placeholder={t('question_text')} />
        <div className="flex gap-2 items-center">
          <select value={category} onChange={e => setCategory(e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-1.5 font-caption text-caption bg-white dark:bg-gray-900">
            <option value="general">General</option>
            <option value="math">Math</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
          <button onClick={handleSave} disabled={saving} className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-label-md text-label-md hover:bg-emerald-600 disabled:opacity-50">{saving ? t('loading') : t('save')}</button>
          {editing && <button onClick={() => { setContent(''); setEditing(null); setCategory('general'); }} className="font-caption text-caption text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">{t('cancel')}</button>}
        </div>
      </div>
      <div className="space-y-2">
        {tips.map(tip => (
          <div key={tip.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-3 flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="font-caption text-caption bg-gray-50 dark:bg-gray-950 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">{tip.category || 'general'}</span>
              <p className="font-body-md text-body-md text-gray-700 dark:text-gray-200 mt-1">{tip.content}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(tip)} className="font-caption text-caption text-emerald-600 hover:underline">{t('edit')}</button>
              <button onClick={() => handleDelete(tip.id)} className="font-caption text-caption text-red-400 hover:underline">{t('delete')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
