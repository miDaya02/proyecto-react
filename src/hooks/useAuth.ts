// hooks/useAuth.ts
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCredentials, logout as logoutAction } from "@/redux/store";
import { userLogin, userRegister } from "@/services/authService";
import { useToast } from "./useToast";
import { useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id, token } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await userLogin(email, password);
      
      localStorage.setItem("id", response.id);
      localStorage.setItem("token", response.token);
      dispatch(setCredentials({ id: response.id, token: response.token }));
      
      showToast("Login successful", "success");
      router.push("/contacts");
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      showToast(errorMessage, "error");
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const response = await userRegister(firstName, lastName, email, password);

      localStorage.setItem("id", response.id);
      localStorage.setItem("token", response.token);
      dispatch(setCredentials({ id: response.id, token: response.token }));

      showToast("Registration successful", "success");
      router.push("/contacts");
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      showToast(errorMessage, "error");
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    dispatch(logoutAction());
    showToast("Logged out successfully", "info");
    router.push("/login");
  };

  return {
    id,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };
};