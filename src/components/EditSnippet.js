import React, { useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/php/php.js';
import 'codemirror/mode/haml/haml.js';
import 'codemirror/mode/javascript/javascript.js';
import { UnControlled as CodeMirror } from 'react-codemirror2';

function EditSnippetForm({ snippet, onSave, onCancel }) {
  const [code, setCode] = useState(snippet.code);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...snippet, code });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CodeMirror
        value={code}
        options={{
          mode: snippet.language === 'html' ? 'haml' : snippet.language,
          theme: 'material',
          lineNumbers: true
        }}
        onChange={(editor, data, value) => {
          setCode(value);
        }}
      />
      <button type="button" onClick={onCancel}>Annuler</button>
      <button type="submit">Sauvegarder</button>
    </form>
  );
}

export default EditSnippetForm;
