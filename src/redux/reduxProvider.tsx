"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect, useState } from 'react';
import { setCredentials, logout } from './store';
import { useRouter } from 'next/navigation';
import logger from '@/utils/logger'; // ✅ IMPORTAR LOGGER

function AuthInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // ✅ Cargar credenciales al inicio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      
      if (id && token) {
        store.dispatch(setCredentials({ id, token }));
      } else {
        store.dispatch(logout());
      }
      setIsInitialized(true);
    }
  }, []);

  // ✅ OPTIMIZADO: Solo escuchar cambios de storage (otras pestañas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Solo actuar si cambió el token
      if (e.key === 'token') {
        const currentToken = store.getState().auth.token;
        
        if (!e.newValue && currentToken) {
          // Token eliminado en otra pestaña
          console.log('Token eliminado en otra pestaña - cerrando sesión');
          store.dispatch(logout());
          router.push('/login');
        } else if (e.newValue && !currentToken) {
          // Token agregado en otra pestaña (login en otra pestaña)
          const id = localStorage.getItem('id');
          if (id && e.newValue) {
            console.log('Login detectado en otra pestaña');
            store.dispatch(setCredentials({ id, token: e.newValue }));
          }
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  // ✅ Verificar auth en cambios de ruta
  useEffect(() => {
    const checkAuthOnNavigation = () => {
      const token = localStorage.getItem('token');
      const currentToken = store.getState().auth.token;
      const pathname = window.location.pathname;
      const publicRoutes = ['/login', '/register'];
      
      // Si no hay token y está en ruta protegida
      if (!token && !currentToken && !publicRoutes.includes(pathname)) {
        console.log('Sin token - redirigiendo a login');
        store.dispatch(logout());
        router.push('/login');
      }
    };

    // Verificar al montar
    checkAuthOnNavigation();
  }, [router]);

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1rem',
        color: '#6b7280'
      }}>
        Loading...
      </div>
    ); 
  }

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}