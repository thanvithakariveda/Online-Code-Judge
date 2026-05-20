import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext.jsx";
import { authAPI, submissionsAPI, problemsAPI } from "../api/services.js";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    submissions: [],
    solved: 0,
    problems: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authAPI.getMe(),
      submissionsAPI.getMine(),
      problemsAPI.getAll(),
    ])
      .then(([me, subs, probs]) => {
        setStats({
          submissions: subs?.data?.submissions || [],
          solved: me?.data?.user?.solvedProblems?.length || 0,
          problems: probs?.data?.count || 0,
        });
      })
      .catch(() => {
        toast.error("Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome {user?.username}</p>

      <p>Score: {user?.score || 0}</p>
      <p>Solved: {stats.solved}</p>
      <p>Total Problems: {stats.problems}</p>

      <Link to="/problems">Problems</Link>
    </div>
  );
}