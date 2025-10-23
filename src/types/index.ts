export type Contact = {
  id_contact: string;
  name: string;
  last_name: string;
  email: string;
  photo_profile: string | null;
  is_favorite: boolean;
};

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ContactFormData = {
  name: string;
  last_name: string;
  photo_profile: string;
  email: string;
  isfavorite: boolean;
};

export type AuthCredentials = {
  id: string;
  token: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type ContactsResponse = {
  contacts: Contact[];
  pagination: PaginationInfo;
};

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastMessage = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};