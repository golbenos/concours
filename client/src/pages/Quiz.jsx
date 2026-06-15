import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import QCMQuestion from '../components/QCMQuestion';
import Timer from '../components/Timer';
import StepIndicator from '../components/StepIndicator';
import LoadingSpinner from '../components/LoadingSpinner';
import MathRenderer from '../components/MathRenderer';

export default function Quiz() {
  const { examId, year } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timedOut, setTimedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/exams/${examId}/${year}`);
        setQuestions(data.questions || []);
      } catch { navigate('/exams'); }
      setLoading(false);
    })();
  }, [examId, year, navigate]);

  const submitResults = useCallback(async (finalAnswers) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    setSubmitting(true);
    try {
      const qs = questions.map(q => ({
        question_id: q.id,
        selected: finalAnswers[q.id] ?? null,
        correct: finalAnswers[q.id] === q.correctIndex,
        time_spent: 0
      }));
      await api.post('/progress', {
        exam_type: examId,
        year: parseInt(year),
        answers: qs
      });
    } catch { /* ignore */ }
    setSubmitting(false);
  }, [questions, examId, year]);

  const handleTimeUp = useCallback(() => {
    if (submittedRef.current) return;
    setTimedOut(true);
    submitResults(answers);
  }, [submitResults, answers]);

  useEffect(() => {
    if (submittedRef.current || questions.length === 0) return;
    if (current >= questions.length) {
      submitResults(answers);
    }
  }, [current, questions.length, submitResults, answers]);

  const selectAnswer = (idx) => {
    if (timedOut || submitted) return;
    setAnswers(prev => ({ ...prev, [questions[current].id]: idx }));
  };

  const goNext = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else submitResults(answers);
  };

  const goPrev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };
  const toggleShowAnswer = () => setShowAnswer(s => !s);

  const answeredCount = Object.keys(answers).length;

  if (loading) return <LoadingSpinner />;
  if (questions.length === 0) return <div className="text-center py-20 text-gray-400">{t('no_questions_topic')}</div>;

  if (submitted) {
    const score = questions.filter(q => answers[q.id] === q.correctIndex).length;
    return (
      <div className="max-w-2xl mx-auto px-mobile py-10">
        {timedOut && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 mb-6 text-center font-body-md text-body-md">
            {t('time_up')} {t('auto_submit')}
          </div>
        )}
        <div className="text-center mb-8">
          <div className="font-headline-lg text-headline-lg text-emerald-600 mb-1">{score}<span className="text-gray-300">/{questions.length}</span></div>
          <p className="font-body-md text-body-md text-gray-400 mt-2">{t('your_score')}</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-4 max-w-xs mx-auto">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(score / questions.length) * 100}%` }} />
          </div>
        </div>
        <h2 className="font-headline-md text-headline-md text-gray-800 mb-5">{t('correction')}</h2>
        {submitting && <LoadingSpinner message={t('loading')} />}
        {!submitting && (
          <div className="space-y-5">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-caption text-caption text-gray-400">{t('question')} {i + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${isCorrect ? 'bg-emerald-50 text-emerald-600' : userAns === undefined ? 'bg-gray-50 text-gray-400' : 'bg-red-50 text-red-500'}`}>
                      {isCorrect ? t('correct') : (userAns === undefined ? t('no_answer') : t('incorrect'))}
                    </span>
                  </div>
                  <QCMQuestion question={q} selected={userAns} showResult />
                  {q.explanation_fr && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="font-label-md text-label-md text-gray-500 mb-1">{t('explanation')}</p>
                      <p className="font-body-md text-body-md text-gray-700 leading-relaxed"><MathRenderer html={q.explanation_fr} /></p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="text-center mt-8">
          <button onClick={() => navigate(`/exams/${examId}`)} className="font-body-md text-body-md text-emerald-600 hover:text-emerald-700">{t('back')}</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto px-mobile py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-caption text-caption text-gray-400 font-medium">{t('question')} {current + 1}/{questions.length}</span>
          <div className="w-24 bg-gray-100 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }} />
          </div>
        </div>
        <Timer duration={30 * 60} onTimeUp={handleTimeUp} running={!submitted} />
      </div>

      <div className="mb-5">
        <StepIndicator total={questions.length} current={current} answers={answers} questions={questions} />
      </div>

      <QCMQuestion question={q} selected={answers[q.id]} onSelect={selectAnswer} />

      <div className="flex items-center justify-between mt-5">
        <button onClick={goPrev} disabled={current === 0} className="px-4 py-2 font-body-md text-body-md text-gray-500 hover:text-gray-700 disabled:opacity-30 transition">{t('previous')}</button>
        <div className="flex gap-2">
          <button onClick={toggleShowAnswer} className="px-4 py-2 font-body-md text-body-md border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
            {showAnswer ? t('hide_answer') : t('show_answer')}
          </button>
          <button onClick={goNext} className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-label-md text-label-md hover:bg-emerald-600 transition">
            {current < questions.length - 1 ? t('next') : t('submit')}
          </button>
        </div>
      </div>

      {showAnswer && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <p className="font-label-md text-label-md text-emerald-700 mb-1">
            {t('correct_answer')} : {['A', 'B', 'C', 'D'][q.correctIndex]}
          </p>
          {q.explanation_fr && (
            <p className="font-body-md text-body-md text-emerald-600 leading-relaxed"><MathRenderer html={q.explanation_fr} /></p>
          )}
        </div>
      )}
    </div>
  );
}
