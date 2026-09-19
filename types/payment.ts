// types/payment.ts

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

/**
 * Interface representing a Payment transaction.
 */
export interface Payment {
  id: string;
  complaintId: string;
  citizenId: string;
  amount: number;
  transactionId: string;
  status: PaymentStatus;
  gateway: string;
  createdAt: string;
}

/**
 * Interface representing citizen feedback.
 */
export interface Feedback {
  id: string;
  complaintId: string;
  citizenId: string;
  rating: number; // usually 1 to 5
  comment?: string | null;
  createdAt: string;
}