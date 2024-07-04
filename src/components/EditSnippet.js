import React, { useState } from 'react';

function EditSnippetForm({ snippet, onSave, onCancel }) {
  const [code, setCode] = useState(snippet.code);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...snippet, code });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Langage: {snippet.language}
      </label>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <button type="button" onClick={onCancel}>Annuler</button>
      <button type="submit">Sauvegarder</button>
    </form>
  );
}

export default EditSnippetForm;
