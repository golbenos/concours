import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const cards = [
  {
    icon: 'assignment',
    titleKey: 'hub_exams',
    descKey: 'hub_exams_desc',
    link: '/exams/ensa',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-100 text-blue-600',
    btnColor: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    icon: 'menu_book',
    titleKey: 'hub_courses',
    descKey: 'hub_courses_desc',
    link: '/tips',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    iconBg: 'bg-amber-100 text-amber-600',
    btnColor: 'bg-amber-500 hover:bg-amber-600',
  },
  {
    icon: 'school',
    titleKey: 'hub_practice',
    descKey: 'hub_practice_desc',
    link: '/practice',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    iconBg: 'bg-emerald-100 text-emerald-600',
    btnColor: 'bg-emerald-500 hover:bg-emerald-600',
  },
];

export default function Hub() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-mobile py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline-lg text-headline-lg text-gray-800 mb-3">{t('hub_title')}</h1>
        <p className="font-body-md text-body-md text-gray-400 max-w-lg mx-auto">{t('hub_subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link key={i} to={card.link}
            className={`group p-8 rounded-3xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${card.color}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${card.iconBg}`}>
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-gray-800 mb-3">{t(card.titleKey)}</h2>
            <p className="font-body-md text-body-md text-gray-500 mb-6">{t(card.descKey)}</p>
            <span className={`inline-flex items-center gap-1 text-white px-5 py-2.5 rounded-xl font-label-md text-label-md transition-all ${card.btnColor} group-hover:shadow-md`}>
              {t('go')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
