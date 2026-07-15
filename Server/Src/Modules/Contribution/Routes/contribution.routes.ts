import { Router } from 'express';
import { getHeatmap, getTimeline, getSummary } from '../Controllers/contribution.controller.js';
import { verifyAuth } from '../../../Middlewares/auth.middleware.js';

const router = Router();

router.get('/heatmap/:userId', verifyAuth, getHeatmap);
router.get('/timeline/:userId', verifyAuth, getTimeline);
router.get('/summary/:userId', verifyAuth, getSummary);

export default router;
