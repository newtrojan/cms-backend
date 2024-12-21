// src/routes/auth.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../config/supabase";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, CCA, CCM, ADMIN, SUDO]
 */
router.post(
  "/register",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUDO),
  asyncHandler(AuthController.register)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post("/login", asyncHandler(AuthController.login));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout from the application
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post("/logout", authenticate, asyncHandler(AuthController.logout));

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", authenticate, asyncHandler(AuthController.getProfile));

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 */
router.put(
  "/profile",
  authenticate,
  asyncHandler(AuthController.updateProfile)
);

export default router;
