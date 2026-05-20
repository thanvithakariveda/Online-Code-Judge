import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import FormField from '../components/forms/FormField.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { validateLoginForm, hasErrors } from '../utils/validation.js';
import { ROUTES } from '../constants/routes.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm({ email, password });
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    setLoading(true);

    try {
      const res = await login(email.trim(), password);

      // SAFE STORAGE (IMPORTANT FIX FOR STEP 4)
      if (res?.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      if (res?.token) {
        localStorage.setItem('token', res.token); // ❌ NO JSON.stringify
      }

      toast.success('Welcome back!');
      navigate(ROUTES.DASHBOARD);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-12 animate-slide-up">
      <article className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-gray-400 text-sm mb-6">
          Sign in to submit solutions
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <FormField
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full flex justify-center items-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Login'}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          No account?{' '}
          <Link to={ROUTES.REGISTER} className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </article>
    </section>
  );
}