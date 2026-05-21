import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
    isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
  }`;

export default function Sidebar() {
  const { user, isAdmin } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/problems', label: 'Categories', icon: '📝' },
    { to: '/submissions', label: 'Submissions', icon: '📤' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  if (isAdmin) {
    links.push({ to: '/admin/problems', label: 'Manage Problems', icon: '⚙️' });
  }

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-white/10 bg-dark-800/50 p-4 gap-1">
      {user && (
        <div className="mb-4 px-4 py-3 glass-card">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="font-medium truncate">{user.username}</p>
          <p className="text-cyan-400 text-sm mt-1">{user.score ?? 0} points</p>
        </div>
      )}
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass}>
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
