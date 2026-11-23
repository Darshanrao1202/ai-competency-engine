'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'student') {
        router.push('/student');
      } else {
        router.push('/faculty');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      <p className="text-xs font-semibold text-slate-500">
        Authenticating & routing to authorized portal...
      </p>
    </div>
  );
}
