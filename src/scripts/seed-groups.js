// Script untuk menambahkan data kelompok sample ke Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCSGlpXspN-gY_cVaITEpoW2qZ-xQITQoo",
  authDomain: "donasi-app-68d00.firebaseapp.com",
  projectId: "donasi-app-68d00",
  storageBucket: "donasi-app-68d00.firebasestorage.app",
  messagingSenderId: "175734002960",
  appId: "1:175734002960:web:9c6e5ec92023270bd30195"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data kelompok sample
const sampleGroups = [
  { name: 'Kelompok A - Masjid Al-Ikhlas' },
  { name: 'Kelompok B - Masjid An-Nur' },
  { name: 'Kelompok C - Masjid Al-Hidayah' },
  { name: 'Kelompok D - Masjid Ar-Rahman' },
  { name: 'Kelompok E - Masjid At-Taqwa' }
];

async function seedGroups() {
  try {
    console.log('Menambahkan data kelompok sample...');
    
    for (const group of sampleGroups) {
      const docRef = await addDoc(collection(db, 'groups'), group);
      console.log(`Kelompok "${group.name}" ditambahkan dengan ID: ${docRef.id}`);
    }
    
    console.log('\nSemua kelompok berhasil ditambahkan!');
    console.log('Sekarang Anda dapat menggunakan fitur input donasi.');
    
  } catch (error) {
    console.error('Error menambahkan kelompok:', error);
  }
}

// Jalankan script
seedGroups();