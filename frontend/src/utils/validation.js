/** Client-side form validation (mirrors backend rules for fast feedback) */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm({ email, password }) {
  const errors = {};

  if (!email?.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email.';

  if (!password) errors.password = 'Password is required.';

  return errors;
}

export function validateRegisterForm({ username, email, password }) {
  const errors = {};

  if (!username?.trim()) errors.username = 'Username is required.';
  else if (username.trim().length < 3) errors.username = 'Username must be at least 3 characters.';
  else if (username.trim().length > 30) errors.username = 'Username must be at most 30 characters.';

  if (!email?.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email.';

  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
