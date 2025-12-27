"use client";

import { useApp } from "@/context/AppDataContext";
import { Plus, Search, Archive } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WorkCentersPage() {
    const { workCenters } = useApp();
    const [search, setSearch] = useState("");

    const filtered = workCenters.filter(wc =>
        wc.name.toLowerCase().includes(search.toLowerCase()) ||
        wc.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Work Centers</h1>
                <button
                    disabled
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
                    title="Create disabled for hackathon demo (mock data only)"
                >
                    <Plus className="h-4 w-4" />
                    New
                </button>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search work centers..."
                        className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Work Center</th>
                                <th className="px-6 py-3 font-medium">Code</th>
                                <th className="px-6 py-3 font-medium">Tag</th>
                                <th className="px-6 py-3 font-medium">Alternative Workcenters</th>
                                <th className="px-6 py-3 font-medium">Cost per hour</th>
                                <th className="px-6 py-3 font-medium">Capacity</th>
                                <th className="px-6 py-3 font-medium">Time Efficiency</th>
                                <th className="px-6 py-3 font-medium">OEE Target</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((wc) => (
                                <tr key={wc.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-slate-900">
                                        <Link href={`/work-centers/${wc.id}`} className="hover:text-purple-600 hover:underline">
                                            {wc.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">{wc.code}</td>
                                    <td className="px-6 py-3 text-slate-600">{wc.tag || "-"}</td>
                                    <td className="px-6 py-3 text-slate-600">-</td>
                                    <td className="px-6 py-3 text-slate-600">${wc.costPerHour.toFixed(2)}</td>
                                    <td className="px-6 py-3 text-slate-600">{wc.capacity}</td>
                                    <td className="px-6 py-3 text-slate-600">{wc.timeEfficiency}%</td>
                                    <td className="px-6 py-3 text-slate-600">{wc.oeeTarget}%</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No work centers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
