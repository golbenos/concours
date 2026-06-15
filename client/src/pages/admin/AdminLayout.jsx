import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const links = [
    { to: '/admin', label: t('admin_dashboard'), exact: true },
    { to: '/admin/exams', label: t('manage_exams') },
    { to: '/admin/tips', label: t('manage_tips') },
    { to: '/admin/users', label: t('manage_users') },
  ];
  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);
  return (
    <div className="max-w-4xl mx-auto px-mobile py-8">
      <h1 className="font-headline-lg text-headline-lg text-gray-800 mb-5">{t('admin')}</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`px-3 py-1.5 rounded-xl font-label-md text-label-md transition ${isActive(l.to, l.exact) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {l.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
