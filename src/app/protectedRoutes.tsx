// app/protectedRoutes.tsx

"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (pathname !== '/login' && !token) {
      router.push('/login');
    }
  }, [pathname, token, router]);

  return <>{children}</>;
}