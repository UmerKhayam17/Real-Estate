// app/components/common/ProtectedRoute.jsx
'use client';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/auth/login' 
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (!loading && isAuthenticated && requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [loading, isAuthenticated, user, requiredRole, router, redirectTo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return children;
}