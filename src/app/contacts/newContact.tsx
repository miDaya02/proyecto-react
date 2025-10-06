"use client";

import { useState } from "react";
import { createContact } from "@/services/contactService";

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
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    photo_profile: "",
    email: "",
    isfavorite: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Sending data:", formData); // Debug log
      await createContact(userId, formData);
      
      setFormData({
        name: "",
        last_name: "",
        photo_profile: "",
        email: "",
        isfavorite: false,
      });
      onContactCreated();
      onClose();
    } catch (error: any) {
      console.error("Error creating contact:", error);
      const errorMessage = error.message || "Error creating contact. Please try again.";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={`inline-form-container ${isOpen ? 'open' : ''}`}>
      <div className="inline-form-content">
        <div className="form-header">
          <button className="form-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {error && (
          <div style={{ 
            padding: "10px", 
            margin: "10px 0", 
            backgroundColor: "#fee", 
            color: "#c00",
            borderRadius: "4px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
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
              value={formData.last_name}
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
              value={formData.email}
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
              value={formData.photo_profile}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isfavorite"
                checked={formData.isfavorite}
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