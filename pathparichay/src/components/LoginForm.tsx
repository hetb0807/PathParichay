'use client';

import { useState } from 'react';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login, e.g., redirect to another page
      console.log('User logged in successfully');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Handle successful login
      console.log('User signed in with Google successfully');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <button onClick={handleGoogleSignIn} className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
        Sign in with Google
      </button>
    </div>
  );
}
