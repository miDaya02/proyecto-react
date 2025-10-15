"use client";

import {
  getFavoriteContactsByUserId,
  removeFromFavorites,
  deleteContact
} from "@/services/contactService";
import { useEffect, useState } from "react";
import Paginator from "../paginator/page";

type Contact = {
  id_contact: string;
  name: string;
  last_name: string;
  email: string;
  photo_profile: string;
  is_favorite: boolean;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function Favorites() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("id");
      setId(userId);
    }
  }, []);

  const fetchFavorites = async (page: number = 1) => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getFavoriteContactsByUserId(id, page, 16
      );
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching favorite contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [id]);

  const handlePageChange = (newPage: number) => {
    fetchFavorites(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFavorite = async (contactId: string) => {
    if (!id) return;

    try {
      await removeFromFavorites(id, contactId);
      // Recargar la lista para obtener el siguiente favorito si existe
      const data = await getFavoriteContactsByUserId(id, pagination.currentPage, 16
      );
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!id) return;

    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await deleteContact(id, contactId);
      // Recargar la lista después de eliminar
      const data = await getFavoriteContactsByUserId(id, pagination.currentPage, 16
      );
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <section className="card">
      <h2>Favorites</h2>
      <div className="cards-container">
        {loading ? (
          <p>Loading...</p>
        ) : contacts.length === 0 ? (
          <p>There are no favorite contacts</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id_contact} className="contact-card">
              <img
                src={contact.photo_profile || "/avatar.png"}
                alt={contact.name}
                className="avatar"
              />
              <div className="info">
                <h3>{contact.name} {contact.last_name}</h3>
                <p>{contact.email}</p>
              </div>

              <div className="actions">
                <button
                  className="remove"
                  onClick={() => handleRemoveFavorite(contact.id_contact)}
                >
                  <img src="/x.svg" className="iconx" alt="remove" />
                </button>
                <button
                  className="trash"
                  onClick={() => handleDelete(contact.id_contact)}
                >
                  <img src="/trash.svg" className="iconTrash" alt="trash" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>


      <Paginator
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}