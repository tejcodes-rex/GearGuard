"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Maintenance Calendar</h1>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft className="h-5 w-5" /></button>
                    <span className="font-semibold text-slate-700">December 2025</span>
                    <button className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight className="h-5 w-5" /></button>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="px-3 py-1 bg-white shadow-sm rounded-md text-xs font-semibold text-slate-700">Month</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">Week</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">Day</button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-2">
                    <span className="text-4xl">📅</span>
                    <p>Calendar View Under Construction</p>
                </div>
            </div>
        </div>
    );
}
