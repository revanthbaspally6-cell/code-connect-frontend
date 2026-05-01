import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Form, Button } from 'react-bootstrap';

interface CodeEditorProps {
  language?: string;
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  theme?: string;
  readOnly?: boolean;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  language = 'javascript', 
  value = '', 
  onChange, 
  height = '400px',
  theme = 'vs-dark',
  readOnly = false,
  placeholder = '// Write your code here...'
}) => {
  const editorRef = useRef<any>(null);
  const [editorTheme, setEditorTheme] = useState(theme);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
    });

    if (!value && placeholder) {
      editor.setValue(placeholder);
      const model = editor.getModel();
      const position = model.getFullModelRange().getEndPosition();
      editor.setPosition(position);
      editor.focus();
    }

    if (onChange) {
      editor.onDidChangeModelContent(() => {
        const currentValue = editor.getValue();
        onChange(currentValue);
      });
    }
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'go', label: 'Go' },
  ];

  const themeOptions = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' },
  ];

  return (
    <div className="border rounded overflow-hidden">
      {/* Editor Controls */}
      <div className="bg-light p-2 border-bottom d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <div className="d-flex align-items-center gap-2">
            <Form.Label className="mb-0 small fw-medium">Language:</Form.Label>
            <Form.Select
              value={language}
              onChange={(e) => {
                const event = new CustomEvent('languageChange', { 
                  detail: { language: e.target.value } 
                });
                window.dispatchEvent(event);
              }}
              size="sm"
              style={{ width: '120px' }}
              disabled={readOnly}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Form.Label className="mb-0 small fw-medium">Theme:</Form.Label>
            <Form.Select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              size="sm"
              style={{ width: '100px' }}
            >
              {themeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        <div className="d-flex gap-2 small text-muted">
          <span>Lines: {value.split('\n').length}</span>
          <span>Characters: {value.length}</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={language}
        value={value}
        theme={editorTheme}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
        }}
      />

      {/* Editor Footer */}
      <div className="bg-light p-2 border-top d-flex justify-content-between align-items-center">
        <div className="small text-muted">
          {readOnly ? 'Read-only mode' : 'Press Ctrl+S to save (if configured)'}
        </div>
        <div className="d-flex gap-2 small text-muted">
          <span>UTF-8</span>
          <span>•</span>
          <span>LF</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
