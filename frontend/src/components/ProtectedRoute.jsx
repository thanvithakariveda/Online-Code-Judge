import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}