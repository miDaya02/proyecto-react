// app/contacts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import EditContactModal from "./editContact";
import ConfirmDialog from "@/components/ConfirmDialog";
import Paginator from "../paginator/page";
import { Contact } from "@/types";

export default function Contacts() {
  const id = useAppSelector((state) => state.auth.id);
  const {
    contacts,
    pagination,
    loading,
    fetchContacts,
    toggleFavorite,
    removeContact,
  } = useContacts(id);
  
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const handlePageChange = (newPage: number) => {
    fetchContacts(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFavorite = async (
    contactId: string,
    isFavorite: boolean
  ) => {
    // Actualización optimista: actualiza el estado local inmediatamente
    setLocalContacts(prev => 
      prev.map(c => 
        c.id_contact === contactId 
          ? { ...c, is_favorite: !isFavorite }
          : c
      )
    );

    const result = await toggleFavorite(contactId, isFavorite);
    if (!result.success) {
      // Si falla, restaura el estado original
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
      // Si falla, recarga
      fetchContacts(pagination.currentPage);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactUpdated = () => {
    // Recarga solo cuando se edita (necesario para obtener cambios del servidor)
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
      <section className="card contacts-page">
        <h2>Contact List</h2>
        <div className="cards-container">
          {loading && localContacts.length === 0 ? (
            <p>Loading...</p>
          ) : localContacts.length === 0 ? (
            <p>No contacts available</p>
          ) : (
            localContacts.map((contact) => (
              <ContactCard
                key={contact.id_contact}
                contact={contact}
                onToggleFavorite={() =>
                  handleToggleFavorite(contact.id_contact, contact.is_favorite)
                }
                onDelete={() => handleDeleteClick(contact)}
                onEdit={() => handleEditContact(contact)}
                showEdit={true}
                showFavorite={true}
                showDelete={true}
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