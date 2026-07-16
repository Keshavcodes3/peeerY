import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FolderKanban, GitBranch, CircleDot, CheckCircle2, Users, Terminal, Layers, ArrowRight } from "lucide-react"

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
    const activeProject = PROJECTS.find((p) => p.id === selectedId) || PROJECTS[0]

    return (
        <div className="h-full w-full bg-zinc-50/60 rounded-xl font-sans antialiased flex flex-col selection:bg-blue-500/10 selection:text-blue-600 overflow-hidden">
            <header className="h-14 sm:h-16 border-b border-zinc-200/80 bg-white px-4 sm:px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
                        <FolderKanban size={16} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-950 tracking-tight truncate">Project Workspace</h3>
                        <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium hidden sm:block">Branches, review status and team, in one view</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-500 bg-zinc-100/80 px-2.5 py-1 rounded-md border border-zinc-200/40 shrink-0">
                    <Layers size={12} />
                    <span>{PROJECTS.length} active</span>
                </div>
            </header>

            {/* Stacks on mobile, splits side-by-side from lg up */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <main className="lg:w-7/12 p-4 sm:p-6 overflow-y-auto space-y-3 lg:border-r border-zinc-200/60">
                    {PROJECTS.map((project) => {
                        const isSelected = project.id === selectedId
                        return (
                            <div
                                key={project.id}
                                onClick={() => setSelectedId(project.id)}
                                className={`group relative w-full text-left p-4 sm:p-5 bg-white border rounded-xl cursor-pointer transition-all duration-300 select-none ${isSelected ? "border-blue-500 ring-2 ring-blue-500/5 shadow-sm" : "border-zinc-200/80 hover:border-zinc-300 hover:shadow-2xs"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1 min-w-0">
                                        <h4 className="font-semibold text-zinc-900 tracking-tight text-sm sm:text-base group-hover:text-blue-600 transition-colors truncate">
                                            {project.name}
                                        </h4>
                                        <p className="text-[11px] text-zinc-400 font-medium">Updated {project.updatedAt}</p>
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${project.status === "active" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-zinc-100 text-zinc-500 border-zinc-200"
                                            }`}
                                    >
                                        {project.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mt-4">
                                    {project.stack.map((tech) => (
                                        <span key={tech} className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200/40 text-[11px] font-medium text-zinc-600">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-5 flex items-center gap-3">
                                    <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-600 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${project.progress}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-500 tracking-tight shrink-0 w-8 text-right">{project.progress}%</span>
                                </div>

                                <div
                                    className={`absolute right-4 bottom-5 text-blue-500 transition-all duration-300 transform hidden sm:block ${isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0"
                                        }`}
                                >
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        )
                    })}
                </main>

                
            </div>
        </div>
    )
}