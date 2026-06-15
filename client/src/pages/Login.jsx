import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError(t('login_error'));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto px-mobile py-16">
      <h1 className="font-headline-lg text-headline-lg text-center text-gray-800 mb-8">{t('login')}</h1>
      {error && <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl p-3 mb-4 text-caption">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-caption text-caption text-gray-500 mb-1">{t('email')}</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white" />
        </div>
        <div>
          <label className="block font-caption text-caption text-gray-500 mb-1">{t('password')}</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-label-md text-label-md hover:bg-emerald-600 transition disabled:opacity-50">{loading ? t('loading') : t('login_btn')}</button>
      </form>
      <p className="text-center font-caption text-caption text-gray-400 mt-5">{t('no_account')} <Link to="/register" className="text-emerald-600 hover:underline">{t('register')}</Link></p>
    </div>
  );
}
