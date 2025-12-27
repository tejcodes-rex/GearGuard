"use client";

import { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    parseISO
} from "date-fns";
import { useApp } from "@/context/AppDataContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function CalendarPage() {
    const { requests, getEquipmentById, getWorkCenterById } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const allScheduledRequests = requests.filter(r => r.scheduledDate);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="flex h-full flex-col space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Preventive Maintenance Calendar</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                        <button onClick={prevMonth} className="rounded p-1 hover:bg-slate-100">
                            <ChevronLeft className="h-5 w-5 text-slate-600" />
                        </button>
                        <span className="min-w-[120px] text-center text-sm font-semibold text-slate-900">
                            {format(currentDate, "MMMM yyyy")}
                        </span>
                        <button onClick={nextMonth} className="rounded p-1 hover:bg-slate-100">
                            <ChevronRight className="h-5 w-5 text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-200 bg-white text-center text-xs font-semibold leading-6 text-slate-500 shadow-sm">
                {weekDays.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>

            <div className="flex-1 rounded-bl-xl rounded-br-xl border-l border-r border-b border-slate-200 bg-slate-50 shadow-sm grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
                {days.map((day, dayIdx) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayRequests = allScheduledRequests.filter(r =>
                        r.scheduledDate && isSameDay(parseISO(r.scheduledDate), day)
                    );

                    return (
                        <Link
                            key={day.toString()}
                            href={`/maintenance/requests/new?date=${dateStr}&type=Preventive`}
                            className={clsx(
                                "flex min-h-[120px] flex-col border-b border-r border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50",
                                !isSameMonth(day, monthStart) && "bg-slate-50/50 text-slate-400"
                            )}
                        >
                            <span className={clsx(
                                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                                isSameDay(day, new Date()) ? "bg-purple-600 text-white" : "text-slate-700"
                            )}>
                                {format(day, 'd')}
                            </span>

                            <div className="mt-2 space-y-1 overflow-y-auto">
                                {dayRequests.map(req => {
                                    const maintenanceFor = req.maintenanceFor || 'equipment';
                                    const eq = req.equipmentId ? getEquipmentById(req.equipmentId) : undefined;
                                    const wc = req.workCenterId ? getWorkCenterById(req.workCenterId) : undefined;
                                    const targetName = maintenanceFor === 'equipment' ? eq?.name : wc?.name;

                                    return (
                                        <div
                                            key={req.id}
                                            className="rounded bg-purple-100 px-1.5 py-1 text-[10px] font-medium text-purple-700 truncate"
                                            title={`${req.subject} - ${targetName}`}
                                        >
                                            {targetName || "Unknown"}
                                        </div>
                                    )
                                })}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
