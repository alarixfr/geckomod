import { cn } from "cn";
import { twMerge } from "tailwind-merge";
import clsx from 'clsx';

export function cn( ... inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}