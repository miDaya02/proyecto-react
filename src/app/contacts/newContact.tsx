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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  const { values, handleChange, reset } = useForm({
    name: "",
    last_name: "",
    photo_profile: "",
    email: "",
    isfavorite: false,
  });

  // Notificar cuando este modal se abre
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('newModalOpened'));
    }
  }, [isOpen]);

  // Cerrar este modal si se abre el modal EDIT
  useEffect(() => {
    const handleEditModalOpen = () => {
      if (isOpen) {
        onClose();
      }
    };

    window.addEventListener('editModalOpened', handleEditModalOpen);
    return () => window.removeEventListener('editModalOpened', handleEditModalOpen);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (previousPathname.current !== pathname && isOpen) {
      onClose();
    }
    previousPathname.current = pathname;
  }, [pathname, isOpen, onClose]);

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Si hay archivo, enviarlo como FormData
    if (selectedFile) {
      const formData = new FormData();
      formData.append('photo_profile', selectedFile);
      formData.append('name', values.name);
      formData.append('last_name', values.last_name);
      formData.append('email', values.email);
      formData.append('isfavorite', values.isfavorite.toString());

      const result = await addContact(formData);

      if (result.success) {
        reset();
        setSelectedFile(null);
        setPreviewUrl("");
        onContactCreated();
        onClose();
      }
    } else {
      // Si no hay archivo, enviar como JSON normal
      const result = await addContact(values);

      if (result.success) {
        reset();
        onContactCreated();
        onClose();
      }
    }

    setIsSubmitting(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
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
              minLength={2}
              maxLength={50}
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
              minLength={2}
              maxLength={50}
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
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
              title="Enter a valid email address (e.g., example@domain.com)"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="file-label">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </label>

            {previewUrl && (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="preview-image" />
                <button type="button" onClick={clearFile} className="clear-button">
                  Remove
                </button>
              </div>
            )}
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