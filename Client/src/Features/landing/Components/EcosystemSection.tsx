import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RoadmapAnimation = () => {
    const steps = ["React", "TypeScript", "Backend", "System Design"];
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % steps.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full py-8 relative">
            {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center">
                    <motion.div
                        animate={{
                            backgroundColor: activeIndex === idx ? '#2563EB' : '#f4f4f5',
                            color: activeIndex === idx ? '#ffffff' : '#71717a',
                            borderColor: activeIndex === idx ? '#2563EB' : '#e4e4e7',
                            scale: activeIndex === idx ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
                    >
                        {step}
                    </motion.div>
                    {idx < steps.length - 1 && (
                        <motion.div
                            animate={{ backgroundColor: activeIndex >= idx + 1 ? '#2563EB' : '#e4e4e7' }}
                            className="w-[2px] h-6 my-1"
                        />
                    )}
                </div>
            ))}
            <div className="absolute top-4 right-4 sm:top-10 sm:right-10 font-handwriting text-blue-600/70 text-lg sm:text-xl rotate-[-6deg] hidden sm:block">
                start here →
            </div>
        </div>
    );
};

export default function EcosystemSection() {
    return (
        <section id="discover" className="w-full bg-white py-20 sm:py-28 md:py-32 px-5 sm:px-12 lg:px-24">
            <div className="max-w-[1200px] mx-auto">

                <div className="mb-14 sm:mb-24 max-w-2xl">
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.08] sm:leading-[1.05]">
                        Everything you need <br className="hidden sm:block" /> to learn, build <br className="hidden sm:block" /> and <span className="text-blue-600">ship, together.</span>
                    </h2>
                    <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-zinc-500 leading-relaxed max-w-lg">
                        Most platforms solve one problem. PeerY combines matching, learning, project workspaces and AI guidance into a single builder ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                    {/* Card 01 - Roadmaps */}
                    <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-200 overflow-hidden flex flex-col h-[400px] sm:h-[450px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
                        <div className="p-6 sm:p-10 pb-0 flex-shrink-0 relative z-20">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-3 block">LEARN</span>
                            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">Structured Roadmaps</h3>
                            <p className="text-zinc-500 mt-2 text-sm max-w-[250px] leading-relaxed">
                                Follow curated learning paths without wondering what to learn next.
                            </p>
                        </div>
                        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-transparent to-zinc-50/50 mt-4">
                            <RoadmapAnimation />
                        </div>
                    </div>

                    {/* Card 02 - AI Mentor */}
                    <div className="group relative h-[400px] sm:h-[450px] overflow-hidden rounded-[28px] sm:rounded-[36px] border border-zinc-200 bg-white hover:border-blue-100 hover:shadow-[0_30px_80px_rgba(37,99,235,0.08)] transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-blue-50/30" />

                        <div className="absolute right-3 top-1 sm:right-6 sm:top-2 text-[90px] sm:text-[140px] font-black leading-none text-blue-50 select-none pointer-events-none">
                            AI
                        </div>

                        <div className="relative z-10 p-6 sm:p-10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600">GUIDANCE</span>
                            <h3 className="mt-4 text-2xl sm:text-[30px] font-bold tracking-tight text-zinc-950">
                                Never wonder
                                <br />
                                what's next.
                            </h3>
                        </div>

                        <div className="absolute left-8 sm:left-12 top-[130px] sm:top-[150px] right-8 sm:right-12 bottom-8 sm:bottom-10">
                            <div className="relative h-full">
                                <div className="absolute left-[11px] top-4 bottom-4 w-px bg-zinc-200" />

                                {["React", "TypeScript", "Backend", "System Design", "Projects", "Open Source"].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="relative flex items-center gap-4 mb-4 sm:mb-5"
                                    >
                                        <div className="h-6 w-6 rounded-full border border-zinc-200 bg-white flex items-center justify-center shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-zinc-400" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-700">{item}</span>
                                    </motion.div>
                                ))}

                                <motion.div
                                    animate={{ y: [0, 45, 90, 135, 180, 225, 0] }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                    className="absolute left-[2px] top-[12px] h-5 w-5 rounded-full bg-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.8)]"
                                />
                            </div>
                        </div>

                        <div className="absolute right-5 bottom-5 sm:right-8 sm:bottom-6 rotate-[-5deg] font-handwriting text-lg sm:text-xl text-blue-500/70 hidden sm:block">
                            figuring out what's next?
                        </div>
                    </div>

                    {/* Card 03 - Peer Matching */}
                    <div className="group relative h-[420px] sm:h-[450px] overflow-hidden rounded-[28px] sm:rounded-[36px] border border-zinc-200 bg-white p-6 sm:p-10 transition-all duration-500 hover:border-blue-100 hover:shadow-[0_30px_80px_rgba(37,99,235,0.08)]">
                        <div className="absolute -right-4 -top-4 sm:-right-6 sm:-top-6 text-[90px] sm:text-[140px] font-black tracking-[-0.08em] text-blue-50 select-none pointer-events-none leading-none">
                            MATCH
                        </div>

                        <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600">CONNECT</span>

                        <div className="relative z-10 mt-6 sm:mt-8">
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-4xl sm:text-[48px] leading-[0.9] tracking-[-0.05em] font-black text-zinc-950"
                            >
                                WE FIND
                                <br />
                                THE
                                <span className="text-blue-600"> OTHERS.</span>
                            </motion.h3>

                            <p className="mt-5 sm:mt-6 max-w-[260px] text-sm leading-relaxed text-zinc-500">
                                People building the same things, learning the same skills and solving the same problems.
                            </p>
                        </div>

                        <div className="absolute left-6 right-6 sm:left-10 sm:right-10 bottom-20 sm:bottom-24 flex flex-wrap gap-2.5 sm:gap-3">
                            {["React", "TypeScript", "Backend", "AI", "Open Source", "System Design"].map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    whileHover={{ y: -3 }}
                                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                            className="absolute left-6 sm:left-10 bottom-8 sm:bottom-10 flex items-center gap-3"
                        >
                            <div className="h-2 w-2 rounded-full bg-blue-600" />
                            <span className="text-sm font-semibold text-zinc-900">2,431 active builders</span>
                        </motion.div>
                    </div>

                    {/* Card 04 - Projects & Chat */}
                    <div className="group relative h-[420px] sm:h-[450px] overflow-hidden rounded-[28px] sm:rounded-[36px] border border-zinc-200 bg-white p-6 sm:p-10 transition-all duration-500 hover:border-blue-100 hover:shadow-[0_30px_80px_rgba(37,99,235,0.08)]">
                        <div className="absolute -right-2 -top-4 sm:-right-4 sm:-top-6 text-[90px] sm:text-[140px] font-black tracking-[-0.08em] text-blue-50 leading-none select-none pointer-events-none">
                            BUILD
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600">BUILD</span>

                        <h3 className="mt-4 sm:mt-5 text-3xl sm:text-[42px] leading-[0.95] tracking-[-0.05em] font-black text-zinc-950">
                            Turn Ideas
                            <br />
                            Into Reality.
                        </h3>

                        <p className="mt-3 sm:mt-4 max-w-[280px] text-sm leading-relaxed text-zinc-500">
                            Find teammates, spin up a project, and coordinate work in a shared Kanban board.
                        </p>

                        <div className="absolute left-6 right-6 sm:left-10 sm:right-10 bottom-16 sm:bottom-20 flex items-center justify-between">
                            {["Idea", "Team", "Build", "Ship"].map((step, index) => (
                                <div key={step} className="relative flex flex-col items-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.08, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-sm"
                                    >
                                        {index + 1}
                                    </motion.div>
                                    <span className="mt-2 sm:mt-3 text-[11px] sm:text-xs font-medium text-zinc-600">{step}</span>
                                    {index !== 3 && <div className="absolute top-5 sm:top-6 left-full h-px w-[45px] sm:w-[80px] bg-zinc-200" />}
                                </div>
                            ))}
                        </div>

                        <motion.div
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute left-6 sm:left-10 bottom-8 sm:bottom-10 flex items-center gap-2"
                        >
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-zinc-700">124 projects currently active</span>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}