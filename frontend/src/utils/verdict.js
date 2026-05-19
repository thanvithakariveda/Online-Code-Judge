export const getVerdictClass = (verdict) => {
  if (verdict === 'Accepted') return 'verdict-accepted';
  if (verdict === 'Wrong Answer') return 'verdict-wa';
  return 'verdict-error';
};

export const DIFFICULTY_COLORS = {
  Easy: 'text-emerald-400 bg-emerald-400/10',
  Medium: 'text-amber-400 bg-amber-400/10',
  Hard: 'text-red-400 bg-red-400/10',
};
