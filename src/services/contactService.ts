import API_URL, {handleResponse} from "./api";

export const getContacts = async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}/contacts`, {
        method: 'GET',
        headers: {  
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
};

export const getFavoriteContactsByUserId = async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}/contacts/favorites`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
};