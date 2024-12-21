// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { supabase, UserRole, ROLE_HIERARCHY } from "../config/supabase";
import { AppError } from "../utils/errors";
import { ApiResponse } from "../utils/apiResponse";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No authentication token provided", 401);
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError("Invalid or expired token", 401);
    }

    // Get user's role from user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new AppError("User profile not found", 404);
    }

    req.user = { ...user, ...profile };
    next();
  } catch (error) {
    return ApiResponse.error(res, error.message, error.statusCode || 500);
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.role) {
        throw new AppError("User not authenticated", 401);
      }

      const userRoleLevel = ROLE_HIERARCHY[req.user.role];
      const hasPermission = allowedRoles.some(
        (role) => ROLE_HIERARCHY[role] <= userRoleLevel
      );

      if (!hasPermission) {
        throw new AppError("Insufficient permissions", 403);
      }

      next();
    } catch (error) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  };
};
