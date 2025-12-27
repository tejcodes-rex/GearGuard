"use client";

import { useState } from "react";
import { useApp } from "@/context/AppDataContext";
import { Equipment } from "@/types";
import { Search, Filter, Warehouse, User, Monitor, Plus } from "lucide-react";
import Link from "next/link";

export default function EquipmentPage() {
    const { equipment } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [groupBy, setGroupBy] = useState<"none" | "department" | "assignedTo">("none");

    const filteredEquipment = equipment.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedEquipment = () => {
        if (groupBy === "none") return { "All Equipment": filteredEquipment };

        return filteredEquipment.reduce((acc, item) => {
            const key = groupBy === "department" ? item.department : (item.assignedTo || "Unassigned");
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, Equipment[]>);
    };

    const groups = groupedEquipment();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Equipment</h1>
                    <p className="text-slate-500">Manage assets and track assignments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                        <Plus className="h-4 w-4" /> New
                    </button>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search equipment..."
                            className="h-10 w-64 rounded-lg border border-slate-200 pl-9 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
                        <button
                            onClick={() => setGroupBy("none")}
                            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${groupBy === "none" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setGroupBy("department")}
                            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors ${groupBy === "department" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <Warehouse className="h-3.5 w-3.5" />
                            Dept
                        </button>
                        <button
                            onClick={() => setGroupBy("assignedTo")}
                            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors ${groupBy === "assignedTo" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <User className="h-3.5 w-3.5" />
                            Employee
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {Object.entries(groups).map(([groupName, items]) => (
                    <div key={groupName}>
                        {groupBy !== "none" && (
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                                {groupName} <span className="text-sm font-normal text-slate-400">({items.length})</span>
                            </h2>
                        )}
                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Equipment Name</th>
                                        <th className="px-6 py-3 font-semibold">Employee</th>
                                        <th className="px-6 py-3 font-semibold">Department</th>
                                        <th className="px-6 py-3 font-semibold">Serial Number</th>
                                        <th className="px-6 py-3 font-semibold">Technician</th>
                                        <th className="px-6 py-3 font-semibold">Equipment Category</th>
                                        <th className="px-6 py-3 font-semibold">Company</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-900">
                                                <Link href={`/equipment/${item.id}`} className="hover:text-purple-600 hover:underline flex items-center gap-3">
                                                    <img src={item.image} className="w-8 h-8 rounded object-cover" alt="" />
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-3 text-slate-600">{item.assignedTo || "-"}</td>
                                            <td className="px-6 py-3 text-slate-600">{item.department}</td>
                                            <td className="px-6 py-3 text-slate-500 font-mono text-xs">{item.serialNumber}</td>
                                            <td className="px-6 py-3 text-slate-600">Mitchell Admin</td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-slate-500">My Company</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
