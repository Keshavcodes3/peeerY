import { useState, useEffect } from 'react';
import { Download, Calendar, Target } from 'lucide-react';
import ContributionCalendar from './ContributionCalendar';
import TimelineSidePanel from './TimelineSidePanel';

import SummaryCards from './SummaryCards';
import contributionService from '../../services/contribution.service';
import type { HeatmapDay, TimelineEvent, ContributionSummary } from '../../types/contribution.types';
import type { PublicProfile } from '../../types/discover.types';

interface ContributionDashboardProps {
    profile: PublicProfile | null;
}

export default function ContributionDashboard({ profile }: ContributionDashboardProps) {
    const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [summary, setSummary] = useState<ContributionSummary | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    // Resolve theme setting dynamic values
    const theme = typeof window !== 'undefined' ? localStorage.getItem("theme") : "dark";
    const isLight = theme !== "dark";

    useEffect(() => {
        if (!profile?._id) return;

        const fetchData = async () => {
            try {
                const [heatmapRes, summaryRes] = await Promise.all([
                    contributionService.getHeatmap(profile.authId, selectedYear),
                    contributionService.getSummary(profile.authId)
                ]);

                if (heatmapRes.success) setHeatmapData(heatmapRes.data);
                if (summaryRes.success) setSummary(summaryRes.data);
            } catch (error) {
                console.error("Failed to fetch contribution data:", error);

                // Fallback empty state if backend isn't populated
                if (heatmapData.length === 0) {
                    const fakeData: HeatmapDay[] = [];
                    const start = new Date(selectedYear, 0, 1);
                    for (let i = 0; i < 365; i++) {
                        const d = new Date(start);
                        d.setDate(start.getDate() + i);
                        fakeData.push({
                            date: d.toISOString().split('T')[0],
                            level: 0,
                            score: 0,
                            xp: 0,
                            events: 0,
                            tasks: 0,
                            projects: 0,
                            reviews: 0,
                            features: 0
                        });
                    }
                    setHeatmapData(fakeData);
                }
            }
        };

        fetchData();
    }, [profile, selectedYear]);

    const handleSelectDate = async (date: string) => {
        setSelectedDate(date);
        setIsPanelOpen(true);
        setIsLoadingTimeline(true);

        if (!profile) return;

        try {
            const res = await contributionService.getTimeline(profile.authId, date);
            if (res.success) {
                setTimelineEvents(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch timeline:", error);
            setTimelineEvents([]);
        } finally {
            setIsLoadingTimeline(false);
        }
    };

    if (!profile) return null;

    return (
        <div className={`rounded-2xl p-6 border shadow-xl overflow-hidden font-sans transition-colors duration-200
            ${isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-[#09090B] border-zinc-800 text-white"}`}
        >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Target className={isLight ? "text-blue-600" : "text-indigo-500"} size={20} />
                        Developer Impact
                    </h2>
                    <p className={`text-sm mt-1 ${isLight ? "text-slate-500" : "text-zinc-500"}`}>
                        Measuring meaningful contributions, beyond just commits.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className={`border text-sm font-semibold rounded-lg px-3 py-2 transition-colors cursor-pointer focus:outline-none
                            ${isLight
                                ? "bg-slate-50 border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                : "bg-[#18181B] border-zinc-800 text-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"}`}
                    >
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                    </select>

                    <button className={`border text-sm font-semibold rounded-lg px-4 py-2 transition-colors flex items-center gap-2
                        ${isLight
                            ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                            : "bg-[#18181B] border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700"}`}
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <SummaryCards summary={summary} theme={theme} />

            {/* Calendar Section */}
            <div className={`rounded-xl border p-6 flex flex-col xl:flex-row gap-6 relative overflow-hidden transition-colors duration-200
                ${isLight
                    ? "bg-slate-50/50 border-slate-200"
                    : "bg-[#09090B] border-zinc-800"}`}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-sm font-semibold flex items-center gap-2 ${isLight ? "text-slate-700" : "text-zinc-300"}`}>
                            <Calendar size={16} className={isLight ? "text-slate-400" : "text-zinc-500"} />
                            Contribution History
                        </h3>

                        {/* Adaptive Legend */}
                        <div className={`flex items-center gap-2 text-[11px] font-medium ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                            <span>Less</span>
                            <div className="flex gap-1">
                                {isLight ? (
                                    <>
                                        <div className="w-3 h-3 rounded-[3px] bg-slate-100 border border-slate-200"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#EFF6FF] border border-[#BFDBFE]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#60A5FA] border border-[#3B82F6]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#3B82F6] border border-[#2563EB]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#2563EB] border border-[#1D4ED8]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#1D4ED8] shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#18181B] border border-zinc-800"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#312E81] border border-[#3730A3]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#4338CA] border border-[#4F46E5]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#4F46E5] border border-[#6366F1]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#6366F1] border border-[#818CF8]"></div>
                                        <div className="w-3 h-3 rounded-[3px] bg-[#818CF8] shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
                                    </>
                                )}
                            </div>
                            <span>More</span>
                        </div>
                    </div>

                    {heatmapData.length > 0 ? (
                        <ContributionCalendar
                            data={heatmapData}
                            selectedDate={selectedDate}
                            onSelectDate={handleSelectDate}
                            theme={theme}
                        />
                    ) : (
                        <div className={`flex flex-col items-center justify-center py-12 ${isLight ? "text-slate-400" : "text-zinc-500"}`}>
                            <Target size={40} className={`mb-4 ${isLight ? "text-slate-200" : "text-zinc-800"}`} />
                            <p className={`font-semibold ${isLight ? "text-slate-700" : "text-zinc-400"}`}>No activity yet</p>
                            <p className="text-sm mt-1 mb-4">Start building to grow your contribution history.</p>
                            <button className={`text-white font-bold py-2 px-6 rounded-lg transition-colors
                                ${isLight
                                    ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                    : "bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]"}`}
                            >
                                Create your first project
                            </button>
                        </div>
                    )}
                </div>

                {/* Side Panel for Timeline */}
                <TimelineSidePanel
                    isOpen={isPanelOpen}
                    date={selectedDate}
                    events={timelineEvents}
                    isLoading={isLoadingTimeline}
                    onClose={() => setIsPanelOpen(false)}
                    theme={theme}
                />
            </div>
        </div>
    );
}