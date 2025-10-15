import API_URL, {handleResponse} from "./api";


const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Login 
export const userLogin = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  console.log("Response status:", response);
  return handleResponse(response);
};



// Register
export const userRegister = async (name: string, lastname: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, last_name: lastname, email, password }),
  });
  return handleResponse(response);
};

// getUserById - SÍ necesita token
export const getUserById = async (id_user: string) => {
  const response = await fetch(`${API_URL}/users/${id_user}`, {
    method: 'GET',
    headers: getHeaders(), // send to token
  });
  return handleResponse(response);
};