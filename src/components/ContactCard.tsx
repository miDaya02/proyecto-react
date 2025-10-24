import { Contact } from "@/types";
import { getImageUrl } from "@/utils/imageUtils";

type ContactCardProps = {
  contact: Contact;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  showEdit?: boolean;
  showFavorite?: boolean;
  showDelete?: boolean;
};

export default function ContactCard({
  contact,
  onToggleFavorite,
  onDelete,
  onEdit,
  showEdit = false,
  showFavorite = false,
  showDelete = false,
}: ContactCardProps) {
  const defaultAvatar = "/avatar.png";

  return (
    <div className="contact-card">
      {showEdit && onEdit && (
        <button
          className="edit-icon-button"
          onClick={onEdit}
          aria-label="Edit contact"
        >
          <img src="/edit.svg" alt="" className="icon-edit" />
        </button>
      )}

      <img
        src={getImageUrl(contact.photo_profile) || defaultAvatar}
        alt={`${contact.name} ${contact.last_name}`}
        className={contact.is_favorite ? "avatar" : "avatarc"}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultAvatar;
        }}
      />

      <div className="info">
        <h3>{contact.name} {contact.last_name}</h3>
        <p>{contact.email}</p>
      </div>

      <div className="actions">
        {showFavorite && onToggleFavorite && (
          contact.is_favorite ? (
            <button
              className="remove"
              onClick={onToggleFavorite}
              aria-label="Remove from favorites"
            >
              <img src="/x.svg" alt="" className="iconx" />
            </button>
          ) : (
            <button
              className="favorite"
              onClick={onToggleFavorite}
              aria-label="Add to favorites"
            >
              <img src="/favorite.svg" alt="" className="iconFavorite" />
            </button>
          )
        )}

        {showDelete && onDelete && (
          <button
            className="trash"
            onClick={onDelete}
            aria-label="Delete contact"
          >
            <img src="/trash.svg" alt="" className="iconTrash" />
          </button>
        )}
      </div>
    </div>
  );
}