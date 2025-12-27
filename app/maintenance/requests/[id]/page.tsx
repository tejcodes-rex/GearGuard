"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppDataContext";
import { MaintenanceRequest, RequestStatus } from "@/types";
import { ArrowLeft, Save, ClipboardList, Plus, Star, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

const STAGES: RequestStatus[] = ["New", "In Progress", "Repaired", "Scrap"];

export default function RequestDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { requests, workCenters, equipment, teams, updateRequest, addRequest } = useApp();

    const [request, setRequest] = useState<MaintenanceRequest | null>(null);
    const [formData, setFormData] = useState<Partial<MaintenanceRequest>>({});

    const isNew = id === 'new';
    // Explicit Edit Workflow State
    const [isEditing, setIsEditing] = useState(isNew);
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    // UI State for "Worksheet" Smart Button
    const [showWorksheet, setShowWorksheet] = useState(false);

    useEffect(() => {
        setIsEditing(isNew);
    }, [isNew]);

    const handleDiscard = () => {
        if (isNew) {
            router.back();
        } else {
            setFormData(request || {});
            setErrors({});
            setIsEditing(false);
            showToast("Changes discarded", "success"); // Technically 'info' but success implies action completed
        }
    };

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
                priority: '0'
            } as MaintenanceRequest);
            setFormData({
                subject: '',
                maintenanceFor: 'equipment',
                type: 'Corrective',
                status: 'New',
                priority: '0'
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
        // Strict Mode: Cannot change stage unless in Edit Mode
        if (!isEditing) return;

        // Industry Grade: Safety Check for Destructive Actions
        if (stage === 'Scrap' && request?.status !== 'Scrap') {
            const confirmScrap = window.confirm("⚠️ Are you sure you want to SCRAP this equipment? This will permanently mark the equipment as active wreck/scrap.");
            if (!confirmScrap) return;
        }

        // Fix: Update local formData state instead of triggering immediate global update.
        // This prevents the useEffect from re-syncing and wiping other unsaved changes.
        setFormData(prev => ({ ...prev, status: stage }));
    };

    // In Explicit Save Mode, we ONLY update local state.
    // The context update happens ONLY on Save.
    // setFormData(prev => ({ ...prev, [field]: value }));
    // Correction: We still update formData state, but we DO NOT call updateRequest.
    // Correction: We still update formData state, but we DO NOT call updateRequest.

    const handleChange = (field: keyof MaintenanceRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Strict Validation
        const newErrors: Record<string, boolean> = {};
        if (!formData.subject?.trim()) newErrors.subject = true;
        if (!formData.teamId) newErrors.teamId = true;
        if (formData.maintenanceFor === 'equipment' && !formData.equipmentId) newErrors.equipmentId = true;
        if (formData.maintenanceFor === 'work_center' && !formData.workCenterId) newErrors.workCenterId = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast("Please fill in all required fields.", "error");
            return;
        }

        setIsSaving(true);

        // Mock API Latency
        setTimeout(() => {
            if (isNew) {
                // Ensure we strip ID and CreatedAt for new requests
                const { id, createdAt, ...newReqData } = formData;
                addRequest({
                    ...newReqData,
                    status: formData.status || 'New',
                    priority: formData.priority || '0',
                    maintenanceFor: formData.maintenanceFor || 'equipment'
                } as any);
            } else {
                updateRequest(request.id, {
                    ...formData,
                    status: formData.status || request.status,
                    priority: formData.priority || request.priority
                });
            }

            showToast(isNew ? "Request created successfully" : "Request updated successfully", "success");
            router.push("/maintenance/kanban");
            setIsSaving(false);
        }, 800);
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
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleDiscard}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Standard Actions when Viewing */}
                            <button
                                onClick={() => setIsEditing(true)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Edit
                            </button>
                            <a href="/maintenance/requests/new" className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-all shadow-sm hover:shadow active:scale-95">
                                <Plus className="h-4 w-4" /> New
                            </a>
                        </>
                    )}
                </div>
            </div>

            {/* Subject Header */}
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-500">Subject</span>
                <h1 className="text-3xl font-bold text-slate-900">
                    {isNew ? (
                        <input
                            type="text"
                            placeholder="e.g., Leaking Oil Pipe"
                            className={`w-full bg-transparent border-b-2 focus:outline-none ${errors.subject ? 'border-red-500 placeholder-red-300' : 'border-slate-200 focus:border-purple-600'}`}
                            value={formData.subject || ''}
                            onChange={e => {
                                handleChange('subject', e.target.value);
                                if (errors.subject) setErrors(prev => ({ ...prev, subject: false }));
                            }}
                            autoFocus
                        />
                    ) : (
                        request.subject
                    )}
                </h1>
            </div>

            {/* Smart Button & Stages Row */}
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

                {/* Stages & Kanban State */}
                <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">

                    {/* States Widget */}
                    <div className="flex items-center overflow-x-auto max-w-full">
                        {STAGES.map((stage, idx) => {
                            // Use local formData if editing, otherwise committed request status
                            const currentStatus = isEditing ? (formData.status || request.status) : request.status;
                            const isActive = currentStatus === stage;
                            const isPast = STAGES.indexOf(currentStatus) > idx;

                            return (
                                <button
                                    key={stage}
                                    onClick={() => handleStageClick(stage)}
                                    disabled={!isEditing}
                                    className={`
                                        whitespace-nowrap relative px-4 py-2 text-sm font-medium border-y border-r border-slate-200 first:border-l first:rounded-l-lg last:rounded-r-lg transition-all
                                        ${isActive ? 'bg-purple-600 text-white border-purple-600 z-10' : ''}
                                        ${isPast ? 'bg-purple-50 text-purple-700' : ''}
                                        ${!isActive && !isPast ? 'bg-slate-50 text-slate-600 hover:bg-slate-100' : ''}
                                        ${!isEditing ? 'opacity-60 cursor-not-allowed hover:bg-inherit' : 'cursor-pointer'}
                                    `}
                                >
                                    {stage}
                                </button>
                            );
                        })}
                    </div>

                    {/* Divider (Desktop Only) */}
                    <div className="hidden md:block h-8 w-px bg-slate-200"></div>

                    {/* Kanban State Indicators */}
                    <div className="flex items-center gap-2" title="Kanban State">
                        <button
                            onClick={() => {
                                if (!isEditing) return;
                                const current = formData.kanbanState || request.kanbanState || 'normal';
                                const nextState = current === 'normal' ? 'blocked' : current === 'blocked' ? 'done' : 'normal';
                                handleChange('kanbanState', nextState);
                            }}
                            className={`w-5 h-5 rounded-full border ring-offset-1 transition-all 
                                ${(isEditing ? formData.kanbanState : request.kanbanState) === 'blocked'
                                    ? 'bg-red-500 border-red-600 ring-2 ring-red-100'
                                    : (isEditing ? formData.kanbanState : request.kanbanState) === 'done'
                                        ? 'bg-green-500 border-green-600 ring-2 ring-green-100'
                                        : 'bg-white border-slate-400 hover:border-slate-500'
                                } 
                                ${!isEditing ? 'cursor-default opacity-60' : 'cursor-pointer hover:scale-110 active:scale-95'}
                            `}
                            title={isEditing ? "Click to change status (Normal -> Blocked -> Ready)" : "Kanban Status"}
                            disabled={!isEditing}
                        />
                        <span className="text-xs font-medium text-slate-600 capitalize">
                            {(isEditing ? formData.kanbanState : request.kanbanState) === 'done' ? 'Ready' : (isEditing ? formData.kanbanState : request.kanbanState) || 'Normal'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Worksheet Section */}
            {showWorksheet && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 animate-in slide-in-from-top-2">
                    <h3 className="font-bold text-slate-900 mb-4">Worksheet & Comments</h3>

                    {/* Entry List */}
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        {formData.worksheetEntries && formData.worksheetEntries.length > 0 ? (
                            formData.worksheetEntries.map((entry) => (
                                <div key={entry.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-slate-700">{entry.author}</span>
                                        <span className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-slate-600">{entry.text}</p>
                                </div>
                            ))
                        ) : (
                            <div className="h-20 flex items-center justify-center bg-white rounded border border-slate-200 text-slate-400 italic text-sm">
                                No entries yet.
                            </div>
                        )}
                    </div>

                    {/* Add Entry Input */}
                    {isEditing && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Log an activity or observation..."
                                className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = (e.target as HTMLInputElement).value;
                                        if (!val.trim()) return;

                                        const newEntry = {
                                            id: crypto.randomUUID(),
                                            text: val,
                                            createdAt: new Date().toISOString(),
                                            author: 'Mitchell Admin' // Mock User
                                        };

                                        setFormData(prev => ({
                                            ...prev,
                                            worksheetEntries: [...(prev.worksheetEntries || []), newEntry]
                                        }));
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                            <button
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                                onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    const val = input.value;
                                    if (!val.trim()) return;

                                    const newEntry = {
                                        id: crypto.randomUUID(),
                                        text: val,
                                        createdAt: new Date().toISOString(),
                                        author: 'Mitchell Admin'
                                    };

                                    setFormData(prev => ({
                                        ...prev,
                                        worksheetEntries: [...(prev.worksheetEntries || []), newEntry]
                                    }));
                                    input.value = '';
                                }}
                            >
                                Add
                            </button>
                        </div>
                    )}
                    {!isEditing && (
                        <p className="text-xs text-slate-500 mt-2 text-center">Enable Edit Mode to add entries.</p>
                    )}
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
                        {isEditing ? (
                            <select
                                className="col-span-2 rounded border border-slate-300 px-3 py-1.5 text-sm"
                                value={formData.maintenanceFor || 'equipment'}
                                onChange={e => handleChange('maintenanceFor', e.target.value)}
                            >
                                <option value="equipment">Equipment</option>
                                <option value="work_center">Work Center</option>
                            </select>
                        ) : (
                            <div className="col-span-2 text-sm text-slate-900 capitalize">{request.maintenanceFor?.replace('_', ' ') || 'Equipment'}</div>
                        )}
                    </div>

                    {(isEditing ? formData.maintenanceFor : request.maintenanceFor) === 'work_center' ? (
                        <>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <label className="text-sm font-bold text-slate-700">Work Center</label>
                                {isEditing ? (
                                    <select
                                        className={`col-span-2 rounded border px-3 py-1.5 text-sm ${errors.workCenterId ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                                        value={formData.workCenterId || ''}
                                        onChange={e => handleChange('workCenterId', e.target.value)}
                                    >
                                        <option value="">Select Work Center...</option>
                                        {workCenters.map(wc => <option key={wc.id} value={wc.id}>{wc.name}</option>)}
                                    </select>
                                ) : (
                                    <div className="col-span-2 text-sm text-slate-900">{workCenters.find(wc => wc.id === request.workCenterId)?.name || '-'}</div>
                                )}
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
                            {isEditing ? (
                                <select
                                    className={`col-span-2 rounded border px-3 py-1.5 text-sm ${errors.equipmentId ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                                    value={formData.equipmentId || ''}
                                    onChange={e => handleChange('equipmentId', e.target.value)}
                                >
                                    <option value="">Select Equipment...</option>
                                    {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                                </select>
                            ) : (
                                <div className="col-span-2 text-sm text-slate-900">{equipment.find(eq => eq.id === request.equipmentId)?.name || '-'}</div>
                            )}
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
                                    disabled={!isEditing}
                                    checked={(isEditing ? formData.type : request.type) === 'Corrective'}
                                    onChange={() => handleChange('type', 'Corrective')}
                                /> Corrective
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="type"
                                    disabled={!isEditing}
                                    checked={(isEditing ? formData.type : request.type) === 'Preventive'}
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
                        {isEditing ? (
                            <select
                                className={`col-span-2 rounded border px-3 py-1.5 text-sm ${errors.teamId ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                                value={formData.teamId || ''}
                                onChange={e => handleChange('teamId', e.target.value)}
                            >
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        ) : (
                            <div className="col-span-2 text-sm text-slate-900">{teams.find(t => t.id === request.teamId)?.name || '-'}</div>
                        )}
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
                        {isEditing ? (
                            <div className="col-span-2 flex items-center gap-2">
                                <input
                                    type="number"
                                    className="w-20 rounded border border-slate-300 px-2 py-1 text-sm"
                                    value={formData.duration || 0}
                                    onChange={e => handleChange('duration', parseFloat(e.target.value))}
                                />
                                <span className="text-sm text-slate-500">hours</span>
                            </div>
                        ) : (
                            <div className="col-span-2 text-sm text-slate-900">{request.duration || 0} hours</div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Priority</label>
                        <div className="col-span-2 flex items-center gap-1">
                            {['1', '2', '3'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    disabled={!isEditing}
                                    onClick={() => {
                                        if (!isEditing) return;
                                        const current = formData.priority || '0';
                                        handleChange('priority', current === level ? '0' : level);
                                    }}
                                    className={`focus:outline-none transition-transform ${isEditing ? 'active:scale-90 cursor-pointer' : 'cursor-default'}`}
                                    title={`Priority ${level}`}
                                >
                                    <Star
                                        className={`w-5 h-5 ${(isEditing ? (formData.priority || '0') : (request.priority || '0')) >= level
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-slate-300'
                                            } ${isEditing ? 'hover:text-yellow-200' : ''}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="text-sm font-bold text-slate-700">Company</label>
                        <div className="col-span-2 text-sm text-slate-900">My Company (San Francisco)</div>
                    </div>
                </div>

                {/* Notes Section at Bottom */}
                <div className="col-span-1 md:col-span-2 mt-8 border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Notes</h3>
                    {isEditing ? (
                        <textarea
                            className="w-full h-24 rounded border border-slate-200 p-2 text-sm focus:border-purple-500 focus:outline-none"
                            placeholder="Add additional notes here..."
                            value={formData.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                        ></textarea>
                    ) : (
                        <div className="w-full min-h-[6rem] rounded border border-transparent p-2 text-sm text-slate-900 bg-slate-50/50">
                            {request.description || <span className="text-slate-400 italic">No notes provided.</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
