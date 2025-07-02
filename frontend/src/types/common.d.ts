// frontend/src/types/common.d.ts

/**
 * Represents a generic object with string keys and any value.
 */
export interface AnyObject {
  [key: string]: any;
}

/**
 * Represents a generic function.
 */
export type GenericFunction = (...args: any[]) => any;

/**
 * Interface for a common UI component prop that accepts a React Node.
 */
export interface ChildrenProp {
  children: React.ReactNode;
}

/**
 * Interface for a component that has an 'onClose' event.
 */
export interface ClosableComponent {
  onClose: () => void;
}

/**
 * Interface for a component that has an 'onSave' event with generic data.
 */
export interface SavableComponent<T> {
  onSave: (data: T) => void;
}

/**
 * Interface for a component that has an 'onCancel' event.
 */
export interface CancellableComponent {
  onCancel: () => void;
}

/**
 * Defines the structure for options in a select dropdown.
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Defines the structure for a report entry.
 */
export interface ReportEntry {
  type: string;
  property: string;
  amount: number;
  period: string;
  description: string;
}

/**
 * Defines the structure for a generic StatCard.
 */
export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType; // For Lucide React icons
  color: 'cyan' | 'teal' | 'emerald' | 'amber' | 'red' | 'blue';
  change?: string;
}
