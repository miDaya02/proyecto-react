"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && pathname !== '/login') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}