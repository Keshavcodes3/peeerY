import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FolderKanban,
    GitBranch,
    CircleDot,
    CheckCircle2,
    Users,
    Terminal,
    Layers,
    ArrowRight
} from "lucide-react"

const PROJECTS = [
    {
        id: "resume-analyzer",
        name: "AI Resume Analyzer",
        stack: ["Next.js", "Python", "OpenAI"],
        status: "active",
        progress: 72,
        team: 3,
        updatedAt: "2m ago",
        branches: [
            { name: "feat(auth)", status: "merged", author: "Alex" },
            { name: "feat(chat)", status: "merged", author: "Sam" },
            { name: "fix(parser)", status: "open", author: "You" },
        ],
    },
    {
        id: "devconnect-api",
        name: "DevConnect API",
        stack: ["Express", "PostgreSQL", "Redis"],
        status: "review",
        progress: 45,
        team: 2,
        updatedAt: "1h ago",
        branches: [
            { name: "feat(matching)", status: "merged", author: "You" },
            { name: "feat(notifications)", status: "open", author: "Jordan" },
        ],
    },
]

export function ProjectView() {
    const [selectedId, setSelectedId] = useState(PROJECTS[0].id)
    const activeProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0]

    return (
        <div className="h-screen w-full bg-zinc-50/60 font-sans antialiased flex flex-col selection:bg-orange-500/10 selection:text-orange-600">
            {/* Top Minimal Navigation Bar */}
            <header className="h-16 border-b border-zinc-200/80 bg-white px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                        <FolderKanban size={16} strokeWidth={2.2} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-950 tracking-tight">Workspace Engines</h3>
                        <p className="text-[11px] text-zinc-400 font-medium">Track development branches and execution status</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 bg-zinc-100/80 px-2.5 py-1 rounded-md border border-zinc-200/40">
                    <Layers size={12} />
                    <span>{PROJECTS.length} Active Environments</span>
                </div>
            </header>

            {/* Split Screen Dashboard Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Column: Interactive Project Grid Selector */}
                <main className="w-7/12 p-6 overflow-y-auto space-y-3 border-r border-zinc-200/60">
                    {PROJECTS.map((project) => {
                        const isSelected = project.id === selectedId
                        return (
                            <div
                                key={project.id}
                                onClick={() => setSelectedId(project.id)}
                                className={`group relative w-full text-left p-5 bg-white border rounded-xl cursor-pointer transition-all duration-300 select-none
                                    ${isSelected
                                        ? "border-orange-500 ring-2 ring-orange-500/5 shadow-sm"
                                        : "border-zinc-200/80 hover:border-zinc-300 hover:shadow-2xs"
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-zinc-900 tracking-tight text-base group-hover:text-orange-600 transition-colors">
                                            {project.name}
                                        </h4>
                                        <p className="text-[11px] text-zinc-400 font-medium">Updated {project.updatedAt}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0
                                        ${project.status === 'active'
                                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
                                    >
                                        {project.status}
                                    </span>
                                </div>

                                {/* Stack Tag Pills */}
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                    {project.stack.map(tech => (
                                        <span key={tech} className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200/40 text-[11px] font-medium text-zinc-600">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Inline Micro Progress Track */}
                                <div className="mt-5 flex items-center gap-3">
                                    <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-orange-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${project.progress}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-500 tracking-tight shrink-0 w-8 text-right">
                                        {project.progress}%
                                    </span>
                                </div>

                                {/* Right pointing micro arrow for indicator feedback */}
                                <div className={`absolute right-4 bottom-5 text-orange-500 transition-all duration-300 transform
                                    ${isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0"}`}
                                >
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        )
                    })}
                </main>

                {/* Right Column: Code/Git Branch Environment Inspector */}
                <aside className="w-5/12 bg-zinc-950 flex flex-col text-zinc-400 overflow-hidden relative">

                    {/* Background Subtle Tech Grid Glow Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeProject.id}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 flex flex-col p-6 z-10 h-full overflow-y-auto"
                        >
                            {/* Panel Header */}
                            <div className="border-b border-zinc-800/80 pb-4 mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal size={14} className="text-orange-500" />
                                    <span className="text-xs font-mono font-semibold tracking-wider text-zinc-200 uppercase">
                                        Branch Inspector
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                                    <Users size={11} />
                                    <span>{activeProject.team} devs</span>
                                </div>
                            </div>

                            {/* Git Target Stream Lists */}
                            <div className="space-y-2.5 flex-1">
                                {activeProject.branches.map((branch, index) => (
                                    <motion.div
                                        key={branch.name}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800/80 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <GitBranch size={14} className={branch.status === 'open' ? 'text-orange-500' : 'text-zinc-600'} />
                                            <div className="truncate">
                                                <p className="font-mono text-xs text-zinc-200 truncate font-medium">{branch.name}</p>
                                                <p className="text-[10px] text-zinc-500 mt-0.5 font-sans">Author: {branch.author}</p>
                                            </div>
                                        </div>

                                        <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold tracking-tight shrink-0 ml-3
                                            ${branch.status === 'merged' ? 'text-emerald-500' : 'text-orange-500'}`}
                                        >
                                            {branch.status === 'merged'
                                                ? <><CheckCircle2 size={12} strokeWidth={2.5} /> merged</>
                                                : <><CircleDot size={12} strokeWidth={2.5} className="animate-pulse" /> open</>
                                            }
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bottom Context Terminal Footer */}
                            <div className="mt-auto pt-6 border-t border-zinc-900 text-[11px] font-mono text-zinc-600">
                                <span className="text-zinc-500">SYSTEM:</span> Listening for inbound webhooks on <span className="text-zinc-400 font-medium">main</span>...
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </aside>

            </div>
        </div>
    )
}