'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserAccount } from '@/features/users/types';

interface AuthContextType {
  token: string | null;
  user: UserAccount | null;
  login: (token: string, userData?: Partial<UserAccount>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple JWT parser
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for token on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decoded = parseJwt(storedToken);
      
      // Fallback user if token doesn't have details
      setUser({
        id: decoded?.sub || 'user-1',
        name: decoded?.name || 'Admin User',
        email: decoded?.email || 'admin@crowdshield.com',
        role: decoded?.role || 'Super Admin',
        department: 'Command Center',
        status: 'active',
        lastActive: new Date().toISOString()
      });
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData?: Partial<UserAccount>) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    const decoded = parseJwt(newToken);
    setUser({
      id: userData?.id || decoded?.sub || 'user-1',
      name: userData?.name || decoded?.name || 'Admin User',
      email: userData?.email || decoded?.email || 'admin@crowdshield.com',
      role: userData?.role || decoded?.role || 'Super Admin',
      department: userData?.department || 'Command Center',
      status: 'active',
      lastActive: new Date().toISOString()
    });
    
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!isLoading && !token && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, token, pathname, router]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {!isLoading ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
