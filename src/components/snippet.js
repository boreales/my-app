import React, { useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { memo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BsDownload, BsCopy, BsFillTrash3Fill } from "react-icons/bs";

const Snippet = memo(function Snippet(props) {
    const snippets = props.snippets;
    const setSnippets = props.setSnippets;
    const snippetRefs = useRef([]);
    const [copied, setCopied] = useState(false);

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
            <a href={`/code/${props.codeId}`} key={props.codeId}>
                <div ref={el => snippetRefs.current[props.codeId] = el}>
                    <SyntaxHighlighter language={props.snippet.language} style={darcula}>
                        {props.snippet.code}
                    </SyntaxHighlighter>
                </div>
            </a>
            <CopyToClipboard text={props.snippet.code}
                onCopy={() => setCopied(true)}>
                <button> <BsCopy /> Copy to clipboard</button>
            </CopyToClipboard>
            {copied ? <span style={{ color: 'green' }}>Copied.</span> : null}
            <button onClick={() => downloadSnippetImage(props.codeId)}><BsDownload /> Download as Image</button>
            <button onClick={() => deleteSnippet(props.codeId)}><BsFillTrash3Fill /> Delete</button>
        </li>
    );
});

export default Snippet;