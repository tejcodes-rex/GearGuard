"use client";

import { BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";

export default function ReportingPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Reporting & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">MTBF Analysis</h3>
                    </div>
                    <div className="h-40 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-sm">
                        Chart Placeholder
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <PieChart className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Request Distribution</h3>
                    </div>
                    <div className="h-40 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-sm">
                        Chart Placeholder
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Cost Analysis</h3>
                    </div>
                    <div className="h-40 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-sm">
                        Chart Placeholder
                    </div>
                </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                ⚠️ <strong>Note:</strong> Advanced Analytics requires connecting to a real backend data warehouse. This view demonstrates the layout.
            </div>
        </div>
    );
}
