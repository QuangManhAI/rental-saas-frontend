import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Vietnamese Dong (₫).
 * Example: 5000000 → "5.000.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format an ISO date string to dd/MM/yyyy.
 */
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'dd/MM/yyyy');
}

/**
 * Format an ISO date string to dd/MM/yyyy HH:mm.
 */
export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'dd/MM/yyyy HH:mm');
}

/**
 * Get status badge variant colour classes.
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    // Room
    AVAILABLE: 'bg-blue-100 text-blue-700',
    OCCUPIED: 'bg-green-100 text-green-700',
    MAINTENANCE: 'bg-amber-100 text-amber-700',
    // Contract
    ACTIVE: 'bg-green-100 text-green-700',
    EXPIRED: 'bg-gray-100 text-gray-700',
    TERMINATED: 'bg-red-100 text-red-700',
    // Bill
    UNPAID: 'bg-gray-100 text-gray-700',
    PARTIAL: 'bg-amber-100 text-amber-700',
    PAID: 'bg-green-100 text-green-700',
    OVERDUE: 'bg-red-100 text-red-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700';
}
