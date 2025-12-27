"use client";

import { useApp } from "@/context/AppDataContext";
import { useParams, useRouter } from "next/navigation";
import {
    Settings,
    Calendar,
    MapPin,
    Tag,
    User,
    Wrench,
    ShieldCheck,
    Clock,
    ChevronLeft,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EquipmentDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getEquipmentById, requests, getTeamById } = useApp();

    const equipment = getEquipmentById(id as string);

    if (!equipment) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                <AlertTriangle className="h-12 w-12 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Equipment not found</h2>
                <button onClick={() => router.back()} className="mt-4 text-purple-600 font-medium hover:underline">Go Back</button>
            </div>
        );
    }

    const team = getTeamById(equipment.teamId);

    // Count open requests for this equipment (Smart Button logic)
    const equipmentRequests = requests.filter(r => r.equipmentId === equipment.id);
    const openRequestCount = equipmentRequests.filter(r => r.status !== 'Repaired' && r.status !== 'Scrap').length;

    return (
        <div className="flex flex-col">
            {/* Control Strip */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 leading-none">{equipment.name}</h1>
                        <span className="text-sm text-slate-500">{equipment.serialNumber}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Odoo Smart Button */}
                    <Link
                        href={`/maintenance/kanban?equipmentId=${equipment.id}`}
                        className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group shadow-sm"
                    >
                        <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Wrench className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 leading-none">{openRequestCount}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maintenance</span>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <Tag className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Category</p>
                                            <p className="text-lg font-medium text-slate-800">{equipment.category}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Default Technician</p>
                                            <p className="text-lg font-medium text-slate-800">{equipment.assignedTo || 'Mitchell Admin'}</p>
                                            <p className="text-xs text-slate-500">From Team: <span className="font-semibold">{team?.name || 'N/A'}</span></p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Location</p>
                                            <p className="text-lg font-medium text-slate-800">{equipment.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Purchase Date</p>
                                            <p className="text-lg font-medium text-slate-800">{new Date(equipment.purchaseDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Warranty Expiration</p>
                                            <p className="text-lg font-medium text-slate-800">{new Date(equipment.warrantyExpiration).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${equipment.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {equipment.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo & Additional */}
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <img
                            src={equipment.image}
                            alt={equipment.name}
                            className="w-full h-auto rounded-lg border border-slate-100"
                        />
                    </div>

                    <div className="bg-indigo-600 p-6 rounded-xl text-white shadow-lg overflow-hidden relative">
                        <Wrench className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
                        <h3 className="font-bold text-lg mb-2">Technical Specs</h3>
                        <p className="text-indigo-100 text-sm opacity-80">
                            Centralize all maintenance logs and technical documentation for this asset.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
