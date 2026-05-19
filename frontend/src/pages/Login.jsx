import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showSidebar={false}>
      <section className="max-w-md mx-auto mt-12 animate-slide-up">
        <article className="glass-card p-8">
          <h1 className="text-2xl font-bold mb-2">Login</h1>
          <p className="text-gray-400 text-sm mb-6">Sign in to submit solutions</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="gradient-btn w-full flex justify-center items-center gap-2">
              {loading ? <LoadingSpinner size="sm" /> : 'Login'}
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4 text-center">
            No account? <Link to="/register" className="text-cyan-400 hover:underline">Register</Link>
          </p>
        </article>
      </section>
    </Layout>
  );
}
