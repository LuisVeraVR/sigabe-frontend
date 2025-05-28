'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Loan, LoanStatus } from '@/types/loan';
import { toast } from 'react-toastify';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Save, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import format from 'date-fns/format';
import {parseISO} from 'date-fns/parseISO';
import {isAfter} from 'date-fns/isAfter';
import { differenceInDays } from 'date-fns/differenceInDays';
const returnSchema = z.object({
  returnDate: z.string().min(1, 'La fecha de devolución es requerida'),
  fineAmount: z.number().optional(),
  notes: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface ReturnFormProps {
  loanId: string;
}

export default function ReturnForm({ loanId }: ReturnFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOverdue, setIsOverdue] = useState(false);
  const [fineRequired, setFineRequired] = useState(false);
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [calculatedFine, setCalculatedFine] = useState(0);
  
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      returnDate: today,
      fineAmount: 0,
      notes: '',
    }
  });

  const watchReturnDate = watch('returnDate');

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/loans/${loanId}`);
        const loanData = response.data;
        setLoan(loanData);
        
        // Verificar si está vencido
        const now = new Date();
        const dueDate = parseISO(loanData.dueDate);
        const overdue = isAfter(now, dueDate);
        setIsOverdue(overdue);
        
        if (overdue) {
          const daysDiff = differenceInDays(now, dueDate);
          setDaysOverdue(daysDiff);
          
          const fineAmount = daysDiff * 5; 
          setCalculatedFine(fineAmount);
          setValue('fineAmount', fineAmount);
        }
      } catch (error) {
        console.error('Error fetching loan:', error);
        toast.error('Error al cargar los datos del préstamo');
        router.push('/loans');
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [loanId, router, setValue]);

  useEffect(() => {
    if (loan && watchReturnDate) {
      const returnDate = parseISO(watchReturnDate);
      const dueDate = parseISO(loan.dueDate);
      
      if (isAfter(returnDate, dueDate)) {
        const daysDiff = differenceInDays(returnDate, dueDate);
        setDaysOverdue(daysDiff);
        setIsOverdue(true);
        
        const fineAmount = daysDiff * 5;
        setCalculatedFine(fineAmount);
        setValue('fineAmount', fineAmount);
      } else {
        setIsOverdue(false);
        setDaysOverdue(0);
        setCalculatedFine(0);
        setValue('fineAmount', 0);
      }
    }
  }, [watchReturnDate, loan, setValue]);

  const onSubmit = async (data: ReturnFormValues) => {
    setIsSubmitting(true);
    
    try {
      await api.returnBook(loanId, data.returnDate);
      
      toast.success('Devolución registrada con éxito');
      router.push('/loans');
    } catch (error: any) {
      console.error('Error registering return:', error);
      const message = error.response?.data?.message || 'Error al registrar la devolución';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center">
        <div className="w-16 h-16 relative mb-4">
          <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Cargando datos del préstamo</h2>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Préstamo no encontrado</h2>
        <button 
          onClick={() => router.push('/loans')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Volver a préstamos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <CheckCircle className="mr-2 h-6 w-6 text-green-600" />
          Registrar devolución
        </h2>
        <p className="text-gray-600 mt-1">
          Completa el formulario para registrar la devolución del libro
        </p>
      </div>
      
      {/* Información del préstamo */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {loan.book?.title || 'Libro desconocido'}
                </div>
                <div className="text-sm text-gray-500">
                  {loan.book?.author || 'Autor desconocido'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {loan.user?.firstName} {loan.user?.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {loan.user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500 block">Fecha de préstamo:</span>
            <span className="text-gray-900">{format(parseISO(loan.loanDate), 'dd/MM/yyyy')}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 block">Fecha de vencimiento:</span>
            <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>{format(parseISO(loan.dueDate), 'dd/MM/yyyy')}</span>
          </div>
        </div>
        
        {isOverdue && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
              <div>
                <p className="font-medium">Préstamo vencido</p>
                <p className="text-sm">El libro debió ser devuelto hace {daysOverdue} días. Se aplicará una multa de ${calculatedFine}.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="returnDate">
              Fecha de devolución
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="returnDate"
                type="date"
                className={`block w-full pl-10 pr-3 py-2.5 border ${
                  errors.returnDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                {...register('returnDate')}
              />
            </div>
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors.returnDate.message}
              </p>
            )}
          </div>
          
          {isOverdue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fineAmount">
                Monto de la multa (estimado)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="fineAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled
                  className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                  {...register('fineAmount', { valueAsNumber: true })}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Monto calculado automáticamente: ${calculatedFine} (${5} por día de retraso)
              </p>
            </div>
          )}
          
          {/* Notas */}
          <div className={isOverdue ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
              Notas adicionales
            </label>
            <textarea
              id="notes"
              rows={3}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Observaciones sobre el estado del libro u otras notas (opcional)"
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
            className="flex items-center font-medium py-2.5 px-5 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            <CheckCircle className="mr-1.5 h-4 w-4" />
            {isSubmitting ? 'Registrando...' : 'Confirmar devolución'}
          </button>
        </div>
      </form>
    </div>
  );
}