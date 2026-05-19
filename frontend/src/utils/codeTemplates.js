// Default starter code per language (stdin/stdout programs for Judge0)
export const CODE_TEMPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Read input and print output
    return 0;
}`,
  python: `# Read input from stdin
import sys

def main():
    data = sys.stdin.read().strip()
    # Your solution here
    print(data)

if __name__ == "__main__":
    main()`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // Your solution here
    }
}`,
  javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
// Your solution here
console.log(input);`,
};

export const LANGUAGES = [
  { id: 'cpp', label: 'C++', monaco: 'cpp' },
  { id: 'python', label: 'Python', monaco: 'python' },
  { id: 'java', label: 'Java', monaco: 'java' },
  { id: 'javascript', label: 'JavaScript', monaco: 'javascript' },
];
