"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useContacts } from "@/hooks/useContacts";
import { useForm } from "@/hooks/useForm";
import { Contact } from "@/types";
import { getImageUrl } from "@/utils/imageUtils"; 

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const pathname = usePathname();

  const { values, handleChange, setValues } = useForm({
    name: "",
    last_name: "",
    photo_profile: "",
    email: "",
    isfavorite: false,
  });

  // Notificar cuando este modal se abre
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('editModalOpened'));
    }
  }, [isOpen]);

  // Cerrar este modal si se abre el modal NEW
  useEffect(() => {
    const handleNewModalOpen = () => {
      if (isOpen) {
        onClose();
      }
    };

    window.addEventListener('newModalOpened', handleNewModalOpen);
    return () => window.removeEventListener('newModalOpened', handleNewModalOpen);
  }, [isOpen, onClose]);

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

      // ✅ CORREGIDO: Usar getImageUrl en lugar de hardcodear URL
      if (contact.photo_profile) {
        setPreviewUrl(getImageUrl(contact.photo_profile));
      } else {
        setPreviewUrl("");
      }

      // Limpiar archivo seleccionado
      setSelectedFile(null);
    }
  }, [contact, setValues]);

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

  const clearFile = () => {
    setSelectedFile(null);
    // ✅ CORREGIDO: Usar getImageUrl aquí también
    if (contact?.photo_profile) {
      setPreviewUrl(getImageUrl(contact.photo_profile));
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setIsSubmitting(true);

    // Si hay un nuevo archivo seleccionado, enviarlo como FormData
    if (selectedFile) {
      const formData = new FormData();
      formData.append('photo_profile', selectedFile);
      formData.append('name', values.name);
      formData.append('last_name', values.last_name);
      formData.append('email', values.email);
      formData.append('is_favorite', values.isfavorite.toString());

      const result = await editContact(contact.id_contact, formData);

      if (result.success) {
        onContactUpdated();
        onClose();
      }
    } else {
      // Si no hay archivo nuevo, enviar como JSON
      const result = await editContact(contact.id_contact, values);

      if (result.success) {
        onContactUpdated();
        onClose();
      }
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
              pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
              title="Enter a valid email address"
              required
            />
          </div>

          <div className="form-group">
            <label className="file-label">
              Upload New Photo
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
                {selectedFile && (
                  <button type="button" onClick={clearFile} className="clear-button">
                    Remove New Photo
                  </button>
                )}
              </div>
            )}
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