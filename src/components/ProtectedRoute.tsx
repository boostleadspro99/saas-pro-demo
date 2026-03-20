import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Vérification stricte de l'email administrateur (insensible à la casse)
  if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return <Navigate to="/login" state={{ error: "Accès refusé : vous n'êtes pas autorisé à accéder à cet espace." }} replace />;
  }

  return <Outlet />;
}
