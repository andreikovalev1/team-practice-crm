import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
  });
};

export const checkIsAdminToken = (): boolean => {
  if (typeof document === "undefined") return false;
  
  const match = document.cookie.match(/(^|; )auth_token=([^;]*)/);
  if (!match) return false;

  try {
    const token = decodeURIComponent(match[2]);
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(decodedJson);
    
    return payload.role === "Admin" || payload.role === "admin";
  } catch {
    return false;
  }
};

export const updateAuthCookies = (
  accessToken: string,
  refreshToken: string | null
): void => {
  if (typeof document === "undefined") return;
  document.cookie = `auth_token=${encodeURIComponent(accessToken)}; path=/; max-age=3600`;
  if (refreshToken) {
    document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; path=/; max-age=2592000`;
  }
};