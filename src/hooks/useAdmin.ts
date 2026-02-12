import { useAuth } from '@/contexts/AuthContext';

export function useAdmin(): boolean {
  const { user } = useAuth();
  return user?.user_metadata?.role === 'admin';
}
