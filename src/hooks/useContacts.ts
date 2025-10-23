import { useState, useCallback } from "react";
import { Contact, PaginationInfo } from "@/types";
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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchContacts = useCallback(
    async (page: number = 1, limit: number = 16) => {
      if (!userId) return;

      setLoading(true);
      try {
        const data = await getContacts(userId, page, limit);
        setContacts(data.contacts);
        setPagination(data.pagination);
      } catch (error: any) {
        showToast(error.message || "Error fetching contacts", "error");
      } finally {
        setLoading(false);
      }
    },
    [userId, showToast]
  );

  const fetchFavorites = useCallback(
    async (page: number = 1, limit: number = 16) => {
      if (!userId) return;

      setLoading(true);
      try {
        const data = await getFavoriteContactsByUserId(userId, page, limit);
        setContacts(data.contacts);
        setPagination(data.pagination);
      } catch (error: any) {
        showToast(error.message || "Error fetching favorites", "error");
      } finally {
        setLoading(false);
      }
    },
    [userId, showToast]
  );

  const fetchNonFavorites = useCallback(
    async (page: number = 1, limit: number = 16) => {
      if (!userId) return;

      setLoading(true);
      try {
        const data = await getNonFavoriteContactsByUserId(userId, page, limit);
        setContacts(data.contacts);
        setPagination(data.pagination);
      } catch (error: any) {
        showToast(error.message || "Error fetching contacts", "error");
      } finally {
        setLoading(false);
      }
    },
    [userId, showToast]
  );

  const fetchTopFavorites = useCallback(async () => {
    if (!userId) return [];

    try {
      return await getFourContactsFavorite(userId);
    } catch (error: any) {
      showToast(error.message || "Error fetching top favorites", "error");
      return [];
    }
  }, [userId, showToast]);

  const addContact = useCallback(
    async (contactData: any) => {
      if (!userId) return { success: false };

      try {
        await createContact(userId, contactData);
        showToast("Contact created successfully", "success");
        return { success: true };
      } catch (error: any) {
        showToast(error.message || "Error creating contact", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, showToast]
  );

  const editContact = useCallback(
    async (contactId: string, contactData: any) => {
      if (!userId) return { success: false };

      try {
        await updateContact(userId, contactId, contactData);
        showToast("Contact updated successfully", "success");
        return { success: true };
      } catch (error: any) {
        showToast(error.message || "Error updating contact", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, showToast]
  );

  const removeContact = useCallback(
    async (contactId: string) => {
      if (!userId) return { success: false };

      try {
        await deleteContact(userId, contactId);
        showToast("Contact deleted successfully", "success");
        return { success: true };
      } catch (error: any) {
        showToast(error.message || "Error deleting contact", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, showToast]
  );

  const toggleFavorite = useCallback(
    async (contactId: string, isFavorite: boolean) => {
      if (!userId) return { success: false };

      try {
        if (isFavorite) {
          await removeFromFavorites(userId, contactId);
          showToast("Removed from favorites", "success");
        } else {
          await addToFavorites(userId, contactId);
          showToast("Added to favorites", "success");
        }

        // NO actualizar el estado aquí - dejamos que el componente lo maneje
        return { success: true };
      } catch (error: any) {
        showToast(error.message || "Error updating favorite", "error");
        return { success: false, error: error.message };
      }
    },
    [userId, showToast]
  );

  return {
    contacts,
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
    setContacts,
  };
};