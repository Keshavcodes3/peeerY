import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Users, FolderKanban, Sparkles, GitPullRequest, Sliders, Play } from "lucide-react"

import { RoadmapView } from "./Sections/RoadmapView"
import { PeerView } from "./Sections/PeerView"
import { ProjectView } from "./Sections/ProjectView"
import { AiMentorView } from "./Sections/AiMentorView"
import { ContributionView } from "./Sections/ContributionView"

const SECTIONS = [
    { id: "roadmap", title: "Builder Roadmap", desc: "Your milestone track, laid out clearly", icon: Map, component: RoadmapView },
    { id: "peers", title: "Peer Network", desc: "Real people, real activity, right now", icon: Users, component: PeerView },
    { id: "projects", title: "Projects", desc: "From idea to shipped, tracked in one place", icon: FolderKanban, component: ProjectView },
    { id: "mentor", title: "AI Mentor", desc: "A second opinion, available any hour", icon: Sparkles, component: AiMentorView },
    { id: "contributions", title: "Open Source", desc: "Your commits and PRs, all in view", icon: GitPullRequest, component: ContributionView },
]

export default function StickyWorkspace() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAutoMode, setIsAutoMode] = useState(true)

    useEffect(() => {
        if (!isAutoMode) return
        const interval = setInterval(() => setActiveIndex((prev) => (prev + 1) % SECTIONS.length), 4500)
        return () => clearInterval(interval)
    }, [isAutoMode])

    const handleTabClick = (idx: number) => {
        setActiveIndex(idx)
        setIsAutoMode(false)
    }

    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 bg-white selection:bg-blue-50 selection:text-blue-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-100">
                <div className="text-left space-y-1 w-full sm:w-auto">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 uppercase font-sans">Workspace Preview</h2>
                    <p className="text-xs font-normal text-zinc-400">What you land in after your first match.</p>
                </div>

                <div className="flex p-1 bg-zinc-100/80 border border-zinc-200/40 rounded-full shadow-inner relative z-30 shrink-0">
                    <button
                        onClick={() => setIsAutoMode(false)}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${!isAutoMode ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/60" : "text-zinc-400 hover:text-zinc-600"
                            }`}
                    >
                        <Sliders size={12} className={!isAutoMode ? "text-blue-600" : ""} />
                        Manual
                    </button>
                    <button
                        onClick={() => setIsAutoMode(true)}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${isAutoMode ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/60" : "text-zinc-400 hover:text-zinc-600"
                            }`}
                    >
                        <Play size={12} className={isAutoMode ? "text-blue-600 fill-blue-600/10" : ""} />
                        Auto
                    </button>
                </div>
            </div>

            {/* Scrollable on mobile so the dock never overflows the viewport */}
            <div className="flex justify-start sm:justify-center mb-8 sm:mb-10 relative z-30 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto no-scrollbar">
                <div className="inline-flex items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-200/80 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.01)] backdrop-blur-md">
                    {SECTIONS.map((section, idx) => {
                        const isActive = idx === activeIndex
                        const Icon = section.icon
                        return (
                            <button
                                key={section.id}
                                onClick={() => handleTabClick(idx)}
                                className={`relative px-3.5 sm:px-5 py-2.5 rounded-full flex items-center gap-2 sm:gap-2.5 text-xs font-medium tracking-tight whitespace-nowrap transition-colors duration-300 outline-none cursor-pointer ${isActive ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-900"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="workspace-dock-pill"
                                        className="absolute inset-0 bg-white border border-zinc-200 shadow-sm rounded-full overflow-hidden"
                                        transition={{ type: "spring", bounce: 0.12, duration: 0.5 }}
                                    >
                                        {isAutoMode && (
                                            <motion.div
                                                initial={{ x: "-100%" }}
                                                animate={{ x: "0%" }}
                                                key={activeIndex}
                                                transition={{ duration: 4.5, ease: "linear" }}
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600/80 origin-left"
                                            />
                                        )}
                                    </motion.div>
                                )}
                                <span className="relative z-10 flex items-center justify-center">
                                    <Icon size={14} className={isActive ? "text-blue-600" : "text-zinc-400"} strokeWidth={2.2} />
                                </span>
                                <span className="relative z-10 font-sans uppercase text-[11px] font-bold tracking-wider hidden xs:inline sm:inline">
                                    {section.title.split(" ")[0]}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="w-full bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.02)] flex flex-col relative z-20 min-h-[560px] sm:min-h-[620px] md:min-h-[680px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-5 sm:px-8 py-4 sm:py-5 gap-2 sm:gap-4">
                    <div className="space-y-0.5 text-left">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isAutoMode ? "bg-blue-600 animate-pulse" : "bg-zinc-900"}`} />
                            <h3 className="text-sm font-bold tracking-tight text-zinc-900 uppercase font-sans">{SECTIONS[activeIndex].title}</h3>
                        </div>
                        <p className="text-xs font-normal text-zinc-400">{SECTIONS[activeIndex].desc}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                        <span>mode // {isAutoMode ? "auto" : "manual"}</span>
                        <span>node // 0{activeIndex + 1}</span>
                    </div>
                </div>

                <div className="flex-1 bg-white relative p-4 sm:p-6 md:p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#fcfcfc_1px,transparent_1px),linear-gradient(to_bottom,#fcfcfc_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none -z-10" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full h-full"
                        >
                            {(() => {
                                const ActiveComponent = SECTIONS[activeIndex].component
                                return <ActiveComponent />
                            })()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}