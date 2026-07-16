import { motion } from "framer-motion"
import StickyWorkspace from "../ProblemSection/StickyWorkspace"

export function ProblemSection() {
  return (
    <>
      <section className="relative pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">Why builders leave other platforms</span>

            <h2 className="mt-6 font-display text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.02] sm:leading-[0.95]">
              A repo needs
              <br />
              a team.
              <br />
              <span className="text-blue-600">Not a feed.</span>
            </h2>

            <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-zinc-500 max-w-2xl">
              Job boards find you a company. Social feeds find you an audience. Neither finds you the one developer
              who's free this weekend and already knows your stack. PeerY does.
            </p>
          </motion.div>
        </div>
      </section>

      <StickyWorkspace />
    </>
  )
}