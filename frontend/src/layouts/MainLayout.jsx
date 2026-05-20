import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

/** Main app shell: navbar, optional sidebar, page content */
export default function MainLayout({ children, showSidebar = true }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
