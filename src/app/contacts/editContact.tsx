// app/contacts/editContact.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useContacts } from "@/hooks/useContacts";
import { useForm } from "@/hooks/useForm";
import { Contact } from "@/types";

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
  const { editContact } = useContacts(userId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  const { values, handleChange, setValues } = useForm({
    name: "",
    last_name: "",
    photo_profile: "",
    email: "",
    isfavorite: false,
  });

  // Cerrar modal automáticamente al cambiar de ruta
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // Cargar datos del contacto cuando cambie
  useEffect(() => {
    if (contact) {
      setValues({
        name: contact.name || "",
        last_name: contact.last_name || "",
        photo_profile: contact.photo_profile || "",
        email: contact.email || "",
        isfavorite: contact.is_favorite || false,
      });
    }
  }, [contact, setValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setIsSubmitting(true);

    const result = await editContact(contact.id_contact, values);

    if (result.success) {
      onContactUpdated();
      onClose();
    }

    setIsSubmitting(false);
  };

  if (!isOpen || !contact) return null;

  return (
    <div
      className={`inline-form-container ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div className="inline-form-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <button
            className="form-close"
            onClick={onClose}
            aria-label="Close form"
          >
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
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={values.last_name}
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
              value={values.email}
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
              value={values.photo_profile}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                className="checkbox-input"
                type="checkbox"
                name="isfavorite"
                checked={values.isfavorite}
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