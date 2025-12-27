"use client";

import { useApp } from "@/context/AppDataContext";
import { DashboardCard } from "@/components/DashboardCard";
import { AlertTriangle, Users, ClipboardList, Activity } from "lucide-react";

export default function Home() {
  const { requests, equipment } = useApp();

  // Metrics Logic
  const openRequests = requests.filter((r) => r.status !== "Repaired" && r.status !== "Scrap");
  const completedRequests = requests.filter(r => r.status === 'Repaired');
  const overdueRequests = openRequests.filter((r) => {
    // Simple logic: if priority is High (2) or Urgent (3) or created > 7 days ago
    if ((r.priority || '0') >= '2') return true;
    const created = new Date(r.createdAt);
    const isOld = (Date.now() - created.getTime()) > 1000 * 60 * 60 * 24 * 7;
    return isOld;
  });

  const criticalEquipmentCount = requests.filter(r => (r.priority || '0') >= '2').length; // Proxy for health

  // Hardcoded for demo/mockup alignment if needed, but dynamic is better
  const technicianLoad = 85;

  return (
    <div className="space-y-8 mt-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <a href="/maintenance/kanban?filter=critical" className="block transition-transform hover:scale-[1.02]">
          <DashboardCard
            title="Critical Equipment"
            value={`${criticalEquipmentCount} Units`}
            subtitle="Health < 30%"
            icon={AlertTriangle}
            color="red"
            variant="filled"
          />
        </a>
        <a href="/teams" className="block transition-transform hover:scale-[1.02]">
          <DashboardCard
            title="Technician Load"
            value={`${technicianLoad}%`}
            subtitle="Assign Carefully"
            icon={Users}
            color="blue"
            variant="filled"
          />
        </a>
        <a href="/maintenance/kanban" className="block transition-transform hover:scale-[1.02]">
          <DashboardCard
            title="Open Requests"
            value={openRequests.length}
            subtitle={`${openRequests.length} pending, ${completedRequests.length} completed`}
            icon={ClipboardList}
            color="green"
            variant="filled"
          />
        </a>
      </div>

      {/* Recent Activity Section as Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold">Subject</th>
              <th className="px-6 py-3 font-semibold">Employee</th>
              <th className="px-6 py-3 font-semibold">Technician</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Stage</th>
              <th className="px-6 py-3 font-semibold">Company</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => {
              // Mock data logic for columns not in basic request model
              const equipmentItem = equipment.find(e => e.id === req.equipmentId);
              return (
                <tr key={req.id} className="hover:bg-slate-50/50 group cursor-pointer transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-900">
                    <a href={`/maintenance/requests/${req.id}`} className="text-purple-600 hover:underline">
                      {req.subject}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-slate-600">Mitchell Admin</td>
                  <td className="px-6 py-3 text-slate-600">Marc Demo</td>
                  <td className="px-6 py-3 text-slate-600">{equipmentItem?.category || 'General'}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${req.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      req.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'Repaired' ? 'bg-green-100 text-green-800' :
                          'bg-slate-100 text-slate-800'
                      }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500">My Company</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
