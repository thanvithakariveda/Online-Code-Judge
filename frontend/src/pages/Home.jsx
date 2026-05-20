import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';

export default function Home() {
  return (
    <section className="max-w-4xl mx-auto text-center py-16 sm:py-24 animate-slide-up">
      <h1 className="text-4xl sm:text-6xl font-bold mb-6">
        <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
          Online Code Judge
        </span>
      </h1>
      <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
        Practice coding problems, submit solutions in C++, Python, Java, or JavaScript,
        and climb the leaderboard — like CodeChef and LeetCode.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to={ROUTES.PROBLEMS} className="gradient-btn">Browse Problems</Link>
        <Link to={ROUTES.REGISTER} className="px-6 py-2.5 rounded-lg border border-white/20 hover:bg-white/5 transition">
          Get Started
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-20 text-left">
        {[
          { title: 'Monaco Editor', desc: 'Professional IDE experience in the browser.' },
          { title: 'Instant Verdicts', desc: 'Accepted, WA, TLE, RE, and CE via Judge0.' },
          { title: 'Leaderboard', desc: 'Earn points for every unique problem you solve.' },
        ].map((f) => (
          <div key={f.title} className="glass-card p-6 hover:border-cyan-500/30 transition">
            <h3 className="font-semibold text-cyan-400 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
