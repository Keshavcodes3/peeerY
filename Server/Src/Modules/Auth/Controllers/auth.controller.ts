import type { Request, Response } from 'express';
import { asyncHandler } from '../../../Utils/asyncHandler.utils.js';
import * as authService from '../Services/auth.service.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';

export const syncAccount = asyncHandler(async (req: Request, res: Response) => {
  // Clerk middleware should have attached userId (clerkId) to req.auth
  const clerkId = req.auth?.userId;
  if (!clerkId) {
    throw new ApiError(401, 'Not authenticated with Clerk');
  }

  // Expect frontend to send these, or fetch from Clerk API
  // Using body for simplicity, or we could use clerkClient.users.getUser(clerkId)
  const { email, username, avatar, provider } = req.body;
  
  if (!email || !username) {
    throw new ApiError(400, 'email and username are required in body to sync');
  }

  const { user } = await authService.syncUser(clerkId, email, username, avatar, provider);
  
  res.status(200).json({
    success: true,
    message: 'User synced successfully',
    user
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user is populated by our custom verifyAuth middleware
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await authService.getMe(userId);

  res.status(200).json({
    success: true,
    user
  });
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  await authService.deleteAccount(userId);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

export const disableAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await authService.disableAccount(userId);

  res.status(200).json({
    success: true,
    message: 'Account disabled successfully',
    user
  });
});