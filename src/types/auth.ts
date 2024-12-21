// src/types/auth.ts

export enum UserRole {
  USER = "USER", // Web user
  CCA = "CCA", // Call Centre Agent
  CCM = "CCM", // Call Centre Manager
  ADMIN = "ADMIN", // Administrator
  SUDO = "SUDO", // Super Admin
}

export const ROLE_HIERARCHY = {
  [UserRole.SUDO]: 5,
  [UserRole.ADMIN]: 4,
  [UserRole.CCM]: 3,
  [UserRole.CCA]: 2,
  [UserRole.USER]: 1,
};

// Role permissions interface
export interface RolePermissions {
  canViewDashboard: boolean;
  canHandleCalls: boolean;
  canManageAgents: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canManageSystem: boolean;
}

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.SUDO]: {
    canViewDashboard: true,
    canHandleCalls: true,
    canManageAgents: true,
    canViewReports: true,
    canManageUsers: true,
    canManageSystem: true,
  },
  [UserRole.ADMIN]: {
    canViewDashboard: true,
    canHandleCalls: true,
    canManageAgents: true,
    canViewReports: true,
    canManageUsers: true,
    canManageSystem: false,
  },
  [UserRole.CCM]: {
    canViewDashboard: true,
    canHandleCalls: true,
    canManageAgents: true,
    canViewReports: true,
    canManageUsers: false,
    canManageSystem: false,
  },
  [UserRole.CCA]: {
    canViewDashboard: true,
    canHandleCalls: true,
    canManageAgents: false,
    canViewReports: false,
    canManageUsers: false,
    canManageSystem: false,
  },
  [UserRole.USER]: {
    canViewDashboard: false,
    canHandleCalls: false,
    canManageAgents: false,
    canViewReports: false,
    canManageUsers: false,
    canManageSystem: false,
  },
};

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper functions
export function hasPermission(
  role: UserRole,
  permission: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

export function isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}

// Auth response types
export interface AuthResponse {
  user: User | null;
  session: any | null;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}
