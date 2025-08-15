"use client";
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../../../lib/firebase';

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="panel p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-yellow-300 text-center mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-yellow-200 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full input-inset px-4 py-3"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-yellow-200 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-inset px-4 py-3"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-skeuo bg-blue-600 text-white font-semibold py-3 px-4"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Login
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-yellow-300 hover:text-yellow-200 text-sm transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}