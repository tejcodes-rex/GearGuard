"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppDataContext";
import { Wrench, Calendar, MapPin, ShieldCheck, User, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EquipmentDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getEquipmentById, getTeamById, requests, updateEquipment } = useApp();

    const equipment = getEquipmentById(id as string);

    if (!equipment) {
        return <div className="p-8 text-center">Equipment not found</div>;
    }

    const team = getTeamById(equipment.teamId);
    const activeRequests = requests.filter(r => r.equipmentId === equipment.id && r.status !== 'Repaired' && r.status !== 'Scrap').length;
    const totalRequests = requests.filter(r => r.equipmentId === equipment.id).length;

    const handleScrap = () => {
        if (confirm("Are you sure you want to scrap this equipment? This will mark it as unusable.")) {
            updateEquipment(equipment.id, { status: "Scrap" });
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="rounded-full bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900">{equipment.name}</h1>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${equipment.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {equipment.status}
                        </span>
                    </div>
                    <p className="text-slate-500">{equipment.serialNumber}</p>
                </div>

                {/* SMART BUTTON */}
                <Link
                    href={`/maintenance/kanban?equipmentId=${equipment.id}`}
                    className="flex items-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all hover:border-purple-300 hover:shadow-md"
                >
                    <div className="bg-purple-50 px-3 py-2 text-purple-600">
                        <Wrench className="h-5 w-5" />
                    </div>
                    <div className="px-3 py-1 flex flex-col items-start min-w-[100px]">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Maintenance</span>
                        <span className="text-sm font-bold text-slate-900">{activeRequests} Active</span>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="relative h-64 w-full bg-slate-100">
                            <img src={equipment.image} alt={equipment.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">Technical Details</h3>
                            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase text-slate-400">Category</span>
                                    <p className="font-medium text-slate-900">{equipment.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase text-slate-400">Department</span>
                                    <p className="font-medium text-slate-900">{equipment.department}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase text-slate-400">Assigned Team</span>
                                    <p className="font-medium text-slate-900">{team?.name || 'Unassigned'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium uppercase text-slate-400">Location</span>
                                    <div className="flex items-center gap-1.5 text-slate-900">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        <span className="font-medium">{equipment.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Lifecycle</h3>
                        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <span className="text-xs font-medium uppercase text-slate-400">Purchase Date</span>
                                <div className="flex items-center gap-1.5 text-slate-900">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium">{equipment.purchaseDate}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-medium uppercase text-slate-400">Warranty Expiration</span>
                                <div className="flex items-center gap-1.5 text-slate-900">
                                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium">{equipment.warrantyExpiration}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-medium uppercase text-slate-400">Assigned Employee</span>
                                <div className="flex items-center gap-1.5 text-slate-900">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium">{equipment.assignedTo || 'None'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions / Stats */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Actions</h3>
                        <div className="space-y-3">
                            <Link
                                href={`/maintenance/kanban?create=true&equipmentId=${equipment.id}`}
                                className="block w-full rounded-lg bg-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
                            >
                                Request Maintenance
                            </Link>
                            {equipment.status === 'Active' && (
                                <button
                                    onClick={handleScrap}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Scrap Equipment
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Other Information</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Used By</span>
                                <span className="font-medium text-slate-900">{equipment.assignedTo || 'Mitchell Admin'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Company</span>
                                <span className="font-medium text-slate-900">My Company (San Francisco)</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Scrap Date</span>
                                <span className="font-medium text-slate-900">{equipment.status === 'Scrap' ? '12/27/2025' : '-'}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-slate-500">Work Center</span>
                                <span className="font-medium text-slate-900">Assembly Line 1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
