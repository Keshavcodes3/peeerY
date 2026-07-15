import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, GitMerge, Eye, Rocket, FolderPlus, Trophy, Activity, Loader2 } from 'lucide-react';
import type { TimelineEvent } from '../../types/contribution.types';

interface TimelineSidePanelProps {
    isOpen: boolean;
    date: string | null;
    events: TimelineEvent[];
    isLoading: boolean;
    onClose: () => void;
    theme?: string | null;
}

export default function TimelineSidePanel({ isOpen, date, events, isLoading, onClose, theme }: TimelineSidePanelProps) {
    const isLight = theme !== "dark";

    const renderIcon = (iconName: string) => {
        const props = {
            size: 16,
            className: isLight ? 'text-blue-500' : 'text-indigo-400'
        };
        switch (iconName) {
            case 'CheckCircle': return <CheckCircle {...props} />;
            case 'GitMerge': return <GitMerge {...props} />;
            case 'Eye': return <Eye {...props} />;
            case 'Rocket': return <Rocket {...props} />;
            case 'FolderPlus': return <FolderPlus {...props} />;
            case 'Trophy': return <Trophy className="text-amber-500" size={16} />;
            default: return <Activity {...props} />;
        }
    };

    const formattedDate = date
        ? new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
        : '';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`w-80 shrink-0 rounded-2xl border shadow-xl overflow-hidden flex flex-col max-h-[500px] transition-colors duration-200
                        ${isLight
                            ? 'bg-white border-slate-200 shadow-slate-100'
                            : 'bg-[#18181B] border-zinc-800'}`}
                >
                    {/* Header */}
                    <div className={`p-5 border-b flex items-center justify-between transition-colors duration-200
                        ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#09090B] border-zinc-800'}`}>
                        <div>
                            <h3 className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Daily Activity</h3>
                            <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{formattedDate}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                ${isLight
                                    ? 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
                        {isLoading ? (
                            <div className={`flex flex-col items-center justify-center h-full space-y-3 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                                <Loader2 className={`animate-spin ${isLight ? 'text-blue-500' : 'text-indigo-500'}`} size={24} />
                                <p className="text-sm font-medium">Loading events...</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className={`flex flex-col items-center justify-center h-full text-center ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                                <Activity size={32} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">No recorded activity</p>
                                <p className="text-xs mt-1 opacity-60">Take a break, you earned it.</p>
                            </div>
                        ) : (
                            <div className={`space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 
                                ${isLight ? 'before:bg-slate-100' : 'before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent'}`}>
                                {events.map((event, idx) => {
                                    const time = new Date(event.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="relative flex items-start justify-between gap-4"
                                        >
                                            {/* Line Node */}
                                            <div className={`absolute left-0 mt-1 w-[22px] h-[22px] rounded-full flex items-center justify-center z-10 shadow-sm border-4
                                                ${isLight
                                                    ? 'bg-white border-slate-50'
                                                    : 'bg-[#18181B] border-[#09090B]'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-blue-500' : 'bg-indigo-500'}`} />
                                            </div>

                                            <div className="pl-8 flex-1">
                                                <div className={`flex items-center gap-2 mb-1 text-xs font-semibold ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                                                    <span>{time}</span>
                                                    <span className={`w-1 h-1 rounded-full ${isLight ? 'bg-slate-300' : 'bg-zinc-700'}`} />
                                                    <span className={isLight ? 'text-blue-600' : 'text-indigo-400'}>{event.project}</span>
                                                </div>
                                                <h4 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{event.title}</h4>

                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border
                                                    ${isLight
                                                        ? 'bg-blue-50 border-blue-100 text-blue-600'
                                                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}
                                                >
                                                    {renderIcon(event.icon)}
                                                    <span className="text-xs font-bold">+{event.xp} XP</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}