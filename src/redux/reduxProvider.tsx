"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect, useState } from 'react';
import { setCredentials, logout } from './store';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../components/LoadingScreen';

function AuthInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // ✅ Cargar credenciales al inicio y verificar expiración
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      const expiry = localStorage.getItem('token_expiry');
      
      // Verificar si expiró
      const isExpired = expiry && Date.now() > parseInt(expiry, 10);
      
      if (id && token && !isExpired) {
        store.dispatch(setCredentials({ id, token }));
      } else if (isExpired) {
        // Limpiar si expiró
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        store.dispatch(logout());
      } else {
        store.dispatch(logout());
      }
      
      setIsInitialized(true);
    }
  }, []);

  // Sincronización entre pestañas (solo cambios de storage)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Solo actuar si cambió el token
      if (e.key !== 'token') return;
      
      const currentToken = store.getState().auth.token;
      
      if (!e.newValue && currentToken) {
        // Token eliminado en otra pestaña
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        store.dispatch(logout());
        router.push('/login');
      } else if (e.newValue && !currentToken) {
        // Token agregado en otra pestaña
        const id = localStorage.getItem('id');
        const expiry = localStorage.getItem('token_expiry');
        const isExpired = expiry && Date.now() > parseInt(expiry, 10);
        
        if (id && e.newValue && !isExpired) {
          store.dispatch(setCredentials({ id, token: e.newValue }));
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  // ✅ Verificar auth en navegación
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const expiry = localStorage.getItem('token_expiry');
      const currentToken = store.getState().auth.token;
      const pathname = window.location.pathname;
      const publicRoutes = ['/login', '/register'];
      
      // Verificar si expiró
      const isExpired = expiry && Date.now() > parseInt(expiry, 10);
      
      if (isExpired) {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        store.dispatch(logout());
        router.push('/login');
        return;
      }
      
      // Si no hay token y está en ruta protegida
      if (!token && !currentToken && !publicRoutes.includes(pathname)) {
        store.dispatch(logout());
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (!isInitialized) {
    return <LoadingScreen />;
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