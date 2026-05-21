import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { problemsAPI } from '../api/services.js';
import { DIFFICULTY_COLORS } from '../utils/verdict.js';
import { getErrorMessage } from '../api/axios.js';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'Easy', label: 'Easy' },
  { id: 'Medium', label: 'Medium' },
  { id: 'Hard', label: 'Hard' },
];

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await problemsAPI.getAll({
          difficulty: difficulty || undefined,
          search: search || undefined,
        });
        setProblems(data.problems || []);
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load problems'));
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetch, 300);
    return () => clearTimeout(t);
  }, [difficulty, search]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-gray-400 text-sm">Browse problems by difficulty</p>
      </header>

      <section className="mb-4">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Filter by category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id || 'all'}
              type="button"
              onClick={() => setDifficulty(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                difficulty === cat.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'border-white/10 text-gray-400 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Search problems..."
          className="input-field max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <section className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="text-left p-4">#</th>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4 hidden sm:table-cell">Category</th>
                <th className="text-left p-4 hidden md:table-cell">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p, i) => {
                const rate =
                  p.submissionCount > 0
                    ? Math.round((p.acceptedCount / p.submissionCount) * 100)
                    : 0;
                return (
                  <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 text-gray-500">{i + 1}</td>
                    <td className="p-4">
                      <Link to={`/problems/${p._id}`} className="text-cyan-400 hover:underline font-medium">
                        {p.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 sm:hidden">{p.difficulty}</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs ${DIFFICULTY_COLORS[p.difficulty]}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-gray-400">{rate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {problems.length === 0 && (
            <p className="p-8 text-center text-gray-500">No problems in this category yet.</p>
          )}
        </section>
      )}
    </>
  );
}
