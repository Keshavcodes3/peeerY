import { useMemo } from 'react';

interface ContributionData {
    date: string; // YYYY-MM-DD
    count: number;
}

export const ContributionGraph = ({ data }: { data: ContributionData[] }) => {
    // Generate 52 weeks of dates
    const grid = useMemo(() => {
        const result = [];
        for (let i = 0; i < 365; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (365 - i));
            const dateStr = d.toISOString().split('T')[0];
            const found = data.find(item => item.date === dateStr);
            result.push({ date: dateStr, count: found?.count ?? 0 });
        }
        return result;
    }, [data]);

    const getIntensity = (count: number) => {
        if (count === 0) return 'bg-zinc-900';
        if (count < 3) return 'bg-cyan-900';
        if (count < 6) return 'bg-cyan-700';
        return 'bg-cyan-400';
    };

    return (
        <div className="flex gap-1 overflow-x-auto p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
            {grid.map((day, i) => (
                <div 
                    key={i}
                    className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors duration-200 hover:scale-125 cursor-pointer relative group`}
                >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-zinc-900 text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                        {day.count} contributions on {day.date}
                    </div>
                </div>
            ))}
        </div>
    );
};
