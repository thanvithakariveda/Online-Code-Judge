import { useEffect, useState } from "react";
import { problemsAPI } from "../api/services";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await problemsAPI.getAll({
          search: search || undefined,
          difficulty: difficulty || undefined,
        });

        setProblems(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load problems");
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, difficulty]);

  return (
    <div>
      <h1>Problems</h1>

      <input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setDifficulty(e.target.value)}>
        <option value="">All</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {problems.map((p) => (
            <li key={p._id}>
              <Link to={`/problems/${p._id}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}