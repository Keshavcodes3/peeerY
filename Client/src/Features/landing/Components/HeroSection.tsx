import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { useEffect, useState, useRef } from "react";
import {
  Layers,
  Users2,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

// Premium platform pillars matching the strict blue, black, and white ecosystem
const PLATFORM_PILLARS = [
  {
    id: "intent-lock",
    icon: Layers,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50/70 border-blue-100",
    headline: "Mutual Intent-Lock",
    detail: "No open-chat clutter or casual browsing. Communication pipelines open only when both builders explicitly commit to the project blueprint.",
    tag: "Intent Matching",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/50",
  },
  {
    id: "vetted-teams",
    icon: Users2,
    iconColor: "text-zinc-900",
    iconBg: "bg-zinc-100/80 border-zinc-200",
    headline: "Verified Stacks",
    detail: "Skip the networking noise. Match exclusively with engineers and designers with verified production deployment histories.",
    tag: "High Execution",
    tagColor: "bg-zinc-100 text-zinc-900 border-zinc-300/60",
  },
  {
    id: "execution-first",
    icon: Workflow,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50/70 border-blue-100",
    headline: "Structured Workspaces",
    detail: "Transition immediately from matching into clean workspaces built around explicit milestones, code coordination, and progress tracking.",
    tag: "Zero Friction",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200/50",
  },
];

export function HeroSection() {
  const { isSignedIn } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PLATFORM_PILLARS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  // Soft, interactive blue spotlight for the dark/light canvas structure
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const currentPillar = PLATFORM_PILLARS[activeIndex];
  const Icon = currentPillar.icon;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-36 pb-28 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-16 lg:gap-20 overflow-hidden bg-white"
    >
      {/* Dynamic Deep Blue Ambient Mesh Layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4] transition-opacity duration-500 hidden lg:block"
        style={{
          background: `radial-gradient(650px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(37, 99, 235, 0.04), transparent 80%)`
        }}
      />

      {/* ── Left Block: Core Value Messaging ── */}
      <div className="flex-1 space-y-10 z-10 max-w-2xl text-left">

        {/* Subtle Platform Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-200/80 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold tracking-wide text-zinc-700">
            PeerY Network🥀
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Decisive Monochromatic Typography with Slate Blue Accent Line */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-bold tracking-tight text-zinc-900 leading-[1.05]">
            Find your partner.<br />
            Lock the intent.<br />
            Execute the{" "}
            <span className="relative inline-block text-zinc-950">
              vision.
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
            A secure, permission-locked platform designed to connect creators. Form high-execution development alliances, coordinate milestones, and drop the networking noise.
          </p>
        </motion.div>

        {/* Action Blocks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <Link to={isSignedIn ? '/dashboard' : '/register'}>
            <Button
              size="lg"
              className="rounded-full text-sm font-medium px-8 h-12 bg-zinc-950 text-white hover:bg-zinc-800 border border-zinc-950 transition-all duration-200 shadow-sm flex items-center gap-2 group cursor-pointer"
            >
              {isSignedIn ? 'Open Dashboard' : 'Find a Co-Builder'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-blue-400" />
            </Button>
          </Link>

          <Link to="/discover">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-sm font-medium px-8 h-12 border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all duration-200 cursor-pointer"
            >
              Browse Active Builds
            </Button>
          </Link>
        </motion.div>

        {/* Verification Footer Tokens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-6 border-t border-zinc-100 flex flex-wrap items-center gap-6 text-zinc-400 text-sm font-normal"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-zinc-900" />
            <span>Zero open-chat spam</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>100% mutual acceptance lock</span>
          </div>
        </motion.div>
      </div>

      {/* ── Right Block: Clean Workspace Blueprint ── */}
      <div className="flex-1 w-full max-w-md z-10 relative">
        <div className="absolute -inset-4 bg-zinc-50 rounded-2xl filter blur-md opacity-30 pointer-events-none -z-10" />

        {/* Pure White & Zinc Clean Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-xs font-semibold text-zinc-800 tracking-tight">
                Platform Blueprint
              </span>
            </div>
            <span className="text-[11px] font-medium text-zinc-400 tracking-wide">
              Core Mechanics
            </span>
          </div>

          {/* Interactive Dynamic Stage */}
          <div className="px-8 py-10 min-h-[270px] flex flex-col justify-center bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPillar.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-4 text-left"
              >
                {/* Header Row within the showcase frame */}
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shadow-xs ${currentPillar.iconBg}`}>
                    <Icon className={`w-4 h-4 ${currentPillar.iconColor}`} />
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${currentPillar.tagColor}`}>
                    {currentPillar.tag}
                  </span>
                </div>

                {/* Main Explanatory Copy */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                    {currentPillar.headline}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                    {currentPillar.detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Clean Segmented Tab Navigation Controls */}
          <div className="px-6 pb-6 pt-2 flex flex-col gap-3 bg-white">
            <div className="h-[1px] w-full bg-zinc-100" />
            <div className="flex items-center justify-between gap-2">
              {PLATFORM_PILLARS.map((pillar, idx) => (
                <button
                  key={pillar.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-xs px-3 py-2 rounded-md transition-all duration-200 cursor-pointer text-center font-medium flex-1 ${idx === activeIndex
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
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