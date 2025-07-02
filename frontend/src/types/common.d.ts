import React from 'react';

/**
 * Represents a generic object with string keys and unknown values.
 * Avoids using 'any'; unknown is safer and forces type checks.
 */
export interface AnyObject {
  [key: string]: unknown;
}

/**
 * Represents a generic function.
 * Uses unknown[] and unknown to avoid 'any'.
 * This enforces that callers handle return type properly.
 */
export type GenericFunction = (...args: unknown[]) => unknown;

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
 * Generic type T to strongly type data passed on save.
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
  icon: React.ElementType; // For Lucide React icons or any React component type
  color: 'cyan' | 'teal' | 'emerald' | 'amber' | 'red' | 'blue';
  change?: string;
}
