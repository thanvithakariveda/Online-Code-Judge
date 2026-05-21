import axios from 'axios';

/** Judge0 language IDs used by the frontend code editor */
export const LANGUAGE_IDS = {
  cpp: 54,
  python: 71,
  java: 62,
  javascript: 63,
};

let client = null;

function getClient() {
  if (!client) {
    const hasRapidKey =
      process.env.JUDGE0_API_KEY &&
      process.env.JUDGE0_API_KEY !== 'your_rapidapi_key_here';

    // No RapidAPI key → use free public Judge0 CE (no X-RapidAPI headers)
    const baseURL = hasRapidKey
      ? process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
      : process.env.JUDGE0_API_URL || 'https://ce.judge0.com';

    const headers = { 'Content-Type': 'application/json' };

    if (hasRapidKey) {
      headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
    }

    client = axios.create({
      baseURL,
      headers,
      timeout: 30000,
    });

    console.log(`Judge0 client: ${baseURL}${hasRapidKey ? ' (RapidAPI)' : ' (public CE)'}`);
  }
  return client;
}

function judge0ErrorMessage(err) {
  const status = err.response?.status;
  if (status === 403) {
    return 'Code runner blocked (403). On Render set a valid JUDGE0_API_KEY, or remove the placeholder key to use free ce.judge0.com.';
  }
  if (status === 401) {
    return 'Invalid Judge0 API key. Update JUDGE0_API_KEY on Render.';
  }
  if (status === 429) {
    return 'Judge0 rate limit — wait a moment and try again.';
  }
  return err.message || 'Execution service unavailable.';
}

/**
 * Submit code to Judge0 and poll until finished.
 */
export const runCode = async ({ sourceCode, languageId, stdin, timeLimit, memoryLimit }) => {
  const http = getClient();

  try {
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
  } catch (err) {
    const msg = judge0ErrorMessage(err);
    throw new Error(msg);
  }
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
