import { useAuth } from '@/context/AuthContext';

export function useAuthUser() {
  return useAuth().auth?.user ?? null;
}

export function useIsAuthenticated() {
  return Boolean(useAuth().auth);
}
