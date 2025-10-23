"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import EditContactModal from "./editContact";
import NewContactModal from "./newContact";
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
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
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

  // Sincronizar contactos cuando cambian desde el servidor
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
    // Actualización optimista instantánea
    setLocalContacts(prev => 
      prev.map(c => 
        c.id_contact === contactId 
          ? { ...c, is_favorite: !isFavorite }
          : c
      )
    );

    // Ejecutar la actualización en segundo plano
    const result = await toggleFavorite(contactId, isFavorite);
    
    // Si falla, revertir al estado del servidor
    if (!result.success) {
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
    
    // Actualización optimista: eliminar visualmente de inmediato
    const contactToDelete = confirmDialog.contactId;
    setLocalContacts(prev => prev.filter(c => c.id_contact !== contactToDelete));
    setConfirmDialog({ isOpen: false, contactId: null, contactName: "" });

    // Ejecutar eliminación en segundo plano
    const result = await removeContact(contactToDelete);
    
    // Si falla, recargar desde el servidor
    if (!result.success) {
      fetchContacts(pagination.currentPage);
    }
  };

  const handleEditContact = (contact: Contact) => {
    // Cerrar modal de nuevo contacto si está abierto
    setIsNewModalOpen(false);
    
    setSelectedContact(contact);
    setIsEditModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenNewContact = () => {
    // Cerrar modal de edición si está abierto
    setIsEditModalOpen(false);
    setSelectedContact(null);
    
    setIsNewModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactUpdated = () => {
    // Después de editar, recargar para obtener datos actualizados
    fetchContacts(pagination.currentPage);
  };

  const handleContactCreated = () => {
    // Después de crear, recargar para obtener datos actualizados
    fetchContacts(pagination.currentPage);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedContact(null);
  };

  const handleCloseNewModal = () => {
    setIsNewModalOpen(false);
  };

  return (
    <>
      {id && (
        <>
          <EditContactModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            userId={id}
            contact={selectedContact}
            onContactUpdated={handleContactUpdated}
          />
        </>
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