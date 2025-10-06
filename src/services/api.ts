// URL base API
const NEXT_PUBLIC_API_URL = 'http://localhost:4000/api';

export default NEXT_PUBLIC_API_URL;
export const handleResponse = async (response: Response) => {
  
  // Si token expiró o es inválido
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error in API request');
  }

  return response.json();
};
