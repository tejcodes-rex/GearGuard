"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppDataContext";
import { WorkCenter } from "@/types";
import { ArrowLeft, Save, Factory } from "lucide-react";

export default function WorkCenterDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { workCenters, getWorkCenterById, updateWorkCenter } = useApp();
    const [isLoading, setIsLoading] = useState(true);
    const [workCenter, setWorkCenter] = useState<WorkCenter | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<WorkCenter>>({});

    useEffect(() => {
        const wc = getWorkCenterById(params.id);
        if (wc) {
            setWorkCenter(wc);
            setFormData(wc);
        }
        setIsLoading(false);
    }, [params.id, getWorkCenterById]);

    if (isLoading) return <div>Loading...</div>;
    if (!workCenter) return <div>Work Center not found</div>;

    const handleChange = (field: keyof WorkCenter, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (workCenter && workCenter.id) {
            updateWorkCenter(workCenter.id, formData);
        }
        router.back();
    };

    return (
        <div className="mx-auto max-w-4xl py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="rounded-full bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{workCenter.name}</h1>
                        <p className="text-sm text-slate-500">{workCenter.code}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
                >
                    <Save className="h-4 w-4" />
                    Save
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">General Information</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.name || ""}
                                    onChange={e => handleChange("name", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Code</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.code || ""}
                                    onChange={e => handleChange("code", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.location || ""}
                                    onChange={e => handleChange("location", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Tag</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.tag || ""}
                                    onChange={e => handleChange("tag", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">Performance Metrics</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Cost per Hour ($)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.costPerHour || 0}
                                    onChange={e => handleChange("costPerHour", parseFloat(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Capacity (Units/Hr)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.capacity || 0}
                                    onChange={e => handleChange("capacity", parseFloat(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Time Efficiency (%)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.timeEfficiency || 0}
                                    onChange={e => handleChange("timeEfficiency", parseFloat(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">OEE Target (%)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                    value={formData.oeeTarget || 0}
                                    onChange={e => handleChange("oeeTarget", parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-center p-8">
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 border-4 border-slate-100">
                                <Factory className="h-16 w-16 text-slate-400" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-slate-500">Work Center Image</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold uppercase text-slate-500 mb-4">Alternative Workcenters</h3>
                        <p className="text-sm text-slate-600 italic">No alternatives configured.</p>
                        <button className="mt-4 w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">
                            + Add Alternative
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
