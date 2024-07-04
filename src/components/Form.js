import React, { useState, useEffect, useRef } from 'react';
import {BsFillPlusCircleFill} from 'react-icons/bs';

function Form(props) {

    <div className='App-form'>
    <input
      type="text"
      value={props.title}
      onChange={(e) => props.setTitle(e.target.value)}
      placeholder="Snippet Title"
    />
    <input
      type="text"
      value={props.language}
      onChange={(e) => props.setLanguage(e.target.value)}
      placeholder="Snippet Language"
    />
    <textarea
      value={props.code}
      onChange={(e) => props.setCode(e.target.value)}
      placeholder="Snippet Code"
    />
    <button onClick={props.addSnippet}><BsFillPlusCircleFill /> Add Snippet</button>
    <input
      type="text"
      value={props.search}
      onChange={(e) => props.setSearch(e.target.value)}
      placeholder="Search Snippets"
    />
  </div>
}

export default Form;