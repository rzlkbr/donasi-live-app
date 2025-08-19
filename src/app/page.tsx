// File: app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Group } from '../types';
// ShinyText component removed

// Fungsi helper untuk format mata uang Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function Home() {
  // State untuk menyimpan data groups, donations dan status loading
  const [groups, setGroups] = useState<Group[]>([]);
  const [donations, setDonations] = useState<{
    id: string;
    groupName: string;
    amount: number;
    notes?: string;
    createdAt: Timestamp;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIKA REAL-TIME FETCHING ---
  useEffect(() => {
    // Query untuk mengambil data dari koleksi 'groups' dan mengurutkannya
    // berdasarkan totalDonasi secara descending (terbesar ke terkecil)
    const groupsQuery = query(collection(db, 'groups'), orderBy('totalDonations', 'desc'));
    
    // Query untuk mengambil donasi individual terbaru
    const donationsQuery = query(
      collection(db, 'donations'), 
      orderBy('createdAt', 'desc'), 
      limit(10)
    );

    // onSnapshot adalah listener real-time dari Firestore untuk groups
    const unsubscribeGroups = onSnapshot(groupsQuery, (querySnapshot) => {
      const groupsData: Group[] = [];
      querySnapshot.forEach((doc) => {
        groupsData.push({ id: doc.id, ...doc.data() } as Group);
      });
      console.log('Groups data loaded:', groupsData);
       setGroups(groupsData); // Update state dengan data terbaru
     }, (error) => {
       console.error('Error fetching groups:', error);
     });
    
    // onSnapshot untuk donations
    const unsubscribeDonations = onSnapshot(donationsQuery, (querySnapshot) => {
      const donationsData: {
        id: string;
        groupName: string;
        amount: number;
        notes?: string;
        createdAt: Timestamp;
      }[] = [];
      querySnapshot.forEach((doc) => {
        donationsData.push({ id: doc.id, ...doc.data() } as {
          id: string;
          groupName: string;
          amount: number;
          notes?: string;
          createdAt: Timestamp;
        }); 
      });
      console.log('Donations data loaded:', donationsData);
       setDonations(donationsData);
       setIsLoading(false); // Matikan status loading setelah kedua data dimuat
     }, (error) => {
       console.error('Error fetching donations:', error);
       setIsLoading(false);
     });

    // Cleanup function: Berhenti mendengarkan saat komponen dilepas
    // Ini sangat penting untuk mencegah memory leak
    return () => {
      unsubscribeGroups();
      unsubscribeDonations();
    };
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen mount

  // --- KALKULASI DATA ---
  const totalDonation = groups.reduce((acc, group) => acc + group.totalDonations, 0);
  const top10Groups = groups.slice(0, 10); // Data sudah terurut dari query

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <i className="fas fa-spinner fa-spin fa-3x text-yellow-400 mb-4"></i>
        <p className="text-lg">Menghubungkan ke Layanan Donasi...</p>
      </div>
    );
  }

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Main Display Panel */}
      <div className="panel p-6 md:p-8 my-8 text-center">
        <h1 className="text-2xl md:text-3xl text-yellow-300 tracking-wider font-bold">
          Total Donasi: <span className="text-white text-4xl md:text-6xl font-extrabold block mt-2">{formatRupiah(totalDonation)}</span>
        </h1>
        {/* Progress Bar Section */}
        <div className="mt-6">
          <div className="flex justify-between items-end mb-1 text-yellow-200 font-semibold">
            <span className="text-lg">{formatRupiah(totalDonation)}</span>
            <span className="text-lg">Target: {formatRupiah(10000000)}</span>
          </div>
          <div className="progress-container w-full h-6">
            <div 
              className="progress-bar h-full rounded-full" 
              style={{ width: `${Math.min((totalDonation / 10000000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Panel Container untuk Ranking dan Donasi Individual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Ranking */}
        <div className="panel p-6">
          <h2 className="text-xl md:text-2xl text-yellow-300 mb-4 text-center tracking-wider font-bold">🏆 Ranking 10 Besar Kelompok</h2>
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {groups.length === 0 ? (
              <li className="text-center text-gray-400">Belum ada donasi.</li>
            ) : (
              top10Groups.map((group, index) => (
                <li key={group.id} className="panel bg-opacity-20 p-3 rounded-lg flex justify-between items-center text-lg animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-300 text-black' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-semibold">{group.name}</span>
                  </div>
                  <span className="font-bold text-yellow-300">{formatRupiah(group.totalDonations)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        
        {/* Panel Donasi Individual */}
        <div className="panel p-6">
          <h2 className="text-xl md:text-2xl text-yellow-300 mb-4 text-center tracking-wider font-bold">💝 Donasi Perorangan Terbaru</h2>
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {donations.length === 0 ? (
              <li className="text-center text-gray-400">Belum ada donasi perorangan.</li>
            ) : (
              donations.map((donation, index) => (
                <li key={donation.id} className="panel bg-opacity-20 p-3 rounded-lg flex justify-between items-center text-sm animate-slide-in" style={{animationDelay: `${index * 0.05}s`}}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {donation.groupName || 'Kelompok Tidak Diketahui'}
                    </span>
                    <span className="text-xs text-gray-300">
                      {donation.createdAt && donation.createdAt.toDate ? 
                        donation.createdAt.toDate().toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Waktu tidak tersedia'
                      }
                    </span>
                    {donation.notes && (
                      <span className="text-xs text-yellow-200 italic mt-1">
                        &ldquo;{donation.notes}&rdquo;
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-yellow-300">{formatRupiah(donation.amount)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Admin Controls */}
      <div className="mt-8 text-center">
        <Link href="/admin/login" className="btn-skeuo bg-sky-700 text-green-300 px-6 py-2 text-lg inline-block no-underline font-semibold shadow-lg">
          <i className="fas fa-sign-in-alt mr-2"></i>Admin Login
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 pt-8 text-yellow-400" style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
        <p>© {new Date().getFullYear()} - Aplikasi Donasi Live Balikpapan</p>
        <p className="text-sm opacity-70">Data diperbarui secara real-time</p>
      </footer>
    </main>
  );
}