'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { 
  BookOpen, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  BookMarked,
  ChevronDown,
  Settings,
  Bell,
  Search,
  HelpCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isOpen, toggle } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  
  // Determinamos si estamos en la página de inicio o en una ruta protegida
  const isHome = pathname === '/';
  const isProtectedRoute = 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/books') || 
    pathname?.startsWith('/users') || 
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/loans') ||
    pathname?.startsWith('/fines');
  
  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setUserMenuOpen(false);
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Determinamos la clase base del navbar según el contexto
  const getNavbarClass = () => {
    if (isProtectedRoute) {
      return "bg-white shadow-sm border-b border-gray-200";
    }
    
    return isHome && scrollY < 10 && !isMenuOpen
      ? 'bg-transparent text-white' 
      : 'bg-white text-gray-800 shadow-sm';
  };

  if (isProtectedRoute) {
    return (
    <header className="bg-white h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 sticky top-0 z-30 transition-all duration-300 w-full">
        <div className="flex items-center">
          {/* Botón para controlar el sidebar */}
          <button 
            onClick={toggle}
            className="h-10 w-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 md:mr-4 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Título de la sección */}
          <h1 className="hidden md:block text-xl font-bold text-gray-800">
            {pathname?.includes('/dashboard') && 'Dashboard'}
            {pathname?.includes('/books') && 'Gestión de Libros'}
            {pathname?.includes('/users') && 'Gestión de Usuarios'}
            {pathname?.includes('/settings') && 'Configuración'}
            {pathname?.includes('/loans') && 'Gestión de Préstamos'}
            {pathname?.includes('/fines') && 'Gestión de Multas'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {/* Búsqueda */}
          <div className="relative dropdown-container">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen(!searchOpen);
                setNotificationsOpen(false);
                setUserMenuOpen(false);
              }}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </button>
            
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-30">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Buscar..."
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Presiona Enter para buscar
                </div>
              </div>
            )}
          </div>

          {/* Notificaciones */}
          <div className="relative dropdown-container">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setNotificationsOpen(!notificationsOpen);
                setSearchOpen(false);
                setUserMenuOpen(false);
              }}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </div>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-30">
                <div className="px-4 py-3 border-b border-gray-200 font-medium flex items-center justify-between">
                  <span>Notificaciones</span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">Marcar todo como leído</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                    <div className="flex items-start">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Nuevo libro registrado</p>
                        <p className="text-xs text-gray-500">Se ha añadido "Cien años de soledad" a la colección</p>
                        <p className="text-xs text-gray-400 mt-1">Hace 20 minutos</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
                        <p className="text-xs text-gray-500">Ana Martínez se ha unido al sistema</p>
                        <p className="text-xs text-gray-400 mt-1">Ayer, 15:30</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800">Ver todas</button>
                </div>
              </div>
            )}
          </div>

          {/* Ayuda - Solo visible en escritorio */}
          <div className="hidden md:block relative">
            <button 
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Menú de usuario */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(!userMenuOpen);
                setSearchOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium uppercase">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName || 'Usuario'}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform text-gray-500 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {userMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Conectado como</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Para el resto de rutas (versión original pero mejorada)
  return (
  <nav className={`${getNavbarClass()} fixed top-0 left-0 right-0 z-30 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className={`h-7 w-7 ${isHome && scrollY < 10 && !isMenuOpen ? 'text-blue-100' : 'text-blue-600'}`} />
              <span className={`text-xl font-bold ${isHome && scrollY < 10 && !isMenuOpen ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>
                SIGABE
              </span>
            </Link>
            
            {/* Enlaces de navegación - Desktop */}
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-6">
                <Link 
                  href="/dashboard" 
                  className={`
                    flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors
                    ${isHome && scrollY < 10 ? 'text-white hover:bg-white hover:bg-opacity-10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                  `}
                >
                  <Home className="h-4 w-4 mr-1.5" />
                  Dashboard
                </Link>
                <Link 
                  href="/books" 
                  className={`
                    flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors
                    ${isHome && scrollY < 10 ? 'text-white hover:bg-white hover:bg-opacity-10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                  `}
                >
                  <BookMarked className="h-4 w-4 mr-1.5" />
                  Libros
                </Link>
                <Link 
                  href="/loans" 
                  className={`
                    flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors
                    ${isHome && scrollY < 10 ? 'text-white hover:bg-white hover:bg-opacity-10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                  `}
                >
                  <Clock className="h-4 w-4 mr-1.5" />
                  Préstamos
                </Link>
                <Link 
                  href="/fines" 
                  className={`
                    flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors
                    ${isHome && scrollY < 10 ? 'text-white hover:bg-white hover:bg-opacity-10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                  `}
                >
                  <DollarSign className="h-4 w-4 mr-1.5" />
                  Multas
                </Link>
              </div>
            )}
          </div>
          
          {/* Navegación desktop */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center dropdown-container">
                <Link 
                  href="/dashboard"
                  className={`
                    mr-4 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center
                    ${isHome && scrollY < 10 
                      ? 'text-white bg-white bg-opacity-10 hover:bg-opacity-20' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                
                {/* Menú de usuario */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className={`
                    flex items-center space-x-2 p-2 rounded-lg transition-colors
                    ${isHome && scrollY < 10 
                      ? 'hover:bg-white hover:bg-opacity-10' 
                      : 'hover:bg-blue-50'
                    }
                  `}
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium uppercase">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div className={isHome && scrollY < 10 ? 'text-white' : 'text-gray-700'}>
                    <span className="text-sm font-medium">
                      {user?.firstName || 'Usuario'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${isHome && scrollY < 10 ? 'text-white' : 'text-gray-500'}`} />
                </button>
                
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 top-16 md:top-20 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Conectado como</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mi Perfil
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isHome && scrollY < 10 
                      ? 'text-white hover:bg-white hover:bg-opacity-10' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isHome && scrollY < 10 
                      ? 'bg-white text-blue-600 hover:bg-opacity-90' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
          
          {/* Botón de menú móvil */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`
                p-2 rounded-md transition-colors 
                ${isHome && scrollY < 10 && !isMenuOpen
                  ? 'text-white hover:bg-white hover:bg-opacity-10' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }
              `}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      <div 
        className={`
          sm:hidden fixed inset-0 z-40 bg-white pt-16 transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="h-full overflow-y-auto">
          {isAuthenticated ? (
            <div className="px-3 py-3">
              <div className="flex items-center px-3 py-3 mb-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold uppercase mr-3">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-gray-900 font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-gray-500 text-sm truncate max-w-[200px]">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Navegación
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                  Dashboard
                </Link>
                <Link
                  href="/books"
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookMarked className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                  Libros
                </Link>
                <Link
                  href="/loans"
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Clock className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                  Préstamos
                </Link>
                <Link
                  href="/fines"
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DollarSign className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                  Multas
                </Link>
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Configuración
                </div>
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                  Mi Perfil
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 group transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                  Configuración
                </Link>
              </div>

              <div className="mt-auto px-3 py-4 border-t border-gray-100 mt-6">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 group transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="px-5 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  className="w-full flex justify-center items-center px-4 py-3 text-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="w-full flex justify-center items-center px-4 py-3 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
              
              <div className="pt-5 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/#features"
                    className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Características
                  </Link>
                  <Link
                    href="/#contact"
                    className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contacto
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}