"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect, useState } from 'react';
import { setCredentials } from './store';

function AuthInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      
      if (id && token) {
        store.dispatch(setCredentials({ id, token }));
      }
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>; // O un spinner
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