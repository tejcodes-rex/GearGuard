"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Equipment, Team, MaintenanceRequest, RequestStatus, WorkCenter } from "@/types";

interface AppContextType {
    equipment: Equipment[];
    teams: Team[];
    requests: MaintenanceRequest[];
    workCenters: WorkCenter[];
    addRequest: (request: Omit<MaintenanceRequest, "id" | "createdAt">) => void;
    updateRequest: (id: string, store: Partial<MaintenanceRequest>) => void;
    updateEquipment: (id: string, data: Partial<Equipment>) => void;
    addWorkCenter: (data: Omit<WorkCenter, "id">) => void;
    updateWorkCenter: (id: string, data: Partial<WorkCenter>) => void;
    getEquipmentById: (id: string) => Equipment | undefined;
    getWorkCenterById: (id: string) => WorkCenter | undefined;
    getTeamById: (id: string) => Team | undefined;
    getMemberById: (teamId: string, memberId: string) => any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- MOCK DATA ---

const MOCK_TEAMS: Team[] = [
    {
        id: "t1",
        name: "Mechanics",
        members: [
            { id: "m1", name: "Mitchell Admin", avatar: "https://i.pravatar.cc/150?u=m1", role: "Manager" },
            { id: "m2", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=m2", role: "Technician" },
        ],
    },
    {
        id: "t2",
        name: "Electricians",
        members: [
            { id: "e1", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=e1", role: "Lead" },
        ],
    },
    {
        id: "t3",
        name: "IT Support",
        members: [
            { id: "i1", name: "Alice Wrapp", avatar: "https://i.pravatar.cc/150?u=i1", role: "Specialist" },
        ],
    },
];

const MOCK_EQUIPMENT: Equipment[] = [
    {
        id: "eq1",
        name: "CNC Machine X1",
        serialNumber: "CNC-2023-001",
        category: "Industrial",
        teamId: "t1",
        location: "Production Floor A",
        purchaseDate: "2023-01-15",
        warrantyExpiration: "2026-01-15",
        image: "https://images.unsplash.com/photo-1565043589221-1a51f3f28054?auto=format&fit=crop&q=80&w=300&h=200",
        status: "Active",
        department: "Production",
    },
    {
        id: "eq2",
        name: "Generator 5000",
        serialNumber: "GEN-5K-99",
        category: "Power",
        teamId: "t2",
        location: "Utility Room",
        purchaseDate: "2022-05-20",
        warrantyExpiration: "2025-05-20",
        image: "https://images.unsplash.com/photo-1486262715619-72a604e3d7b9?auto=format&fit=crop&q=80&w=300&h=200",
        status: "Active",
        department: "Maintenance",
    },
    {
        id: "eq3",
        name: "Office Printer 01",
        serialNumber: "PRT-HP-01",
        category: "Electronics",
        teamId: "t3",
        location: "Main Office",
        purchaseDate: "2024-02-10",
        warrantyExpiration: "2025-02-10",
        image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=300&h=200",
        status: "Active",
        department: "Admin",
    },
    {
        id: "eq4",
        name: "Forklift Z-Series",
        serialNumber: "FL-2021-X",
        category: "Vehicle",
        teamId: "t1",
        location: "Warehouse B",
        purchaseDate: "2021-11-01",
        warrantyExpiration: "2024-11-01",
        image: "https://images.unsplash.com/photo-1580674285054-bed31e140f19?auto=format&fit=crop&q=80&w=300&h=200",
        status: "Active",
        department: "Logistics",
    },
    {
        id: "eq5",
        name: "MacBook Pro M3",
        serialNumber: "MBP-M3-999",
        category: "Computers",
        teamId: "t3",
        location: "Remote",
        purchaseDate: "2023-11-15",
        warrantyExpiration: "2024-11-15",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=300&h=200",
        status: "Active",
        department: "Sales",
        assignedTo: "Marc Demo",
    },
];

const MOCK_WORK_CENTERS: WorkCenter[] = [
    {
        id: "wc1",
        name: "Assembly 1",
        code: "WC-001",
        location: "Workshop A",
        capacity: 100,
        costPerHour: 34.59,
        timeEfficiency: 100,
        oeeTarget: 90
    },
    {
        id: "wc2",
        name: "Drill 1",
        code: "WC-002",
        location: "Workshop B",
        capacity: 80,
        costPerHour: 45.00,
        timeEfficiency: 95,
        oeeTarget: 85
    }
];

const MOCK_REQUESTS: MaintenanceRequest[] = [
    {
        id: "r1",
        subject: "Leaking Oil",
        equipmentId: "eq4",
        maintenanceFor: "equipment",
        teamId: "t1",
        status: "New",
        type: "Corrective",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        priority: "2",
    },
    {
        id: "r2",
        subject: "Monthly Service",
        equipmentId: "eq2",
        maintenanceFor: "equipment",
        teamId: "t2",
        status: "New",
        type: "Preventive",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // In 3 days
    },
    {
        id: "r3",
        subject: "Paper Jam / Roller Issue",
        equipmentId: "eq3",
        maintenanceFor: "equipment",
        teamId: "t3",
        technicianId: "i1",
        status: "In Progress",
        type: "Corrective",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: "r4",
        subject: "Screen Flickering",
        equipmentId: "eq5",
        maintenanceFor: "equipment",
        teamId: "t3",
        status: "New",
        type: "Corrective",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago (Overdue-ish)
    },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [equipment, setEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);
    const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
    const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_REQUESTS);
    const [workCenters, setWorkCenters] = useState<WorkCenter[]>(MOCK_WORK_CENTERS);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const storedEquipment = localStorage.getItem("gearguard_equipment");
        const storedRequests = localStorage.getItem("gearguard_requests");
        const storedWorkCenters = localStorage.getItem("gearguard_workcenters");

        if (storedEquipment) setEquipment(JSON.parse(storedEquipment));
        if (storedRequests) setRequests(JSON.parse(storedRequests));
        if (storedWorkCenters) setWorkCenters(JSON.parse(storedWorkCenters));
        setIsInitialized(true);
    }, []);

    // Save to localStorage on changes
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem("gearguard_equipment", JSON.stringify(equipment));
    }, [equipment, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem("gearguard_requests", JSON.stringify(requests));
    }, [requests, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem("gearguard_workcenters", JSON.stringify(workCenters));
    }, [workCenters, isInitialized]);

    const addRequest = (request: Omit<MaintenanceRequest, "id" | "createdAt">) => {
        const newRequest: MaintenanceRequest = {
            ...request,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        setRequests((prev) => [...prev, newRequest]);
    };

    const updateRequest = (id: string, data: Partial<MaintenanceRequest>) => {
        setRequests((prev) =>
            prev.map((req) => {
                if (req.id !== id) return req;
                const updated = { ...req, ...data };

                // Scrap Logic: If request moved to Scrap, update equipment status
                // Only if it's equipment maintenance
                if (data.status === 'Scrap' && req.status !== 'Scrap' && req.maintenanceFor === 'equipment' && req.equipmentId) {
                    updateEquipment(req.equipmentId, { status: 'Scrap' });
                }

                return updated;
            })
        );
    };

    const updateEquipment = (id: string, data: Partial<Equipment>) => {
        setEquipment((prev) =>
            prev.map((eq) => (eq.id === id ? { ...eq, ...data } : eq))
        );
    };

    const addWorkCenter = (data: Omit<WorkCenter, "id">) => {
        const newWc: WorkCenter = {
            ...data,
            id: Math.random().toString(36).substr(2, 9)
        };
        setWorkCenters(prev => [...prev, newWc]);
    }

    const updateWorkCenter = (id: string, data: Partial<WorkCenter>) => {
        setWorkCenters(prev => prev.map(wc => wc.id === id ? { ...wc, ...data } : wc));
    };

    const getEquipmentById = (id: string) => equipment.find((e) => e.id === id);
    const getWorkCenterById = (id: string) => workCenters.find(w => w.id === id);
    const getTeamById = (id: string) => teams.find((t) => t.id === id);
    const getMemberById = (teamId: string, memberId: string) => {
        const team = getTeamById(teamId);
        return team?.members.find(m => m.id === memberId);
    }

    return (
        <AppContext.Provider
            value={{
                equipment,
                teams,
                requests,
                workCenters,
                addRequest,
                updateRequest,
                updateEquipment,
                addWorkCenter,
                updateWorkCenter,
                getEquipmentById,
                getWorkCenterById,
                getTeamById,
                getMemberById
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
