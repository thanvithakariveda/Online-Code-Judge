import axios from 'axios';

/** Judge0 language IDs used by the frontend code editor */
export const LANGUAGE_IDS = {
  cpp: 54,
  python: 71,
  java: 62,
  javascript: 63,
};

/** Lazy client — env vars are read when first used (after dotenv.config). */
let client = null;

function getClient() {
  if (!client) {
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
    }

    client = axios.create({
      baseURL: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
      headers,
      timeout: 30000,
    });
  }
  return client;
}

/**
 * Submit code to Judge0 and poll until finished.
 */
export const runCode = async ({ sourceCode, languageId, stdin, timeLimit, memoryLimit }) => {
  const http = getClient();

  const { data: submission } = await http.post('/submissions?base64_encoded=false&wait=false', {
    source_code: sourceCode,
    language_id: languageId,
    stdin: stdin || '',
    cpu_time_limit: (timeLimit || 2000) / 1000,
    memory_limit: memoryLimit || 128000,
  });

  const token = submission.token;
  let result = null;

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const { data } = await http.get(`/submissions/${token}?base64_encoded=false`);
    if (data.status && data.status.id > 2) {
      result = data;
      break;
    }
  }

  if (!result) {
    throw new Error('Judge0 timeout while waiting for result');
  }

  return result;
};

export const mapVerdict = (judgeResult) => {
  const statusId = judgeResult.status?.id;
  const desc = judgeResult.status?.description || '';

  if (statusId === 3) {
    return { verdict: 'Accepted', runtime: judgeResult.time, memory: judgeResult.memory };
  }
  if (statusId === 4) {
    return { verdict: 'Wrong Answer', errorMessage: 'Output does not match expected.' };
  }
  if (statusId === 5) {
    return { verdict: 'Time Limit Exceeded', errorMessage: desc };
  }
  if (statusId === 6) {
    return {
      verdict: 'Compilation Error',
      errorMessage: judgeResult.compile_output || desc,
    };
  }
  if (statusId >= 7 && statusId <= 12) {
    return {
      verdict: 'Runtime Error',
      errorMessage: judgeResult.stderr || judgeResult.message || desc,
    };
  }
  return { verdict: 'Runtime Error', errorMessage: desc || 'Unknown error' };
};

export const normalizeOutput = (output) => {
  if (output == null) return '';
  return String(output)
    .trim()
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
};
