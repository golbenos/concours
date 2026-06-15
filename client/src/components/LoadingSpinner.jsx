import { useTranslation } from 'react-i18next';

export default function LoadingSpinner({ message }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p className="font-body-md text-body-md text-gray-400">{message || t('loading')}</p>
    </div>
  );
}
