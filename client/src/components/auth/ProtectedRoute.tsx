import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    } else if (adminOnly && user?.role !== 'admin') {
      setLocation('/');
    }
  }, [isAuthenticated, user, adminOnly, setLocation]);

  if (!isAuthenticated || (adminOnly && user?.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
} 