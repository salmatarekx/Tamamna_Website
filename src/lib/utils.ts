import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL = import.meta.env.VITE_API_URL;
// Example usage:
// fetch(`${API_URL}/api/vendors`)
//   .then(res => res.json())
//   .then(data => console.log(data));
