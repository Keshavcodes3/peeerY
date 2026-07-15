import authRepositary from '../Repos/auth.repositary.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';
import authModel from '../Models/auth.model.js';
import profileModel from '../Models/profile.model.js';
import mongoose from 'mongoose';
import { sendGoogleAuthWelcomeEmail } from '../../../Infra/Mail/email.js';

/**
 * Syncs a user from Clerk to the local database.
 * If the user doesn't exist, it creates a new auth and profile record.
 */
export const syncUser = async (clerkId: string, email: string, username: string, avatar?: string, provider?: 'local' | 'github' | 'google') => {
  if (!clerkId || !email || !username) {
    throw new ApiError(400, 'clerkId, email, and username are required');
  }

  let user = await authModel.findOne({ clerkId });

  if (!user) {
    // If not found by clerkId, maybe check if they existed locally before clerk migration?
    // The requirements: "If missing create user inside my database"
    // "No duplicates"
    user = await authModel.findOne({ email });

    if (user) {
      // Link existing user to clerk
      user.clerkId = clerkId;
      if (provider) user.provider = provider;
      await user.save();
    } else {
      // Create new user
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        // Ensure username is unique — if taken by another user, append part of clerkId
        let finalUsername = username;
        const existingUsername = await authModel.findOne({ username });
        if (existingUsername) {
          finalUsername = `${username}${clerkId.slice(-6)}`;
        }

        const newUser = await authModel.create([{
          clerkId,
          email,
          username: finalUsername,
          provider: provider || 'local',
          emailVerified: true
        }], { session });
        if (!newUser) throw new ApiError(404, "User not found")
        await profileModel.create([{
          authId: newUser[0]._id,
          name: finalUsername,
          avatar: avatar || '',
          experience: 'Beginner'
        }], { session });

        await session.commitTransaction();
        user = newUser[0];
        
        // Send welcome email if it's a Google provider
        if (provider === 'google') {
            try {
                await sendGoogleAuthWelcomeEmail(
                    email,
                    finalUsername,
                    `https://peeery.onrender.com/profile/setup`,
                    `https://peeery.onrender.com/discover`
                );
            } catch (emailError) {
                console.error('[syncUser] Failed to send welcome email:', emailError);
                // We don't want to abort the transaction just because the email failed
            }
        }

      } catch (error) {
        await session.abortTransaction();
        // Log the real error so it's visible in server logs
        console.error('[syncUser] Transaction failed:', error);
        throw new ApiError(500, `Failed to create user during sync: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        session.endSession();
      }
    }
  } else {
    // Optionally update fields if they changed (like webhook user.updated)
    let isUpdated = false;
    if (user.email !== email) { user.email = email; isUpdated = true; }
    if (user.username !== username) { user.username = username; isUpdated = true; }
    if (isUpdated) await user.save();
  }

  const userObj = user.toObject();
  return { user: userObj };
};

/**
 * Retrieves the current user's profile information by ID.
 */
export const getMe = async (userId: string) => {
  const user = await authRepositary.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isDisabled) {
    throw new ApiError(403, 'Your account has been disabled');
  }

  return user;
};

/**
 * Deletes a user account permanently from the database.
 */
export const deleteAccount = async (userId: string) => {
  const user = await authRepositary.deleteUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return true;
};

/**
 * Disables a user account (soft delete/disable).
 */
export const disableAccount = async (userId: string) => {
  const user = await authRepositary.updateUserStatus(userId, true);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
