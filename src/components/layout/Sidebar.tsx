"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  User,
  Home,
  LogOut,
  BookMarked,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign
} from "lucide-react";

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };

  const menuItems = [
    { path: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Inicio" },
    {
      path: "/books",
      icon: <BookMarked className="h-5 w-5" />,
      label: "Libros",
    },
    {
      path: "/loans",
      icon: <Clock className="h-5 w-5" />,
      label: "Préstamos",
    },
    {
      path: "/fines",
      icon: <DollarSign className="h-5 w-5" />,
      label: "Multas",
    }
  ];

  const adminMenuItems = [
    { path: "/users", icon: <Users className="h-5 w-5" />, label: "Usuarios" },
    {
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Configuración",
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full w-0 md:w-16 md:translate-x-0"
        } fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 shadow-lg md:shadow-none flex flex-col`}
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center justify-between border-b border-gray-100">
          {isOpen ? (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SIGABE
              </span>
            </div>
          ) : (
            <div className="mx-auto">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Menu principal */}
        <div className="flex-1 flex flex-col py-5 overflow-y-auto">
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <div
                  className={`${
                    isActive(item.path) ? "text-blue-700" : "text-blue-600"
                  }`}
                >
                  {item.icon}
                </div>
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}

            {user?.isAdmin && (
              <>
                <div className="pt-5 pb-2 px-3">
                  {isOpen && (
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Administración
                    </p>
                  )}
                  {!isOpen && <hr className="border-gray-200" />}
                </div>

                {adminMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <div
                      className={`${
                        isActive(item.path) ? "text-blue-700" : "text-blue-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                ))}
              </>
            )}

            <div className="pt-5 pb-2 px-3">
              {isOpen && (
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Soporte
                </p>
              )}
              {!isOpen && <hr className="border-gray-200 mt-5" />}
            </div>

            <Link
              href="/help"
              className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors"
            >
              <HelpCircle className="h-5 w-5 text-blue-600" />
              {isOpen && <span>Ayuda</span>}
            </Link>
          </nav>

          {/* Perfil de usuario */}
          <div className="mt-auto px-3 pb-4">
            {isOpen ? (
              <div className="pt-3 border-t border-gray-200">
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex-shrink-0 h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium uppercase">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.firstName || "Usuario"} {user?.lastName || ""}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.isAdmin ? "Administrador" : "Usuario"}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => logout && logout()}
                  className="mt-2 w-full flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <Link
                  href="/profile"
                  className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium uppercase">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                </Link>
                <button
                  onClick={() => logout && logout()}
                  className="p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay para sidebar en móvil */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-20"
          onClick={toggle}
        ></div>
      )}
    </>
  );
}