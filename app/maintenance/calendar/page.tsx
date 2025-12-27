"use client";

import { useApp } from "@/context/AppDataContext";
import { ChevronLeft, ChevronRight, Clock, User, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CalendarPage() {
    const { requests } = useApp();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // Filter Requests for this month
    const getRequestsForDay = (day: number) => {
        return requests.filter(req => {
            if (!req.scheduledDate) return false;
            const d = new Date(req.scheduledDate);
            return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        });
    };

    const handleDayClick = (day: number) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateStr = selectedDate.toISOString().split('T')[0];
        router.push(`/maintenance/requests/new?date=${dateStr}T10:00:00`);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Maintenance Calendar</h1>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded-full transition"><ChevronLeft className="h-5 w-5" /></button>
                    <span className="font-bold text-slate-700 min-w-[140px] text-center">{monthName} {year}</span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded-full transition"><ChevronRight className="h-5 w-5" /></button>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="px-3 py-1 bg-white shadow-sm rounded-md text-xs font-semibold text-slate-700">Month</button>
                    <button disabled className="px-3 py-1 text-xs font-medium text-slate-400 cursor-not-allowed">Week</button>
                    <button disabled className="px-3 py-1 text-xs font-medium text-slate-400 cursor-not-allowed">Day</button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2 border-b border-slate-100 pb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">{day}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                    {/* Empty cells for previous month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`prev-${i}`} className="bg-slate-50 relative p-2 opacity-50"></div>
                    ))}

                    {/* Days of current month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const daysRequests = getRequestsForDay(day);
                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className={`bg-white relative p-2 min-h-[100px] hover:bg-slate-50 transition group flex flex-col gap-1 cursor-pointer ${isToday ? 'bg-purple-50 hover:bg-purple-50' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-purple-600 text-white' : 'text-slate-700'}`}>
                                        {day}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-100 text-purple-600 p-1 rounded">
                                        <Plus className="h-3 w-3" />
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[120px] custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                                    {daysRequests.map(req => (
                                        <Link
                                            key={req.id}
                                            href={`/maintenance/requests/${req.id}`}
                                            className={`text-[10px] p-1.5 rounded border border-l-2 shadow-sm transition-all hover:shadow-md hover:brightness-95 active:scale-95 block truncate
                                                ${req.priority === '3' ? 'bg-red-50 border-slate-200 border-l-red-500 text-red-700' :
                                                    req.priority === '2' ? 'bg-orange-50 border-slate-200 border-l-orange-500 text-orange-700' :
                                                        'bg-white border-slate-200 border-l-purple-500 text-slate-700'
                                                }
                                            `}
                                        >
                                            <div className="font-semibold truncate">{req.subject}</div>
                                            <div className="flex items-center gap-1 opacity-80 mt-0.5">
                                                <Clock className="h-3 w-3" />
                                                <span>{new Date(req.scheduledDate || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
