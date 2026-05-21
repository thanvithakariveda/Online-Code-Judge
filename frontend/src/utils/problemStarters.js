import { CODE_TEMPLATES } from '../constants/languages.js';

/** Build slug from title (same logic as backend) */
export function slugifyTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Starter code that matches each sample problem's expected I/O.
 * Falls back to generic template for custom/admin problems.
 */
const STARTERS_BY_SLUG = {
  'two-sum': {
    python: `import sys

data = sys.stdin.read().strip().split()
n = int(data[0])
nums = list(map(int, data[1:1 + n]))
target = int(data[1 + n])
seen = {}
for i, v in enumerate(nums):
    need = target - v
    if need in seen:
        print(seen[need], i)
        break
    seen[v] = i
`,
    javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const n = Number(lines[0]);
const nums = lines.slice(1, 1 + n).map(Number);
const target = Number(lines[1 + n]);
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  if (seen.has(target - nums[i])) {
    console.log(seen.get(target - nums[i]), i);
    break;
  }
  seen.set(nums[i], i);
}
`,
  },
  'reverse-string': {
    python: `import sys
s = sys.stdin.read().strip()
print(s[::-1])
`,
    javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf8').trim();
console.log(s.split('').reverse().join(''));
`,
    cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    reverse(s.begin(), s.end());
    cout << s;
    return 0;
}
`,
  },
  'maximum-subarray': {
    python: `import sys

data = list(map(int, sys.stdin.read().split()))
n = data[0]
nums = data[1:1 + n]
best = cur = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)
print(best)
`,
  },
  'valid-parentheses': {
    python: `import sys
s = sys.stdin.read().strip()
stack = []
pairs = {')': '(', ']': '[', '}': '{'}
ok = True
for c in s:
    if c in '([{':
        stack.append(c)
    elif not stack or stack.pop() != pairs[c]:
        ok = False
        break
if stack:
    ok = False
print('true' if ok else 'false')
`,
  },
};

export function getStarterCode(problem, language) {
  const slug = problem?.slug || slugifyTitle(problem?.title);
  const byLang = STARTERS_BY_SLUG[slug];
  if (byLang?.[language]) return byLang[language];
  return CODE_TEMPLATES[language] || CODE_TEMPLATES.python;
}
