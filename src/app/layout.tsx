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
  title: "Pelacak Donasi Real-time",
  description: "Pantau donasi secara real-time dan transparan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      {/* Gabungkan variabel font ke dalam className */}
      <body className={`${amiri.variable} ${poppins.variable} ${poppins.className}`}>
        {children}
      </body>
    </html>
  );
}