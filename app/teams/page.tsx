"use client";

import { useApp } from "@/context/AppDataContext";
import { Users, Mail } from "lucide-react";

export default function TeamsPage() {
    const { teams } = useApp();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Maintenance Teams</h1>
                <p className="text-slate-500">Manage specialized teams and technicians.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Team Name</th>
                            <th className="px-6 py-3 font-semibold">Team Members</th>
                            <th className="px-6 py-3 font-semibold">Company</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-3 font-medium text-slate-900">{team.name}</td>
                                <td className="px-6 py-3 text-slate-600">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {team.members.map((member) => (
                                            <img
                                                key={member.id}
                                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                                src={member.avatar}
                                                alt={member.name}
                                                title={member.name}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs ml-2 text-slate-400">
                                        {team.members.map(m => m.name).join(", ")}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-500">My Company (San Francisco)</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
