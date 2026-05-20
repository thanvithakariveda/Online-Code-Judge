import { useEffect, useState } from "react";
import { problemsAPI } from "../api/services";

export default function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await problemsAPI.getAll();
        setProblems(Array.isArray(data) ? data : []);
      } catch (err) {
        setProblems([]);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1>Problems</h1>

      {problems.length === 0 ? (
        <p>No problems found</p>
      ) : (
        <ul>
          {problems.map((p) => (
            <li key={p._id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}