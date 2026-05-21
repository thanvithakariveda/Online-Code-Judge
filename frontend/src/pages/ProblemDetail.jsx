import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import CodeEditor from '../components/CodeEditor.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { problemsAPI, submissionsAPI } from '../api/services.js';
import { CODE_TEMPLATES, LANGUAGES } from '../constants/languages.js';
import { getVerdictClass, DIFFICULTY_COLORS } from '../utils/verdict.js';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../constants/routes.js';
import { getErrorMessage } from '../api/axios.js';

export default function ProblemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(CODE_TEMPLATES.python);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    problemsAPI
      .getById(id)
      .then(({ data }) => setProblem(data.problem))
      .catch(() => toast.error('Problem not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const onLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(CODE_TEMPLATES[lang]);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to submit');
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const { data } = await submissionsAPI.submit({ problemId: id, code, language });
      setResult(data.submission);
      toast.success(`Verdict: ${data.submission.verdict}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Submission failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const monacoLang = LANGUAGES.find((l) => l.id === language)?.monaco || 'python';

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!problem) {
    return (
      <section className="text-center py-20">
        <p className="text-gray-400 mb-4">Problem not found.</p>
        <Link to={ROUTES.PROBLEMS} className="text-cyan-400 hover:underline">
          Back to problems
        </Link>
      </section>
    );
  }

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <article className="glass-card p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <header className="mb-4">
          <span className={`text-xs px-2 py-0.5 rounded ${DIFFICULTY_COLORS[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <h1 className="text-2xl font-bold mt-2">{problem.title}</h1>
          {problem.tags?.length > 0 && (
            <p className="flex flex-wrap gap-2 mt-2">
              {problem.tags.map((t) => (
                <span key={t} className="text-xs bg-dark-600 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </p>
          )}
        </header>
        <pre className="whitespace-pre-wrap text-sm text-gray-300 mb-4">{problem.description}</pre>
        {problem.constraints && (
          <>
            <h3 className="font-semibold text-cyan-400 mb-1">Constraints</h3>
            <pre className="text-sm text-gray-400 mb-4">{problem.constraints}</pre>
          </>
        )}
        {problem.inputFormat && (
          <>
            <h3 className="font-semibold text-cyan-400 mb-1">Input Format</h3>
            <pre className="text-sm text-gray-400 mb-4">{problem.inputFormat}</pre>
          </>
        )}
        {problem.outputFormat && (
          <>
            <h3 className="font-semibold text-cyan-400 mb-1">Output Format</h3>
            <pre className="text-sm text-gray-400 mb-4">{problem.outputFormat}</pre>
          </>
        )}
        <h3 className="font-semibold text-cyan-400 mb-1">Sample</h3>
        <p className="text-xs text-gray-500">Input</p>
        <pre className="bg-dark-800 p-3 rounded text-sm mb-2 font-mono">{problem.sampleInput}</pre>
        <p className="text-xs text-gray-500">Output</p>
        <pre className="bg-dark-800 p-3 rounded text-sm font-mono">{problem.sampleOutput}</pre>
      </article>

      <article className="flex flex-col gap-3">
        <header className="flex flex-wrap items-center gap-3">
          <select
            className="input-field max-w-[160px]"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <button onClick={handleSubmit} disabled={submitting} className="gradient-btn flex items-center gap-2">
            {submitting ? <LoadingSpinner size="sm" /> : 'Submit'}
          </button>
        </header>
        <CodeEditor value={code} onChange={setCode} language={monacoLang} height="420px" />
        {result && (
          <aside className={`p-4 rounded-lg border ${getVerdictClass(result.verdict)}`}>
            <p className="font-bold text-lg">{result.verdict}</p>
            {result.runtime != null && (
              <p className="text-sm mt-1">
                Time: {result.runtime}s · Memory: {result.memory} KB
              </p>
            )}
            {result.errorMessage && <p className="text-sm mt-2 opacity-80">{result.errorMessage}</p>}
          </aside>
        )}
      </article>
    </section>
  );
}
