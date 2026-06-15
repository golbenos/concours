import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import QCMQuestion from '../components/QCMQuestion';
import MathRenderer from '../components/MathRenderer';
import LoadingSpinner from '../components/LoadingSpinner';

const stripCBPrefix = (str) => str.replace(/^\[CB\d+#\d+\]\s*/, '');

const difficultyColors = {
  facile: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  moyen: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  difficile: 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400',
};

export default function PracticeTopic() {
  const { sectionId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isConcours = sectionId?.startsWith('cb');
  const [section, setSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState({});
  const [allAtOnce, setAllAtOnce] = useState(false);
  const showAll = allAtOnce;
  const submittedRef = useRef(false);
  const resultRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/data/book/book.json');
        const sec = res.data.sections?.find(s => s.id === sectionId);
        if (sec) {
          setSection(sec);
          const raw = sec.questions || [];
          if (isConcours) {
            raw.forEach(q => { q.question_fr = stripCBPrefix(q.question_fr); });
          }
          setQuestions(raw);
        } else {
          navigate('/practice');
        }
      } catch (e) { console.error('PracticeTopic fetch error:', e); navigate('/practice'); }
      setLoading(false);
    })();
  }, [sectionId, navigate]);

  const selectAnswer = (qId, idx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: idx }));
  };

  const goNext = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else finishQuiz();
  };

  const goPrev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  const finishQuiz = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    if (resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const toggleShowAnswer = () => {
    const q = questions[current];
    setShowAnswer(prev => ({ ...prev, [q.id]: !prev[q.id] }));
  };

  if (loading) return <LoadingSpinner />;
  if (questions.length === 0) return (
    <div className="max-w-2xl mx-auto px-mobile py-20 text-center">
      <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
      <p className="font-body-md text-body-md text-gray-400 dark:text-gray-500 mb-4">{t('no_questions_section')}</p>
      <button onClick={() => navigate('/practice')} className="text-emerald-600 dark:text-emerald-400 font-body-md text-body-md">{t('back')}</button>
    </div>
  );

  if (submitted) {
    const score = questions.filter(q => answers[q.id] === q.correctIndex).length;
    return (
      <div ref={resultRef} className="max-w-2xl mx-auto px-mobile py-10">
        <div className="text-center mb-8">
          <div className="font-headline-lg text-headline-lg text-emerald-600 dark:text-emerald-400 mb-1">{score}<span className="text-gray-300 dark:text-gray-600">/{questions.length}</span></div>
          <p className="font-body-md text-body-md text-gray-400 dark:text-gray-500 mt-2">{t('your_score')}</p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-4 max-w-xs mx-auto">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(score / questions.length) * 100}%` }} />
          </div>
        </div>
        <h2 className="font-headline-md text-headline-md text-gray-800 dark:text-gray-100 mb-5">{t('correction')}</h2>
        <div className="space-y-5">
          {questions.map((q, i) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correctIndex;
            return (
              <div key={q.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-caption text-caption text-gray-400 dark:text-gray-500">{t('question')} {i + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-caption font-medium ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : userAns === undefined ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'}`}>
                    {isCorrect ? t('correct') : (userAns === undefined ? t('no_answer') : t('incorrect'))}
                  </span>
                </div>
                <QCMQuestion question={q} selected={userAns} showResult />
                {q.explanation_fr && (
                  <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="font-label-md text-label-md text-gray-500 dark:text-gray-400 mb-1">{t('explanation')}</p>
                    <p className="font-body-md text-body-md text-gray-700 dark:text-gray-200 leading-relaxed"><MathRenderer html={q.explanation_fr} /></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate('/practice')} className="font-body-md text-body-md text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">{t('back')}</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const showingAnswer = showAnswer[q.id];

  return (
    <div className="max-w-2xl mx-auto px-mobile py-8">
      {section?.course && section.course.length > 0 && (
        <div className="mb-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
          <h3 className="font-label-md text-label-md text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500 text-lg">menu_book</span>
            {section.title_fr}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-caption px-2 py-0.5 rounded-full">{questions.length} QCM</span>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <span className="font-body-md text-body-md text-gray-600">{t('practice_mode')}</span>
        <button onClick={() => setAllAtOnce(prev => !prev)}
          className={`px-4 py-1.5 rounded-xl font-label-md text-label-md transition ${
            allAtOnce ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
          {allAtOnce ? t('all_at_once') : t('one_by_one')}
        </button>
      </div>

      {!showAll && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="font-caption text-caption text-gray-400 dark:text-gray-500 font-medium">{t('question')} {current + 1}/{questions.length}</span>
              <button onClick={() => navigate('/practice')} className="font-caption text-caption text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">{t('back')}</button>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {q.difficulty && <span className={`text-caption px-2 py-0.5 rounded-full ${difficultyColors[q.difficulty] || 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>{t(q.difficulty)}</span>}
          </div>
        </>
      )}

      {showAll ? (
        <div className="space-y-6">
          {questions.map((question, i) => {
            const showing = showAnswer[question.id];
            return (
              <div key={question.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                <div className="mb-3">
                  <span className="font-caption text-caption text-gray-400 dark:text-gray-500">{t('question')} {i + 1}/{questions.length}</span>
                </div>
                <QCMQuestion question={question} selected={answers[question.id]} onSelect={(idx) => selectAnswer(question.id, idx)} />
                <div className="mt-3 flex justify-end">
                  <button onClick={() => setShowAnswer(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                    className="px-3 py-1.5 font-caption text-caption border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    {showing ? t('hide_answer') : t('show_answer')}
                  </button>
                </div>
                {showing && (
                  <div className="mt-3 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                    <p className="font-label-md text-label-md text-emerald-700 dark:text-emerald-300 mb-1">
                      {t('correct_answer')} : {['A', 'B', 'C', 'D'][question.correctIndex]}
                    </p>
                    {question.explanation_fr && (
                      <p className="font-body-md text-body-md text-emerald-600 dark:text-emerald-400 leading-relaxed"><MathRenderer html={question.explanation_fr} /></p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div className="text-center py-6">
            <button onClick={finishQuiz} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-label-md text-label-md hover:bg-emerald-600 transition shadow-lg">
              {t('submit')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <QCMQuestion question={q} selected={answers[q.id]} onSelect={(idx) => selectAnswer(q.id, idx)} />

          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-2">
              <button onClick={goPrev} disabled={current === 0} className="px-4 py-2 font-body-md text-body-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition">{t('previous')}</button>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleShowAnswer} className="px-4 py-2 font-body-md text-body-md border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                {showingAnswer ? t('hide_answer') : t('show_answer')}
              </button>
              <button onClick={goNext} className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-label-md text-label-md hover:bg-emerald-600 transition">
                {current < questions.length - 1 ? t('next') : t('submit')}
              </button>
            </div>
          </div>

          {showingAnswer && (
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
              <p className="font-label-md text-label-md text-emerald-700 dark:text-emerald-300 mb-1">
                {t('correct_answer')} : {['A', 'B', 'C', 'D'][q.correctIndex]}
              </p>
              {q.explanation_fr && (
                <p className="font-body-md text-body-md text-emerald-600 dark:text-emerald-400 leading-relaxed"><MathRenderer html={q.explanation_fr} /></p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
