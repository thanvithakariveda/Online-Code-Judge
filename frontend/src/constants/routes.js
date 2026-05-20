/** App route paths — single source of truth for links and redirects */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROBLEMS: '/problems',
  PROBLEM: '/problems/:id',
  DASHBOARD: '/dashboard',
  LEADERBOARD: '/leaderboard',
  SUBMISSIONS: '/submissions',
  ADMIN_PROBLEMS: '/admin/problems',
};

/** localStorage keys for JWT auth */
export const AUTH_STORAGE = {
  TOKEN: 'token',
  USER: 'user',
};
