import React, { useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { memo } from 'react';

const Snippet = memo(function Snippet(props) {
    const [snippets, setSnippets] = useState([]);
    const snippetRefs = useRef([]);

    const downloadSnippetImage = (index) => {
        const node = snippetRefs.current[index];
        console.log(node);
        if (node) {
            toPng(node)
                .then((dataUrl) => {
                    download(dataUrl, `${props.snippet.title}.png`);
                })
                .catch((error) => {
                    console.error('Oops, something went wrong!', error);
                });
        }
    };

    const deleteSnippet = (index) => {
        setSnippets(snippets.filter((_, i) => i !== index));
        const savedSnippets = JSON.parse(localStorage.getItem('snippets'));
        savedSnippets.splice(index, 1);
        localStorage.setItem('snippets', JSON.stringify(savedSnippets));
    };

    return (
        <li key={props.codeId}>
            <h3>{props.snippet.title}</h3>
            <div ref={el => snippetRefs.current[props.codeId] = el}>
                <SyntaxHighlighter language={props.snippet.language} style={darcula}>
                    {props.snippet.code}
                </SyntaxHighlighter>
            </div>
            <button onClick={() => downloadSnippetImage(props.codeId)}>Download as Image</button>
            <button onClick={() => deleteSnippet(props.codeId)}>Delete</button>
        </li>
    );
});

export default Snippet;