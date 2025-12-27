"use client";

import { Settings, Users, Database, Shield, FileText } from "lucide-react";

export default function ConfigurationPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Configuration</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition">
                            <Settings className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">General Settings</h3>
                    </div>
                    <p className="text-sm text-slate-500">Configure company info, units of measure, and default values.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Maintenance Teams</h3>
                    </div>
                    <p className="text-sm text-slate-500">Manage internal teams, members, and roles.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Equipment Categories</h3>
                    </div>
                    <p className="text-sm text-slate-500">Define equipment types, properties, and standard tags.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Work Center Stages</h3>
                    </div>
                    <p className="text-sm text-slate-500">Customize Kanban stages and workflow rules.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-100 group-hover:text-purple-600 transition">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Report Templates</h3>
                    </div>
                    <p className="text-sm text-slate-500">Edit PDF report layouts and email templates.</p>
                </div>

            </div>
        </div>
    );
}
