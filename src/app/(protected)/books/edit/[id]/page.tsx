'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BookForm from '@/components/books/BookForm';
import api from '@/lib/api';
import { Book } from '@/types/book';
import { toast } from 'react-toastify';

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const id = params.id;
        const { data } = await api.get<Book>(`/books/getBooks/${id}`);
        setBook(data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching book:', error);
        const message = error.response?.data?.message || 'No se pudo cargar la información del libro';
        setError(message);
        toast.error('Error al cargar el libro');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-10">Cargando información del libro...</div>;
  }

  if (error || !book) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || 'No se encontró el libro'}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Libro</h1>
      <BookForm book={book} isEditing={true} />
    </div>
  );
}