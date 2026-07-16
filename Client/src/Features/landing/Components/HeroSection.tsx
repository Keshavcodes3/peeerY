import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { useEffect, useState, useRef } from "react";
import { Layers, Users2, Workflow, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const PLATFORM_PILLARS = [
  {
    id: "intent-lock",
    icon: Layers,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50/70 border-blue-100",
    headline: "Mutual match, not cold DMs",
    detail: "Chat only opens once both sides commit to the same project brief. No open inboxes, no networking noise.",
    tag: "Intent Matching",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/50",
  },
  {
    id: "vetted-teams",
    icon: Users2,
    iconColor: "text-zinc-900",
    iconBg: "bg-zinc-100/80 border-zinc-200",
    headline: "Matched on stack, not vibes",
    detail: "Skills, tech stack, timezone and shipping history all factor into every match score — no swiping through noise.",
    tag: "Real Signal",
    tagColor: "bg-zinc-100 text-zinc-900 border-zinc-300/60",
  },
  {
    id: "execution-first",
    icon: Workflow,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50/70 border-blue-100",
    headline: "A workspace on day one",
    detail: "Land straight in a Kanban board, milestones and a shared repo view — no separate tool to set up.",
    tag: "Zero Setup",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/50",
  },
];

export function HeroSection() {
  const { isSignedIn } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setActiveIndex((prev) => (prev + 1) % PLATFORM_PILLARS.length), 4200);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty("--mouse-x", `${e.clientX - left}px`);
    containerRef.current.style.setProperty("--mouse-y", `${e.clientY - top}px`);
  };

  const currentPillar = PLATFORM_PILLARS[activeIndex];
  const Icon = currentPillar.icon;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-28 px-5 sm:px-8 md:px-12 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-12 lg:gap-20 overflow-hidden bg-white"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4] transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(37, 99, 235, 0.04), transparent 80%)`,
        }}
      />

      <div className="flex-1 space-y-8 sm:space-y-10 z-10 max-w-2xl text-left w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-200/80 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold tracking-wide text-zinc-700">The dev-matching network</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-bold tracking-tight text-zinc-900 leading-[1.05]">
            Stop building
            <br />
            alone. Start{" "}
            <span className="relative inline-block text-zinc-950">
              shipping.
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-1.5 text-blue-600 overflow-visible"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M 2 5 Q 50 6 98 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg text-zinc-500 max-w-lg leading-relaxed font-normal">
            PeerY matches you with developers by skill, stack and timezone — then drops you straight into a shared
            workspace so you go from "want to build this?" to a first commit in the same afternoon.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <Link to={isSignedIn ? "/dashboard" : "/register"} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-sm font-medium px-8 h-12 bg-zinc-950 text-white hover:bg-zinc-800 border border-zinc-950 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isSignedIn ? "Open dashboard" : "Find a co-builder"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-blue-400" />
            </Button>
          </Link>

          <Link to="/discover" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-sm font-medium px-8 h-12 border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all duration-200 cursor-pointer"
            >
              Browse active builds
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-6 border-t border-zinc-100 flex flex-wrap items-center gap-x-6 gap-y-3 text-zinc-400 text-sm font-normal"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0" />
            <span>No open-chat spam</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Mutual acceptance, every time</span>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 w-full max-w-md z-10 relative">
        <div className="absolute -inset-4 bg-zinc-50 rounded-2xl filter blur-md opacity-30 pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60 px-5 sm:px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-xs font-semibold text-zinc-800 tracking-tight">How PeerY matches you</span>
            </div>
            <span className="text-[11px] font-mono font-medium text-zinc-400 tracking-wide hidden sm:inline">core_mechanics</span>
          </div>

          <div className="px-6 sm:px-8 py-8 sm:py-10 min-h-[260px] sm:min-h-[270px] flex flex-col justify-center bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPillar.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shadow-xs ${currentPillar.iconBg}`}>
                    <Icon className={`w-4 h-4 ${currentPillar.iconColor}`} />
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${currentPillar.tagColor}`}>
                    {currentPillar.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{currentPillar.headline}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-normal">{currentPillar.detail}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-4 sm:px-6 pb-6 pt-2 flex flex-col gap-3 bg-white">
            <div className="h-[1px] w-full bg-zinc-100" />
            <div className="flex items-center justify-between gap-2">
              {PLATFORM_PILLARS.map((pillar, idx) => (
                <button
                  key={pillar.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-[11px] sm:text-xs px-2 sm:px-3 py-2 rounded-md transition-all duration-200 cursor-pointer text-center font-medium flex-1 ${idx === activeIndex ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                    }`}
                >
                  0{idx + 1}. {pillar.headline.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}