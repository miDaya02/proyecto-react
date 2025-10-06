import API_URL, {handleResponse} from "./api";


const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const getContacts = async (idUser: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts`, {
    method: 'GET',
    headers: getHeaders(), 
  });
  return handleResponse(response);
};

export const getFavoriteContactsByUserId = async (idUser: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/favorites`, {
    method: 'GET',
    headers: getHeaders(), 
  });
  return handleResponse(response);
};

export const createContact = async (idUser: string, contactData: { name: string; last_name: string; photo_profile: string; email: string; isfavorite: boolean }) => {
  const response = await fetch(`${API_URL}/${idUser}/newContacts`, {
    method: 'POST', 
    headers: getHeaders(),
    body: JSON.stringify({
      id_user: idUser,  
      name: contactData.name,
      last_name: contactData.last_name,
      email: contactData.email,
      photo_profile: contactData.photo_profile,
      is_favorite: contactData.isfavorite  
    }),
  });
  return handleResponse(response);
};

export const removeFromFavorites = async (idUser: string, contactId: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}/remove-favorite`, {
    method: 'PUT',   
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const addToFavorites = async (idUser: string, contactId: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}/add-favorite`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const updateContact = async (idUser: string, contactId: string, contactData: { name?: string; last_name?: string; photo_profile?: string; email?: string; isfavorite?: boolean }) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      ...(contactData.name && { name: contactData.name }),
      ...(contactData.last_name && { last_name: contactData.last_name }),
      ...(contactData.email && { email: contactData.email }),
      ...(contactData.photo_profile && { photo_profile: contactData.photo_profile }),
      ...(contactData.isfavorite !== undefined && { is_favorite: contactData.isfavorite }),
    }),
  });
  return handleResponse(response);
};

export const deleteContact = async (idUser: string, contactId: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const getFiveContactsFavorite = async (idUser: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/five-favorites`, {
    method: 'GET',
    headers: getHeaders(), 
  });
  return handleResponse(response);
};

export const getFiveContactsNonFavorite = async (idUser: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/five-non-favorites`, {
    method: 'GET',
    headers: getHeaders(), 
  });
  return handleResponse(response);
};