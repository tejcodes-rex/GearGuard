"use client";

import { useApp } from "@/context/AppDataContext";
import { BarChart3, PieChart } from "lucide-react";

export default function ReportsPage() {
    const { requests, teams, equipment } = useApp();

    // 1. Requests per Team
    const requestsPerTeam = teams.map(team => {
        const count = requests.filter(r => r.teamId === team.id).length;
        return { name: team.name, count };
    }).sort((a, b) => b.count - a.count);

    const maxTeamCount = Math.max(...requestsPerTeam.map(i => i.count), 1);

    // 2. Requests per Category
    const categories = Array.from(new Set(equipment.map(e => e.category)));
    const requestsPerCategory = categories.map(cat => {
        // Find all equipment in this category
        const eqIds = equipment.filter(e => e.category === cat).map(e => e.id);
        const count = requests.filter(r => eqIds.includes(r.equipmentId)).length;
        return { name: cat, count };
    }).sort((a, b) => b.count - a.count);

    const maxCatCount = Math.max(...requestsPerCategory.map(i => i.count), 1);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Analytics Reports</h1>
                <p className="text-slate-500">Advanced insights into maintenance operations.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Requests per Team */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <h2 className="text-lg font-bold text-slate-800">Requests per Team</h2>
                    </div>

                    <div className="space-y-4">
                        {requestsPerTeam.map((item) => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-700">{item.name}</span>
                                    <span className="text-slate-500">{item.count} Req</span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-purple-500 transition-all duration-1000"
                                        style={{ width: `${(item.count / maxTeamCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Requests per Category */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-800">Requests per Category</h2>
                    </div>

                    <div className="space-y-4">
                        {requestsPerCategory.map((item) => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-700">{item.name}</span>
                                    <span className="text-slate-500">{item.count} Req</span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                                        style={{ width: `${(item.count / maxCatCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Metrics Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="font-bold text-slate-900">Performance Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Metric</th>
                                <th className="px-6 py-3 font-semibold">Value</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="px-6 py-3 font-medium text-slate-900">Total Requests</td>
                                <td className="px-6 py-3 text-slate-600">{requests.length}</td>
                                <td className="px-6 py-3"><span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Healthy</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 font-medium text-slate-900">Avg Duration</td>
                                <td className="px-6 py-3 text-slate-600">
                                    {(requests.reduce((acc, r) => acc + (r.duration || 0), 0) / (requests.filter(r => r.status === 'Repaired').length || 1)).toFixed(1)} hrs
                                </td>
                                <td className="px-6 py-3"><span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">Optimal</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-3 font-medium text-slate-900">Scrap Rate</td>
                                <td className="px-6 py-3 text-slate-600">
                                    {((requests.filter(r => r.status === 'Scrap').length / requests.length) * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-3"><span className="inline-flex rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">Monitor</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
