import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Snippet from './snippet';
import Header from './header';

function CodeItem() {
  const [loaded, setIsLoaded] = useState(false);
  const [snippet, setSnippet] = useState([]);
  let { codeId } = useParams();
  useEffect(() => {
    if (!loaded) {
      loadedSnippets();
    }
  }, []);

  function loadedSnippets() {
    console.log("Code id", codeId);
    //Get local storage item with position codeId
    const item = JSON.parse(localStorage.getItem('snippets'))[codeId];
    console.log(item);
    if (item) {
      setSnippet(item);
    }
    setIsLoaded(true);
  }

  return (
    <div className="App">
      <Header />
      <a href={"/"}>Back</a>
      <div className="App-body">
        <ul>
          <Snippet snippet={snippet} codeId={codeId} />
        </ul>
      </div>
    </div>
  );
}

export default CodeItem;