// app/layout.tsx

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import ClientRootLayout from './ClientRootLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SIGABE - Sistema de Gestión de Biblioteca',
  description: 'Plataforma para la gestión de bibliotecas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <SidebarProvider>
            <ClientRootLayout>
              {children}
            </ClientRootLayout>
          </SidebarProvider>
          <ToastContainer position="top-right" autoClose={5000} />
        </AuthProvider>
      </body>
    </html>
  );
}
