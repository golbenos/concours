import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || t('error_occurred'));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto px-mobile py-16">
      <h1 className="font-headline-lg text-headline-lg text-center text-gray-800 dark:text-gray-100 mb-8">{t('register')}</h1>
      {error && <div className="bg-red-50 border border-red-100 text-red-500 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 rounded-xl p-3 mb-4 text-caption">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-caption text-caption text-gray-500 dark:text-gray-400 mb-1">{t('name')}</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-900" />
        </div>
        <div>
          <label className="block font-caption text-caption text-gray-500 dark:text-gray-400 mb-1">{t('email')}</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-900" />
        </div>
        <div>
          <label className="block font-caption text-caption text-gray-500 dark:text-gray-400 mb-1">{t('password')}</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-900" />
        </div>
        <div>
          <label className="block font-caption text-caption text-gray-500 dark:text-gray-400 mb-1">{t('confirm_password')}</label>
          <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-900" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-label-md text-label-md hover:bg-emerald-600 transition disabled:opacity-50">{loading ? t('loading') : t('register_btn')}</button>
      </form>
      <p className="text-center font-caption text-caption text-gray-400 dark:text-gray-500 mt-5">{t('have_account')} <Link to="/login" className="text-emerald-600 hover:underline">{t('login')}</Link></p>
    </div>
  );
}
