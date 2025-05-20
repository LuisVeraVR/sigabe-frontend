'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Library, 
  Search, 
  Users, 
  BarChart4, 
  Layout, 
  ChevronRight,
  Clock,
  CheckCircle,
  BookMarked,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats counter animation
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    libraries: 0
  });

  useEffect(() => {
    if (!isClient) return;

    const statsSection = document.getElementById('stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const interval = setInterval(() => {
              setStats(prev => {
                const newUsers = Math.min(prev.users + 7, 2500);
                const newBooks = Math.min(prev.books + 121, 15000);
                const newLibraries = Math.min(prev.libraries + 1, 120);
                
                if (newUsers === 2500 && newBooks === 15000 && newLibraries === 120) {
                  clearInterval(interval);
                }
                
                return {
                  users: newUsers,
                  books: newBooks,
                  libraries: newLibraries
                };
              });
            }, 30);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(statsSection);
    return () => observer.disconnect();
  }, [isClient]);

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          {/* Background con gradiente y formas */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-white rounded-full"></div>
              <div className="absolute top-60 right-20 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 text-center md:text-left text-white mb-12 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Sistema de Gestión <br />
                  <span className="text-blue-200">de Biblioteca</span>
                </h1>
                <p className="text-xl opacity-90 mb-8 max-w-xl md:mx-0 mx-auto">
                  Una plataforma moderna para gestionar tu colección de libros de manera
                  eficiente y organizada en la era digital.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Link
                    href="/login"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center justify-center group transition-all"
                  >
                    Iniciar Sesión
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-500 bg-opacity-30 text-white border border-white border-opacity-30 hover:bg-opacity-40 px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center justify-center"
                  >
                    Registrarse
                  </Link>
                </div>
              </div>
              
              {/* Ilustración/Imagen */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Ilustración principal */}
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-6 w-6 text-white mr-2" />
                      <div className="h-2 w-32 bg-white bg-opacity-30 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-white bg-opacity-20 mr-3 flex items-center justify-center">
                            <BookMarked className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="h-2 w-40 bg-white bg-opacity-40 rounded-full"></div>
                            <div className="h-2 w-24 bg-white bg-opacity-20 rounded-full mt-2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white border-opacity-10">
                      <div className="flex justify-end">
                        <div className="h-8 w-24 bg-blue-400 bg-opacity-40 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elementos decorativos */}
                  <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl opacity-50 blur-xl"></div>
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-300 to-purple-400 rounded-xl opacity-40 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L80,80C160,64,320,32,480,21.3C640,11,800,21,960,37.3C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Features with icons */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Características Principales</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Un sistema completo diseñado para bibliotecas modernas que necesitan
                gestionar sus colecciones de manera eficiente.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <BookOpen className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Gestión de Libros</h3>
                <p className="text-gray-600">
                  Añade, edita y elimina libros de tu biblioteca con facilidad.
                  Organiza por autor, año, editorial y más.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex text-blue-600 font-medium items-center group cursor-pointer">
                    <span>Conocer más</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
                <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <Clock className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Control de Disponibilidad</h3>
                <p className="text-gray-600">
                  Lleva un registro de qué libros están disponibles y cuáles
                  no en tiempo real con actualizaciones automáticas.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex text-green-600 font-medium items-center group cursor-pointer">
                    <span>Conocer más</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
                <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <Layout className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Interfaz Intuitiva</h3>
                <p className="text-gray-600">
                  Diseñada para ser fácil de usar, con una experiencia fluida
                  tanto en dispositivos móviles como en escritorio.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex text-purple-600 font-medium items-center group cursor-pointer">
                    <span>Conocer más</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats-section" className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Números que hablan</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                SIGABE se ha convertido en una herramienta esencial para cientos de bibliotecas
                en todo el país.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <div className="flex justify-center">
                  <Users className="h-10 w-10 text-blue-600 mb-4" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {isClient ? stats.users.toLocaleString() : "0"}+
                </div>
                <div className="text-lg text-gray-600">Usuarios activos</div>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <div className="flex justify-center">
                  <BookMarked className="h-10 w-10 text-green-600 mb-4" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {isClient ? stats.books.toLocaleString() : "0"}+
                </div>
                <div className="text-lg text-gray-600">Libros catalogados</div>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <div className="flex justify-center">
                  <Library className="h-10 w-10 text-purple-600 mb-4" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {isClient ? stats.libraries.toLocaleString() : "0"}+
                </div>
                <div className="text-lg text-gray-600">Bibliotecas utilizando SIGABE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  ¿Por qué elegir SIGABE?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Desarrollamos SIGABE pensando en las necesidades reales de las bibliotecas
                  modernas, con un enfoque en la experiencia de usuario y la eficiencia.
                </p>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Fácil de implementar</h3>
                      <p className="text-gray-600">Comienza a utilizar el sistema en cuestión de minutos, sin configuraciones complejas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Soporte continuo</h3>
                      <p className="text-gray-600">Nuestro equipo está disponible para ayudarte cuando lo necesites.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Actualizaciones constantes</h3>
                      <p className="text-gray-600">Mejoras regulares basadas en la retroalimentación de usuarios.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="relative">
                  {/* Imagen principal */}
                  <div className="bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-xl p-3 shadow-xl">
                    <div className="bg-white rounded-lg p-2">
                      <div className="bg-gray-800 rounded-t-lg p-2 flex items-center">
                        <div className="flex space-x-2">
                          <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                          <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="mx-auto text-xs text-gray-300">SIGABE Dashboard</div>
                      </div>
                      
                      {/* Dashboard Preview */}
                      <div className="p-4 bg-gray-50 rounded-b-lg">
                        <div className="flex mb-4">
                          <div className="bg-blue-600 w-1/4 h-20 rounded-lg"></div>
                          <div className="flex-1 ml-4 space-y-2">
                            <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                            <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="bg-gray-200 h-3 w-1/2 rounded mb-2"></div>
                            <div className="bg-gray-800 h-6 w-1/3 rounded"></div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="bg-gray-200 h-3 w-1/2 rounded mb-2"></div>
                            <div className="bg-green-600 h-6 w-2/3 rounded"></div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                            <div className="bg-blue-500 h-6 w-16 rounded"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elementos decorativos */}
                  <div className="absolute -z-10 -bottom-6 -right-6 w-28 h-28 bg-blue-100 rounded-xl transform rotate-12"></div>
                  <div className="absolute -z-10 -top-6 -left-6 w-20 h-20 bg-indigo-100 rounded-xl transform -rotate-6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
            <div className="absolute left-10 bottom-10 w-40 h-40 rounded-full bg-white"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Comienza a Organizar tu Biblioteca Hoy
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Registra tus libros, mantén tu colección organizada y accede a la
              información desde cualquier lugar. Tu biblioteca siempre a un clic de distancia.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center justify-center group"
              >
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-40 px-6 py-3 rounded-lg font-medium text-lg"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </section>
      </main>      
    </div>
  );
}