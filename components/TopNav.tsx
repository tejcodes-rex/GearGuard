"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";
import { ChevronDown, Search, Plus, Menu, X } from "lucide-react";

export function TopNav() {
    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [equipmentOpen, setEquipmentOpen] = useState(false);
    const [reportingOpen, setReportingOpen] = useState(false); // Kept for state consistency, though CSS hover used for desktop

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

                <div className="ml-auto flex items-center gap-4">
                    <span className="hidden md:inline text-sm text-slate-300">Mitchell Admin</span>
                    <img src="https://github.com/shadcn.png" className="w-8 h-8 rounded-full border border-slate-600" />
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
                </div>
            )}

            {/* Sub Header (Contextual) - Only on Dashboard for now as per req "Search Bar... centered" */}
            {pathname === "/" && (
                <div className="px-4 py-3 bg-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full md:w-auto flex justify-between md:justify-start">
                        <Link href="/maintenance/requests/new" className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700">
                            <Plus className="h-4 w-4" /> New
                        </Link>
                    </div>

                    <div className="flex-1 w-full md:max-w-2xl mx-auto relative md:px-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-[100px]"></div> {/* Spacer for center alignment */}
                </div>
            )}
        </div>
    );
}
