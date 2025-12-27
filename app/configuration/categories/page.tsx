"use client";

import { useState } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";

const INITIAL_CATEGORIES = [
    { id: "c1", name: "Computers", count: 12 },
    { id: "c2", name: "Software", count: 5 },
    { id: "c3", name: "Monitors", count: 8 },
    { id: "c4", name: "Industrial", count: 3 },
    { id: "c5", name: "Vehicles", count: 2 },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    // Mock Create
    const handleAdd = () => {
        const name = prompt("Enter new category name:");
        if (name) {
            setCategories([...categories, { id: Math.random().toString(), name, count: 0 }]);
        }
    };

    // Mock Delete
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Equipment Categories</h1>
                    <p className="text-slate-500">Define and manage equipment types.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    New Category
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Name</th>
                            <th className="px-6 py-3 font-semibold">Responsible</th>
                            <th className="px-6 py-3 font-semibold">Company</th>
                            <th className="px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="group hover:bg-slate-50/50">
                                <td className="px-6 py-3 font-medium text-slate-900">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                            <Tag className="h-4 w-4" />
                                        </div>
                                        {cat.name}
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-slate-600">OdooBot</td>
                                <td className="px-6 py-3 text-slate-500">My Company (San Francisco)</td>
                                <td className="px-6 py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
