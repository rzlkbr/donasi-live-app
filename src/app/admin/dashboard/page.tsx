// File: app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
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
  const [displayAmount, setDisplayAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const router = useRouter();

  // Fungsi untuk format angka dengan titik satuan
  const formatNumber = (value: string) => {
    // Hapus semua karakter non-digit
    const numericValue = value.replace(/\D/g, '');
    // Format dengan titik sebagai pemisah ribuan
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Fungsi untuk handle perubahan input amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const formattedValue = formatNumber(inputValue);
    
    setAmount(numericValue); // Simpan nilai numerik untuk database
     setDisplayAmount(formattedValue); // Simpan nilai terformat untuk display
   };

  // 1. Ambil data semua kelompok dari Firestore saat halaman dimuat
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log('Fetching groups from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'groups'));
        console.log('Groups query result:', querySnapshot.size, 'documents');
        
        const groupsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        console.log('Groups data:', groupsData);
        setGroups(groupsData);
        
        if (groupsData.length === 0) {
           setMessage('Peringatan: Belum ada kelompok yang tersedia. Silakan tambahkan kelompok terlebih dahulu.');
           setShowAddGroup(true);
         }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setMessage('Error: Gagal memuat data kelompok.');
      }
    };
    fetchGroups();
  }, []);

  // 2. Fungsi untuk handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with:', { selectedGroup, amount, notes });
    
    if (!selectedGroup || !amount) {
      setMessage('Error: Kelompok dan Nominal wajib diisi.');
      return;
    }

    if (Number(amount) <= 0) {
      setMessage('Error: Nominal donasi harus lebih dari 0.');
      return;
    }

    // Konfirmasi sebelum menyimpan
    if (!confirm(`Anda yakin ingin menambahkan donasi Rp ${Number(amount).toLocaleString('id-ID')} ke kelompok yang dipilih?`)) {
        return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      console.log('Current user:', user?.email);
      
      if (!user) {
        throw new Error("Admin tidak terautentikasi. Silakan login kembali.");
      }
      
      // Cari nama kelompok berdasarkan ID yang dipilih
      const selectedGroupData = groups.find(group => group.id === selectedGroup);
      const groupName = selectedGroupData ? selectedGroupData.name : 'Kelompok Tidak Diketahui';
      
      const donationData = {
        groupId: selectedGroup,
        groupName: groupName,
        amount: Number(amount),
        notes: notes || '',
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByEmail: user.email
      };
      
      console.log('Adding donation:', donationData);
      
      // 3. Tambahkan dokumen baru ke collection 'donations'
      const docRef = await addDoc(collection(db, 'donations'), donationData);
      
      console.log('Donation added with ID:', docRef.id);
      
      // 4. Update totalDonations di dokumen group secara manual
      const groupRef = doc(db, 'groups', selectedGroup);
      await updateDoc(groupRef, {
        totalDonations: increment(Number(amount)),
        donationCount: increment(1),
        lastUpdated: serverTimestamp()
      });
      
      console.log('Group totalDonations updated successfully');
      setMessage(`Sukses! Donasi Rp ${Number(amount).toLocaleString('id-ID')} berhasil ditambahkan.`);
      
      // Reset form
      setSelectedGroup('');
      setAmount('');
      setDisplayAmount('');
      setNotes('');
    } catch (error) {
      console.error("Error adding donation: ", error);
      setMessage(`Gagal menambahkan donasi: ${error instanceof Error ? error.message : 'Terjadi kesalahan tidak dikenal'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menambah kelompok baru
  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGroupName.trim()) {
      setMessage('Error: Nama kelompok tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Admin tidak terautentikasi. Silakan login kembali.");
      }
      
      const groupData = {
        name: newGroupName.trim(),
        totalDonations: 0,
        donationCount: 0,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByEmail: user.email
      };
      
      console.log('Adding group:', groupData);
      
      const docRef = await addDoc(collection(db, 'groups'), groupData);
      
      console.log('Group added with ID:', docRef.id);
      
      // Update local state
      const newGroup = { id: docRef.id, name: newGroupName.trim() };
      setGroups(prev => [...prev, newGroup]);
      
      setMessage(`Sukses! Kelompok "${newGroupName.trim()}" berhasil ditambahkan.`);
      setNewGroupName('');
      setShowAddGroup(false);
      
    } catch (error) {
      console.error("Error adding group: ", error);
      setMessage(`Gagal menambahkan kelompok: ${error instanceof Error ? error.message : 'Terjadi kesalahan tidak dikenal'}`);
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
        <div className="panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-yellow-300">Dashboard Admin</h1>
            <button
              onClick={handleLogout}
              className="btn-skeuo btn-clear text-sm py-2 px-4"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        <div className="p-6 sm:p-8">
          {/* Form Tambah Kelompok */}
          {showAddGroup && (
            <div className="mb-6 panel p-4">
              <h2 className="text-xl font-semibold text-yellow-300 mb-4">Tambah Kelompok Baru</h2>
              <form onSubmit={handleAddGroup} className="flex gap-3">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Nama kelompok (contoh: Kelompok A - Masjid Al-Ikhlas)"
                  className="flex-1 input-inset px-3 py-2"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-skeuo bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 disabled:opacity-50 shadow-lg"
                >
                  <i className="fas fa-plus mr-2"></i>{isLoading ? 'Menambah...' : 'Tambah'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGroup(false)}
                  className="btn-skeuo btn-clear px-4 py-2"
                  disabled={isLoading}
                >
                  Batal
                </button>
              </form>
            </div>
          )}
          
          {/* Tombol untuk menampilkan form tambah kelompok */}
          {!showAddGroup && groups.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowAddGroup(true)}
                className="btn-skeuo bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 text-sm shadow-lg"
              >
                <i className="fas fa-plus mr-2"></i>Tambah Kelompok Baru
              </button>
            </div>
          )}
          
          <h2 className="text-xl font-semibold text-yellow-300 mb-4">Input Donasi Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="group" className="block text-sm font-medium text-yellow-200 mb-2">
                Pilih Kelompok
              </label>
              <select
                id="group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                required
                className="w-full input-inset px-3 py-2"
              >
                <option value="">-- Pilih Kelompok --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-yellow-200 mb-2">
                Jumlah Donasi (Rp)
              </label>
              <input
                type="text"
                id="amount"
                value={displayAmount}
                onChange={handleAmountChange}
                required
                className="w-full input-inset px-3 py-2"
                placeholder="Masukkan jumlah donasi (contoh: 100.000)"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-yellow-200 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full input-inset px-3 py-2 resize-none"
                placeholder="Tambahkan catatan jika diperlukan"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-skeuo bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 disabled:opacity-50 shadow-lg transition-colors"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              {isLoading ? 'Memproses...' : 'Tambah Donasi'}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </div>
        </div>
      </div>
    </div>
  );
}