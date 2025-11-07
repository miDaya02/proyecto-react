"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { isValidEmail } from "@/services/authService";

export default function Login() {
  const { login, loading } = useAuth();
  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(values.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await login(values.email, values.password);
  };

  return (
    <>
      <div className="background"></div>
      <section className="login-card">
        <Image
          src="/logo.png"
          alt="Globant"
          width={150}
          height={50}
          className="logo-login"
          priority
        />

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              disabled={loading}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              disabled={loading}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

          <Link href="/register" className="register">
            Don&apos;t have an account? Register
          </Link>
        </form>
      </section>
    </>
  );
}