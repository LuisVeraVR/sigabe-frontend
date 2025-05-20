'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import { User, LoginFormData, RegisterFormData, AuthResponse } from '@/types/user';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const checkingAuth = useRef(false); 
  const hasLoadedInitially = useRef(false); 

  useEffect(() => {
    if (!hasLoadedInitially.current) {
      hasLoadedInitially.current = true;
      const initAuth = async () => {
        await checkAuth();
        setIsLoading(false);
      };
      initAuth();
    }
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    if (checkingAuth.current) return isAuthenticated;
    checkingAuth.current = true;

    try {
      const token = localStorage.getItem('token') || Cookies.get('auth_token');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        checkingAuth.current = false;
        return false;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          logout();
          checkingAuth.current = false;
          return false;
        }
      } catch (error) {
        console.error('Error decodificando token:', error);
        logout();
        checkingAuth.current = false;
        return false;
      }

      if (user && isAuthenticated) {
        checkingAuth.current = false;
        return true;
      }

      const { data } = await api.get('/auth/profile');
      setUser(data);
      setIsAuthenticated(true);
      checkingAuth.current = false;
      return true;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      logout();
      checkingAuth.current = false;
      return false;
    }
  };

  const login = async (formData: LoginFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', formData);
      
      localStorage.setItem('token', data.token);
      Cookies.set('auth_token', data.token, { expires: 1 }); 

      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Inicio de sesión exitoso');
      
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Usuario registrado exitosamente. Puedes iniciar sesión ahora.');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrar usuario';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    Cookies.remove('auth_token');
    
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Sesión cerrada');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};