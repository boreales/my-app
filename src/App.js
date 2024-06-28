import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/header';
import Snippet from './components/snippet';
import {BsFillPlusCircleFill} from 'react-icons/bs';

function App() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [search, setSearch] = useState('');
  const [loaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState('all');
  const [tagFilterSnippets, setTagFilterSnippets] = useState([]);

  function loadedSnippets() {
    const savedSnippets = JSON.parse(localStorage.getItem('snippets'));
    if (savedSnippets) {
      setSnippets(savedSnippets);
    }
    setIsLoaded(true);
  }

  useEffect(() => {
    if (!loaded) {
      loadedSnippets();
    }
  }, []);

  const addSnippet = () => {
    if (title.trim() !== '' && code.trim() !== '') {
      setSnippets([...snippets, { title, code, language }]);
      setTitle('');
      setCode('');
      setLanguage('');
      localStorage.setItem('snippets', JSON.stringify([...snippets, { title, code, language }]));
    }
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(search.toLowerCase()) ||
    snippet.code.toLowerCase().includes(search.toLowerCase())
  );

  function changeFilter(e) {
    setFilter(e.target.value)
    let filteredSnippets = snippets.filter(snippet => snippet.language === e.target.value)
    if (e.target.value === 'all') {
      setTagFilterSnippets([]);
    }
    setTagFilterSnippets(filteredSnippets);
  }

  return (
    <div className="App">
      <Header />
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Snippets"
        />
      </div>
      <div className="App-body">
        <span>Filter by language:</span>
        <select
          value={filter}
          onChange={(e) => changeFilter(e)}
        >
          <option value='all'>All</option>
          {snippets.map(snippet => (
            <option value={snippet.language}>{snippet.language}</option>
          ))}
        </select>
        <ul>
          {tagFilterSnippets.length > 0 && tagFilterSnippets.map((snippet, index) => (
            <Snippet snippets={snippets} setSnippets={setSnippets} codeId={index} snippet={snippet} />
          ))}
          {tagFilterSnippets.length === 0 && filteredSnippets.length === 0 && <li>No snippets found</li>}
          {tagFilterSnippets.length === 0 && filteredSnippets.map((snippet, index) => (
            <Snippet snippets={snippets} setSnippets={setSnippets} codeId={index} snippet={snippet} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
