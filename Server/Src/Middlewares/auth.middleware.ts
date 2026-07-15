import type { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import type { AuthUser } from '../Types/express.js';
import authModel from '../Modules/Auth/Models/auth.model.js';

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Check if Clerk's middleware has populated req.auth
    const clerkId = (req as any).auth?.userId;
    
    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no valid Clerk token found'
      });
    }

    // 2. Find the user in the database
    const user = await authModel.findOne({ clerkId });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in database. Please sync account.'
      });
    }

    if (user.isDisabled) {
      return res.status(403).json({
        success: false,
        message: 'Account has been disabled.'
      });
    }

    // 3. Populate req.user
    req.user = {
      userId: user._id.toString(),
      clerkId: user.clerkId as string,
      email: user.email,
      username: user.username,
      // imageUrl would require syncing or fetching from clerk directly if needed
    } as AuthUser;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token'
    });
  }
};