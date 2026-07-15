import { Router } from 'express';
import { NotificationModel } from '../Models/notification.model.js';
import { asyncHandler } from '../../../Utils/asyncHandler.utils.js';
// import { authMiddleware } from '../../../Middlewares/auth.middleware.js';
import { verifyAuth } from '../../../Middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyAuth, asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false });

    const notifications = await NotificationModel.find({ recipientId: userId }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: notifications });
}));

export default router;
