// app/login/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";

export default function Login() {
  const { login, loading } = useAuth();
  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
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