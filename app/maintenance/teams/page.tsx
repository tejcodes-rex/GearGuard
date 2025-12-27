"use client";

import { useApp } from "@/context/AppDataContext";
import { User, Mail, Phone } from "lucide-react";

export default function TeamsPage() {
    const { teams } = useApp();

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Maintenance Teams</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div key={team.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {team.members.length} Members
                                </span>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {team.members.map(member => (
                                <div key={member.id} className="flex items-center gap-3">
                                    <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full border border-slate-200" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Mock 'Internal Maintenance' Team if empty */}
                {teams.length === 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Internal Maintenance</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Mitchell Admin</p>
                                <p className="text-xs text-slate-500">Manager</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
