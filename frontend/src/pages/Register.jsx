import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import FormField from '../components/forms/FormField.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { validateRegisterForm, hasErrors } from '../utils/validation.js';
import { ROUTES } from '../constants/routes.js';
import { getErrorMessage } from '../api/axios.js';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm({ username, email, password });
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
      toast.success('Account created!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-12 animate-slide-up">
      <article className="glass-card p-8">
        <h1 className="text-2xl font-bold mb-2">Register</h1>
        <p className="text-gray-400 text-sm mb-6">Create your account</p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            autoComplete="username"
          />
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
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
          <button type="submit" disabled={loading} className="gradient-btn w-full flex justify-center items-center gap-2">
            {loading ? <LoadingSpinner size="sm" /> : 'Register'}
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Have an account? <Link to={ROUTES.LOGIN} className="text-cyan-400 hover:underline">Login</Link>
        </p>
      </article>
    </section>
  );
}
