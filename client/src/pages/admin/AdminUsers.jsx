import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/admin/users'); setUsers(data); } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch { /* ignore */ }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <table className="w-full font-body-md text-body-md">
        <thead className="bg-gray-50 text-gray-500 font-label-md text-label-md">
          <tr>
            <th className="text-left px-4 py-3 font-medium">{t('name')}</th>
            <th className="text-left px-4 py-3 font-medium">{t('email')}</th>
            <th className="text-left px-4 py-3 font-medium">{t('exams')}</th>
            <th className="text-left px-4 py-3 font-medium">Role</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
              <td className="px-4 py-3 text-gray-400">{u.email}</td>
              <td className="px-4 py-3 text-gray-400">{u.exams_taken || 0}</td>
              <td className="px-4 py-3">
                <span className={`font-caption text-caption px-1.5 py-0.5 rounded ${u.role === 'admin' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>{u.role}</span>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => toggleRole(u.id, u.role)} className="font-caption text-caption text-emerald-600 hover:underline">
                  {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
