/**
 * Whitelist fields allowed when creating/updating problems (prevents mass assignment).
 */
const PROBLEM_FIELDS = [
  'title',
  'description',
  'constraints',
  'inputFormat',
  'outputFormat',
  'sampleInput',
  'sampleOutput',
  'difficulty',
  'tags',
  'hiddenTestCases',
  'timeLimit',
  'memoryLimit',
];

export function pickProblemFields(body) {
  const payload = {};
  if (!body || typeof body !== 'object') return payload;

  for (const key of PROBLEM_FIELDS) {
    if (body[key] !== undefined) payload[key] = body[key];
  }
  return payload;
}

export function validateProblemBody(body, { partial = false } = {}) {
  const errors = [];
  const data = pickProblemFields(body);

  if (!partial) {
    if (!data.title?.trim()) errors.push('Title is required.');
    if (!data.description?.trim()) errors.push('Description is required.');
  }

  if (data.difficulty && !['Easy', 'Medium', 'Hard'].includes(data.difficulty)) {
    errors.push('Difficulty must be Easy, Medium, or Hard.');
  }

  return { errors, data };
}

const CONTEST_FIELDS = ['title', 'description', 'problems', 'startTime', 'endTime', 'isActive'];

export function pickContestFields(body) {
  const payload = {};
  if (!body || typeof body !== 'object') return payload;

  for (const key of CONTEST_FIELDS) {
    if (body[key] !== undefined) payload[key] = body[key];
  }
  return payload;
}

export function validateContestBody(body) {
  const errors = [];
  const data = pickContestFields(body);

  if (!data.title?.trim()) errors.push('Title is required.');
  if (!data.startTime) errors.push('Start time is required.');
  if (!data.endTime) errors.push('End time is required.');

  return { errors, data };
}

export function validateSubmissionBody(body) {
  const { problemId, code, language } = body ?? {};
  const errors = [];

  if (!problemId) errors.push('problemId is required.');
  if (!code?.trim()) errors.push('code is required.');
  if (!language) errors.push('language is required.');

  return { errors, data: { problemId, code, language } };
}
