// app/contacts/newContact.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useContacts } from "@/hooks/useContacts";
import { useForm } from "@/hooks/useForm";

type NewContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onContactCreated: () => void;
};

export default function NewContactModal({
  isOpen,
  onClose,
  userId,
  onContactCreated,
}: NewContactModalProps) {
  const { addContact } = useContacts(userId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  const { values, handleChange, reset } = useForm({
    name: "",
    last_name: "",
    photo_profile: "",
    email: "",
    isfavorite: false,
  });

  // Cerrar modal solo cuando la ruta cambie
  useEffect(() => {
    if (previousPathname.current !== pathname && isOpen) {
      onClose();
    }
    previousPathname.current = pathname;
  }, [pathname, isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await addContact(values);

    if (result.success) {
      reset();
      onContactCreated();
      onClose();
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className={`inline-form-container ${isOpen ? "open" : ""}`}>
      <div className="inline-form-content">
        <div className="form-header">
          <button
            className="form-close"
            onClick={onClose}
            type="button"
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              required
              className="form-input"
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
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="photo_profile"
              placeholder="Photo URL"
              value={values.photo_profile}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isfavorite"
                checked={values.isfavorite}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span>Enable like favorite</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "SAVING..." : "SAVE"}
          </button>
        </form>
      </div>
    </div>
  );
}