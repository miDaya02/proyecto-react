"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import Paginator from "../paginator/page";
import { Contact } from "@/types";

export default function Favorites() {
  const id = useAppSelector((state) => state.auth.id);
  
  // ✅ Todo viene de Redux (sin localContacts)
  const {
    contacts,
    pagination,
    loading,
    fetchFavorites,
    toggleFavorite,
    removeContact,
  } = useContacts(id);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    contactId: string | null;
    contactName: string;
  }>({
    isOpen: false,
    contactId: null,
    contactName: "",
  });

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // ✅ Escuchar evento de contacto creado desde navbar
  useEffect(() => {
    const handleContactCreated = () => {
      fetchFavorites(1);
    };

    window.addEventListener('contactCreated', handleContactCreated);
    return () => window.removeEventListener('contactCreated', handleContactCreated);
  }, [fetchFavorites]);

  const handlePageChange = (newPage: number) => {
    fetchFavorites(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Simplificado: Redux maneja todo
  const handleRemoveFavorite = async (contactId: string) => {
    await toggleFavorite(contactId, true);
  };

  const handleDeleteClick = (contact: Contact) => {
    setConfirmDialog({
      isOpen: true,
      contactId: contact.id_contact,
      contactName: `${contact.name} ${contact.last_name}`,
    });
  };

  // ✅ Simplificado: Redux maneja todo
  const handleConfirmDelete = async () => {
    if (!confirmDialog.contactId) return;

    const contactToDelete = confirmDialog.contactId;
    setConfirmDialog({ isOpen: false, contactId: null, contactName: "" });
    
    await removeContact(contactToDelete);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ isOpen: false, contactId: null, contactName: "" })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Contact"
        message={`Are you sure you want to delete ${confirmDialog.contactName}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <section className="card">
        <h2>Favorites</h2>
        <div className="cards-container">
          {loading && contacts.length === 0 ? (
            <p>Loading...</p>
          ) : contacts.length === 0 ? (
            <p>There are no favorite contacts</p>
          ) : (
            contacts.map((contact) => (
              <ContactCard
                key={contact.id_contact}
                contact={contact}
                onToggleFavorite={() => handleRemoveFavorite(contact.id_contact)}
                onDelete={() => handleDeleteClick(contact)}
                showEdit={false}
                showFavorite={true}
                showDelete={false}
              />
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