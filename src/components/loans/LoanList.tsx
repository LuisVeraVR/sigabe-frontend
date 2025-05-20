"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loan, LoanStatus } from "@/types/loan";
import api from "@/lib/api";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  Clock,
  Calendar,
  User as UserIcon,
  CheckCircle,
  AlertTriangle,
  Filter,
  BookOpen,
  Search,
  Plus,
  RefreshCw,
  ArrowUpDown,
  X,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import format from "date-fns/format";
import { parseISO } from "date-fns/parseISO";
import { isAfter } from "date-fns/isAfter";
import { es } from "date-fns/locale";

export default function LoanList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (loans) {
      let results = [...loans];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (loan) =>
            loan.book?.title.toLowerCase().includes(term) ||
            loan.user?.firstName.toLowerCase().includes(term) ||
            loan.user?.lastName.toLowerCase().includes(term)
        );
      }

      if (filterStatus !== "all") {
        results = results.filter((loan) => loan.status === filterStatus);
      }

      results = sortLoans(results, sortField, sortDirection);

      setFilteredLoans(results);
    }
  }, [loans, searchTerm, filterStatus, sortField, sortDirection]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const { data } = await api.getLoans();

      const processedLoans = data.map((loan: any) => {
        if (
          loan.status === LoanStatus.ACTIVE &&
          isAfter(new Date(), parseISO(loan.dueDate))
        ) {
          return { ...loan, status: LoanStatus.OVERDUE };
        }
        return loan;
      });

      setLoans(processedLoans);
      setFilteredLoans(processedLoans);
      setError(null);
    } catch (error) {
      console.error("Error fetching loans:", error);
      setError("Error al cargar los préstamos. Intente de nuevo más tarde.");
      toast.error("Error al cargar los préstamos");
    } finally {
      setLoading(false);
    }
  };

  const sortLoans = (
    loansToSort: Loan[],
    field: string,
    direction: "asc" | "desc"
  ) => {
    return [...loansToSort].sort((a, b) => {
      let valueA, valueB;

      switch (field) {
        case "loanDate":
        case "dueDate":
        case "returnDate":
          valueA = a[field] ? new Date(a[field] as string).getTime() : 0;
          valueB = b[field] ? new Date(b[field] as string).getTime() : 0;
          break;
        case "bookTitle":
          valueA = a.book?.title.toLowerCase() || "";
          valueB = b.book?.title.toLowerCase() || "";
          break;
        case "userName":
          valueA =
            `${a.user?.firstName} ${a.user?.lastName}`.toLowerCase() || "";
          valueB =
            `${b.user?.firstName} ${b.user?.lastName}`.toLowerCase() || "";
          break;
        default:
          valueA = a[field as keyof Loan] || "";
          valueB = b[field as keyof Loan] || "";
      }

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return "bg-blue-100 text-blue-800";
      case LoanStatus.RETURNED:
        return "bg-green-100 text-green-800";
      case LoanStatus.OVERDUE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case LoanStatus.RETURNED:
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case LoanStatus.OVERDUE:
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return "Prestado";
      case LoanStatus.RETURNED:
        return "Devuelto";
      case LoanStatus.OVERDUE:
        return "Vencido";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(parseISO(dateString), "dd/MM/yyyy");
  };

  const getTimeRemaining = (dueDate: string, status: string) => {
    if (status === LoanStatus.RETURNED) return null;

    const due = parseISO(dueDate);
    const now = new Date();

    if (isAfter(now, due)) {
      return {
        isOverdue: true,
        text: `Vencido hace ${formatDistanceToNow(due, {
          addSuffix: false,
          locale: es,
        })}`,
      };
    }

    return {
      isOverdue: false,
      text: `Vence en ${formatDistanceToNow(due, {
        addSuffix: false,
        locale: es,
      })}`,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen text-blackbg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 relative mb-4">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-r-4 border-l-4 border-transparent animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Cargando préstamos
          </h2>
          <p className="text-gray-600 text-center mb-2">
            Obteniendo información de préstamos...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-blue-600 h-1.5 rounded-full animate-pulse"
              style={{ width: "70%" }}
            ></div>
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
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            No se pudieron cargar los préstamos
          </h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchLoans}
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
              <Clock className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Préstamos</h1>
              <div className="ml-3 flex space-x-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {
                    loans.filter((loan) => loan.status === LoanStatus.ACTIVE)
                      .length
                  }{" "}
                  activos
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {
                    loans.filter((loan) => loan.status === LoanStatus.OVERDUE)
                      .length
                  }{" "}
                  vencidos
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
                      placeholder="Buscar préstamo..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <button
                    className={`ml-2 p-2 rounded-lg border ${
                      showFilters
                        ? "bg-blue-50 border-blue-300 text-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <Link
                href="/loans/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm flex items-center transition-colors"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                <span>Nuevo préstamo</span>
              </Link>
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                      filterStatus === "all"
                        ? "bg-blue-100 border-blue-300 text-blue-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setFilterStatus("all")}
                  >
                    Todos
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      filterStatus === LoanStatus.ACTIVE
                        ? "bg-blue-100 border-blue-300 text-blue-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setFilterStatus(LoanStatus.ACTIVE)}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Activos
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      filterStatus === LoanStatus.RETURNED
                        ? "bg-green-100 border-green-300 text-green-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setFilterStatus(LoanStatus.RETURNED)}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Devueltos
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      filterStatus === LoanStatus.OVERDUE
                        ? "bg-red-100 border-red-300 text-red-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setFilterStatus(LoanStatus.OVERDUE)}
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                    Vencidos
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      sortField === "dueDate"
                        ? "bg-blue-100 border-blue-300 text-blue-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSort("dueDate")}
                  >
                    Fecha de vencimiento
                    {sortField === "dueDate" && (
                      <ArrowUpDown className="h-3.5 w-3.5 ml-1.5" />
                    )}
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center ${
                      sortField === "loanDate"
                        ? "bg-blue-100 border-blue-300 text-blue-800"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSort("loanDate")}
                  >
                    Fecha de préstamo
                    {sortField === "loanDate" && (
                      <ArrowUpDown className="h-3.5 w-3.5 ml-1.5" />
                    )}
                  </button>
                </div>
              </div>

              {(searchTerm || filterStatus !== "all") && (
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

        {/* Tabla de préstamos */}
        {filteredLoans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-gray-100 rounded-full mb-4">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No se encontraron préstamos
            </h3>
            <p className="text-gray-600 mb-4">
              No hay préstamos que coincidan con los criterios de búsqueda.
            </p>
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
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Libro / Usuario
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fechas
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLoans.map((loan) => {
                    const timeRemaining = getTimeRemaining(
                      loan.dueDate,
                      loan.status
                    );
                    return (
                      <tr
                        key={loan.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {loan.book?.title || "Libro desconocido"}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <UserIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                {loan.user?.firstName} {loan.user?.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="flex items-center mb-1">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                              <span className="text-gray-500">Prestado: </span>
                              <span className="text-gray-900 ml-1">
                                {formatDate(loan.loanDate)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar
                                className={`h-3.5 w-3.5 mr-1.5 ${
                                  timeRemaining?.isOverdue
                                    ? "text-red-500"
                                    : "text-amber-500"
                                }`}
                              />
                              <span className="text-gray-500">Vence: </span>
                              <span
                                className={`ml-1 ${
                                  timeRemaining?.isOverdue
                                    ? "text-red-600 font-medium"
                                    : "text-gray-900"
                                }`}
                              >
                                {formatDate(loan.dueDate)}
                              </span>
                            </div>
                            {loan.returnDate && (
                              <div className="flex items-center mt-1">
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                                <span className="text-gray-500">
                                  Devuelto:{" "}
                                </span>
                                <span className="text-gray-900 ml-1">
                                  {formatDate(loan.returnDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                loan.status
                              )}`}
                            >
                              {getStatusIcon(loan.status)}
                              {getStatusText(loan.status)}
                            </span>
                            {timeRemaining && (
                              <span
                                className={`text-xs ${
                                  timeRemaining.isOverdue
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {timeRemaining.text}
                              </span>
                            )}
                            {loan.fine && loan.fine.status === "pending" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Multa: ${loan.fine.amount}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/loans/${loan.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Ver detalles
                            </Link>
                            {loan.status === LoanStatus.ACTIVE && (
                              <Link
                                href={`/loans/return/${loan.id}`}
                                className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                              >
                                Devolver
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
