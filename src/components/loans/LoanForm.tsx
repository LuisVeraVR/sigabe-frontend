'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api, { CreateLoanData } from '@/lib/api';
import { Book } from '@/types/book';
import { User } from '@/types/user';
import { toast } from 'react-toastify';
import { 
  BookOpen, 
  User as UserIcon, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Save, 
  Search, 
  X
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const loanSchema = z.object({
  bookId: z.number({
    required_error: 'Selecciona un libro',
    invalid_type_error: 'Selecciona un libro válido',
  }),
  userId: z.number({
    required_error: 'Selecciona un usuario',
    invalid_type_error: 'Selecciona un usuario válido',
  }),
  borrowDate: z.string().min(1, 'La fecha de préstamo es requerida'),
  dueDate: z.string().min(1, 'La fecha de devolución es requerida'),
  notes: z.string().optional(),
});

type LoanFormValues = z.infer<typeof loanSchema>;

export default function LoanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showBookResults, setShowBookResults] = useState(false);
  const [showUserResults, setShowUserResults] = useState(false);

  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const defaultDueDate = format(addDays(new Date(), 14), 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      borrowDate: today,
      dueDate: defaultDueDate,
      notes: '',
    }
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('books/getBooks');
        const allBooks = response.data;
        setBooks(allBooks);
        const available = allBooks.filter((book: Book) => book.avaliable);
        setAvailableBooks(available);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Error al cargar los libros');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get('auth/getUsers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error al cargar los usuarios');
      }
    };

    fetchBooks();
    fetchUsers();
  }, []);

  const handleBookSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookSearchTerm(event.target.value);
    setShowBookResults(true);
  };

  const handleUserSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchTerm(event.target.value);
    setShowUserResults(true);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setValue('bookId', book.id, { shouldValidate: true });
    setBookSearchTerm(book.title);
    setShowBookResults(false);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setValue('userId', user.id, { shouldValidate: true });
    setUserSearchTerm(`${user.firstName} ${user.lastName}`);
    setShowUserResults(false);
  };

  const onSubmit = async (data: LoanFormValues) => {
    setIsSubmitting(true);
    
    try {
      const loanData: CreateLoanData = {
        userId: data.userId,
        bookId: data.bookId,
        borrowDate: data.borrowDate,
        dueDate: data.dueDate,
        notes: data.notes
      };
        
      await api.createLoan(loanData);
      toast.success('Préstamo registrado con éxito');
      router.push('/loans');
    } catch (error: any) {
      console.error('Error creating loan:', error);
      const message = error.response?.data?.message || 'Error al registrar el préstamo';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBooks = bookSearchTerm
    ? availableBooks.filter(book => 
        book.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearchTerm.toLowerCase())
      )
    : availableBooks;

  const filteredUsers = userSearchTerm
    ? users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="bg-white  text-black rounded-xl text-black shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Clock className="mr-2 h-6 w-6 text-blue-600" />
          Registrar nuevo préstamo
        </h2>
        <p className="text-gray-600 mt-1">
          Completa el formulario para registrar un nuevo préstamo
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Selección de libro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bookSearch">
              Libro
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="bookSearch"
                type="text"
                value={bookSearchTerm}
                onChange={handleBookSearch}
                onFocus={() => setShowBookResults(true)}
                placeholder="Buscar libro..."
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.bookId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {bookSearchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setBookSearchTerm('');
                    setSelectedBook(null);
                    setValue('bookId', undefined as any);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {/* Resultados de búsqueda */}
              {showBookResults && filteredBooks.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <ul className="divide-y divide-gray-100">
                    {filteredBooks.map(book => (
                      <li
                        key={book.id}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => handleBookSelect(book)}
                      >
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">{book.author}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {showBookResults && filteredBooks.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 p-4 text-center">
                  <p className="text-gray-500">No se encontraron libros disponibles</p>
                </div>
              )}
            </div>
            <input type="hidden" {...register('bookId')} />
            {errors.bookId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-1" />
                {errors.bookId.message}
              </p>
            )}
            {selectedBook && (
              <div className="mt-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedBook.title}</p>
                    <p className="text-sm text-gray-600">{selectedBook.author}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Selección de usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="userSearch">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="userSearch"
                type="text"
                value={userSearchTerm}
                onChange={handleUserSearch}
                onFocus={() => setShowUserResults(true)}
                placeholder="Buscar usuario..."
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.userId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {userSearchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setUserSearchTerm('');
                    setSelectedUser(null);
                    setValue('userId', undefined as any);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {/* Resultados de búsqueda */}
              {showUserResults && filteredUsers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <ul className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <li
                        key={user.id}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            <UserIcon className="h-4 w-4 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {showUserResults && filteredUsers.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 p-4 text-center">
                  <p className="text-gray-500">No se encontraron usuarios</p>
                </div>
              )}
            </div>
            <input type="hidden" {...register('userId')} />
            {errors.userId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-1" />
                {errors.userId.message}
              </p>
            )}
            {selectedUser && (
              <div className="mt-2 bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Fechas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="borrowDate">
              Fecha de préstamo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="borrowDate"
                type="date"
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.borrowDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                {...register('borrowDate')}
              />
            </div>
            {errors.borrowDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-1" />
                {errors.borrowDate.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dueDate">
              Fecha de devolución
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="dueDate"
                type="date"
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.dueDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                {...register('dueDate')}
              />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-1" />
                {errors.dueDate.message}
              </p>
            )}
          </div>
          
          {/* Notas */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
              Notas adicionales
            </label>
            <textarea
              id="notes"
              rows={3}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Notas u observaciones sobre el préstamo (opcional)"
              {...register('notes')}
            ></textarea>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-200">
          <button
            type="button"
            className="flex items-center text-gray-700 hover:text-gray-900 font-medium py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center font-medium py-2.5 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isSubmitting ? 'Registrando...' : 'Registrar préstamo'}
          </button>
        </div>
      </form>
    </div>
  );
}