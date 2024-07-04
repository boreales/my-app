import React, { useState } from 'react';
import {BsFillPlusCircleFill} from 'react-icons/bs';
import { getDatabase, ref, set } from "firebase/database";
import { useForm } from "react-hook-form"

function Form(props) {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => console.log(data)

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
        <form className='App-form' onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Snippet Title"
            {...register("titleRequired", { required: true })}
          />
          {errors.titleRequired && <p className='error'>This field is required</p>}
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Snippet Language"
            {...register("languageRequired", { required: true })}
          />
          {errors.languageRequired && <p className='error'>This field is required</p>}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Snippet Code"
            {...register("codeRequired", { required: true })}
          />
          {errors.codeRequired && <p className='error'>This field is required</p>}
          <button onClick={addSnippet}><BsFillPlusCircleFill /> Add Snippet</button>
          <input
            type="text"
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            placeholder="Search Snippets"
          />
        </form>
  );
}

export default Form;