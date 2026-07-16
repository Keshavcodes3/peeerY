import { motion } from "framer-motion"

const testimonials = [
  {
    quote: "I finally found people who actually want to build. No endless planning, no vaporware — just shipping code.",
    author: "dev_mitch",
    project: "Matched on KubeDeck",
  },
  {
    quote: "We launched on Product Hunt three weeks after matching. The scoring saved us months of searching for the right teammate.",
    author: "sarah_t",
    project: "Matched on Braid",
  },
  {
    quote: "No coffee chats, just code. Within two hours of matching we'd initialized the repo and pushed the first commit.",
    author: "rust_ace",
    project: "Matched on VaporSearch",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 md:py-32 px-5 sm:px-6 max-w-7xl mx-auto border-t border-zinc-900">
      <div className="space-y-4 mb-12 sm:mb-16 text-center">
        <span className="text-sm font-semibold tracking-wider text-blue-500 uppercase font-mono">Feedback</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Built with teammates found on PeerY</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="space-y-4 flex flex-col justify-between"
          >
            <p className="text-lg text-zinc-300 italic font-light leading-relaxed">"{t.quote}"</p>
            <div className="pt-4">
              <p className="text-sm font-bold text-white">@{t.author}</p>
              <p className="text-xs text-zinc-500">{t.project}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
