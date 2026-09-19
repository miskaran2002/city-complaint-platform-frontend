// types/complaint.ts

import { User } from './user';
import { Category, Department } from './department';
import { Payment, Feedback } from './payment';

export enum ComplaintStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY'
}

/**
 * Interface representing a Complaint entity.
 */
export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: Priority;
  categoryId: string;
  departmentId: string;
  citizenId: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string | null;
  slaHours: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  // Optional relations (Populated when joined via API)
  category?: Category;
  department?: Department;
  citizen?: User;
  payment?: Payment;
  feedback?: Feedback;
}

/**
 * Interface for technician assignments.
 */
export interface Assignment {
  id: string;
  complaintId: string;
  technicianId: string;
  assignedById: string;
  notes?: string | null;
  assignedAt: string;

  // Optional relations
  technician?: User;
  assigner?: User;
}

/**
 * Interface for complaint status history.
 */
export interface StatusLog {
  id: string;
  complaintId: string;
  changedById: string;
  oldStatus?: ComplaintStatus | null;
  newStatus: ComplaintStatus;
  note?: string | null;
  createdAt: string;
  
  changedBy?: User;
}

/**
 * Interface for system audit logs.
 */
export interface AuditLog {
  id: string;
  complaintId: string;
  actorId: string;
  action: string;
  oldValue?: string | null;
  newValue?: string | null;
  note?: string | null;
  createdAt: string;

  actor?: User;
}