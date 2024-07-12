import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header.js';
import Snippet from './components/Snippet.js';
import Pagination from './components/Pagination';
import Form from './components/Form';
import './firebase.js';
import { getDatabase, ref, get, child } from "firebase/database";
import {InfinitySpin} from 'react-loader-spinner';
import Auth from './components/Auth';

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
  const [isLogged, setIsLogged] = useState(false);
  const userId = localStorage.getItem('userId');
  const dbRef = ref(getDatabase());

  async function loadedSnippets() {
    get(child(dbRef, `snippets/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        if (data) {
          setSnippets(Object.entries(data));
          setIsLoaded(true);
          setTotalPages(Math.ceil(Object.entries(data).length / SNIPPETS_PER_PAGE));
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

   useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLogged(true);
      if (!loaded) {
        loadedSnippets();
      }
    } else {
      setIsLoaded(true);
    }
    const languages = new Set(snippets.map(snippet => snippet.language));
    setUniqueLanguages([...languages]);
  }, [snippets, loaded]);

  const filterSnippets = (snippets, search) => {
    console.log('Get list snippets', snippets);
    return snippets.filter(([id, snippet]) => {
      const title = (snippet.title || '').toLowerCase();
      const code = (snippet.code || '').toLowerCase();
      const searchLower = search.toLowerCase();
      
      return title.includes(searchLower) || code.includes(searchLower);
    }).map(([id, snippet]) => ({ id, ...snippet }));
  };
  
  const filteredSnippets = filterSnippets(snippets, search);

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

  function logout() {
    localStorage.removeItem('userId');
    setIsLogged(false);
  }

  const startIndex = (currentPage - 1) * SNIPPETS_PER_PAGE;
  const objectToArray = obj => Object.entries(obj).map(([id, data]) => ({id, ...data}));

  const currentSnippets = (tagFilterSnippets.length > 0 ? objectToArray(tagFilterSnippets) : objectToArray(filteredSnippets))
    .slice(startIndex, startIndex + SNIPPETS_PER_PAGE);
  
  return (
    <div className="App">
      <Header />
      {isLogged && <button type="button" className="link" onClick={logout}>Logout</button> }
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
        {!isLogged && 
          <Auth setIsLogged={setIsLogged} />
        }
        {isLogged &&
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
        </>
      }
    </div>
  );
}

export default App;
