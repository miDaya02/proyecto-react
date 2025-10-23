"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { useContacts } from "@/hooks/useContacts";
import ContactCard from "@/components/ContactCard";
import NewContactModal from "./contacts/newContact";
import { Contact } from "@/types";

export default function Overview() {
  const id = useAppSelector((state) => state.auth.id);
  const { logout } = useAuth();
  const {
    contacts,
    pagination,
    loading,
    fetchNonFavorites,
    fetchTopFavorites,
    toggleFavorite,
  } = useContacts(id);

  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const topFavs = await fetchTopFavorites();
      setFavorites(topFavs);
      fetchNonFavorites();
    };

    loadData();
  }, [fetchNonFavorites, fetchTopFavorites]);


  const handleRemoveFavorite = async (contactId: string) => {
    const result = await toggleFavorite(contactId, true);
    if (result.success) {
      const topFavs = await fetchTopFavorites();
      setFavorites(topFavs);
      fetchNonFavorites(pagination.currentPage);
    }
  };

  const handleAddFavorite = async (contactId: string) => {
    const result = await toggleFavorite(contactId, false);
    if (result.success) {
      const topFavs = await fetchTopFavorites();
      setFavorites(topFavs);
      fetchNonFavorites(pagination.currentPage);
    }
  };

  const handleContactCreated = async () => {
    const topFavs = await fetchTopFavorites();
    setFavorites(topFavs);
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