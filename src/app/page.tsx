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
  ArrowRight,
  ExternalLink
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
        {/* Hero Section - Mejorando el diseño con elementos modernos */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          {/* Background con gradiente más moderno y elementos de diseño */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
            {/* Elementos decorativos modernos - círculos y formas abstractas */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-15">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-white rounded-full blur-xl"></div>
              <div className="absolute top-60 right-20 w-64 h-64 bg-blue-300 rounded-full blur-xl opacity-30"></div>
              <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white rounded-full blur-xl"></div>
              {/* Líneas decorativas */}
              <div className="absolute top-1/4 right-1/3 w-64 h-1 bg-blue-200 opacity-20 transform rotate-45"></div>
              <div className="absolute bottom-1/3 left-1/4 w-96 h-1 bg-blue-200 opacity-20 transform -rotate-45"></div>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 text-center md:text-left text-white mb-12 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  Sistema de Gestión <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">de Biblioteca</span>
                </h1>
                <p className="text-xl opacity-90 mb-8 max-w-xl md:mx-0 mx-auto">
                  Una plataforma moderna para gestionar tu colección de libros de manera
                  eficiente y organizada en la era digital.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Link
                    href="/login"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-medium text-lg inline-flex items-center justify-center group transition-all shadow-lg hover:shadow-xl"
                  >
                    Iniciar Sesión
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 bg-opacity-30 backdrop-blur-sm text-white border border-white border-opacity-30 hover:bg-opacity-40 px-8 py-4 rounded-xl font-medium text-lg inline-flex items-center justify-center transition-all"
                  >
                    Registrarse
                  </Link>
                </div>
              </div>
              
              {/* Ilustración/Imagen con diseño más moderno */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Ilustración principal con bordes más suaves y efectos modernos */}
                  <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <BookOpen className="h-6 w-6 text-white mr-2" />
                      <div className="h-2 w-32 bg-white bg-opacity-30 rounded-full"></div>
                    </div>
                    <div className="space-y-6">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-white bg-opacity-20 mr-4 flex items-center justify-center">
                            <BookMarked className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="h-2.5 w-40 bg-white bg-opacity-40 rounded-full"></div>
                            <div className="h-2 w-24 bg-white bg-opacity-20 rounded-full mt-2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-4 border-t border-white border-opacity-10">
                      <div className="flex justify-end">
                        <div className="h-10 w-28 bg-blue-400 bg-opacity-40 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elementos decorativos mejorados con efectos de blur */}
                  <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-60 blur-2xl"></div>
                  <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-2xl opacity-50 blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave separator más suave y moderno */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path fill="#ffffff" fillOpacity="1" d="M0,64L60,64C120,64,240,64,360,69.3C480,75,600,85,720,80C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Features with icons - con elementos de diseño más modernos */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Características Principales</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Un sistema completo diseñado para bibliotecas modernas que necesitan
                gestionar sus colecciones de manera eficiente.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Gestión de Libros</h3>
                <p className="text-gray-600">
                  Añade, edita y elimina libros de tu biblioteca con facilidad.
                  Organiza por autor, año, editorial y más.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex text-blue-600 font-medium items-center group cursor-pointer">
                    <span>Conocer más</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300">
                <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Control de Disponibilidad</h3>
                <p className="text-gray-600">
                  Lleva un registro de qué libros están disponibles y cuáles
                  no en tiempo real con actualizaciones automáticas.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex text-green-600 font-medium items-center group cursor-pointer">
                    <span>Conocer más</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Layout className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Interfaz Intuitiva</h3>
                <p className="text-gray-600">
                  Diseñada para ser fácil de usar, con una experiencia fluida
                  tanto en dispositivos móviles como en escritorio.
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex text-blue-600 font-medium items-center group cursor-pointer">
                    <span>Conocer más</span>
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section con diseño más moderno */}
        <section id="stats-section" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Elementos decorativos sutiles */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -right-20 top-40 w-64 h-64 rounded-full bg-blue-100 blur-3xl"></div>
            <div className="absolute left-10 bottom-10 w-40 h-40 rounded-full bg-indigo-100 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-blue-600">Números que hablan</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                SIGABE se ha convertido en una herramienta esencial para cientos de bibliotecas
                en todo el país.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center group hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-center">
                  <Users className="h-12 w-12 text-blue-600 mb-6 group-hover:text-white transition-colors" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors">
                  {isClient ? stats.users.toLocaleString() : "0"}+
                </div>
                <div className="text-lg text-gray-600 group-hover:text-blue-100 transition-colors">Usuarios activos</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center group hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-center">
                  <BookMarked className="h-12 w-12 text-blue-600 mb-6 group-hover:text-white transition-colors" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors">
                  {isClient ? stats.books.toLocaleString() : "0"}+
                </div>
                <div className="text-lg text-gray-600 group-hover:text-blue-100 transition-colors">Libros catalogados</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl text-center group hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-center">
                  <Library className="h-12 w-12 text-blue-600 mb-6 group-hover:text-white transition-colors" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors">
                  {isClient ? stats.libraries.toLocaleString() : "0"}+
                </div>
                <div className="text-lg text-gray-600 group-hover:text-blue-100 transition-colors">Bibliotecas utilizando SIGABE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section con diseño mejorado */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  ¿Por qué elegir SIGABE?
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Desarrollamos SIGABE pensando en las necesidades reales de las bibliotecas
                  modernas, con un enfoque en la experiencia de usuario y la eficiencia.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start transform transition-all hover:translate-x-2">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="bg-blue-100 rounded-full p-2.5">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Fácil de implementar</h3>
                      <p className="text-gray-600">Comienza a utilizar el sistema en cuestión de minutos, sin configuraciones complejas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start transform transition-all hover:translate-x-2">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="bg-blue-100 rounded-full p-2.5">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Soporte continuo</h3>
                      <p className="text-gray-600">Nuestro equipo está disponible para ayudarte cuando lo necesites.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start transform transition-all hover:translate-x-2">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="bg-blue-100 rounded-full p-2.5">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Actualizaciones constantes</h3>
                      <p className="text-gray-600">Mejoras regulares basadas en la retroalimentación de usuarios.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="relative">
                  {/* Imagen principal con diseño más moderno */}
                  <div className="bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-2xl p-5 shadow-2xl">
                    <div className="bg-white rounded-xl p-2">
                      <div className="bg-gray-800 rounded-t-xl p-3 flex items-center">
                        <div className="flex space-x-2">
                          <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                          <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="mx-auto text-xs text-gray-300">SIGABE Dashboard</div>
                      </div>
                      
                      {/* Dashboard Preview modernizado */}
                      <div className="p-5 bg-gray-50 rounded-b-xl">
                        <div className="flex mb-6">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-1/4 h-24 rounded-xl shadow-md"></div>
                          <div className="flex-1 ml-5 space-y-3">
                            <div className="bg-gray-200 h-5 w-3/4 rounded-full"></div>
                            <div className="bg-gray-200 h-5 w-1/2 rounded-full"></div>
                            <div className="bg-gray-200 h-5 w-5/6 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-200 h-3 w-1/2 rounded-full mb-3"></div>
                            <div className="bg-blue-600 h-8 w-1/3 rounded-xl"></div>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-200 h-3 w-1/2 rounded-full mb-3"></div>
                            <div className="bg-green-500 h-8 w-2/3 rounded-xl"></div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <div className="bg-gray-200 h-4 w-1/4 rounded-full"></div>
                            <div className="bg-blue-500 h-7 w-20 rounded-lg"></div>
                          </div>
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-4/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elementos decorativos más modernos */}
                  <div className="absolute -z-10 -bottom-8 -right-8 w-32 h-32 bg-blue-200 rounded-2xl transform rotate-12 blur-md"></div>
                  <div className="absolute -z-10 -top-8 -left-8 w-28 h-28 bg-indigo-200 rounded-2xl transform -rotate-6 blur-md"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section más impactante y moderna */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20 relative overflow-hidden">
          {/* Elementos decorativos modernos */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute left-10 bottom-10 w-64 h-64 rounded-full bg-blue-300 blur-3xl"></div>
            {/* Líneas decorativas */}
            <div className="absolute top-1/3 right-1/4 w-96 h-1 bg-white opacity-30 transform rotate-45"></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-1 bg-white opacity-30 transform -rotate-45"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
              Comienza a Organizar tu Biblioteca Hoy
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Registra tus libros, mantén tu colección organizada y accede a la
              información desde cualquier lugar. Tu biblioteca siempre a un clic de distancia.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-medium text-lg inline-flex items-center justify-center group shadow-lg hover:shadow-xl transition-all"
              >
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="bg-blue-700 bg-opacity-40 backdrop-blur-sm text-white border border-white border-opacity-30 hover:bg-opacity-50 px-8 py-4 rounded-xl font-medium text-lg transition-all"
              >
                Iniciar Sesión
              </Link>
            </div>
            
            {/* Testimonial flotante - elemento moderno */}
            <div className="mt-16 max-w-md mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 shadow-xl transform hover:-translate-y-1 transition-all">
              <p className="text-white text-lg italic mb-4">"SIGABE ha revolucionado la forma en que gestionamos nuestra biblioteca. Es intuitivo, eficiente y exactamente lo que necesitábamos."</p>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  M
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">María Rodríguez</p>
                  <p className="text-blue-200 text-sm">Biblioteca Municipal de Cali</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>      
    </div>
  );
}