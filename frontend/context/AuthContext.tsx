'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  sub: number;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/auth');
  }, [router]);

  const validateAndSetToken = useCallback((tokenValue: string) => {
    try {
      const decodedUser: User = jwtDecode(tokenValue);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if ((decodedUser as any).exp && (decodedUser as any).exp < currentTime) {
        throw new Error('Token expired');
      }
      
      setUser(decodedUser);
      setToken(tokenValue);
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      return false;
    }
  }, []);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) {
      const isValid = validateAndSetToken(storedToken);
      if (!isValid && pathname !== '/auth' && !pathname.startsWith('/auth/')) {
        router.push('/auth');
      }
    }
    setIsLoading(false);
  }, [validateAndSetToken, pathname, router]);

  // Setup global fetch interceptor for 401 handling
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401 && token) {
        console.log('401 detected, logging out...');
        logout();
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [token, logout]);

  const login = useCallback((newToken: string) => {
    const isValid = validateAndSetToken(newToken);
    if (isValid) {
      localStorage.setItem('token', newToken);
    }
  }, [validateAndSetToken]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
