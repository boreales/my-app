import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Snippet from './components/Snippet';
import Pagination from './components/Pagination';
import Form from './components/Form';
import './firebase.js';
import { getDatabase, ref, onValue } from "firebase/database";
import {InfinitySpin} from 'react-loader-spinner';

const SNIPPETS_PER_PAGE = 2;

function App() {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState('');
  const [loaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState('all');
  const [tagFilterSnippets, setTagFilterSnippets] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const db = getDatabase();
  const snippetsFromDB = ref(db, 'snippets');

  async function loadedSnippets() {
    onValue(snippetsFromDB, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSnippets(Object.values(data));
        setIsLoaded(true);
        setTotalPages(Math.ceil(data.length / SNIPPETS_PER_PAGE));
      }
    });
  }

  useEffect(() => {
    if (!loaded) {
      loadedSnippets();
    }
    const languages = new Set(snippets.map(snippet => snippet.language));
    setUniqueLanguages([...languages]);
  }, [snippets, loaded]);

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
      {!loaded &&
          <>
            <div className='center'>
              <InfinitySpin
              visible={true}
              width="200"
              color="#61dafb"
              ariaLabel="infinity-spin-loading"
              />
            </div>
            <p>Loading ...</p>
          </>
        }
        {loaded && 
        <>
          <Form snippets={snippets} setSnippets={setSnippets} setSearch={setSearch} />
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
              {loaded && tagFilterSnippets.length === 0 && filteredSnippets.length === 0 && <li>No snippets found</li>}
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
        </>
      }
    </div>
  );
}

export default App;
