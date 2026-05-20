import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { ROUTES } from '../constants/routes.js';

/** Only allow admin users */
export default function AdminRoute({ children }) {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute>
      {isAdmin ? children : <Navigate to={ROUTES.DASHBOARD} replace />}
    </ProtectedRoute>
  );
}
