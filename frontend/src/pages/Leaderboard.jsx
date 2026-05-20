import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { leaderboardAPI } from '../api/services.js';

export default function Leaderboard() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardAPI
      .get()
      .then(({ data }) => setBoard(data.leaderboard))
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-gray-400 text-sm">Top coders ranked by score (10 pts per unique solve)</p>
      </header>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <section className="glass-card overflow-hidden max-w-2xl">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-right">Solved</th>
                <th className="p-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {board.map((row) => (
                <tr key={row.username} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-mono text-cyan-400">#{row.rank}</td>
                  <td className="p-4 font-medium">{row.username}</td>
                  <td className="p-4 text-right text-gray-400">{row.solvedCount}</td>
                  <td className="p-4 text-right text-violet-400 font-semibold">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {board.length === 0 && (
            <p className="p-8 text-center text-gray-500">No rankings yet.</p>
          )}
        </section>
      )}
    </>
  );
}
