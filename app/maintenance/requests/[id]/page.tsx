"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppDataContext";
import { MaintenanceRequest, RequestStatus } from "@/types";
import { ArrowLeft, Save, ClipboardList, Plus } from "lucide-react";

const STAGES: RequestStatus[] = ["New", "In Progress", "Repaired", "Scrap"];

export default function RequestDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { requests, workCenters, equipment, teams, updateRequest } = useApp();

    const [request, setRequest] = useState<MaintenanceRequest | null>(null);
    const [formData, setFormData] = useState<Partial<MaintenanceRequest>>({});

    const isNew = id === 'new';

    // UI State for "Worksheet" Smart Button
    const [showWorksheet, setShowWorksheet] = useState(false);

    useEffect(() => {
        if (isNew) {
            // Initialize for creation
            setRequest({
                id: 'new',
                subject: 'New Request',
                maintenanceFor: 'equipment',
                teamId: '',
                status: 'New',
                type: 'Corrective',
                createdAt: new Date().toISOString(),
                priority: 'Normal'
            } as MaintenanceRequest);
            setFormData({
                subject: '',
                maintenanceFor: 'equipment',
                type: 'Corrective',
                status: 'New',
                priority: 'Normal'
            });
        } else {
            const found = requests.find(r => r.id === id);
            if (found) {
                setRequest(found);
                setFormData(found);
            }
        }
    }, [id, requests, isNew]);

    if (!request) return <div>Loading...</div>;

    // Handlers
    const handleStageClick = (stage: RequestStatus) => {
        if (isNew) {
            setFormData(prev => ({ ...prev, status: stage }));
            setRequest(prev => prev ? ({ ...prev, status: stage }) : null);
        } else {
            updateRequest(request.id, { status: stage });
        }
    };

    const handleChange = (field: keyof MaintenanceRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (!isNew) {
            updateRequest(request.id, { [field]: value });
        } else {
            // Just update local request state preview
            setRequest(prev => prev ? ({ ...prev, [field]: value }) : null);
        }
    };

    const handleSave = () => {
        // Validate & Create
        // This is a minimal implementation, in reality we'd pull all fields from formData
        // For hackathon, just log or rely on mocked state
        alert("Request Created (Mock)");
        router.push("/maintenance/kanban");
    };

    // Helper to get selected Work Center details
    const selectedWC = workCenters.find(wc => wc.id === formData.workCenterId);

    return (
        <div className="mx-auto max-w-6xl py-6 space-y-6">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="rounded-full bg-white p-2 text-slate-500 hover:bg-slate-100">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <nav className="flex items-center text-sm font-medium text-slate-500">
                        <span>Maintenance Requests</span>
                        <span className="mx-2">/</span>
                        <span className="text-purple-600">{isNew ? "New" : request.subject}</span>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    {isNew ? (
                        <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                            <Save className="h-4 w-4" /> Save
                        </button>
                    ) : (
                        <>
                            <span className="text-sm text-slate-500 mr-2">Maintenance Requests</span>
                            <a href="/maintenance/requests/new" className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                                <Plus className="h-4 w-4" /> New
                            </a>
                        </>
                    )}
                </div>
            </div>

            {/* Subject Header */}
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-500">Subject</span>
                <h1 className="text-3xl font-bold text-slate-900">{request.subject}</h1>
            </div>

            {/* Smart Button & Stages Row */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">

                    {/* Smart Button */}
                    <button
                        onClick={() => setShowWorksheet(!showWorksheet)}
                        className={`w-full md:w-auto flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-lg border transition-colors ${showWorksheet ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100'}`}
                    >
                        <ClipboardList className="h-5 w-5" />
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-xs font-bold uppercase">Worksheet</span>
                            <span className="text-xs opacity-70">Comments</span>
                        </div>
                    </button>

                    {/* Stages Widget */}
                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2 overflow-x-auto">
                        <div className="flex items-center w-full md:w-auto overflow-x-auto">
                            {STAGES.map((stage, idx) => {
                                const isActive = request.status === stage;
                                const isPast = STAGES.indexOf(request.status) > idx;

                                return (
                                    <button
                                        key={stage}
                                        onClick={() => handleStageClick(stage)}
                                        className={`
                                            whitespace-nowrap relative px-4 md:px-6 py-2 text-sm font-medium border-y border-r border-slate-200 first:border-l first:rounded-l-lg last:rounded-r-lg
                                            ${isActive ? 'bg-purple-600 text-white border-purple-600 z-10' : ''}
                                            ${isPast ? 'bg-purple-50 text-purple-700' : ''}
                                            ${!isActive && !isPast ? 'bg-slate-50 text-slate-600 hover:bg-slate-100' : ''}
                                        `}
                                    >
                                        {stage}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Separate Box for Kanban State Indicators */}
                <div className="flex items-center justify-end gap-4 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-sm font-medium text-slate-500">Kanban State:</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleChange('kanbanState', 'normal')}
                            className={`w-6 h-6 rounded-full border ring-offset-1 transition-all ${request.kanbanState === 'normal' || !request.kanbanState ? 'bg-white border-slate-400 ring-2 ring-slate-400' : 'bg-white border-slate-300 hover:border-slate-400'}`}
                            title="In Progress"
                        />
                        <button
                            onClick={() => handleChange('kanbanState', 'blocked')}
                            className={`w-6 h-6 rounded-full border ring-offset-1 transition-all ${request.kanbanState === 'blocked' ? 'bg-red-500 border-red-600 ring-2 ring-red-500' : 'bg-red-200 border-red-300 hover:bg-red-500'}`}
                            title="Blocked"
                        />
                        <button
                            onClick={() => handleChange('kanbanState', 'done')}
                            className={`w-6 h-6 rounded-full border ring-offset-1 transition-all ${request.kanbanState === 'done' ? 'bg-green-500 border-green-600 ring-2 ring-green-500' : 'bg-green-200 border-green-300 hover:bg-green-500'}`}
                            title="Ready for Next Stage"
                        />
                    </div>
                </div>
            </div>

            {/* Worksheet Section */}
            {showWorksheet && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 animate-in slide-in-from-top-2">
                    <h3 className="font-bold text-slate-900 mb-4">Worksheet & Comments</h3>
                    <div className="h-32 bg-white rounded border border-slate-200 p-4 text-slate-400 italic">
                        No worksheet entries yet.
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                {/* Left Column */}
                <div className="space-y-4">

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Created By</label>
                        <div className="col-span-2 text-sm text-slate-900">Mitchell Admin</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Maintenance For</label>
                        <select
                            className="col-span-2 rounded border border-slate-300 px-3 py-1.5 text-sm"
                            value={formData.maintenanceFor || 'equipment'}
                            onChange={e => handleChange('maintenanceFor', e.target.value)}
                        >
                            <option value="equipment">Equipment</option>
                            <option value="work_center">Work Center</option>
                        </select>
                    </div>

                    {formData.maintenanceFor === 'work_center' ? (
                        <>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-bold text-slate-700">Work Center</label>
                                <select
                                    className="col-span-2 rounded border border-slate-300 px-3 py-1.5 text-sm"
                                    value={formData.workCenterId || ''}
                                    onChange={e => handleChange('workCenterId', e.target.value)}
                                >
                                    <option value="">Select Work Center...</option>
                                    {workCenters.map(wc => <option key={wc.id} value={wc.id}>{wc.name}</option>)}
                                </select>
                            </div>
                            {selectedWC && (
                                <div className="col-span-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-1 mt-2 grid grid-cols-2 gap-x-4">
                                    <p><strong>Code:</strong> {selectedWC.code}</p>
                                    <p><strong>Tag:</strong> {selectedWC.tag || 'None'}</p>
                                    <p><strong>Alt Workcenters:</strong> {selectedWC.alternativeWorkcenters?.join(', ') || 'None'}</p>
                                    <p><strong>Cost/Hour:</strong> ${selectedWC.costPerHour}0</p>
                                    <p><strong>Capacity:</strong> {selectedWC.capacity}.00</p>
                                    <p><strong>Time Eff:</strong> {selectedWC.timeEfficiency}%</p>
                                    <p><strong>OEE Target:</strong> {selectedWC.oeeTarget}%</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label className="text-sm font-bold text-slate-700">Equipment</label>
                            <select
                                className="col-span-2 rounded border border-slate-300 px-3 py-1.5 text-sm"
                                value={formData.equipmentId || ''}
                                onChange={e => handleChange('equipmentId', e.target.value)}
                            >
                                <option value="">Select Equipment...</option>
                                {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Request Date</label>
                        <div className="col-span-2 text-sm text-slate-900">12/18/2025</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Maintenance Type</label>
                        <div className="col-span-2 flex gap-4">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={formData.type === 'Corrective'}
                                    onChange={() => handleChange('type', 'Corrective')}
                                /> Corrective
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={formData.type === 'Preventive'}
                                    onChange={() => handleChange('type', 'Preventive')}
                                /> Preventive
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Team</label>
                        <select
                            className="col-span-2 rounded border border-slate-300 px-3 py-1.5 text-sm"
                            value={formData.teamId || ''}
                            onChange={e => handleChange('teamId', e.target.value)}
                        >
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Technician</label>
                        <div className="col-span-2 text-sm text-slate-900">Mitchell Admin</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Scheduled Date</label>
                        <div className="col-span-2 text-sm text-slate-900">12/28/2025 14:30:00</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Duration</label>
                        <div className="col-span-2 flex items-center gap-2">
                            <input type="number" className="w-20 rounded border border-slate-300 px-2 py-1 text-sm" value="00" />
                            <span className="text-sm text-slate-500">hours</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Priority</label>
                        <div className="col-span-2 text-slate-400">◇ ◇ ◇</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Company</label>
                        <div className="col-span-2 text-sm text-slate-900">My Company (San Francisco)</div>
                    </div>
                </div>

                {/* Notes Section at Bottom */}
                <div className="col-span-1 md:col-span-2 mt-8 border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Notes</h3>
                    <textarea className="w-full h-24 rounded border border-slate-200 p-2 text-sm" placeholder="Add additional notes here..."></textarea>
                </div>
            </div>
        </div>
    );
}
