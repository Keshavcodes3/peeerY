import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeatmapDay } from '../../types/contribution.types';

interface ContributionCalendarProps {
    data: HeatmapDay[];
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
    theme?: string | null;
}

export default function ContributionCalendar({ data, selectedDate, onSelectDate, theme }: ContributionCalendarProps) {
    const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

    const isLight = theme !== "dark";

    // Dynamic coloring system: Level 0 returns white for light mode, 1-5 maps blue levels
    const getLevelColor = (level: number) => {
        if (isLight) {
            switch (level) {
                case 1: return 'bg-[#EFF6FF] border-[#BFDBFE]'; // Very Light Blue
                case 2: return 'bg-[#60A5FA] border-[#3B82F6]'; // Light Blue
                case 3: return 'bg-[#3B82F6] border-[#2563EB]'; // Blue
                case 4: return 'bg-[#2563EB] border-[#1D4ED8]'; // Royal Dark Blue
                case 5: return 'bg-[#1D4ED8] border-[#1E40AF] shadow-[0_0_12px_rgba(37,99,235,0.4)]'; // Deep Blue Glow
                default: return 'bg-white border-slate-200'; // 0 contributions -> clean white background
            }
        } else {
            switch (level) {
                case 1: return 'bg-[#312E81] border-[#3730A3]'; // Slate Blue
                case 2: return 'bg-[#4338CA] border-[#4F46E5]'; // Indigo
                case 3: return 'bg-[#4F46E5] border-[#6366F1]'; // Royal Blue
                case 4: return 'bg-[#6366F1] border-[#818CF8]'; // Bright Blue
                case 5: return 'bg-[#818CF8] border-[#A5B4FC] shadow-[0_0_12px_rgba(129,140,248,0.5)]'; // Electric Indigo Glow
                default: return 'bg-[#18181B] border-[#27272A]'; // Neutral dark state
            }
        }
    };

    // Calculate grid dynamically grouped by week blocks
    const weeks = useMemo(() => {
        const result: HeatmapDay[][] = [];
        let currentWeek: HeatmapDay[] = [];

        data.forEach((day, i) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || i === data.length - 1) {
                result.push(currentWeek);
                currentWeek = [];
            }
        });
        return result;
    }, [data]);

    return (
        <div className="relative w-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-[6px] min-w-max p-2">
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[6px]">
                        {week.map((day) => {
                            const isSelected = selectedDate === day.date;
                            const isHovered = hoveredDay?.date === day.date;

                            // Adaptive selection rings
                            const activeSelectionClasses = isSelected
                                ? isLight
                                    ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white'
                                    : 'ring-2 ring-white ring-offset-2 ring-offset-[#09090B]'
                                : '';

                            return (
                                <div key={day.date} className="relative group">
                                    <motion.button
                                        whileHover={{ scale: 1.15, zIndex: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onSelectDate(day.date)}
                                        onMouseEnter={() => setHoveredDay(day)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                        className={`w-3.5 h-3.5 rounded-[4px] border transition-colors duration-200 focus:outline-none focus:ring-2 
                                            ${isLight ? 'focus:ring-blue-500' : 'focus:ring-[#818CF8]'} 
                                            ${getLevelColor(day.level)} ${activeSelectionClasses}`}
                                    />

                                    {/* Tooltip implementation */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-xl p-3 shadow-2xl z-50 pointer-events-none border
                                                    ${isLight
                                                        ? 'bg-white border-slate-200 shadow-slate-200/55'
                                                        : 'bg-[#18181B] border-zinc-800'}`}
                                            >
                                                <p className={`text-[11px] font-medium mb-1 ${isLight ? 'text-slate-400' : 'text-zinc-400'}`}>
                                                    {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className={`text-sm font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                                    {day.xp} XP Earned
                                                </p>

                                                <div className={`space-y-1 mt-2 border-t pt-2 ${isLight ? 'border-slate-100' : 'border-zinc-800'}`}>
                                                    {day.tasks > 0 && <div className="flex justify-between text-[11px]"><span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>Tasks</span><span className={isLight ? 'text-slate-700 font-semibold' : 'text-zinc-300 font-semibold'}>{day.tasks}</span></div>}
                                                    {day.reviews > 0 && <div className="flex justify-between text-[11px]"><span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>Reviews</span><span className={isLight ? 'text-slate-700 font-semibold' : 'text-zinc-300 font-semibold'}>{day.reviews}</span></div>}
                                                    {day.projects > 0 && <div className="flex justify-between text-[11px]"><span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>Projects</span><span className={isLight ? 'text-slate-700 font-semibold' : 'text-zinc-300 font-semibold'}>{day.projects}</span></div>}
                                                    {day.features > 0 && <div className="flex justify-between text-[11px]"><span className={isLight ? 'text-slate-400' : 'text-zinc-500'}>Features</span><span className={isLight ? 'text-slate-700 font-semibold' : 'text-zinc-300 font-semibold'}>{day.features}</span></div>}

                                                    {day.events === 0 && <p className={`text-[11px] italic ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>No activity</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}