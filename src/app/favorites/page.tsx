// app/favorites/page.tsx
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
  const {
    contacts,
    pagination,
    loading,
    fetchFavorites,
    toggleFavorite,
    removeContact,
  } = useContacts(id);

  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
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

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const handlePageChange = (newPage: number) => {
    fetchFavorites(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveFavorite = async (contactId: string) => {
    // Actualización optimista: remueve visualmente antes de confirmar
    setLocalContacts(prev => prev.filter(c => c.id_contact !== contactId));
    
    const result = await toggleFavorite(contactId, true);
    if (!result.success) {
      // Si falla, restaura el estado
      setLocalContacts(contacts);
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setConfirmDialog({
      isOpen: true,
      contactId: contact.id_contact,
      contactName: `${contact.name} ${contact.last_name}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.contactId) return;

    // Actualización optimista
    setLocalContacts(prev => prev.filter(c => c.id_contact !== confirmDialog.contactId));
    setConfirmDialog({ isOpen: false, contactId: null, contactName: "" });

    const result = await removeContact(confirmDialog.contactId);
    if (!result.success) {
      // Si falla, recarga los datos
      fetchFavorites(pagination.currentPage);
    }
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
          {loading && localContacts.length === 0 ? (
            <p>Loading...</p>
          ) : localContacts.length === 0 ? (
            <p>There are no favorite contacts</p>
          ) : (
            localContacts.map((contact) => (
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