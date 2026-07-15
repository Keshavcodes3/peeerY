import type { JwtPayload } from 'jsonwebtoken';

// ─── Strongly-typed req.user payload ────────────────────────────────────────
// The verifyAuth middleware sets req.user to the decoded JWT.
// The JWT is signed with { userId, email } — extend this if your token changes.

export interface AuthUser {
  userId: string; // The database ObjectId as string
  clerkId: string;
  email?: string;
  username?: string;
  imageUrl?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
