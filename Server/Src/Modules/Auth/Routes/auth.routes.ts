import { Router } from 'express';
import express from 'express';
import * as authController from '../Controllers/auth.controller.js';
import { verifyAuth } from '../../../Middlewares/auth.middleware.js';
import { requireAuth } from '@clerk/express';

const router = Router();

// Protected routes (requireAuth is from Clerk to enforce valid token, verifyAuth loads user from DB)
router.post('/sync', requireAuth(), authController.syncAccount);
router.get('/me', requireAuth(), verifyAuth, authController.getMe);
router.delete('/delete', requireAuth(), verifyAuth, authController.deleteAccount);
router.put('/disable', requireAuth(), verifyAuth, authController.disableAccount);

export default router;
