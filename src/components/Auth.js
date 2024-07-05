// Auth.js
import React, { useState } from 'react';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function Auth({ setIsLogged }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);

  const handleAuth = async () => {
    try {
      if (isRegister) {
        console.log('Creating user...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created:', userCredential.user);
        localStorage.setItem('userId', userCredential.user.uid);
        setIsLogged(true);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);
        localStorage.setItem('userId', userCredential.user.uid);
        setIsLogged(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className='App-form'>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="button" onClick={handleAuth}>
        {isRegister ? 'Register' : 'Login'}
      </button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        Switch to {isRegister ? 'Login' : 'Register'}
      </button>
    </form>
  );
}

export default Auth;
