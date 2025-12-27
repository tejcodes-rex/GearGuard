"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Storing plain text for this mock/hackathon only
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [isInitialized, setIsInitialized] = useState(false);

    // Load user from session
    useEffect(() => {
        const storedUser = localStorage.getItem("gearguard_current_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsInitialized(true);
    }, []);

    const login = async (email: string, password: string) => {
        // delay for realism
        await new Promise(r => setTimeout(r, 500));

        const storedUsers = JSON.parse(localStorage.getItem("gearguard_users") || "[]");
        const foundUser = storedUsers.find((u: User) => u.email === email);

        if (!foundUser) {
            return { success: false, error: "Account not exist" };
        }

        if (foundUser.password !== password) {
            return { success: false, error: "Invalid Password" };
        }

        const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
        setUser(userData);
        localStorage.setItem("gearguard_current_user", JSON.stringify(userData));
        return { success: true };
    };

    const signup = async (name: string, email: string, password: string) => {
        await new Promise(r => setTimeout(r, 500));

        const storedUsers = JSON.parse(localStorage.getItem("gearguard_users") || "[]");

        if (storedUsers.some((u: User) => u.email === email)) {
            return { success: false, error: "Email ID already exists" };
        }

        const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, password };
        const updatedUsers = [...storedUsers, newUser];

        localStorage.setItem("gearguard_users", JSON.stringify(updatedUsers));

        // Auto login after signup? Screenshot says "Land to SignUp page and only portal user will be create". 
        // It implies we might redirect to login, but usually auto-login is better. 
        // I will redirect to login to match "create...database" instruction strictly.
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("gearguard_current_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
