"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  User,
  Bell,
  Search,
  Clock,
  Calendar,
  Users,
  BarChart2,
  PlusCircle,
  ChevronRight,
  ArrowRight,
  Activity,
  TrendingUp,
  BookMarked,
  FileText,
  X,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".search-container") &&
        !target.closest(".notification-container")
      ) {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="h-16 w-16 relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin absolute"></div>
          <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-transparent animate-pulse absolute"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Cargando dashboard...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
        <div className="h-16 w-16 relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin absolute"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          No autenticado. Redirigiendo...
        </p>
        <Link
          href="/login"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Header */}
      <header className="bg-white py-3 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 sticky top-0 z-10 h-16">
        {/* Título de la página para móvil */}
        <div className="md:hidden">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          {/* Búsqueda */}
          <div className="relative search-container">
            <div
              className={`flex items-center ${
                isSearchFocused || searchOpen ? "bg-gray-100" : "bg-gray-50"
              } border ${
                isSearchFocused
                  ? "border-blue-400 ring-2 ring-blue-100"
                  : "border-gray-200"
              } rounded-full transition-all duration-200 overflow-hidden pl-3 pr-1.5 py-1.5`}
            >
              <Search
                className={`h-4 w-4 ${
                  isSearchFocused || searchText
                    ? "text-blue-500"
                    : "text-gray-400"
                } transition-colors`}
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onClick={() => setSearchOpen(true)}
                className="outline-none bg-transparent ml-2 w-32 sm:w-48 text-sm placeholder:text-gray-400 text-gray-700"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-gray-500" />
                </button>
              )}
            </div>

            {searchOpen && searchText && (
              <div className="absolute right-0 left-0 mt-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-30">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Resultados de búsqueda
                </div>
                <div className="space-y-1">
                  <div className="p-2 hover:bg-gray-50 rounded transition-colors flex cursor-pointer">
                    <BookMarked className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800">
                        Cien años de soledad
                      </p>
                      <p className="text-xs text-gray-500">
                        Gabriel García Márquez
                      </p>
                    </div>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded transition-colors flex cursor-pointer">
                    <User className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800">Ana María Solano</p>
                      <p className="text-xs text-gray-500">Usuario</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Ver todos los resultados
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido del dashboard */}
      <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Encabezado con saludo y fecha */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              ¡Bienvenido, {user?.firstName || "Usuario"}!
              <span className="inline-block ml-3 h-2 w-2 bg-green-500 rounded-full relative">
                <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
              </span>
            </h1>
            <p className="text-gray-600 mt-1">
              Aquí puedes gestionar tu sistema de biblioteca
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            <span>
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Panel de resumen */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-500" />
                Resumen del sistema
              </h2>
              <div className="flex space-x-2">
                <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors">
                  Esta semana
                </button>
                <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                  Este mes
                </button>
                <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors">
                  Este año
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 border border-blue-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-blue-800 text-sm font-medium">
                      Total de Libros
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">
                        1,248
                      </div>
                      <div className="ml-2 text-xs font-medium text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        +8.2%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-5 border border-green-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-green-800 text-sm font-medium">
                      Préstamos Activos
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">83</div>
                      <div className="ml-2 text-xs font-medium text-red-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5 transform rotate-180" />
                        -2.5%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-green-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-5 border border-purple-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-purple-800 text-sm font-medium">
                      Usuarios Activos
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">
                        254
                      </div>
                      <div className="ml-2 text-xs font-medium text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        +12.4%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 sm:p-5 border border-amber-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-amber-800 text-sm font-medium">
                      Eventos del Mes
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-bold text-gray-900">8</div>
                      <div className="ml-2 text-xs font-medium text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        +2
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                    style={{ width: "32%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico simple */}
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 text-gray-500 mr-1.5" />
                <span className="text-sm font-medium text-gray-600">
                  Actividad mensual
                </span>
              </div>
              <Link
                href="/statistics"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Ver estadísticas completas
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="mt-3 h-16 flex items-end space-x-1">
              {[25, 38, 28, 45, 35, 55, 60, 50, 65, 75, 60, 40].map(
                (height, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div
                      className="w-full bg-blue-500 bg-opacity-70 hover:bg-opacity-100 rounded-t transition-all"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {height} libros
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>Ene</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Ago</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dic</span>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BookMarked className="mr-2 h-5 w-5 text-blue-500" />
              Accesos Rápidos
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Personalizar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Link href="/books">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer group">
                <div className="flex p-5 sm:p-6">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Gestión de Libros
                    </h3>
                    <p className="text-gray-600">
                      Administra tu catálogo, añade nuevos títulos, actualiza
                      existencias
                    </p>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {1248} libros
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {83} prestados
                    </span>
                  </div>
                  <div className="text-blue-500 group-hover:translate-x-1 transform transition-transform">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>

            {user?.isAdmin ? (
              <Link href="/profile">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer group">
                  <div className="flex p-5 sm:p-6">
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                        <User className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        Mi Perfil
                      </h3>
                      <p className="text-gray-600">
                        Administra tu información personal y preferencias del
                        sistema
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Administrador
                      </span>
                    </div>
                    <div className="text-purple-500 group-hover:translate-x-1 transform transition-transform">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/loans">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer group">
                  <div className="flex p-5 sm:p-6">
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                        <Clock className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        Mis Préstamos
                      </h3>
                      <p className="text-gray-600">
                        Consulta tus préstamos activos y el historial de
                        préstamos
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        3 activos
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        12 históricos
                      </span>
                    </div>
                    <div className="text-green-500 group-hover:translate-x-1 transform transition-transform">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Actividad reciente e Información del sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividad reciente */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                Actividad reciente
              </h3>
              <Link
                href="/activity"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todo
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        García Márquez, Gabriel
                      </span>{" "}
                      - Nuevo libro añadido a la colección
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        Hace 20 minutos
                      </span>
                      <span className="mx-1.5 h-0.5 w-0.5 bg-gray-400 rounded-full"></span>
                      <span className="text-xs font-medium text-blue-600">
                        Cien años de soledad
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex">
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Ana Martínez</span> - Nuevo
                      usuario registrado en el sistema
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">Ayer, 15:30</span>
                      <span className="mx-1.5 h-0.5 w-0.5 bg-gray-400 rounded-full"></span>
                      <span className="text-xs font-medium text-purple-600">
                        Usuario
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex">
                  <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Carlos Mendoza</span> - Ha
                      devuelto un libro prestado
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        20/05/2025, 09:15
                      </span>
                      <span className="mx-1.5 h-0.5 w-0.5 bg-gray-400 rounded-full"></span>
                      <span className="text-xs font-medium text-green-600">
                        El Principito
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto">
                Cargar más actividades
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Información del sistema */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center">
                Información del Sistema
              </h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Sistema
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-base text-gray-900 font-medium">
                      SIGABE
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      v1.2.0
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Usuario
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium uppercase mr-2">
                      {user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="text-base text-gray-900 font-medium">
                      {user?.firstName || "Nombre"}{" "}
                      {user?.lastName || "Apellido"}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Rol
                  </div>
                  <div className="text-base text-gray-900">
                    {user?.isAdmin ? (
                      <span className="inline-flex items-center">
                        <span className="h-2.5 w-2.5 bg-purple-500 rounded-full mr-2 relative">
                          <span className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-75"></span>
                        </span>
                        Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <span className="h-2.5 w-2.5 bg-blue-500 rounded-full mr-2 relative">
                          <span className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></span>
                        </span>
                        Usuario
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Estado del servidor
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-base text-gray-900 font-medium">
                      Activo
                    </div>
                    <div className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 relative">
                        <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
                      </span>
                      <span className="text-xs text-green-700">
                        100% operativo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                href="/settings"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
              >
                Configuración del sistema
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
