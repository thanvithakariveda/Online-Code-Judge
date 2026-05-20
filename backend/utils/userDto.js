/**
 * Consistent user object for API responses (always uses `id`, never raw `_id`).
 */
export function formatUser(user) {
  if (!user) return null;

  const doc = user.toObject ? user.toObject() : user;

  return {
    id: doc._id?.toString?.() ?? doc.id,
    username: doc.username,
    email: doc.email,
    role: doc.role,
    score: doc.score ?? 0,
    solvedProblems: doc.solvedProblems,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
