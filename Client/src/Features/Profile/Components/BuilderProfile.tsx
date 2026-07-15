import { Users, Trophy } from 'lucide-react';
import { ContributionGraph } from './ContributionGraph';


export const BuilderProfile = ({ user }: { user: any }) => {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Hero / Avatar */}
                <div className="lg:col-span-12 flex items-center gap-6 p-6 bg-zinc-950 rounded-3xl border border-zinc-800">
                    <div className="w-24 h-24 rounded-full border-2 border-cyan-500 p-1 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-cyan-400 font-mono">@{user.username}</p>
                    </div>
                </div>

                {/* Left Col */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
                        <h2 className="text-xl font-bold mb-4">Activity</h2>
                        <ContributionGraph data={user.contributionHistory} />
                    </div>
                </div>

                {/* Right Col */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
                            <Users className="text-cyan-500" />
                            <div><p className="text-xs text-zinc-500">Followers</p><p className="font-bold text-lg">{user.followersCount}</p></div>
                        </div>
                        <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
                            <Trophy className="text-cyan-500" />
                            <div><p className="text-xs text-zinc-500">Rank</p><p className="font-bold text-lg">{user.rank}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
