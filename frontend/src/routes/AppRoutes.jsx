import { Routes, Route } from 'react-router-dom';
import PageShell from './PageShell.jsx';
import { ROUTES } from '../constants/routes.js';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Problems from '../pages/Problems.jsx';
import ProblemDetail from '../pages/ProblemDetail.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Leaderboard from '../pages/Leaderboard.jsx';
import Submissions from '../pages/Submissions.jsx';
import AdminProblems from '../pages/AdminProblems.jsx';

/** Central route table — all paths and guards in one place */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<PageShell sidebar={false}><Home /></PageShell>} />

      <Route path={ROUTES.LOGIN} element={<PageShell sidebar={false} guest><Login /></PageShell>} />
      <Route path={ROUTES.REGISTER} element={<PageShell sidebar={false} guest><Register /></PageShell>} />

      <Route path={ROUTES.PROBLEMS} element={<PageShell><Problems /></PageShell>} />
      <Route path={ROUTES.PROBLEM} element={<PageShell sidebar={false}><ProblemDetail /></PageShell>} />
      <Route path={ROUTES.LEADERBOARD} element={<PageShell><Leaderboard /></PageShell>} />

      <Route path={ROUTES.DASHBOARD} element={<PageShell protect><Dashboard /></PageShell>} />
      <Route path={ROUTES.SUBMISSIONS} element={<PageShell protect><Submissions /></PageShell>} />
      <Route path={ROUTES.ADMIN_PROBLEMS} element={<PageShell protect admin><AdminProblems /></PageShell>} />
    </Routes>
  );
}
