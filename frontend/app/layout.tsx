import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { StudentProvider } from '../context/StudentContext';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'AI Competency Gap & Personalized Learning Engine',
  description:
    'Academic skill gap identification, diagnostic assessments, and ML-powered personalized learning paths.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <StudentProvider>
            <Navbar />
            <main className="pb-16">{children}</main>
          </StudentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
