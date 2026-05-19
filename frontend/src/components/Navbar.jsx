import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-dark-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Online Code Judge
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link to="/problems" className="hover:text-cyan-400 transition">Problems</Link>
          <Link to="/leaderboard" className="hover:text-cyan-400 transition">Leaderboard</Link>
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link>
              <Link to="/submissions" className="hover:text-cyan-400 transition">Submissions</Link>
              {user.role === 'admin' && (
                <Link to="/admin/problems" className="hover:text-violet-400 transition">Admin</Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:inline">
                {user.username} · <span className="text-cyan-400">{user.score ?? 0} pts</span>
              </span>
              <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1.5 hover:text-cyan-400 transition">Login</Link>
              <Link to="/register" className="gradient-btn text-sm py-1.5 px-4">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
