"use client";

import {
  removeFromFavorites,
  addToFavorites,
  getFourContactsFavorite,
  getNonFavoriteContactsByUserId,
} from "@/services/contactService";
import { useEffect, useState } from "react";
import NewContactModal from "./contacts/newContact";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/store";
import Paginator from "./paginator/page";

type Contact = {
  id_contact: string;
  name: string;
  last_name: string;
  email: string;
  photo_profile: string;
  is_favorite: boolean;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function Overview() {
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.auth.id);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    return () => window.removeEventListener('openNewContactModal', handleOpenModal);
  }, []);

  const fetchData = async (page: number = 1) => {
    if (!id) return;

    setLoading(true);
    try {
      const [favoritesData, contactsData] = await Promise.all([
        getFourContactsFavorite(id),
        getNonFavoriteContactsByUserId(id, page, 16)
      ]);
      setFavorites(favoritesData);
      setContacts(contactsData.contacts);
      setPagination(contactsData.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePageChange = (newPage: number) => {
    fetchData(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleRemoveFavorite = async (contactId: string) => {
    if (!id) return;
    try {
      await removeFromFavorites(id, contactId);

      // Recargar ambas listas para obtener el siguiente favorito si existe
      const [favoritesData, contactsData] = await Promise.all([
        getFourContactsFavorite(id),
        getNonFavoriteContactsByUserId(id, pagination.currentPage, 16)
      ]);
      setFavorites(favoritesData);
      setContacts(contactsData.contacts);
      setPagination(contactsData.pagination);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleAddFavorite = async (contactId: string) => {
    if (!id) return;
    try {
      await addToFavorites(id, contactId);

      // Recargar ambas listas sin cambiar de página
      const [favoritesData, contactsData] = await Promise.all([
        getFourContactsFavorite(id),
        getNonFavoriteContactsByUserId(id, pagination.currentPage, 16)
      ]);
      setFavorites(favoritesData);
      setContacts(contactsData.contacts);
      setPagination(contactsData.pagination);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleContactCreated = async () => {
    fetchData(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    dispatch(logout());
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
                    <img src="/x.svg" className="iconx" alt="remove" /> Remove
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
          {contacts.length === 0 ? (
            <p>No contacts available</p>
          ) : (
            contacts.map((contact) => (
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


        <Paginator
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </section>

      <footer className="footer">
        <button className="log-out" onClick={() => handleLogout()}>Log Out</button>
      </footer>
    </>
  );
}