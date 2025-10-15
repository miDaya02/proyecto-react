import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  id: string | null;
  token: string | null;
}

const initialState: AuthState = {
  id: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ id: string; token: string }>) => {
      state.id = action.payload.id;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.id = null;
      state.token = null;
      // Limpiar localStorage también
      if (typeof window !== 'undefined') {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;