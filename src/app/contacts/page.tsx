"use client";

import { getContacts } from "@/services/contactService";
import { useEffect, useState } from "react";

type Contacts = {
    id_contact: string;
    name: string;
    email: string;
    photo_profile: string;
    is_favorite: boolean;
}[];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contacts>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  // Get ID only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("id");
      setId(userId);
    }
  }, []);

  useEffect(() => {
    const fetchContacts = async () => { 
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getContacts(id);
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="card">
      <h2>Contact List</h2>
      <div className="cards-container">
        {contacts.length === 0 ? (
          <p>No contacts available</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id_contact} className="contact-card">
              <img
              
                src={contact.photo_profile || "/avatar.png"}
                alt={contact.name}
                className={contact.is_favorite ? "avatar" : "avatarc"}
              />
              <div className="info">
                <h3>{contact.name}</h3>
                <p>{contact.email}</p>
              </div>

              <div className="actions">
                {contact.is_favorite ? (
                  
                  <button className="remove">
                    <img src="/x.svg" className="iconx" alt="remove" />
                  </button>
                ) : (
                 <button className="favorite">
                    <img src="/favorite.svg" className="iconFavorite" />
                  </button>
                )}
                <button className="trash">
                  <img src="/trash.svg" className="iconTrash" alt="trash" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}