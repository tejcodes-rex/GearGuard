import { useState } from "react";
import { useApp } from "@/context/AppDataContext";
import { User, Mail, Phone, Search } from "lucide-react";

export default function TeamsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.members.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Maintenance Teams</h1>
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search teams or members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                        <div key={team.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                                        {team.members.length} Members
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 flex-1">
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
                    ))
                ) : (
                    <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                        <span className="text-2xl mb-2">🔍</span>
                        <p>No teams or members found matching "{searchTerm}"</p>
                    </div>
                )}

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
