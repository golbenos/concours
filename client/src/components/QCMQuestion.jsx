import MathRenderer from './MathRenderer';

export default function QCMQuestion({ question, selected, onSelect, showResult }) {
  const letters = ['A', 'B', 'C', 'D'];

  const labelClass = (idx) => {
    if (showResult) {
      if (idx === question.correctIndex) return 'border-2 border-emerald-500 bg-emerald-50';
      if (selected === idx) return 'border-2 border-red-400 bg-red-50';
      return 'border-2 border-gray-100 opacity-50';
    }
    return selected === idx
      ? 'border-2 border-emerald-500 bg-emerald-50 shadow-sm'
      : 'border-2 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 bg-white';
  };

  const iconClass = (idx) => {
    if (showResult) {
      if (idx === question.correctIndex) return 'bg-emerald-500 text-white';
      if (selected === idx) return 'bg-red-400 text-white';
      return 'bg-gray-100 text-gray-400';
    }
    return selected === idx
      ? 'bg-emerald-500 text-white'
      : 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="font-body-md text-body-md text-gray-800 leading-relaxed" style={{ overflowWrap: 'break-word' }} dir="auto">
          <MathRenderer html={question.question_fr} />
        </p>
      </div>
      <div className="grid gap-2">
        {question.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            disabled={showResult}
            className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-all cursor-pointer ${labelClass(idx)}`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-label-md text-label-md font-bold shrink-0 ${iconClass(idx)}`}>
              {letters[idx]}
            </span>
            <span className="text-gray-700 font-body-md text-body-md">
              <MathRenderer html={choice.fr} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
