'use client';

import { Book } from '@/types/book';
import { 
  Edit, 
  Trash2, 
  CalendarIcon, 
  Building, 
  Tag, 
  Clock, 
  Eye, 
  Ban, 
  BookOpen,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';

interface BookItemProps {
  book: Book;
  onDelete: () => void;
  onEdit: () => void;
  onView?: () => void;
}
export default function BookItem({ book, onDelete, onEdit, onView }: BookItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  
  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'Novela':
        return 'bg-blue-100 text-blue-800';
      case 'Ensayo':
        return 'bg-purple-100 text-purple-800';
      case 'Técnico':
        return 'bg-green-100 text-green-800';
      case 'Educativo':
        return 'bg-amber-100 text-amber-800';
      case 'Biografía':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative">
      <div className="absolute top-3 left-3 z-10 flex space-x-2">
        <div className={`flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {book.available ? (
            <>
              <Clock className="h-3 w-3 mr-1" />
              Disponible
            </>
          ) : (
            <>
              <Ban className="h-3 w-3 mr-1" />
              No disponible
            </>
          )}
        </div>
      </div>
      
      {/* Menú de opciones */}
      <div className="absolute top-3 right-3 z-10">
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-10">
              {onView && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onView();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2 text-blue-500" />
                  Ver detalles
                </button>
              )}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2 text-amber-500" />
                Editar
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Portada del libro */}
      <div className="relative h-48 overflow-hidden flex items-center justify-center">
        {!isImageError && book.photo ? (
          <img
            src={book.photo}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setIsImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50">
            <BookOpen className="h-10 w-10 text-blue-300 mb-2" />
            <span className="text-sm text-gray-400">Sin imagen</span>
          </div>
        )}
        
        {/* Overlay al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity"></div>
        
        {/* Acciones rápidas que aparecen al hacer hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          {onView && (
            <button
              onClick={onView}
              className="flex-1 flex items-center justify-center bg-white bg-opacity-90 text-blue-600 hover:bg-opacity-100 rounded-lg py-1.5 text-sm font-medium transition-colors"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Ver
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center bg-white bg-opacity-90 text-amber-600 hover:bg-opacity-100 rounded-lg py-1.5 text-sm font-medium transition-colors"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Editar
          </button>
        </div>
      </div>
      
      {/* Información del libro */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-gray-700 font-medium mb-3 line-clamp-1">
          {book.author}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {book.year}
          </div>
          
          <div className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
            <Building className="h-3 w-3 mr-1" />
            {book.publisher}
          </div>
          
          <div className={`inline-flex items-center text-xs font-medium rounded-full px-2.5 py-1 ${getTypeStyles(book.type)}`}>
            <Tag className="h-3 w-3 mr-1" />
            {book.type}
          </div>
        </div>
        
        <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Editar
          </button>
          
          <button
            onClick={onDelete}
            className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}