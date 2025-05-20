'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && isClient) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, isClient]);
  
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="h-16 w-16 relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin absolute"></div>
          <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-transparent animate-pulse absolute"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}