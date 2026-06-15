export default function StepIndicator({ total, current, answers, questions }) {
  if (total === 0) return null;

  const getState = (idx) => {
    if (idx === current) return 'current';
    const q = questions?.[idx];
    if (q && answers[q.id] !== undefined) return 'answered';
    return 'pending';
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => {
        const state = getState(i);
        return (
          <div
            key={i}
            className={[
              'h-1.5 rounded-full transition-all duration-300 flex-1',
              state === 'current' && 'bg-emerald-500',
              state === 'answered' && 'bg-emerald-300',
              state === 'pending' && 'bg-gray-200 dark:bg-gray-700',
            ].join(' ')}
          />
        );
      })}
    </div>
  );
}
