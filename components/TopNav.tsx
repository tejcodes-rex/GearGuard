"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Search, Plus, Menu, X } from "lucide-react";

export function TopNav() {
    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [equipmentOpen, setEquipmentOpen] = useState(false);
    const [reportingOpen, setReportingOpen] = useState(false); // Kept for state consistency, though CSS hover used for desktop

    const { user, logout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);

    const isActive = (path: string) => pathname === path || pathname.startsWith(path);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className="flex flex-col bg-white border-b border-slate-200 sticky top-0 z-50">
            {/* Main Strip: Dark Background like Odoo */}
            <div className="flex items-center justify-between h-12 bg-slate-900 text-white px-4">
                <div className="flex items-center">
                    <button
                        className="md:hidden mr-4 text-slate-300 hover:text-white"
                        onClick={toggleMobileMenu}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    <Link href="/" className="mr-8 font-bold text-xl tracking-tight text-white/90 hover:text-white">
                        Maintenance
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 h-full">
                        <Link
                            href="/"
                            className={clsx(
                                "px-3 py-1.5 rounded-sm text-sm font-medium transition-colors hover:bg-slate-800",
                                pathname === "/" ? "bg-slate-800 text-white" : "text-slate-300"
                            )}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/maintenance/calendar"
                            className={clsx(
                                "px-3 py-1.5 rounded-sm text-sm font-medium transition-colors hover:bg-slate-800",
                                pathname === "/maintenance/calendar" ? "bg-slate-800 text-white" : "text-slate-300"
                            )}
                        >
                            Calendar
                        </Link>

                        {/* Equipment Dropdown */}
                        <div className="relative group h-full flex items-center">
                            <button
                                className={clsx(
                                    "flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors hover:bg-slate-800",
                                    isActive("/equipment") || isActive("/work-centers") ? "bg-slate-800 text-white" : "text-slate-300"
                                )}
                            >
                                Equipment <ChevronDown className="h-3 w-3" />
                            </button>
                            <div className="absolute left-0 top-full hidden w-48 bg-white text-slate-900 shadow-lg border border-slate-200 group-hover:block z-50">
                                <Link href="/work-centers" className="block px-4 py-2 text-sm hover:bg-slate-50">Workcenter</Link>
                                <Link href="/equipment" className="block px-4 py-2 text-sm hover:bg-slate-50">Machine & Tools</Link>
                            </div>
                        </div>

                        {/* Reporting Dropdown */}
                        <div className="relative group h-full flex items-center">
                            <button
                                className={clsx(
                                    "flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm font-medium transition-colors hover:bg-slate-800",
                                    isActive("/reports") ? "bg-slate-800 text-white" : "text-slate-300"
                                )}
                            >
                                Reporting <ChevronDown className="h-3 w-3" />
                            </button>
                            <div className="absolute left-0 top-full hidden w-48 bg-white text-slate-900 shadow-lg border border-slate-200 group-hover:block z-50">
                                <Link href="/reports" className="block px-4 py-2 text-sm hover:bg-slate-50">Maintenance Reports</Link>
                            </div>
                        </div>

                        <Link
                            href="/teams"
                            className={clsx(
                                "px-3 py-1.5 rounded-sm text-sm font-medium transition-colors hover:bg-slate-800",
                                pathname === "/teams" ? "bg-slate-800 text-white" : "text-slate-300"
                            )}
                        >
                            Teams
                        </Link>

                        <Link
                            href="/configuration/categories"
                            className={clsx(
                                "px-3 py-1.5 rounded-sm text-sm font-medium transition-colors hover:bg-slate-800",
                                pathname === "/configuration/categories" ? "bg-slate-800 text-white" : "text-slate-300"
                            )}
                        >
                            Configuration
                        </Link>
                    </nav>
                </div>

                <div className="ml-auto flex items-center h-full">
                    {/* User Profile Dropdown */}
                    <div className="relative h-full">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 px-3 h-full hover:bg-slate-800 transition-colors"
                        >
                            <span className="hidden md:inline text-sm text-slate-300">{user?.name || 'Mitchell Admin'}</span>
                            <img src="https://github.com/shadcn.png" className="w-7 h-7 rounded-full border border-slate-600 shadow-sm" alt="Avatar" />
                            <ChevronDown className={clsx("h-3 w-3 text-slate-400 transition-transform", profileOpen && "rotate-180")} />
                        </button>

                        {profileOpen && (
                            <>
                                {/* Overlay to close */}
                                <div className="fixed inset-0 z-[90]" onClick={() => setProfileOpen(false)}></div>
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-[100] animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900">{user?.name || 'Mitchell Admin'}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">My Profile</Link>
                                        <Link href="/maintenance/configuration" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Settings</Link>
                                    </div>
                                    <div className="border-t border-slate-100 pt-1">
                                        <button
                                            onClick={() => {
                                                setProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors outline-none"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-800 text-slate-300 py-2 px-4 space-y-2 border-t border-slate-700">
                    <Link href="/" className="block py-2 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <Link href="/maintenance/calendar" className="block py-2 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
                    <div className="py-2">
                        <div className="font-semibold text-slate-400 text-xs uppercase mb-1">Equipment</div>
                        <Link href="/work-centers" className="block pl-4 py-1 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Workcenter</Link>
                        <Link href="/equipment" className="block pl-4 py-1 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Machine & Tools</Link>
                    </div>
                    <Link href="/reports" className="block py-2 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Reporting</Link>
                    <Link href="/teams" className="block py-2 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Teams</Link>
                    <Link href="/configuration/categories" className="block py-2 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Configuration</Link>
                    <div className="border-t border-slate-700 mt-2 pt-2">
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="block w-full text-left py-2 text-red-400 font-bold hover:text-red-300 transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
