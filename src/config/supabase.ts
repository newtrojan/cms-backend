// src/config/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { config } from "./app";

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error("Missing Supabase configuration");
}

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Define the enum first
export enum UserRole {
  USER = "USER", // Web user
  CCA = "CCA", // Call Centre Agent
  CCM = "CCM", // Call Centre Manager
  ADMIN = "ADMIN", // Administrator
  SUDO = "SUDO", // Super Admin
}

// Then use it in ROLE_HIERARCHY
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUDO]: 5,
  [UserRole.ADMIN]: 4,
  [UserRole.CCM]: 3,
  [UserRole.CCA]: 2,
  [UserRole.USER]: 1,
};

// Add a type guard function to check if a string is a valid UserRole
export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}
