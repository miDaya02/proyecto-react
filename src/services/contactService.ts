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

export const deleteContact = async (idUser: string, contactId: string) => {
  const response = await fetch(`${API_URL}/${idUser}/contacts/${contactId}/delete`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
};