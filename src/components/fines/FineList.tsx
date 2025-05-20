'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Fine, FineStatus } from '@/types/fine';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { 
  BookOpen, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  CreditCard,
  Filter,
  Search,
  RefreshCw,
  X,
  FileText,
  DollarSign
} from 'lucide-react';
import format from 'date-fns/format';
import {parseISO} from 'date-fns/parseISO';

export default function FineList() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [filteredFines, setFilteredFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchFines();
  }, []);

  useEffect(() => {
    if (fines) {
      let results = [...fines];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          fine => 
            fine.loan?.book?.title.toLowerCase().includes(term) || 
            fine.loan?.user?.firstName.toLowerCase().includes(term) ||
            fine.loan?.user?.lastName.toLowerCase().includes(term)
        );
      }
      
      if (filterStatus !== 'all') {
        results = results.filter(fine => fine.status === filterStatus);
      }
      
      setFilteredFines(results);
    }
  }, [fines, searchTerm, filterStatus]);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const { data } = await api.getFines();
      setFines(data);
      setFilteredFines(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching fines:', error);
      setError('Error al cargar las multas. Intente de nuevo más tarde.');
      toast.error('Error al cargar las multas');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  const handlePaymentSubmit = async () => {
    if (!selectedFine || !paymentMethod) return;
    
    try {
      await api.payFine(selectedFine.id, paymentMethod);
      toast.success('Pago registrado con éxito');
      
      // Actualizar el estado local después del pago exitoso
      setFines(prevFines => 
        prevFines.map(fine => 
          fine.id === selectedFine.id 
            ? { 
                ...fine, 
                status: FineStatus.PAID, 
                paidAt: new Date().toISOString(), 
                paymentMethod 
              } 
            : fine
        )
      );
      
      setShowPaymentModal(false);
      setSelectedFine(null);
      setPaymentMethod('');
    } catch (error) {
      console.error('Error registering payment:', error);
      toast.error('Error al registrar el pago');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'dd/MM/yyyy');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 relative mb-4">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-amber-600 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-r-4 border-l-4 border-transparent animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Cargando multas</h2>
          <p className="text-gray-600 text-center mb-2">Obteniendo información de multas...</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-amber-600 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">No se pudieron cargar las multas</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={fetchFines}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl text-black mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header y barra de acciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-amber-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Multas</h1>
              <div className="ml-3 flex space-x-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {fines.filter(fine => fine.status === FineStatus.PENDING).length} pendientes
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {fines.filter(fine => fine.status === FineStatus.PAID).length} pagadas
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
                      placeholder="Buscar multa..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-amber-500 focus:border-amber-500"
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
                    className={`ml-2 p-2 rounded-lg border ${showFilters ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros */}
          {showFilters && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                      filterStatus === 'all' 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterStatus('all')}
                  >
                    Todos
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      filterStatus === FineStatus.PENDING 
                        ? 'bg-amber-100 border-amber-300 text-amber-800' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterStatus(FineStatus.PENDING)}
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                    Pendientes
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      filterStatus === FineStatus.PAID 
                        ? 'bg-green-100 border-green-300 text-green-800' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setFilterStatus(FineStatus.PAID)}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Pagadas
                  </button>
                </div>
              </div>
              
              {(searchTerm || filterStatus !== 'all') && (
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
        
        {/* Lista de multas */}
        {filteredFines.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-gray-100 rounded-full mb-4">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No se encontraron multas</h3>
            <p className="text-gray-600 mb-4">No hay multas que coincidan con los criterios de búsqueda.</p>
            <button 
              onClick={clearFilters}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario / Libro
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Información
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFines.map((fine) => (
                    <tr key={fine.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {fine.loan?.user?.firstName} {fine.loan?.user?.lastName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                              {fine.loan?.book?.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <DollarSign className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                            <span className="text-gray-500">Monto de la multa: </span>
                            <span className="text-gray-900 ml-1">${fine.amount}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                            <span className="text-gray-500">Fecha de préstamo: </span>
                            <span className="text-gray-900 ml-1">{formatDate(fine.loan?.loanDate || null)}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                            <span className="text-gray-500">Fecha de vencimiento: </span>
                            <span className="text-gray-900 ml-1">{formatDate(fine.loan?.dueDate || null)}</span>
                          </div>
                          {fine.status === FineStatus.PAID && fine.paidAt && (
                            <div className="flex items-center mt-1">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                              <span className="text-gray-500">Fecha de pago: </span>
                              <span className="text-gray-900 ml-1">{formatDate(fine.paidAt)}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fine.status === FineStatus.PENDING 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {fine.status === FineStatus.PENDING 
                              ? <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              : <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            }
                            {fine.status === FineStatus.PENDING ? 'Pendiente' : 'Pagado'}
                          </span>
                          
                          {fine.status === FineStatus.PAID && fine.paymentMethod && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <CreditCard className="h-3.5 w-3.5 mr-1" />
                              {fine.paymentMethod}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        {fine.status === FineStatus.PENDING && (
                          <button 
                            onClick={() => {
                              setSelectedFine(fine);
                              setShowPaymentModal(true);
                            }}
                            className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                          >
                            Registrar pago
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de pago */}
      {showPaymentModal && selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                Registrar pago de multa
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-start">
                  <DollarSign className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Monto a pagar: ${selectedFine.amount}</p>
                    <p className="text-sm text-gray-600">Usuario: {selectedFine.loan?.user?.firstName} {selectedFine.loan?.user?.lastName}</p>
                    <p className="text-sm text-gray-600">Libro: {selectedFine.loan?.book?.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="paymentMethod">
                  Método de pago
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Seleccionar método de pago</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de débito">Tarjeta de débito</option>
                  <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedFine(null);
                    setPaymentMethod('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!paymentMethod}
                  className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:bg-green-300"
                  onClick={handlePaymentSubmit}
                >
                  Confirmar pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}