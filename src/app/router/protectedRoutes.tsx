"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/login', '/register'];
    
    // Si no está en una ruta pública y no tiene token, redirigir a login
    if (!publicRoutes.includes(pathname) && !token) {
      router.push('/login');
    }
    
    // Si tiene token y está en login o register, redirigir a contacts
    if (token && publicRoutes.includes(pathname)) {
      router.push('/contacts');
    }
  }, [pathname, token, router]);

  return <>{children}</>;
}