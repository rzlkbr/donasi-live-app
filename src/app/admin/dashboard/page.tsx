// File: app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from 'D:/Repositories/work_repo/donasi_app/v.1/donasi-live-app/firebase/config';
import { useRouter } from 'next/navigation';

// Definisikan tipe data untuk group agar lebih rapi dengan TypeScript
interface Group {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 1. Ambil data semua kelompok dari Firestore saat halaman dimuat
  useEffect(() => {
    const fetchGroups = async () => {
      const querySnapshot = await getDocs(collection(db, 'groups'));
      const groupsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setGroups(groupsData);
    };
    fetchGroups();
  }, []);

  // 2. Fungsi untuk handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !amount) {
      setMessage('Error: Kelompok dan Nominal wajib diisi.');
      return;
    }

    // Konfirmasi sebelum menyimpan
    if (!confirm(`Anda yakin ingin menambahkan donasi Rp ${amount} ke kelompok yang dipilih?`)) {
        return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Admin tidak terautentikasi.");
      }
      // 3. Tambahkan dokumen baru ke collection 'donations'
      await addDoc(collection(db, 'donations'), {
        groupId: selectedGroup,
        amount: Number(amount),
        notes: notes,
        createdAt: serverTimestamp(), // Timestamp dari server Firebase
        createdBy: user.uid, // Simpan ID admin yang input
        createdByEmail: user.email // Simpan email admin
      });

      setMessage('Sukses! Donasi berhasil ditambahkan.');
      // Reset form
      setSelectedGroup('');
      setAmount('');
      setNotes('');
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage('Gagal menambahkan donasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-6 sm:p-8 flex justify-between items-center border-b">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Input Donasi Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dropdown Kelompok */}
                <div>
                    <label htmlFor="group" className="block text-sm font-medium text-gray-600 mb-1">Pilih Kelompok</label>
                    <select
                        id="group"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    >
                        <option value="" disabled>-- Pilih salah satu --</option>
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>

                {/* Input Nominal */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">Nominal Donasi (Rp)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Contoh: 500000"
                        required
                    />
                </div>
            </div>

            {/* Input Catatan */}
            <div className="mt-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-1">Catatan (Opsional)</label>
                <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Donasi dari Hamba Allah"
                ></textarea>
            </div>

            {/* Tombol Submit */}
            <div className="mt-6 text-right">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-400"
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan Donasi'}
                </button>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
}