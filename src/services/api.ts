// URL base API
const NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';

export default NEXT_PUBLIC_API_URL;

// Function to handle API responses
export const handleResponse = async (response: Response) => {
  // If the response is not ok, throw an error
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error in API request');
  }

  // If the response is ok, return the JSON data
  return response.json();
};