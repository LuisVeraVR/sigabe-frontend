'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  
  const isProtectedRoute = 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/books') || 
    pathname?.startsWith('/users') || 
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/loans') ||
    pathname?.startsWith('/fines');
  
  if (!isProtectedRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-16'}`}>
        <Navbar />
        <main className="flex-grow pt-5 px-4 sm:px-6 lg:px-8 pb-16">
          {children}
        </main>
        <Footer className="mt-auto w-full" />
      </div>
    </div>
  );
}