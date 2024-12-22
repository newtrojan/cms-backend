// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errors";
import { AuthenticatedRequest } from "../middleware/auth";
import {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "../types/auth";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
      }: RegisterRequest = req.body;

      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new AppError(authError.message, 400);

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from("users") // Changed from user_profiles to users
        .insert({
          id: authData.user!.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          role: role || "USER",
          created_at: new Date(),
          updated_at: new Date(),
        })
        .single();

      if (profileError) throw new AppError(profileError.message, 400);

      return ApiResponse.success(
        res,
        profileData,
        "User registered successfully",
        201
      );
    } catch (error) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      // Authenticate with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw new AppError(authError.message, 401);

      // Fetch user profile including role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) throw new AppError(userError.message, 400);

      // Update last sign in
      await supabase
        .from("users")
        .update({ updated_at: new Date() })
        .eq("id", authData.user.id);

      // Combine auth data with user profile
      const responseData = {
        user: {
          ...authData.user,
          ...userData, // This will include the role
        },
        session: authData.session,
      };

      return ApiResponse.success(res, responseData, "Login successful");
    } catch (error) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw new AppError(error.message, 400);

      return ApiResponse.success(res, null, "Logout successful");
    } catch (error) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.user.id)
        .single();

      if (error) throw new AppError(error.message, 400);

      return ApiResponse.success(
        res,
        profile,
        "Profile retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { firstName, lastName, phone }: UpdateProfileRequest = req.body;

      const { data, error } = await supabase
        .from("users") // Changed from user_profiles to users
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          updated_at: new Date(),
        })
        .eq("id", req.user.id)
        .single();

      if (error) throw new AppError(error.message, 400);

      return ApiResponse.success(res, data, "Profile updated successfully");
    } catch (error) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  }
}
