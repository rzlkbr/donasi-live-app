// File: app/page.tsx
'use client'; // Wajib karena kita menggunakan hooks (useState, useEffect)

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Definisikan tipe data untuk group agar kode lebih aman
interface Group {
  id: string;
  name: string;
  totalDonations: number;
}

// Remove this duplicate and misplaced function declaration block

// Fungsi helper untuk format mata uang Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// (Remove this duplicate block entirely)
export default function HomePage() {
  // State untuk menyimpan data groups dan status loading
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIKA REAL-TIME FETCHING ---
  useEffect(() => {
    const q = query(collection(db, 'groups'), orderBy('totalDonations', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const groupsData: Group[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Defensive mapping & type coercion
          const id = doc.id;
          const name = typeof data.name === 'string' ? data.name : 'Tidak diketahui';
          let totalDonations = Number(data.totalDonations);
          if (!Number.isFinite(totalDonations)) totalDonations = 0;
          // Only push valid group
          if (id && name) {
            groupsData.push({ id, name, totalDonations });
          } else {
            // Log malformed doc for debugging
            console.warn('Malformed group doc:', { id, data });
          }
        });
        setGroups(groupsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        setError('Gagal mengambil data donasi. Silakan coba lagi nanti.');
        setIsLoading(false);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (err) {
        console.error('Error unsubscribing Firestore listener:', err);
      }
    };
  }, []);

  // --- KALKULASI DATA ---
  const totalDonation = groups.reduce((acc, group) => acc + group.totalDonations, 0);
  const top10Groups = groups.slice(0, 10); // Data sudah terurut dari query

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-heading text-3xl">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-heading text-3xl">Memuat Data...</div>;
  }

  return (
    <main className="bg-gradient-to-br from-emerald-900 to-teal-900 min-h-screen text-white p-4 sm:p-8">
      {/* Header dengan Ornamen (placeholder) */}
      <header className="text-center mb-12" style={{ borderBottom: '2px solid rgba(212, 175, 55, 0.2)' /* Ornamen Dayak - Gold */, paddingBottom: '2rem' }}>
        <h1 className="font-heading text-5xl sm:text-7xl mb-2">Donasi Live</h1>
        <p className="font-sans text-lg text-emerald-200">Progres Penggalangan Dana Real-time</p>
      </header>

      {/* TOTAL DONASI (F-01) */}
      <section className="text-center mb-12">
        <h2 className="font-sans text-xl text-emerald-300 uppercase tracking-widest">Total Donasi Terkumpul</h2>
        <p className="font-heading text-6xl sm:text-8xl text-primary my-4" style={{ textShadow: '0 0 15px rgba(46, 204, 113, 0.5)' }}>
          {formatRupiah(totalDonation)}
        </p>
      </section>

      {/* KONTEN UTAMA: TOP 10 & SEMUA KELOMPOK */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Kolom Kiri: TOP 10 (F-02) */}
        <div className="lg:col-span-1 bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
          <h3 className="font-heading text-3xl text-secondary mb-4">Top 10 Donatur</h3>
          <ul className="space-y-4">
            {top10Groups.map((group, index) => (
              <li key={group.id} className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                <span className="font-sans text-lg">
                  <span className="font-bold text-secondary mr-2">{index + 1}.</span> {group.name}
                </span>
                <span className="font-bold text-primary">{formatRupiah(group.totalDonations)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom Kanan: SEMUA KELOMPOK (F-03) */}
        <div className="lg:col-span-2 bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
          <h3 className="font-heading text-3xl text-white mb-4">Daftar Kelompok Donatur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div key={group.id} className="bg-white/5 p-4 rounded-lg">
                <p className="font-sans font-semibold text-lg text-emerald-200">{group.name}</p>
                <p className="font-sans text-md text-white">{formatRupiah(group.totalDonations)}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer dengan Ornamen (placeholder) */}
      <footer className="text-center mt-12 pt-8 text-emerald-400 font-sans" style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
        <p>&copy; {new Date().getFullYear()} - Aplikasi Donasi Live Balikpapan</p>
        <p className="text-sm opacity-70">Data diperbarui secara real-time</p>
      </footer>
    </main>
  );
}
