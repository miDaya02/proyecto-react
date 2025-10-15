"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect, useState } from 'react';
import { setCredentials, logout } from './store';
import { useRouter } from 'next/navigation';

function AuthInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

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

  // Verificar periódicamente si el token sigue existiendo
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const currentToken = store.getState().auth.token;
      
      // Si había token en Redux pero ya no está en localStorage
      if (currentToken && !token) {
        console.log('Token eliminado - cerrando sesión automáticamente');
        store.dispatch(logout());
        router.push('/login');
      }
      
      // Si no hay token en ningún lado, asegurar que no esté en ruta protegida
      if (!currentToken && !token) {
        const pathname = window.location.pathname;
        const publicRoutes = ['/login', '/register'];
        
        if (!publicRoutes.includes(pathname)) {
          console.log('Sin token - redirigiendo a login');
          router.push('/login');
        }
      }
    };

    const interval = setInterval(checkAuth, 1000);
    
    // También escuchar cambios en localStorage desde otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        console.log('Token eliminado en otra pestaña - cerrando sesión');
        store.dispatch(logout());
        router.push('/login');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
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