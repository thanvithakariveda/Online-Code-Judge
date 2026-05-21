import axios from 'axios';
import { LANGUAGE_IDS } from './judge0.service.js';
import { mapVerdict, normalizeOutput } from './judge0.service.js';

export { LANGUAGE_IDS, mapVerdict, normalizeOutput };

function hasValidRapidApiKey() {
  const key = process.env.JUDGE0_API_KEY?.trim();
  return key && key !== 'your_rapidapi_key_here' && key.length > 10;
}

function createJudge0Client() {
  const hasRapidKey = hasValidRapidApiKey();

  const baseURL = hasRapidKey
    ? process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
    : 'https://ce.judge0.com';

  const headers = { 'Content-Type': 'application/json' };

  if (hasRapidKey) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
  }

  console.log(`Code runner: ${baseURL}${hasRapidKey ? ' (RapidAPI)' : ' (free CE)'}`);

  return axios.create({ baseURL, headers, timeout: 60000 });
}

/**
 * Run code via Judge0. Free tier uses ce.judge0.com with wait=true (no API key).
 */
export async function runCode({ sourceCode, languageId, stdin, timeLimit, memoryLimit }) {
  const http = createJudge0Client();
  const hasRapidKey = hasValidRapidApiKey();

  const waitParam = hasRapidKey ? 'wait=false' : 'wait=true';

  try {
    const { data: submission } = await http.post(
      `/submissions?base64_encoded=false&${waitParam}`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin || '',
        cpu_time_limit: (timeLimit || 2000) / 1000,
        memory_limit: memoryLimit || 128000,
      }
    );

    if (waitParam === 'wait=true') {
      return submission;
    }

    const token = submission.token;
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const { data } = await http.get(`/submissions/${token}?base64_encoded=false`);
      if (data.status?.id > 2) return data;
    }

    throw new Error('Judge0 timeout while waiting for result');
  } catch (err) {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      throw new Error(
        'Code runner auth failed. On Render: delete JUDGE0_API_KEY or set a real RapidAPI key. Free mode uses ce.judge0.com automatically.'
      );
    }
    throw new Error(err.response?.data?.message || err.message || 'Execution service unavailable');
  }
}
