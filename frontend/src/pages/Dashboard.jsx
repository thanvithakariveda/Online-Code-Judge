import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI, submissionsAPI, problemsAPI } from '../api/services.js';
import { ROUTES } from '../constants/routes.js';

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    submissions: [],
    solved: 0,
    problems: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      authAPI.getMe(),
      submissionsAPI.getMine(),
      problemsAPI.getAll(),
    ])
      .then(([me, subs, probs]) => {
        const meData = me?.data || {};
        const subData = subs?.data || subs || {};
        const probData = probs?.data || probs || {};

        setStats({
          submissions: subData?.submissions?.slice(0, 5) || [],
          solved: meData?.user?.solvedProblems?.length || 0,
          problems: probData?.count || 0,
        });

        setError(false);
      })
      .catch(() => {
        setError(true);
        toast.error('Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  if (error) {
    return (
      <section className="glass-card p-8 text-center max-w-md mx-auto mt-12">
        <p className="text-gray-400 mb-4">
          Could not load your dashboard data.
        </p>

        <Link to={ROUTES.PROBLEMS} className="text-cyan-400 hover:underline">
          Browse problems
        </Link>
      </section>
    );
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, {user?.username}
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Score', value: user?.score ?? 0, color: 'text-cyan-400' },
          { label: 'Solved', value: stats.solved, color: 'text-violet-400' },
          { label: 'Total Problems', value: stats.problems, color: 'text-pink-400' },
        ].map((s) => (
          <article key={s.label} className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>
              {s.value}
            </p>
          </article>
        ))}
      </section>

      <section className="glass-card p-6">
        <header className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recent Submissions</h2>

          <Link to={ROUTES.SUBMISSIONS} className="text-sm text-cyan-400 hover:underline">
            View all
          </Link>
        </header>

        {stats.submissions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No submissions yet.{' '}
            <Link to={ROUTES.PROBLEMS} className="text-cyan-400">
              Start solving
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {stats.submissions.map((s) => (
              <li
                key={s._id}
                className="flex justify-between text-sm border-b border-white/5 py-2"
              >
                <span>{s?.problem?.title || 'Untitled Problem'}</span>

                <span
                  className={
                    s.verdict === 'Accepted'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }
                >
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