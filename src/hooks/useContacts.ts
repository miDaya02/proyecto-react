import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setContacts,
  setFavorites,
  setPagination,
  setLoading,
  setError,
  addContactOptimistic,
  updateContactOptimistic,
  deleteContactOptimistic,
  toggleFavoriteOptimistic,
} from "@/redux/contactsSlices";
import {
  getContacts,
  getFavoriteContactsByUserId,
  getNonFavoriteContactsByUserId,
  getFourContactsFavorite,
  createContact,
  updateContact,
  deleteContact,
  addToFavorites,
  removeFromFavorites,
} from "@/services/contactService";
import { useToast } from "./useToast";

export const useContacts = (userId: string | null) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const contacts = useAppSelector((state) => state.contacts.contacts);
  const favorites = useAppSelector((state) => state.contacts.favorites);
  const pagination = useAppSelector((state) => state.contacts.pagination);
  const loading = useAppSelector((state) => state.contacts.loading);

  const fetchContacts = useCallback(
    async (page: number = 1, limit: number = 16) => {
      if (!userId) return;

      dispatch(setLoading(true));
      try {
        const data = await getContacts(userId, page, limit);
        dispatch(setContacts(data.contacts));
        dispatch(setPagination(data.pagination));
      } catch (error: any) {
        dispatch(setError(error.message));
        showToast(error.message || "Error fetching contacts", "error");
      } finally {
        dispatch(setLoading(false));
      }
    },
    [userId, dispatch, showToast]
  );

  const fetchFavorites = useCallback(
    async (page: number = 1, limit: number = 16) => {
      if (!userId) return;

      dispatch(setLoading(true));
      try {
        const data = await getFavoriteContactsByUserId(userId, page, limit);
        dispatch(setContacts(data.contacts));
        dispatch(setPagination(data.pagination));
      } catch (error: any) {
        dispatch(setError(error.message));
        showToast(error.message || "Error fetching favorites", "error");
      } finally {
        dispatch(setLoading(false));
      }
    },
    [userId, dispatch, showToast]
  );

  const fetchNonFavorites = useCallback(
    async (page: number = 1, limit: number = 16) => {
      if (!userId) return;

      dispatch(setLoading(true));
      try {
        const data = await getNonFavoriteContactsByUserId(userId, page, limit);
        dispatch(setContacts(data.contacts));
        dispatch(setPagination(data.pagination));
      } catch (error: any) {
        dispatch(setError(error.message));
        showToast(error.message || "Error fetching contacts", "error");
      } finally {
        dispatch(setLoading(false));
      }
    },
    [userId, dispatch, showToast]
  );

  const fetchTopFavorites = useCallback(async () => {
    if (!userId) return [];

    try {
      const data = await getFourContactsFavorite(userId);
      dispatch(setFavorites(data));
      return data;
    } catch (error: any) {
      showToast(error.message || "Error fetching top favorites", "error");
      return [];
    }
  }, [userId, dispatch, showToast]);

  const addContact = useCallback(
    async (contactData: any) => {
      if (!userId) return { success: false };

      try {
        const newContact = await createContact(userId, contactData);
        
        // Actualización optimista
        dispatch(addContactOptimistic(newContact));
        
        showToast("Contact created successfully", "success");
        
        // Disparar evento para que los componentes se actualicen
        window.dispatchEvent(new CustomEvent('contactCreated', { 
          detail: { refresh: true } 
        }));
        
        return { success: true };
      } catch (error: any) {
        showToast(error.message || "Error creating contact", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, dispatch, showToast]
  );

  const editContact = useCallback(
    async (contactId: string, contactData: any) => {
      if (!userId) return { success: false };

      try {
        const updatedContact = await updateContact(userId, contactId, contactData);
        
        // Solo actualización optimista, sin recargar
        dispatch(updateContactOptimistic(updatedContact));
        
        showToast("Contact updated successfully", "success");
        
        return { success: true };
      } catch (error: any) {
        // Si falla, recargar para mostrar el estado real
        await fetchContacts(pagination.currentPage);
        showToast(error.message || "Error updating contact", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, dispatch, showToast, fetchContacts, pagination.currentPage]
  );

  const removeContact = useCallback(
    async (contactId: string) => {
      if (!userId) return { success: false };

      // Actualización optimista
      dispatch(deleteContactOptimistic(contactId));

      try {
        await deleteContact(userId, contactId);
        showToast("Contact deleted successfully", "success");
        
        // Solo recargar si eliminamos el último contacto de la página
        // y no estamos en la primera página
        if (contacts.length === 1 && pagination.currentPage > 1) {
          await fetchContacts(pagination.currentPage - 1);
        } else if (contacts.length === 1) {
          // Si es el último contacto de la primera página, recargar
          await fetchContacts(1);
        }
        // Si hay más contactos en la página, la actualización optimista es suficiente
        
        return { success: true };
      } catch (error: any) {
        // Si falla, recargar para revertir
        await fetchContacts(pagination.currentPage);
        showToast(error.message || "Error deleting contact", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, dispatch, showToast, fetchContacts, pagination.currentPage, contacts.length]
  );

  const toggleFavorite = useCallback(
    async (contactId: string, isFavorite: boolean) => {
      if (!userId) return { success: false };

      // Actualización optimista
      dispatch(toggleFavoriteOptimistic({ contactId, isFavorite: !isFavorite }));

      try {
        if (isFavorite) {
          await removeFromFavorites(userId, contactId);
          showToast("Removed from favorites", "success");
        } else {
          await addToFavorites(userId, contactId);
          showToast("Added to favorites", "success");
        }

        return { success: true };
      } catch (error: any) {
        // Si falla, revertir y recargar
        dispatch(toggleFavoriteOptimistic({ contactId, isFavorite }));
        await fetchContacts(pagination.currentPage);
        showToast(error.message || "Error updating favorite", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, dispatch, showToast, fetchContacts, pagination.currentPage]
  );

  return {
    contacts,
    favorites,
    pagination,
    loading,
    fetchContacts,
    fetchFavorites,
    fetchNonFavorites,
    fetchTopFavorites,
    addContact,
    editContact,
    removeContact,
    toggleFavorite,
  };
};