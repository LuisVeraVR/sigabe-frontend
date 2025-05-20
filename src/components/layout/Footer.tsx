'use client';

import { BookOpen } from 'lucide-react';

export default function Footer({ className = "" }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-white border-t border-gray-200 py-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SIGABE</h3>
              <p className="text-gray-500 text-sm">
                Sistema de Gestión de Biblioteca
              </p>
            </div>
          </div>
          
          <div className="text-gray-500 text-sm">
            &copy; {currentYear} Sistema de Gestión de Biblioteca. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}