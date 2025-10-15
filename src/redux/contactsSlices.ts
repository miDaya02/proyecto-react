// redux/slices/contactsSlice.ts - Redux slice para contactos

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Contact, PaginationInfo } from '@/types';

interface ContactsState {
  contacts: Contact[];
  favorites: Contact[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  favorites: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // Setters
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
    setFavorites: (state, action: PayloadAction<Contact[]>) => {
      state.favorites = action.payload;
    },
    setPagination: (state, action: PayloadAction<PaginationInfo>) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Optimistic updates
    addContactOptimistic: (state, action: PayloadAction<Contact>) => {
      state.contacts.unshift(action.payload);
      state.pagination.totalContacts += 1;
    },
    
    updateContactOptimistic: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(
        (c) => c.id_contact === action.payload.id_contact
      );
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
      
      const favIndex = state.favorites.findIndex(
        (c) => c.id_contact === action.payload.id_contact
      );
      if (favIndex !== -1) {
        state.favorites[favIndex] = action.payload;
      }
    },

    deleteContactOptimistic: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(
        (c) => c.id_contact !== action.payload
      );
      state.favorites = state.favorites.filter(
        (c) => c.id_contact !== action.payload
      );
      state.pagination.totalContacts = Math.max(0, state.pagination.totalContacts - 1);
    },

    toggleFavoriteOptimistic: (
      state,
      action: PayloadAction<{ contactId: string; isFavorite: boolean }>
    ) => {
      const { contactId, isFavorite } = action.payload;
      
      // Actualizar en contacts
      const contactIndex = state.contacts.findIndex(
        (c) => c.id_contact === contactId
      );
      if (contactIndex !== -1) {
        state.contacts[contactIndex].is_favorite = isFavorite;
      }

      // Actualizar en favorites
      if (isFavorite) {
        const contact = state.contacts.find((c) => c.id_contact === contactId);
        if (contact && !state.favorites.find((f) => f.id_contact === contactId)) {
          state.favorites.push(contact);
        }
      } else {
        state.favorites = state.favorites.filter((c) => c.id_contact !== contactId);
      }
    },

    // Rollback para errores
    revertOptimisticUpdate: (state, action: PayloadAction<ContactsState>) => {
      return action.payload;
    },

    // Reset
    resetContacts: () => initialState,
  },
});

export const {
  setContacts,
  setFavorites,
  setPagination,
  setLoading,
  setError,
  addContactOptimistic,
  updateContactOptimistic,
  deleteContactOptimistic,
  toggleFavoriteOptimistic,
  revertOptimisticUpdate,
  resetContacts,
} = contactsSlice.actions;

export default contactsSlice.reducer;