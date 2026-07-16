import { motion } from "framer-motion"

const steps = [
  { num: "01", title: "Post the idea", desc: "Define the stack, the goal, and the roles you need filled." },
  { num: "02", title: "Get matched", desc: "PeerY scores active builders against your requirements — skills, stack and availability." },
  { num: "03", title: "Lock the match", desc: "Both sides accept. No open chat, no cold DMs — the thread opens once it's mutual." },
  { num: "04", title: "Move into the workspace", desc: "Kanban board, milestones and member roles are ready the moment you match." },
  { num: "05", title: "Ship it", desc: "Push to main, then show the finished build to a community that actually ships." },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 md:py-32 px-5 sm:px-6 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="space-y-4 mb-12 sm:mb-16">
        <span className="text-sm font-semibold tracking-wider text-blue-500 uppercase">Workflow</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">How PeerY works</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col space-y-4 border-l border-zinc-800 pl-4 py-2 hover:border-zinc-500 transition-colors"
          >
            <span className="text-sm font-mono text-zinc-500">{step.num}</span>
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}