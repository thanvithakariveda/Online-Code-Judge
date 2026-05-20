import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminRoute from '../components/AdminRoute.jsx';
import GuestRoute from '../components/GuestRoute.jsx';

/**
 * Wraps a page with layout + optional auth guards.
 * - protect: requires login
 * - admin: requires admin role
 * - guest: only for logged-out users (login/register)
 */
export default function PageShell({ children, sidebar = true, protect = false, admin = false, guest = false }) {
  let content = children;

  if (guest) content = <GuestRoute>{content}</GuestRoute>;
  if (admin) content = <AdminRoute>{content}</AdminRoute>;
  else if (protect) content = <ProtectedRoute>{content}</ProtectedRoute>;

  return <MainLayout showSidebar={sidebar}>{content}</MainLayout>;
}
