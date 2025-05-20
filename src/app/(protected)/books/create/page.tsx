import BookForm from '@/components/books/BookForm';

export default function CreateBookPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Libro</h1>
      <BookForm />
    </div>
  );
}