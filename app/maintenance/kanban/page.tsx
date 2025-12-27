"use client";

import React, { useState, useEffect, Suspense } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useApp } from "@/context/AppDataContext";
import { RequestStatus } from "@/types";
import { Plus, Clock, User } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const COLUMNS: RequestStatus[] = ["New", "In Progress", "Repaired", "Scrap"];

function KanbanBoard() {
    const { requests, updateRequest, getTeamById, getEquipmentById, getWorkCenterById, getMemberById } = useApp();
    const searchParams = useSearchParams();
    const [isBrowser, setIsBrowser] = useState(false);

    // Filter Logic
    const equipmentIdFilter = searchParams.get("equipmentId");
    const filteredRequests = equipmentIdFilter
        ? requests.filter(r => r.equipmentId === equipmentIdFilter)
        : requests;

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as RequestStatus;
        updateRequest(draggableId, { status: newStatus });
    };

    if (!isBrowser) return null;

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
                    {equipmentIdFilter && <p className="text-sm text-slate-500">Filtered by equipment ID: {equipmentIdFilter}</p>}
                </div>
                <Link
                    href="/maintenance/requests/new"
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    New Request
                </Link>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full min-w-[1000px] gap-6">
                        {COLUMNS.map((columnId) => (
                            <div key={columnId} className="flex h-full w-80 flex-col rounded-xl bg-slate-100/50 border border-slate-200/60">
                                <div className="flex items-center justify-between p-4 pb-2">
                                    <h2 className="font-semibold text-slate-700">{columnId}</h2>
                                    <span className="rounded-full bg-slate-200 px-2 text-xs font-bold text-slate-600">
                                        {filteredRequests.filter((r) => r.status === columnId).length}
                                    </span>
                                </div>

                                <Droppable droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={clsx(
                                                "flex-1 space-y-3 px-3 py-2 transition-colors",
                                                snapshot.isDraggingOver ? "bg-purple-50/50" : ""
                                            )}
                                        >
                                            {filteredRequests
                                                .filter((req) => req.status === columnId)
                                                .map((req, index) => {
                                                    const maintenanceFor = req.maintenanceFor || 'equipment';
                                                    const equipment = getEquipmentById(req.equipmentId || "");
                                                    const workCenter = getWorkCenterById(req.workCenterId || "");

                                                    const targetName = maintenanceFor === 'equipment' ? equipment?.name : workCenter?.name;
                                                    const team = getTeamById(req.teamId);
                                                    const technician = req.technicianId && team
                                                        ? getMemberById(team.id, req.technicianId)
                                                        : null;
                                                    const isOverdue = (req.priority || '0') >= '2';

                                                    return (
                                                        <Draggable key={req.id} draggableId={req.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <Link
                                                                    href={`/maintenance/requests/${req.id}`}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={clsx(
                                                                        "relative block overflow-hidden rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md cursor-pointer",
                                                                        snapshot.isDragging ? "shadow-lg rotate-2" : "",
                                                                        isOverdue ? "border-l-4 border-l-red-500" : ""
                                                                    )}
                                                                >
                                                                    <div className="mb-2">
                                                                        <span className="inline-block text-sm font-medium text-slate-900 line-clamp-2">
                                                                            {req.subject}
                                                                        </span>
                                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                                            Created By: Mitchell Admin
                                                                        </p>
                                                                    </div>

                                                                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                                                                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                                                                            {targetName || 'Unknown'}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            {isOverdue && (
                                                                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-600">
                                                                                    <Clock className="h-3 w-3" />
                                                                                    Overdue
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {technician ? (
                                                                            <img
                                                                                src={technician.avatar}
                                                                                alt={technician.name}
                                                                                title={technician.name}
                                                                                className="h-6 w-6 rounded-full border border-white shadow-sm"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                                                <User className="h-3 w-3 text-slate-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Link>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}

export default function KanbanPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <KanbanBoard />
        </Suspense>
    );
}
