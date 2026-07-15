import type { Request, Response } from 'express';
import { asyncHandler } from '../../../Utils/asyncHandler.utils.js';
import { ContributionDay } from '../Models/ContributionDay.js';
import { ContributionEvent } from '../Models/ContributionEvent.js';

// @desc    Get heatmap data for a user
// @route   GET /api/v1/contributions/heatmap/:userId
export const getHeatmap = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { year } = req.query;

    const query: any = { user: userId };
    
    if (year) {
        query.date = { 
            $regex: `^${year}-` 
        };
    }

    const days = await ContributionDay.find(query).sort({ date: 1 });

    const formatted = days.map(d => ({
        date: d.date,
        level: d.level,
        score: d.score,
        xp: d.totalXp,
        events: d.counts.events,
        tasks: d.counts.tasks,
        projects: d.counts.projects,
        reviews: d.counts.reviews,
        features: d.counts.features
    }));

    return res.status(200).json({
        success: true,
        data: formatted
    });
});

// @desc    Get detailed timeline events for a user and optional date
// @route   GET /api/v1/contributions/timeline/:userId
export const getTimeline = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    const query: any = { user: userId };

    if (date) {
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        query.timestamp = { $gte: startOfDay, $lte: endOfDay };
    }

    const events = await ContributionEvent.find(query)
        .populate('project', 'title')
        .sort({ timestamp: -1 })
        .limit(50);

    const formatted = events.map((e: any) => {
        const typeIcons: Record<string, string> = {
            TASK_COMPLETED: 'CheckCircle',
            PR_MERGED: 'GitMerge',
            REVIEW_GIVEN: 'Eye',
            FEATURE_DELIVERED: 'Rocket',
            PROJECT_CREATED: 'FolderPlus',
            PROJECT_COMPLETED: 'Trophy'
        };

        return {
            icon: typeIcons[e.type] || 'Activity',
            title: e.title,
            project: e.project?.title || 'System',
            xp: e.xp,
            time: e.timestamp.toISOString(),
            type: e.type
        };
    });

    return res.status(200).json({
        success: true,
        data: formatted
    });
});

// @desc    Get contribution summary for a user
// @route   GET /api/v1/contributions/summary/:userId
export const getSummary = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    // Calculate totals from ContributionDay
    const days = await ContributionDay.find({ user: userId });
    
    let totalXp = 0;
    let activityScore = 0;
    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    let collabScore = 0;

    // Simplified streak calc (assumes sorted implicitly or we sort)
    const sortedDays = days.sort((a, b) => a.date.localeCompare(b.date));
    
    // Fake date math for streak for now
    let lastDate: Date | null = null;
    
    sortedDays.forEach(day => {
        totalXp += day.totalXp;
        activityScore += day.score;
        collabScore += day.counts.reviews * 10; // arbitrary logic
        
        const currDate = new Date(day.date);
        if (lastDate) {
            const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
                tempStreak++;
            } else {
                if (tempStreak > maxStreak) maxStreak = tempStreak;
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        lastDate = currDate;
    });

    if (tempStreak > maxStreak) maxStreak = tempStreak;
    
    // If the last day was today or yesterday, they have a current streak
    const today = new Date();
    if (lastDate) {
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
            currentStreak = tempStreak;
        }
    }

    const level = Math.floor(totalXp / 1000) + 1; // 1 level per 1000 XP

    return res.status(200).json({
        success: true,
        data: {
            currentStreak,
            longestStreak: maxStreak,
            totalXp,
            activityScore,
            collabScore,
            level,
            projectsCompleted: days.reduce((acc, d) => acc + d.counts.projects, 0)
        }
    });
});
