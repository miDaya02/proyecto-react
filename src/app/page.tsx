"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import NewContactModal from "./contacts/newContact";
import { useState } from "react";

export default function Overview() {
  const id = useAppSelector((state) => state.auth.id);
  const { logout } = useAuth();
  
  // ✅ Todo viene de Redux
  const {
    contacts,
    favorites,
    loading,
    fetchNonFavorites,
    fetchTopFavorites,
    toggleFavorite,
  } = useContacts(id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Cargar datos iniciales
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (cancelled) return;
      await fetchTopFavorites();
      if (cancelled) return;
      fetchNonFavorites();
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [fetchNonFavorites, fetchTopFavorites]);

  // ✅ Escuchar evento de contacto creado desde navbar
  useEffect(() => {
    const handleContactCreated = async () => {
      await fetchTopFavorites();
      fetchNonFavorites(1);
    };

    window.addEventListener('contactCreated', handleContactCreated);
    return () => window.removeEventListener('contactCreated', handleContactCreated);
  }, [fetchTopFavorites, fetchNonFavorites]);

  // ✅ Simplificado
  const handleRemoveFavorite = async (contactId: string) => {
    await toggleFavorite(contactId, true);
    // Redux actualiza automáticamente
    await fetchTopFavorites(); // Recargar top 4
    fetchNonFavorites(); // Recargar lista
  };

  const handleAddFavorite = async (contactId: string) => {
    await toggleFavorite(contactId, false);
    // Redux actualiza automáticamente
    await fetchTopFavorites(); // Recargar top 4
    fetchNonFavorites(); // Recargar lista
  };

  const handleContactCreated = async () => {
    await fetchTopFavorites();
    fetchNonFavorites(1);
  };

  if (loading && favorites.length === 0 && contacts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
    );
  }

  return (
    <>
      {id && (
        <NewContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={id}
          onContactCreated={handleContactCreated}
        />
      )}

      <section className="card">
        <h2>Favorites</h2>
        <div className="cards-container">
          {favorites.length === 0 ? (
            <p>There are no favorite contacts</p>
          ) : (
            favorites.map((contact) => (
              <ContactCard
                key={contact.id_contact}
                contact={contact}
                onToggleFavorite={() =>
                  handleRemoveFavorite(contact.id_contact)
                }
                showEdit={false}
                showFavorite={true}
                showDelete={false}
              />
            ))
          )}
        </div>
      </section>

      <section className="card">
        <h2>Contact List</h2>
        <div className="cards-container">
          {contacts.length === 0 ? (
            <p>No contacts available</p>
          ) : (
            contacts.slice(0, 12).map((contact) => (
              <ContactCard
                key={contact.id_contact}
                contact={contact}
                onToggleFavorite={() => handleAddFavorite(contact.id_contact)}
                showEdit={false}
                showFavorite={true}
                showDelete={false}
              />
            ))
          )}
        </div>
      </section>

      <footer className="footer">
        <button className="log-out" onClick={logout}>
          Log Out
        </button>
      </footer>
    </>
  );
}