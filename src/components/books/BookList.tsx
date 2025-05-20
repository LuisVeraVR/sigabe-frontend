'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookItem from './BookItem';
import { 
  BookOpen, 
  PlusCircle, 
  Search, 
  Filter, 
  X, 
  RefreshCw, 
  BookMarked,
  AlertTriangle,
  Tag,
  Check,
  Ban
} from 'lucide-react';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (books) {
      let results = [...books];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          book => 
            book.title.toLowerCase().includes(term) || 
            book.author.toLowerCase().includes(term) ||
            book.publisher.toLowerCase().includes(term)
        );
      }
      
      if (filterType) {
        results = results.filter(book => book.type === filterType);
      }
      
      if (filterAvailable !== null) {
        results = results.filter(book => book.avaliable === filterAvailable);
      }
      
      setFilteredBooks(results);
    }
  }, [books, searchTerm, filterType, filterAvailable]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Book[]>('/books/getBooks');
      setBooks(data);
      setFilteredBooks(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error al cargar los libros. Intente de nuevo más tarde.');
      toast.error('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este libro?')) {
      return;
    }

    try {
      await api.delete(`/books/deleteBook/${id}`);
      toast.success('Libro eliminado con éxito');
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error al eliminar el libro');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterAvailable(null);
  };

  const getBookTypes = () => {
    const types = [...new Set(books.map(book => book.type))];
    return types;
  };

  const getAvailableBooksCount = () => {
    return books.filter(book => book.avaliable).length;
  };

  const getUnavailableBooksCount = () => {
    return books.filter(book => !book.avaliable).length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 relative mb-4">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-r-4 border-l-4 border-transparent animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Cargando libros</h2>
          <p className="text-gray-600 text-center mb-2">Obteniendo la biblioteca de libros...</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">No se pudieron cargar los libros</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={fetchBooks}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">No hay libros registrados</h2>
          <p className="text-gray-600 text-center mb-4">Añade tu primer libro para comenzar a gestionar tu biblioteca.</p>
          <Link 
            href="/books/create"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir nuevo libro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header y barra de acciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <BookMarked className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Biblioteca</h1>
              <div className="ml-3 flex space-x-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {books.length} libros
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {getAvailableBooksCount()} disponibles
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="flex items-center">
                  <div className="relative flex-1 min-w-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar libro..."
                      className="block w-full pl-10 pr-3 py-2 border text-black border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <button
                    className={`ml-2 p-2 rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <Link 
                href="/books/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm flex items-center transition-colors"
              >
                <PlusCircle className="h-4 w-4 mr-1.5" />
                <span>Añadir libro</span>
              </Link>
            </div>
          </div>
          
          {/* Filtros */}
          {showFilters && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                      filterType === '' 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterType('')}
                  >
                    Todos
                  </button>
                  {getBookTypes().map((type) => (
                    <button 
                      key={type}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                        filterType === type 
                          ? 'bg-blue-100 border-blue-300 text-blue-800' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setFilterType(type)}
                    >
                      <Tag className="h-3.5 w-3.5 mr-1.5" />
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                      filterAvailable === null 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterAvailable(null)}
                  >
                    Todos
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      filterAvailable === true 
                        ? 'bg-green-100 border-green-300 text-green-800' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterAvailable(true)}
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Disponibles
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      filterAvailable === false 
                        ? 'bg-red-100 border-red-300 text-red-800' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterAvailable(false)}
                  >
                    <Ban className="h-3.5 w-3.5 mr-1.5" />
                    No disponibles
                  </button>
                </div>
              </div>
              
              {(searchTerm || filterType || filterAvailable !== null) && (
                <button 
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 self-end"
                  onClick={clearFilters}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Resultados de la búsqueda */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-gray-100 rounded-full mb-4">
              <Search className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">No hay libros que coincidan con los criterios de búsqueda.</p>
            <button 
              onClick={clearFilters}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookItem 
                key={book.id} 
                book={book} 
                onDelete={() => handleDelete(book.id)} 
                onEdit={() => router.push(`/books/edit/${book.id}`)}
                onView={() => router.push(`/books/${book.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}