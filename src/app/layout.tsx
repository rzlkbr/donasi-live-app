// File: app/layout.tsx

import type { Metadata } from "next";
// Impor font dari next/font
import { Amiri, Poppins } from "next/font/google";
import "./globals.css";

// Konfigurasi font
const amiri = Amiri({
  subsets: ["latin"],
  weight: ["700"], // Sesuai PRD: 700 weight
  variable: "--font-amiri", // Nama variabel CSS
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Sesuai PRD
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Aplikasi Donasi Live",
  description: "Menampilkan progres donasi secara real-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Gabungkan variabel font ke dalam className */}
      <body className={`${amiri.variable} ${poppins.variable} ${poppins.className}`}>
        {children}
      </body>
    </html>
  );
}