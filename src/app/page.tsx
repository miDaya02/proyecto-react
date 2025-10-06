"use client";

import {
  getFavoriteContactsByUserId,
  removeFromFavorites,
  addToFavorites,
  getFiveContactsFavorite,
  getFiveContactsNonFavorite,
} from "@/services/contactService";
import { useEffect, useState } from "react";
import NewContactModal from "./contacts/newContact";
import { useRouter } from "next/navigation";

type Contact = {
  id_contact: string;
  name: string;
  last_name: string;
  email: string;
  photo_profile: string;
  is_favorite: boolean;
};

export default function Overview() {
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("id");
      setId(userId);
    }
  }, []);

  // Escuchar evento del navbar
  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openNewContactModal', handleOpenModal);
    return () => window.removeEventListener('openNewContactModal', handleOpenModal);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const [favoritesData, contactsData] = await Promise.all([
          getFiveContactsFavorite(id),
          getFiveContactsNonFavorite(id)
        ]);
        setFavorites(favoritesData);
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRemoveFavorite = async (contactId: string) => {
    if (!id) return;
    try {
      await removeFromFavorites(id, contactId);
      setFavorites(favorites.filter(c => c.id_contact !== contactId));
      setContacts(contacts.map(c =>
        c.id_contact === contactId ? { ...c, is_favorite: false } : c
      ));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleAddFavorite = async (contactId: string) => {
    if (!id) return;
    try {
      await addToFavorites(id, contactId);
      const updatedContacts = contacts.map(c =>
        c.id_contact === contactId ? { ...c, is_favorite: true } : c
      );
      setContacts(updatedContacts);
      const newFavorite = updatedContacts.find(c => c.id_contact === contactId);
      if (newFavorite && !favorites.some(f => f.id_contact === contactId)) {
        setFavorites([...favorites, newFavorite]);
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleContactCreated = async () => {
    if (!id) return;
    try {
      const [favoritesData, contactsData] = await Promise.all([
        getFavoriteContactsByUserId(id),
        getFiveContactsNonFavorite(id)
      ]);
      setFavorites(favoritesData);
      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
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
              <div key={contact.id_contact} className="contact-card">
                <img src={contact.photo_profile || "/avatar.png"} alt={contact.name} className="avatar" />
                <div className="info">
                  <h3>{contact.name} {contact.last_name}</h3>
                  <p>{contact.email}</p>
                </div>
                <div className="actions">
                  <button className="remove" onClick={() => handleRemoveFavorite(contact.id_contact)}>
                    <img src="/x.svg" className="iconx" alt="remove" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card">
        <h2>Contact List</h2>
        <div className="cards-container">
          {contacts.filter(c => !c.is_favorite).length === 0 ? (
            <p>No contacts available</p>
          ) : (
            contacts.filter(c => !c.is_favorite).map((contact) => (
              <div key={contact.id_contact} className="contact-card">
                <img src={contact.photo_profile || "/avatar.png"} alt={contact.name} className="avatarc" />
                <div className="info">
                  <h3>{contact.name} {contact.last_name}</h3>
                  <p>{contact.email}</p>
                </div>
                <div className="actions">
                  <button className="favorite" onClick={() => handleAddFavorite(contact.id_contact)}>
                    <img src="/favorite.svg" className="iconFavorite" alt="favorite" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </section>
      <footer className="footer">
        <button className="log-out" onClick={() => handleLogout()}>Log Out
        </button>
      </footer>
    </>
  );
}