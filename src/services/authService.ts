import API_URL, {handleResponse} from "./api";

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

export const userRegister = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
    return handleResponse(response);
};

export const getUserById = async (id_user: string) => {
    const response = await fetch(`${API_URL}/users/${id_user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
}