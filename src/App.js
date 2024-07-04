import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Snippet from './components/Snippet';
import {BsFillPlusCircleFill} from 'react-icons/bs';
import Pagination from './components/Pagination';

const SNIPPETS_PER_PAGE = 2;

function App() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [search, setSearch] = useState('');
  const [loaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState('all');
  const [tagFilterSnippets, setTagFilterSnippets] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function loadedSnippets() {
    const savedSnippets = JSON.parse(localStorage.getItem('snippets'));
    if (savedSnippets) {
      setSnippets(savedSnippets);
    }
    setIsLoaded(true);
    setTotalPages(Math.ceil(savedSnippets.length / SNIPPETS_PER_PAGE));
  }

  useEffect(() => {
    if (!loaded) {
      loadedSnippets();
    }
    const languages = new Set(snippets.map(snippet => snippet.language));
    setUniqueLanguages([...languages]);
  }, [snippets]);

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
      setTotalPages(Math.ceil(snippets.length / SNIPPETS_PER_PAGE));
    } else {
      setTagFilterSnippets(filteredSnippets);
      setTotalPages(Math.ceil(filteredSnippets.length / SNIPPETS_PER_PAGE));
    }
  }

  const startIndex = (currentPage - 1) * SNIPPETS_PER_PAGE;
  console.log(tagFilterSnippets.length);
  const currentSnippets = tagFilterSnippets.length > 0 ? tagFilterSnippets.slice(startIndex, startIndex + SNIPPETS_PER_PAGE) : filteredSnippets.slice(startIndex, startIndex + SNIPPETS_PER_PAGE);
  
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
        <p>Filter by language:</p>
        <select
          value={filter}
          onChange={(e) => changeFilter(e)}
        >
          <option value='all'>All</option>
          {uniqueLanguages.map(language => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
        <ul>
          {tagFilterSnippets.length > 0 && currentSnippets.map((snippet, index) => (
            <Snippet snippets={snippets} setSnippets={setSnippets} codeId={index} snippet={snippet} />
          ))}
          {tagFilterSnippets.length === 0 && filteredSnippets.length === 0 && <li>No snippets found</li>}
          {tagFilterSnippets.length === 0 && currentSnippets.map((snippet, index) => (
            <Snippet snippets={snippets} setSnippets={setSnippets} codeId={index} snippet={snippet} />
          ))}
        </ul>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default App;
