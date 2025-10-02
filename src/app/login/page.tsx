"use client";
import { useState } from "react";
import { userLogin } from "@/services/authService";
import { useRouter } from "next/navigation";

/*
interface LoginProps { 
    onLogin: () => void;
 }*/

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await userLogin(email, password);
            console.log("Login successful");
            if (response.id) {
                localStorage.setItem("id", response.id);
            }
            
            router.push("/contacts");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="login-card">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input type="email" placeholder="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'} </button>
            </form>
        </section>
    );

};
