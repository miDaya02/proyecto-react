"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userRegister } from "@/services/authService";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/store";
import Image from "next/image";


export default function Register() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await userRegister(firstName, lastName, email, password);

            console.log("Registration successful");

            localStorage.setItem("id", response.id);
            localStorage.setItem("token", response.token);
            dispatch(setCredentials({ id: response.id, token: response.token }));

            router.push("/contacts");

        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
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

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form className="login-form" onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Register'}
                    </button>

                    <Link href="/login" className="register">
                        Already have an account? Login
                    </Link>
                </form>
            </section>
        </>
    );
}