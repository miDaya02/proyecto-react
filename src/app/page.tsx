"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import NewContactModal from "./contacts/newContact";
import LoadingScreen from "@/components/LoadingScreen";

export default function Overview() {
  const id = useAppSelector((state) => state.auth.id);
  const { logout } = useAuth();
  
  const {
    contacts,
    favorites,
    fetchNonFavorites,
    fetchTopFavorites,
    toggleFavorite,
  } = useContacts(id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (cancelled) return;
      
      await fetchTopFavorites();
      if (cancelled) return;
      
      await fetchNonFavorites();
      if (cancelled) return;
      
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
  }, [fetchNonFavorites, fetchTopFavorites]);

  useEffect(() => {
    const handleContactCreated = async () => {
      await fetchTopFavorites();
      fetchNonFavorites(1);
    };

    window.addEventListener('contactCreated', handleContactCreated);
    return () => window.removeEventListener('contactCreated', handleContactCreated);
  }, [fetchTopFavorites, fetchNonFavorites]);

  const handleRemoveFavorite = async (contactId: string) => {
    await toggleFavorite(contactId, true);
    await Promise.all([
      fetchTopFavorites(),
      fetchNonFavorites()
    ]);
  };

  const handleAddFavorite = async (contactId: string) => {
    await toggleFavorite(contactId, false);
    await Promise.all([
      fetchTopFavorites(),
      fetchNonFavorites()
    ]);
  };

  const handleContactCreated = async () => {
    await fetchTopFavorites();
    fetchNonFavorites(1);
  };

  // Mostrar loading screen en carga inicial
  if (isInitialLoading) {
    return <LoadingScreen duration={500} />;
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