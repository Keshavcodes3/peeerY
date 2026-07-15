import { Request, Response } from 'express';
import crypto from 'crypto';
import ProfileModel from '../Models/ExtendedProfile.model.js';

export const handleGithubWebhook = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const signature = req.headers['x-hub-signature-256'] as string;
    
    if (!signature) return res.status(401).json({ success: false, message: 'No signature' });

    const profile = await ProfileModel.findById(userId);
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    // Verify HMAC
    const hmac = crypto.createHmac('sha256', profile.githubWebhookSecret);
    const digest = Buffer.from(signature.split('=')[1], 'hex');
    const checksum = hmac.update(JSON.stringify(req.body)).digest();

    if (!crypto.timingSafeEqual(digest, checksum)) {
        return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    // Logic: push events
    if (req.headers['x-github-event'] === 'push') {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Atomic update: increment total and day-specific
        await ProfileModel.updateOne(
            { _id: userId, "contributionHistory.date": { $ne: date } },
            { $push: { contributionHistory: { date, count: 1 } } }
        );

        await ProfileModel.updateOne(
            { _id: userId, "contributionHistory.date": date },
            { 
                $inc: { 
                    totalContributions: 1,
                    "contributionHistory.$.count": 1 
                } 
            }
        );

        // Rank promotion logic
        const updatedProfile = await ProfileModel.findById(userId);
        if (updatedProfile) {
            let newRank: 'A' | 'B' | 'C' | 'F' = 'F';
            if (updatedProfile.totalContributions > 5000) newRank = 'A';
            else if (updatedProfile.totalContributions > 1500) newRank = 'B';
            else if (updatedProfile.totalContributions > 500) newRank = 'C';
            
            if (updatedProfile.rank !== newRank) {
                updatedProfile.rank = newRank;
                await updatedProfile.save();
            }
        }
    }

    res.status(200).json({ success: true });
};
