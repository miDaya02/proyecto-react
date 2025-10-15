"use client";

import {
  getContacts,
  removeFromFavorites,
  addToFavorites,
  deleteContact
} from "@/services/contactService";
import { useEffect, useState } from "react";
import EditContactModal from "./editContact";
import Paginator from "../paginator/page";
type Contact = {
  id_contact: string;
  last_name: string;
  name: string;
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

export default function Contacts() {
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = window.localStorage.getItem("id");
      setId(userId);
    }
  }, []);

  const fetchContacts = async (page: number = 1) => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await getContacts(id, page, 16);
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [id]);

  const handlePageChange = (newPage: number) => {
    fetchContacts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = async (contactId: string, isFavorite: boolean) => {
    if (!id) return;

    try {
      if (isFavorite) {
        await removeFromFavorites(id, contactId);
      } else {
        await addToFavorites(id, contactId);
      }

      setContacts(contacts.map(c =>
        c.id_contact === contactId ? { ...c, is_favorite: !isFavorite } : c
      ));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!id) return;

    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await deleteContact(id, contactId);
      fetchContacts(pagination.currentPage);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactUpdated = async () => {
    fetchContacts(pagination.currentPage);
  };

  return (
    <>
      {id && (
        <EditContactModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userId={id}
          contact={selectedContact}
          onContactUpdated={handleContactUpdated}
        />
      )}

      <section className="card">
        <h2>Contact List</h2>
        <div className="cards-container">
          {loading ? (
            <p>Loading...</p>
          ) : contacts.length === 0 ? (
            <p>No contacts available</p>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id_contact} className="contact-card">
                <button
                  className="edit-icon-button"
                  onClick={() => handleEditContact(contact)}
                >
                  <img src="/edit.svg" alt="edit" className="icon-edit" />
                </button>

                <img
                  src={contact.photo_profile || "/avatar.png"}
                  alt={contact.name}
                  className={contact.is_favorite ? "avatar" : "avatarc"}
                />
                <div className="info">
                  <h3>{contact.name} {contact.last_name}</h3>
                  <p>{contact.email}</p>
                </div>

                <div className="actions">
                  {contact.is_favorite ? (
                    <button
                      className="remove"
                      onClick={() => handleToggleFavorite(contact.id_contact, true)}
                    >
                      <img src="/x.svg" className="iconx" alt="remove" />
                    </button>
                  ) : (
                    <button
                      className="favorite"
                      onClick={() => handleToggleFavorite(contact.id_contact, false)}
                    >
                      <img src="/favorite.svg" className="iconFavorite" alt="favorite" />
                    </button>
                  )}
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
    </>
  );
}