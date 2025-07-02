// frontend/src/types/models.d.ts

/**
 * Interface for a Landlord entity.
 */
export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  // Add any other landlord-specific fields here
}

/**
 * Interface for a Property Unit.
 */
export interface Unit {
  id: string;
  name: string;
  type: string; // e.g., '1-Bedroom', 'Bedsitter', 'Penthouse'
  rent: number;
  tenantId: string | null; // ID of the assigned tenant, null if vacant
  // Add any other unit-specific fields here
}

/**
 * Interface for a Property entity.
 */
export interface Property {
  id: string;
  landlordId: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  images: string[]; // URLs or paths to images
  units: Unit[]; // Array of units within this property
  // Add any other property-specific fields here
}

/**
 * Interface for a Tenant entity.
 */
export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  leaseStart: string; // Date string (YYYY-MM-DD)
  leaseEnd: string;   // Date string (YYYY-MM-DD)
  propertyId: string; // ID of the property the tenant is in
  unitId: string;     // ID of the unit the tenant is in
  // Add any other tenant-specific fields here
}

/**
 * Interface for a Payment record.
 */
export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  date: string; // Date string (YYYY-MM-DD)
  status: 'Paid' | 'Overdue' | 'Pending';
  method: string; // e.g., 'M-PESA', 'Bank Transfer', 'Cash'
  // Add any other payment-specific fields here
}

/**
 * Interface for an Expense record.
 */
export interface Expense {
  id: string;
  propertyId: string;
  category: string; // e.g., 'Repairs', 'Utilities', 'Management Fees'
  description: string;
  amount: number;
  date: string; // Date string (YYYY-MM-DD)
  // Add any other expense-specific fields here
}

/**
 * Interface for a Rental Deposit record.
 */
export interface Deposit {
  id: string;
  tenantId: string;
  amount: number;
  date: string; // Date string (YYYY-MM-DD)
  status: 'Held' | 'Refunded' | 'Partially Refunded';
  landlordId: string; // The landlord holding this deposit
  propertyId: string; // The property this deposit is for
  // Add any other deposit-specific fields here
}

/**
 * Interface for an Audit Log entry.
 */
export interface AuditLogEntry {
  id: number;
  timestamp: Date;
  message: string;
}

/**
 * Interface for a Notification.
 */
export interface Notification {
  id: number;
  read: boolean;
  message: string;
}

/**
 * Interface for an Investment Fund.
 */
export interface InvestmentFund {
  id: string;
  name: string;
  currentRate: number; // e.g., 0.08 for 8%
  type: 'MMF' | 'Fixed Deposit';
}

/**
 * Interface for the overall application data state.
 * This will be used by the DataContext.
 */
export interface AppData {
  landlords: Landlord[];
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  expenses: Expense[];
  deposits: Deposit[];
  auditLog: AuditLogEntry[];
  notifications: Notification[];
  investmentFunds: InvestmentFund[];
}
