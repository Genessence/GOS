import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Director' | 'Project Lead' | 'Engineer';

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
  login: (email: string, role: UserRole) => Promise<boolean>;
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
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initial mock login as Kavya (Director) to matching the mockup screenshot
    return {
      id: 'usr-1',
      name: 'Kavya Chopra',
      email: 'kavya.chopra@genessence.com',
      role: 'Director',
      avatar: DEFAULT_AVATARS['Director'],
    };
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('gos_theme') as 'dark' | 'light') || 'dark';
  });

  // Sync Tailwind's class-based dark mode to the <html> element
  // Tailwind darkMode:'class' requires the 'dark' class on document.documentElement
  useEffect(() => {
    localStorage.setItem('gos_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const login = async (email: string, role: UserRole): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    setUser({
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      name: name || 'Kavya Chopra',
      email: email,
      role: role,
      avatar: DEFAULT_AVATARS[role],
    });
    return true;
  };

  const logout = () => {
    setUser(null);
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
