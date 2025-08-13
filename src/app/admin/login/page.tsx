"use client";
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../../../../firebase/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Sekarang akan terpakai

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); 
    setError(''); 

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      let message = 'Terjadi kesalahan saat masuk. Silakan coba lagi.';
      if (err && typeof err === 'object' && 'code' in err && err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
            message = 'Akun tidak ditemukan.';
            break;
          case 'auth/wrong-password':
            message = 'Password salah.';
            break;
          case 'auth/invalid-email':
            message = 'Format email tidak valid.';
            break;
          case 'auth/user-disabled':
            message = 'Akun dinonaktifkan.';
            break;
          case 'auth/too-many-requests':
            message = 'Terlalu banyak percobaan. Silakan coba beberapa saat lagi.';
            break;
          default:
            message = 'Terjadi kesalahan saat masuk. Silakan coba lagi.';
        }
      }
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
        {/* PASTIKAN ONSUBMIT ADA DI SINI */}
        <form onSubmit={handleLogin}> 
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="admin@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="********"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}