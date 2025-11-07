import API_URL, {handleResponse} from "./api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;
  return emailRegex.test(email);
};

// Validación de contraseña
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Validación de nombre
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

// Login 
export const userLogin = async (email: string, password: string) => {
  // Validaciones antes de hacer la petición
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  if (!isValidPassword(password)) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return handleResponse(response);
};

// Register
export const userRegister = async (name: string, lastname: string, email: string, password: string) => {
  // Validaciones antes de hacer la petición
  if (!isValidName(name)) {
    throw new Error('First name must be between 2 and 50 characters');
  }
  
  if (!isValidName(lastname)) {
    throw new Error('Last name must be between 2 and 50 characters');
  }
  
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  
  if (!isValidPassword(password)) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, last_name: lastname, email, password }),
  });
  return handleResponse(response);
};

// getUserById
export const getUserById = async (id_user: string) => {
  const response = await fetch(`${API_URL}/users/${id_user}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};