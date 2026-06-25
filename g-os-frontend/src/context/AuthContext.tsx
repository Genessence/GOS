import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
export type UserRole = 'Director' | 'Project Lead' | 'Engineer' | 'Admin' | 'Manager' | 'Employee' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_AVATARS: Record<UserRole, string> = {
  Director: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'Project Lead': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  Engineer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  Admin: 'https://images.unsplash.com/photo-1545996124-1b1a5d3f1c6f?w=150&auto=format&fit=crop&q=80',
  Manager: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  Employee: 'https://images.unsplash.com/photo-1545996124-1b1a5d3f1c6f?w=150&auto=format&fit=crop&q=80',
  User: 'https://images.unsplash.com/photo-1545996124-1b1a5d3f1c6f?w=150&auto=format&fit=crop&q=80',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    // Use Vite env variable (import.meta.env) instead of process.env
    // Create a file `g-os-frontend/.env` with `VITE_API_URL=http://localhost:4000` if needed
    const backendUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';
    const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
    const userData = response.data.user;
    const token = response.data.token;

    if (!userData || !token) return false;

    setUser({
      id: String(userData.id),
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole,
      avatar: DEFAULT_AVATARS[userData.role as UserRole] ?? DEFAULT_AVATARS.Engineer,
    });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ id: String(userData.id), name: userData.name, email: userData.email, role: userData.role }));

    // Set default auth header for future axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return true;
  } catch (error) {
    console.error('Login failed', error);
    return false;
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role: role,
        avatar: DEFAULT_AVATARS[role],
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
