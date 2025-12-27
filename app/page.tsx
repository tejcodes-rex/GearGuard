import { useState } from "react";
import { useApp } from "@/context/AppDataContext";
import { DashboardCard } from "@/components/DashboardCard";
import { AlertTriangle, Users, ClipboardList, Activity, Search, Plus } from "lucide-react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // Metrics Logic
  const openRequests = requests.filter((r) => r.status !== "Repaired" && r.status !== "Scrap");
  const completedRequests = requests.filter(r => r.status === 'Repaired');

  const filteredRequests = requests.filter(req =>
    req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalEquipmentCount = requests.filter(r => (r.priority || '0') >= '2').length; // Proxy for health

  return (
    <div className="space-y-6 mt-4">
      {/* Sub Header: Actions & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <a href="/maintenance/requests/new" className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-100">
            <Plus className="h-4 w-4" /> New Request
          </a>
        </div>

        <div className="flex-1 w-full md:max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search maintenance requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
          />
        </div>

        <div className="hidden md:block w-[120px]"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* ... existing cards ... */}
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
        <a href="/maintenance/teams" className="block transition-transform hover:scale-[1.02]">
          <DashboardCard
            title="Technician Load"
            value={`${85}%`}
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
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">Subject</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">Employee</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">Technician</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">Category</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">Stage</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider text-[10px]">Company</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const equipmentItem = equipment.find(e => e.id === req.equipmentId);
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                      <a href={`/maintenance/requests/${req.id}`} className="block">
                        {req.subject}
                        <span className="block text-[10px] text-slate-400 font-normal">{req.id}</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-600">Mitchell Admin</td>
                    <td className="px-6 py-4 text-slate-600">Marc Demo</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{equipmentItem?.category || 'General'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase border ${req.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        req.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                          req.status === 'Repaired' ? 'bg-green-50 text-green-700 border-green-100' :
                            'bg-slate-50 text-slate-700 border-slate-100'
                        }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">My Company</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/50">
                  No requests found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
