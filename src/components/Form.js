import React, { useState } from 'react';
import {BsFillPlusCircleFill} from 'react-icons/bs';
import { getDatabase, ref, set } from "firebase/database";

function Form(props) {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');

  const addSnippet = () => {
    const db = getDatabase();
    if (title.trim() !== '' && code.trim() !== '') {
      let newSnippet = { title, code, language };
      props.setSnippets([...props.snippets, newSnippet]);
      setTitle('');
      setCode('');
      setLanguage('');
      localStorage.setItem('snippets', JSON.stringify([...props.snippets, newSnippet]));
      set(ref(db, 'snippets/'), [...props.snippets, newSnippet]);
    }
  };

  return(
      <div className='App-form'>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Snippet Title"
      />
      <input
        type="text"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        placeholder="Snippet Language"
      />
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Snippet Code"
      />
      <button onClick={addSnippet}><BsFillPlusCircleFill /> Add Snippet</button>
      <input
        type="text"
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
        placeholder="Search Snippets"
      />
    </div>
  );
}

export default Form;