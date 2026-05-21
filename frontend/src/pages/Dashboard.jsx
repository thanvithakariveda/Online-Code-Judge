import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { authAPI, submissionsAPI, problemsAPI } from '../api/services.js';
import { ROUTES } from '../constants/routes.js';
import { getErrorMessage } from '../api/axios.js';
import { DIFFICULTY_COLORS } from '../utils/verdict.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Load each part separately so one failure does not break the whole dashboard
      try {
        const { data } = await problemsAPI.getAll();
        const list = data.problems || [];
        setProblems(list);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load problems'));
      }

      try {
        const { data } = await authAPI.getMe();
        if (data.user) {
          const solvedList = data.user.solvedProblems;
          setSolved(Array.isArray(solvedList) ? solvedList.length : 0);
        }
      } catch {
        /* keep user from context */
        setSolved(0);
      }

      try {
        const { data } = await submissionsAPI.getMine();
        setSubmissions((data.submissions || []).slice(0, 5));
      } catch {
        setSubmissions([]);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.username}</p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Score', value: user?.score ?? 0, color: 'text-cyan-400' },
          { label: 'Solved', value: solved, color: 'text-violet-400' },
          { label: 'Total Problems', value: problems.length, color: 'text-pink-400' },
        ].map((s) => (
          <article key={s.label} className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </article>
        ))}
      </section>

      <section className="glass-card p-6 mb-8">
        <header className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Problems</h2>
          <Link to={ROUTES.PROBLEMS} className="text-sm text-cyan-400 hover:underline">
            View all categories
          </Link>
        </header>

        {problems.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No problems yet. Restart the backend or run <code className="text-cyan-400">npm run seed</code> in the
            backend folder.
          </p>
        ) : (
          <ul className="space-y-2">
            {problems.slice(0, 8).map((p) => (
              <li key={p._id} className="flex justify-between items-center border-b border-white/5 py-2 text-sm">
                <Link to={`/problems/${p._id}`} className="text-cyan-400 hover:underline font-medium">
                  {p.title}
                </Link>
                <span className={`px-2 py-0.5 rounded text-xs ${DIFFICULTY_COLORS[p.difficulty] || ''}`}>
                  {p.difficulty}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass-card p-6">
        <header className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recent Submissions</h2>
          <Link to={ROUTES.SUBMISSIONS} className="text-sm text-cyan-400 hover:underline">
            View all
          </Link>
        </header>
        {submissions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No submissions yet.{' '}
            <Link to={ROUTES.PROBLEMS} className="text-cyan-400">
              Start solving
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {submissions.map((s) => (
              <li key={s._id} className="flex justify-between text-sm border-b border-white/5 py-2">
                <span>{s.problem?.title}</span>
                <span className={s.verdict === 'Accepted' ? 'text-emerald-400' : 'text-amber-400'}>
                  {s.verdict}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
