import { motion } from 'framer-motion';
import { Flame, Star, Zap, Activity, Users, Trophy } from 'lucide-react';
import type { ContributionSummary } from '../../types/contribution.types';

interface SummaryCardsProps {
    summary: ContributionSummary | null;
    theme?: string | null;
}

export default function SummaryCards({ summary, theme }: SummaryCardsProps) {
    if (!summary) return null;

    const isLight = theme !== "dark";

    const cards = [
        {
            title: 'Current Streak',
            value: `${summary.currentStreak} Days`,
            icon: <Flame size={18} className="text-orange-500" />,
            color: isLight
                ? 'from-orange-500/5 to-transparent border-orange-500/20'
                : 'from-orange-500/10 to-transparent border-orange-500/20'
        },
        {
            title: 'Builder Level',
            value: `Level ${summary.level}`,
            // Flips from Indigo (Dark) to Blue (Light)
            icon: <Star size={18} className={isLight ? "text-blue-500" : "text-indigo-400"} />,
            color: isLight
                ? 'from-blue-500/5 to-transparent border-blue-500/20'
                : 'from-indigo-500/10 to-transparent border-indigo-500/20'
        },
        {
            title: 'Total XP',
            value: summary.totalXp.toLocaleString(),
            icon: <Zap size={18} className="text-amber-500" />,
            color: isLight
                ? 'from-amber-500/5 to-transparent border-amber-500/20'
                : 'from-amber-400/10 to-transparent border-amber-400/20'
        },
        {
            title: 'Activity Score',
            value: summary.activityScore.toLocaleString(),
            icon: <Activity size={18} className={isLight ? "text-emerald-500" : "text-emerald-400"} />,
            color: isLight
                ? 'from-emerald-500/5 to-transparent border-emerald-500/20'
                : 'from-emerald-400/10 to-transparent border-emerald-400/20'
        },
        {
            title: 'Collab Score',
            value: summary.collabScore,
            icon: <Users size={18} className="text-blue-500" />,
            color: isLight
                ? 'from-blue-500/5 to-transparent border-blue-500/20'
                : 'from-blue-400/10 to-transparent border-blue-400/20'
        },
        {
            title: 'Projects Built',
            value: summary.projectsCompleted,
            icon: <Trophy size={18} className="text-yellow-500" />,
            color: isLight
                ? 'from-yellow-500/5 to-transparent border-yellow-500/20'
                : 'from-yellow-500/10 to-transparent border-yellow-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-gradient-to-b ${card.color} rounded-xl p-4 border flex flex-col justify-between transition-colors duration-200
                        ${isLight
                            ? "bg-slate-50/50 border-slate-200"
                            : "bg-[#18181B] border-zinc-800"}`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                            {card.title}
                        </span>
                        {card.icon}
                    </div>
                    <div className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {card.value}
                        </motion.span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}