import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket, Code2, Users, GitBranch, Crown, CheckCircle2, ArrowRight, Trophy, TerminalSquare, Sparkles } from "lucide-react"

const JOURNEY = [
    {
        id: "beginner",
        title: "Beginner",
        subtitle: "Start Learning",
        icon: Code2,
        skills: ["React", "TypeScript", "Tailwind CSS"],
        projects: ["Portfolio", "Todo App"],
        nextMilestone: "Build a full-stack app",
        current: false,
    },
    {
        id: "builder",
        title: "Builder",
        subtitle: "Ship Projects",
        icon: Rocket,
        skills: ["Node.js", "PostgreSQL", "Next.js"],
        projects: ["SaaS MVP", "E-commerce API"],
        nextMilestone: "Contribute to open source",
        current: true,
    },
    {
        id: "contributor",
        title: "Contributor",
        subtitle: "Open Source",
        icon: GitBranch,
        skills: ["Git Workflows", "CI/CD", "Testing"],
        projects: ["5 merged PRs", "Docs updates"],
        nextMilestone: "Mentor a beginner",
        current: false,
    },
    {
        id: "mentor",
        title: "Mentor",
        subtitle: "Help Others",
        icon: Users,
        skills: ["Code Review", "System Design", "Communication"],
        projects: ["Guided 3 builders", "Tech talks"],
        nextMilestone: "Lead a team",
        current: false,
    },
    {
        id: "founder",
        title: "Founder",
        subtitle: "Build Teams",
        icon: Crown,
        skills: ["Leadership", "Product Strategy", "Architecture"],
        projects: ["Launched product", "Scaled to 10k users"],
        nextMilestone: "Keep shipping",
        current: false,
    },
]

export function RoadmapView() {
    const [activeId, setActiveId] = useState<string | null>("builder")

    return (
        <div className="h-full w-full bg-zinc-50/50 rounded-xl flex flex-col pt-8 sm:pt-12 overflow-y-auto overflow-x-hidden font-sans antialiased selection:bg-blue-500/10 selection:text-blue-600">
            <div className="mb-10 sm:mb-20 text-center px-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/80 text-blue-600 mb-4 shadow-sm backdrop-blur-sm">
                        <Sparkles size={12} className="animate-pulse" />
                        <span className="text-xs font-semibold tracking-wider uppercase">Your Milestone Track</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 max-w-2xl mx-auto leading-[1.15]">
                        From first commit to founder
                    </h3>

                    <p className="mt-4 text-zinc-500 max-w-lg mx-auto text-sm sm:text-base font-normal leading-relaxed px-2">
                        Every stage comes with a peer group at the same level and a mentor one stage ahead.
                    </p>
                </motion.div>
            </div>

            <div className="relative flex-1 flex flex-col items-center pb-16 sm:pb-32">
                <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-zinc-200/60 hidden sm:block overflow-hidden">
                    <motion.div
                        className="w-full bg-gradient-to-b from-blue-400 via-blue-500 to-indigo-500 origin-top"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-2xl px-3 sm:px-4 flex flex-col gap-5 sm:gap-6">
                    {JOURNEY.map((step, index) => {
                        const Icon = step.icon
                        const isExpanded = activeId === step.id
                        const isCurrentLevel = step.current

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex items-start gap-4 sm:gap-6 group cursor-pointer"
                                onClick={() => setActiveId(isExpanded ? null : step.id)}
                            >
                                <div className="relative mt-2 shrink-0 hidden sm:block">
                                    {isCurrentLevel && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        />
                                    )}
                                    <div
                                        className={`relative w-11 h-11 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300 z-10 ${isCurrentLevel
                                                ? "border-blue-500 text-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.25)] ring-4 ring-blue-50"
                                                : isExpanded
                                                    ? "border-blue-400 text-blue-500 shadow-sm"
                                                    : "border-zinc-200 text-zinc-400 group-hover:border-zinc-300 group-hover:text-zinc-600"
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={isCurrentLevel || isExpanded ? 2.2 : 1.8} />
                                    </div>
                                </div>

                                <motion.div
                                    layout="position"
                                    className={`flex-1 bg-white rounded-2xl border p-4 sm:p-5 transition-all duration-300 select-none ${isCurrentLevel ? "border-blue-200 bg-gradient-to-br from-white to-blue-50/[0.15]" : "border-zinc-200/80"
                                        } ${isExpanded ? "border-zinc-300 shadow-[0_12px_38px_-4px_rgba(24,24,27,0.06)] ring-4 ring-zinc-50" : "hover:border-zinc-300 hover:shadow-sm"}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <span className={`sm:hidden p-2 rounded-lg border ${isCurrentLevel ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-zinc-50 border-zinc-100 text-zinc-500"}`}>
                                                <Icon size={16} />
                                            </span>
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">{step.title}</h4>
                                                <p className="text-zinc-400 text-[11px] sm:text-xs mt-0.5 font-medium tracking-wide uppercase">{step.subtitle}</p>
                                            </div>
                                        </div>

                                        {isCurrentLevel && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 border border-blue-700/10 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-zinc-100 mt-4 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div>
                                                        <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                                            <TerminalSquare size={13} className="text-zinc-400" />
                                                            Tech Stack Focus
                                                        </h5>
                                                        <ul className="space-y-1.5">
                                                            {step.skills.map((skill) => (
                                                                <li key={skill} className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                                                                    <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                                                                    {skill}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="flex flex-col justify-between gap-4">
                                                        <div>
                                                            <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                                                <Trophy size={13} className="text-zinc-400" />
                                                                Core Projects
                                                            </h5>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {step.projects.map((project) => (
                                                                    <span key={project} className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-medium shadow-2xs">
                                                                        {project}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="pt-2 border-t border-zinc-50 md:border-none">
                                                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                                                <span>Next up: {step.nextMilestone}</span>
                                                                <ArrowRight size={13} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}