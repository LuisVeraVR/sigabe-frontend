'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Book } from '@/types/book';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Building, 
  BookMarked, 
  Image as ImageIcon, 
  Check, 
  X, 
  Save, 
  ArrowLeft,
  HelpCircle
} from 'lucide-react';

const bookSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  author: z.string().min(1, 'El autor es requerido'),
  year: z.coerce.number()
    .int('El año debe ser un número entero')
    .min(1000, 'El año debe ser válido')
    .max(new Date().getFullYear(), 'El año no puede ser futuro'),
  publisher: z.string().min(1, 'La editorial es requerida'),
  type: z.string().min(1, 'El tipo de libro es requerido'),
  photo: z.string().optional(),
  avaliable: z.boolean().default(true),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  book?: Book;
  isEditing?: boolean;
}

const bookTypes = [
  { value: 'Novela', label: 'Novela', color: 'blue' },
  { value: 'Ensayo', label: 'Ensayo', color: 'purple' },
  { value: 'Técnico', label: 'Técnico', color: 'green' },
  { value: 'Educativo', label: 'Educativo', color: 'amber' },
  { value: 'Biografía', label: 'Biografía', color: 'indigo' },
  { value: 'Otro', label: 'Otro', color: 'gray' }
];

export default function BookForm({ book, isEditing = false }: BookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(book?.type || '');
  const [previewUrl, setPreviewUrl] = useState<string>(book?.photo || '');
  const [isImageValid, setIsImageValid] = useState<boolean | null>(book?.photo ? true : null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: isEditing && book
      ? {
          title: book.title,
          author: book.author,
          year: book.year,
          publisher: book.publisher,
          type: book.type,
          photo: book.photo || '',
          avaliable: book.avaliable,
        }
      : {
          title: '',
          author: '',
          year: new Date().getFullYear(),
          publisher: '',
          type: '',
          photo: '',
          avaliable: true,
        },
  });

  const photoUrl = watch('photo');
  
  useEffect(() => {
    if (photoUrl) {
      setPreviewUrl(photoUrl);
      const img = new Image();
      img.onload = () => setIsImageValid(true);
      img.onerror = () => setIsImageValid(false);
      img.src = photoUrl;
    } else {
      setPreviewUrl('');
      setIsImageValid(null);
    }
  }, [photoUrl]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'type') {
        setSelectedType(value.type || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: BookFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && book) {
        await api.put(`/books/updateBook/${book.id}`, data);
        toast.success('Libro actualizado con éxito');
      } else {
        await api.post('/books/createBook', data);
        toast.success('Libro creado con éxito');
      }
      router.push('/books');
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al guardar el libro';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    setValue('type', type, { shouldValidate: true, shouldDirty: true });
    setSelectedType(type);
  };

  const clearPhotoInput = () => {
    setValue('photo', '', { shouldValidate: true, shouldDirty: true });
    setPreviewUrl('');
    setIsImageValid(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const getTypeColor = (type: string) => {
    const typeInfo = bookTypes.find(t => t.value === type);
    return typeInfo?.color || 'gray';
  };

  return (
    <div className="bg-white rounded-xl text-black shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
          {isEditing ? 'Editar Libro' : 'Crear Nuevo Libro'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Actualiza la información del libro' : 'Completa el formulario para añadir un nuevo libro'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
          {/* Columna izquierda - Datos principales */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Título
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookMarked className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                  id="title"
                  type="text"
                  placeholder="Título del libro"
                  {...register('title')}
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="author">
                Autor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.author ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                  id="author"
                  type="text"
                  placeholder="Autor del libro"
                  {...register('author')}
                />
              </div>
              {errors.author && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.author.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
                  Año
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.year ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                    id="year"
                    type="number"
                    placeholder="Año de publicación"
                    {...register('year')}
                  />
                </div>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.year.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="publisher">
                  Editorial
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.publisher ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                    id="publisher"
                    type="text"
                    placeholder="Editorial"
                    {...register('publisher')}
                  />
                </div>
                {errors.publisher && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.publisher.message}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="type">
                Tipo de libro
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bookTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedType === type.value 
                        ? `bg-${type.color}-100 border-${type.color}-300 text-${type.color}-800`
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    onClick={() => handleTypeSelect(type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('type')} value={selectedType} />
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.type.message}
                </p>
              )}
            </div>
            
            <div className="flex items-center mt-2">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="avaliable" 
                  className="sr-only peer"
                  {...register('avaliable')}
                />
                <div className="h-6 w-11 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </div>
              <label htmlFor="avaliable" className="font-medium text-gray-700 cursor-pointer">
                Disponible para préstamo
              </label>
            </div>
          </div>
          
          {/* Columna derecha - Imagen y previsualización */}
          <div className="md:col-span-3">
            <div className="rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-700 flex items-center mb-1">
                  <ImageIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                  Portada del libro
                </h3>
                <p className="text-xs text-gray-500">
                  Agrega una URL de imagen para la portada del libro (opcional)
                </p>
              </div>
              
              <div className="flex-1 flex flex-col p-4">
                <div className="relative mb-4">
                  <div className="flex">
                    <input
                      className={`flex-1 pl-3 pr-10 py-2.5 border ${
                        isImageValid === false ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                      id="photo"
                      type="text"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...register('photo')}
                    />
                    {photoUrl && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={clearPhotoInput}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  {isImageValid === false && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <X className="h-4 w-4 mr-1" />
                      URL de imagen no válida
                    </p>
                  )}
                </div>
                
                <div className="flex-1 relative flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  {previewUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={previewUrl}
                        alt="Previsualización"
                        className="object-contain w-full h-full max-h-48"
                        onError={() => setIsImageValid(false)}
                        onLoad={() => setIsImageValid(true)}
                      />
                      {isImageValid === false && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-90">
                          <X className="h-10 w-10 text-red-500 mb-2" />
                          <p className="text-sm text-gray-600 text-center">
                            No se pudo cargar la imagen
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No hay imagen
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-200">
          <button
            className="flex items-center text-gray-700 hover:text-gray-900 font-medium py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            type="button"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Cancelar
          </button>
          
          <button
            className={`flex items-center font-medium py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
              isSubmitting || !isDirty
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5'
            }`}
            type="submit"
            disabled={isSubmitting || !isDirty}
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isSubmitting 
              ? 'Guardando...' 
              : isEditing 
                ? 'Actualizar libro' 
                : 'Crear libro'
            }
          </button>
        </div>
        
        {!isDirty && (
          <p className="mt-2 text-sm text-gray-500 text-center flex items-center justify-center">
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            Realiza cambios para habilitar el botón de guardado
          </p>
        )}
      </form>
    </div>
  );
}
