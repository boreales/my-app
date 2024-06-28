import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import './App.css';
import Header from './components/header';

function App() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [search, setSearch] = useState('');
  const [loaded, setIsLoaded] = useState(false);
  const snippetRefs = useRef([]);

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

  const deleteSnippet = (index) => {
    setSnippets(snippets.filter((_, i) => i !== index));
    const savedSnippets = JSON.parse(localStorage.getItem('snippets'));
    savedSnippets.splice(index, 1);
    localStorage.setItem('snippets', JSON.stringify(savedSnippets));
  };

  const downloadSnippetImage = (index) => {
    const node = snippetRefs.current[index];
    console.log(node);
    if (node) {
      toPng(node)
        .then((dataUrl) => {
          download(dataUrl, `${snippets[index].title}.png`);
        })
        .catch((error) => {
          console.error('Oops, something went wrong!', error);
        });
    }
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(search.toLowerCase()) ||
    snippet.code.toLowerCase().includes(search.toLowerCase())
  );

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
        <button onClick={addSnippet}>Add Snippet</button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Snippets"
        />
      </div>
      <div className="App-body">
        <ul>
          {filteredSnippets.map((snippet, index) => (
            <li key={index}>
              <h3>{snippet.title}</h3>
              <div ref={el => snippetRefs.current[index] = el}>
                <SyntaxHighlighter language={snippet.language} style={darcula}>
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
              <button onClick={() => downloadSnippetImage(index)}>Download as Image</button>
              <button onClick={() => deleteSnippet(index)}>Delete</button>
              <a href={"/code/" + index}>Show as plain page</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
