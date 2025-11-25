import { createContext, useContext, useEffect, useState } from 'react';
import type { Role } from '@/services/auth';

export type AuthUser = { email: string; role: Role; name: string };
export type AuthState = { token: string; user: AuthUser } | null;

type AuthContextValue = {
  auth: AuthState;
  signIn: (data: { token: string; user: AuthUser }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log('AuthProvider - Loading from localStorage:', parsed);
        return parsed as AuthState;
      }
      return null;
    } catch (err) {
      console.error('AuthProvider - Error parsing localStorage auth:', err);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (auth) localStorage.setItem('auth', JSON.stringify(auth));
      else localStorage.removeItem('auth');
    } catch {}
  }, [auth]);

  const signIn: AuthContextValue['signIn'] = (data) => {
    console.log('AuthProvider - Signing in with data:', data);
    setAuth(data);
  };
  const signOut = () => {
    console.log('AuthProvider - Signing out');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
