import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { ROUTES } from '../constants/routes.js';

/** Redirect logged-in users away from login/register pages */
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
}
