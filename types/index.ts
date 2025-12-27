export type EquipmentStatus = 'Active' | 'Scrap';

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  teamId: string;
  location: string;
  purchaseDate: string;
  warrantyExpiration: string;
  image: string;
  status: EquipmentStatus;
  department: string;
  assignedTo?: string; // Employee name
}

export interface WorkCenter {
  id: string;
  name: string;
  code: string;
  tag?: string;
  costPerHour: number;
  capacity: number;
  timeEfficiency: number;
  oeeTarget: number;
  location: string;
  alternativeWorkcenters?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export type RequestStatus = 'New' | 'In Progress' | 'Repaired' | 'Scrap';
export type RequestType = 'Corrective' | 'Preventive';
export type MaintenanceFor = 'equipment' | 'work_center';

export interface MaintenanceRequest {
  id: string;
  subject: string;
  maintenanceFor: MaintenanceFor;
  equipmentId?: string;
  workCenterId?: string;
  teamId: string;
  technicianId?: string;
  status: RequestStatus;
  type: RequestType;
  scheduledDate?: string; // ISO string
  duration?: number; // Hours
  createdAt: string;
  description?: string;
  priority?: '0' | '1' | '2' | '3';
  kanbanState?: 'normal' | 'blocked' | 'done';
}
