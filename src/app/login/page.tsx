"use client";

import { useState } from "react";
import { userLogin } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/store";
import Image from "next/image";

export default function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();
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
            
            localStorage.setItem("id", response.id);
            localStorage.setItem("token", response.token);
            dispatch(setCredentials({ id: response.id, token: response.token }));
            
            router.push("/contacts");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

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
                
                {error && <p style={{color: 'red'}}>{error}</p>}
                
                <form className="login-form" onSubmit={handleSubmit}>
                    
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
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Loading...' : 'Login'} 
                    </button>
                    
                    <Link href="/register" className="register">
                        Don't have an account? Register
                    </Link>
                </form>
            </section>
        </>
    );
}