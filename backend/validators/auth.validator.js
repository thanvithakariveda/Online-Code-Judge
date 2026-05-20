/**
 * Simple auth request validation (no external library — easy to read).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(body) {
  const { username, email, password } = body ?? {};
  const errors = [];

  if (!username?.trim()) errors.push('Username is required.');
  else if (username.trim().length < 3) errors.push('Username must be at least 3 characters.');
  else if (username.trim().length > 30) errors.push('Username must be at most 30 characters.');

  if (!email?.trim()) errors.push('Email is required.');
  else if (!EMAIL_REGEX.test(email.trim())) errors.push('Email format is invalid.');

  if (!password) errors.push('Password is required.');
  else if (password.length < 6) errors.push('Password must be at least 6 characters.');

  return errors;
}

export function validateLogin(body) {
  const { email, password } = body ?? {};
  const errors = [];

  if (!email?.trim()) errors.push('Email is required.');
  if (!password) errors.push('Password is required.');

  return errors;
}
