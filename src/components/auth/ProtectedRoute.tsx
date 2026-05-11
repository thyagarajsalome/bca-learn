import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5b6af0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8890b5]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}