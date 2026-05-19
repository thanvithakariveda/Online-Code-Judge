import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { submissionsAPI } from '../api/services.js';
import { getVerdictClass } from '../utils/verdict.js';

function SubmissionsContent() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    submissionsAPI
      .getMine()
      .then(({ data }) => setSubmissions(data.submissions))
      .catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Submission History</h1>
        <p className="text-gray-400 text-sm">All your past submissions</p>
      </header>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <section className="glass-card overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-4 text-left">Problem</th>
                <th className="p-4 text-left">Language</th>
                <th className="p-4 text-left">Verdict</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <Link to={`/problems/${s.problem?._id}`} className="text-cyan-400 hover:underline">
                      {s.problem?.title || 'Unknown'}
                    </Link>
                  </td>
                  <td className="p-4 capitalize">{s.language}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs border ${getVerdictClass(s.verdict)}`}>{s.verdict}</span>
                  </td>
                  <td className="p-4 text-gray-400">{s.runtime != null ? `${s.runtime}s` : '—'}</td>
                  <td className="p-4 text-gray-500">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && <p className="p-8 text-center text-gray-500">No submissions yet.</p>}
        </section>
      )}
    </>
  );
}

export default function Submissions() {
  return (
    <ProtectedRoute>
      <Layout>
        <SubmissionsContent />
      </Layout>
    </ProtectedRoute>
  );
}
