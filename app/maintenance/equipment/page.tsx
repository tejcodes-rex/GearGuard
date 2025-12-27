"use client";

import { useState } from "react";
import { useApp } from "@/context/AppDataContext";
import { Search, Filter, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function EquipmentPage() {
    const { equipment } = useApp();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEquipment = equipment.filter(eq =>
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Equipment</h1>
                <Link
                    href="/maintenance/equipment/new"
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                    <Plus className="h-4 w-4" /> New Equipment
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search equipment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Serial Number</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredEquipment.length > 0 ? (
                            filteredEquipment.map((eq) => (
                                <tr key={eq.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-3 font-medium text-slate-900">{eq.name}</td>
                                    <td className="px-6 py-3 text-slate-600">{eq.serialNumber}</td>
                                    <td className="px-6 py-3 text-slate-600">{eq.category}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${eq.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {eq.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">{eq.location}</td>
                                    <td className="px-6 py-3 text-right">
                                        <Link
                                            href={`/maintenance/equipment/${eq.id}`}
                                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded transition-colors inline-block"
                                            title="View Details"
                                        >
                                            <Settings className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                                    No equipment found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
