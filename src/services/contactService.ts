import API_URL, { handleResponse } from "./api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Obtener todos los contactos del usuario con paginación
export const getContacts = async (idUser: string, page: number = 1, limit: number = 16) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Obtener contactos favoritos
export const getFavoriteContactsByUserId = async (idUser: string, page: number = 1, limit: number = 16) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/favorites?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Obtener contactos NO favoritos
export const getNonFavoriteContactsByUserId = async (idUser: string, page: number = 1, limit: number = 16) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/non-favorites?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Obtener 4 contactos favoritos (para vista rápida)
export const getFourContactsFavorite = async (idUser: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/four-favorites`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Crear contacto (soporta FormData para archivos y JSON para URLs)
export const createContact = async (idUser: string, contactData: any) => {
  const isFormData = contactData instanceof FormData;
  
  console.log('📤 Enviando contacto:', { isFormData, idUser });
  
  if (isFormData) {
    // Si es FormData (archivo), agregar el id_user
    contactData.append('id_user', idUser);
    
    // Log para debug
    console.log('📦 FormData entries:');
    for (let pair of contactData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const response = await fetch(`${API_URL}/${idUser}/newContacts`, {
      method: 'POST',
      headers: getAuthHeaders(), // Solo auth, sin Content-Type
      body: contactData,
    });
    return handleResponse(response);
  } else {
    // Si es JSON normal (URL o sin foto)
    const payload = {
      id_user: idUser,
      name: contactData.name,
      last_name: contactData.last_name,
      email: contactData.email,
      photo_profile: contactData.photo_profile || null,
      is_favorite: contactData.isfavorite
    };
    
    console.log('📦 JSON payload:', payload);
    
    const response = await fetch(`${API_URL}/${idUser}/newContacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  }
};

// Actualizar contacto (soporta FormData y JSON)
export const updateContact = async (idUser: string, contactId: string, contactData: any) => {
  const isFormData = contactData instanceof FormData;
  
  if (isFormData) {
    // Si es FormData (nuevo archivo)
    const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Solo auth, sin Content-Type
      body: contactData,
    });
    return handleResponse(response);
  } else {
    // Si es JSON normal (sin archivo o con URL)
    const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        name: contactData.name,
        last_name: contactData.last_name,
        email: contactData.email,
        photo_profile: contactData.photo_profile,
        is_favorite: contactData.isfavorite,
      }),
    });
    return handleResponse(response);
  }
};

// Eliminar contacto
export const deleteContact = async (idUser: string, contactId: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Agregar a favoritos
export const addToFavorites = async (idUser: string, contactId: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}/add-favorite`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Remover de favoritos
export const removeFromFavorites = async (idUser: string, contactId: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}/remove-favorite`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  return handleResponse(response);
};