"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import EditContactModal from "./editContact";
import ConfirmDialog from "@/components/ConfirmDialog";
import Paginator from "../paginator/page";
import LoadingScreen from "@/components/LoadingScreen";
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
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    contactId: string | null;
    contactName: string;
  }>({
    isOpen: false,
    contactId: null,
    contactName: "",
  });

  // ✅ Cargar contactos al montar
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (cancelled) return;
      
      await fetchContacts(1);
      
      // Esperar mínimo 1 segundo para el loading screen
      setTimeout(() => {
        if (!cancelled) {
          setIsInitialLoading(false);
        }
      }, 500);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [fetchContacts]);

  // ✅ Escuchar cuando se crea un contacto desde navbar
  useEffect(() => {
    const handleContactCreated = (e: CustomEvent) => {
      if (e.detail?.refresh) {
        fetchContacts(1);
      }
    };

    window.addEventListener('contactCreated', handleContactCreated as EventListener);
    return () => window.removeEventListener('contactCreated', handleContactCreated as EventListener);
  }, [fetchContacts]);

  const handlePageChange = (newPage: number) => {
    fetchContacts(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFavorite = async (contactId: string, isFavorite: boolean) => {
    await toggleFavorite(contactId, isFavorite);
    // toggleFavorite ya recarga automáticamente
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
    
    const contactToDelete = confirmDialog.contactId;
    setConfirmDialog({ isOpen: false, contactId: null, contactName: "" });
    
    await removeContact(contactToDelete);
    // removeContact ya recarga automáticamente
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactUpdated = () => {
    // editContact en el modal ya recarga automáticamente
    fetchContacts(pagination.currentPage);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedContact(null);
  };

  // Mostrar loading screen en carga inicial
  if (isInitialLoading) {
    return <LoadingScreen duration={500} />;
  }

  return (
    <>
      {id && (
        <EditContactModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
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
          {contacts.length === 0 ? (
            <p>No contacts available</p>
          ) : (
            contacts.map((contact) => (
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