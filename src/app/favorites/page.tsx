"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import Paginator from "../paginator/page";
import LoadingScreen from "@/components/LoadingScreen";
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

  // ✅ Cargar favoritos al montar
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (cancelled) return;
      
      await fetchFavorites(1);
      
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
  }, [fetchFavorites]);

  // ✅ Escuchar cuando se crea un contacto desde navbar
  useEffect(() => {
    const handleContactCreated = (e: CustomEvent) => {
      if (e.detail?.refresh) {
        fetchFavorites(1);
      }
    };

    window.addEventListener('contactCreated', handleContactCreated as EventListener);
    return () => window.removeEventListener('contactCreated', handleContactCreated as EventListener);
  }, [fetchFavorites]);

  const handlePageChange = (newPage: number) => {
    fetchFavorites(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveFavorite = async (contactId: string) => {
    await toggleFavorite(contactId, true);
    // toggleFavorite recargará automáticamente, pero como quitamos de favoritos
    // necesitamos recargar la lista de favoritos específicamente
    
    // Si solo queda 1 contacto en la página actual y no es la primera, ir a la anterior
    const shouldGoToPrevPage = 
      pagination.currentPage > 1 && 
      contacts.length === 1;
    
    const targetPage = shouldGoToPrevPage 
      ? pagination.currentPage - 1 
      : pagination.currentPage;
    
    await fetchFavorites(targetPage);
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
    
    // Si solo queda 1 contacto en la página actual y no es la primera, ir a la anterior
    const shouldGoToPrevPage = 
      pagination.currentPage > 1 && 
      contacts.length === 1;
    
    const targetPage = shouldGoToPrevPage 
      ? pagination.currentPage - 1 
      : pagination.currentPage;
    
    await fetchFavorites(targetPage);
  };

  // Mostrar loading screen en carga inicial
  if (isInitialLoading) {
    return <LoadingScreen duration={500} />;
  }

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
          {contacts.length === 0 ? (
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