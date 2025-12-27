"use client";

import { AppProvider } from "@/context/AppDataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { ToastProvider } from "@/components/Toast";

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const publicPaths = ["/login", "/signup"];

    useEffect(() => {
        // Basic protection: if not logged in and not on public path, redirect
        // We check localStorage directly here to avoid flickers on refresh before context hydrates
        // But since context does it, let's look at isAuthenticated

        // Actually, context hydration takes a split second. 
        // Ideally we show a loading spinner if auth state is unknown. 
        // maximizing simplicity for hackathon: check null user on non-public pages.

        if (!isAuthenticated && !publicPaths.includes(pathname)) {
            // Double check local storage to prevent false redirect on refresh
            const stored = localStorage.getItem("gearguard_current_user");
            if (!stored) {
                router.push("/login");
            }
        }

        if (isAuthenticated && publicPaths.includes(pathname)) {
            router.push("/");
        }
    }, [isAuthenticated, pathname, router]);

    if (publicPaths.includes(pathname)) {
        return <>{children}</>;
    }

    // If not public, show sidebar layout
    // Prevent flash of content if not authenticated
    // SAFE GUARD: Check window before localStorage to avoid SSR error
    if (typeof window !== 'undefined' && !isAuthenticated && !localStorage.getItem("gearguard_current_user")) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <TopNav />
            <main className="flex-1 bg-slate-50/50 p-6 md:p-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider>
                <AppProvider>
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </AppProvider>
            </ToastProvider>
        </AuthProvider>
    );
}
