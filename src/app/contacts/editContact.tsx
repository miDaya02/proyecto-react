"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { updateContact } from "@/services/contactService";

type Contact = {
  id_contact: string;
  name: string;
  last_name: string;
  email: string;
  photo_profile: string | null;  // Ahora acepta null explícitamente
  is_favorite: boolean;
};

type EditContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  contact: Contact | null;
  onContactUpdated: () => void;
};

export default function EditContactModal({
  isOpen,
  onClose,
  userId,
  contact,
  onContactUpdated,
}: EditContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    photo_profile: "",
    email: "",
    isfavorite: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  // Cerrar modal automáticamente al cambiar de ruta
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // Cargar datos del contacto cuando cambie - CORREGIDO
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        last_name: contact.last_name || "",
        photo_profile: contact.photo_profile || "",  // Convierte null a string vacío
        email: contact.email || "",
        isfavorite: contact.is_favorite || false,
      });
    }
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setIsSubmitting(true);
    try {
      await updateContact(userId, contact.id_contact, formData);
      onContactUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div
      className={`inline-form-container ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div
        className="inline-form-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-header">
          <button className="form-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="text"
              name="photo_profile"
              placeholder="Photo URL"
              value={formData.photo_profile}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                className="checkbox-input"
                type="checkbox"
                name="isfavorite"
                checked={formData.isfavorite}
                onChange={handleChange}
              />
              Enable like favorite
            </label>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "UPDATING..." : "UPDATE"}
          </button>
        </form>
      </div>
    </div>
  );
}