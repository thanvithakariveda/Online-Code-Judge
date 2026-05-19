import Editor from '@monaco-editor/react';

export default function CodeEditor({ value, onChange, language = 'python', height = '400px' }) {
  return (
    <div className="monaco-wrapper">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
        }}
      />
    </div>
  );
}
