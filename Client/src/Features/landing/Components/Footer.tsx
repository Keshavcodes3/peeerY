import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, MessageCircleCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { FaGithub,FaTwitter,FaLinkedin } from "react-icons/fa"

const LINK_GROUPS = [
    {
        title: "Product",
        links: [
            { label: "Discover", href: "#discover" },
            { label: "Projects", href: "#projects" },
            { label: "Builders", href: "#builders" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Pricing", href: "/pricing" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Developers",
        links: [
            { label: "Documentation", href: "/docs" },
            { label: "API reference", href: "/docs/api" },
            { label: "Changelog", href: "/changelog" },
            { label: "Status", href: "/status" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy policy", href: "/privacy" },
            { label: "Terms of service", href: "/terms" },
            { label: "Cookie policy", href: "/cookies" },
        ],
    },
]

const SOCIALS = [
    { label: "GitHub", href: "https://github.com/peery", icon: FaGithub },
    { label: "Twitter", href: "https://twitter.com/peery", icon: FaTwitter },
    { label: "Discord", href: "https://discord.gg/peery", icon: MessageCircleCheck },
    { label: "LinkedIn", href: "https://linkedin.com/company/peery", icon: FaLinkedin },
]

export function Footer() {
    const [email, setEmail] = useState("")
    const [subscribed, setSubscribed] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return
        setSubscribed(true)
    }

    return (
        <footer className="relative border-t border-zinc-200 bg-white overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#fafafa_1px,transparent_1px),linear-gradient(to_bottom,#fafafa_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-60" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/[0.04] blur-3xl rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

                {/* Top: headline + newsletter */}
                <div className="py-16 sm:py-20 md:py-24 border-b border-zinc-100">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-600">
                                Ready to build?
                            </span>
                            <h2 className="mt-5 font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] sm:tracking-[-0.06em] leading-[1.02] sm:leading-[0.95] text-zinc-950">
                                Find people.
                                <br />
                                Learn together.
                                <br />
                                <span className="text-blue-600">Ship faster.</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="w-full"
                        >
                            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                                One email a month. New builders on the platform, projects looking for teammates, nothing else.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-5 relative max-w-sm">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@domain.com"
                                    disabled={subscribed}
                                    aria-label="Email address"
                                    className="w-full h-12 pl-4 pr-32 rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-300 focus:bg-white focus:shadow-lg focus:shadow-blue-500/5 transition-all duration-300 disabled:opacity-60"
                                />
                                <button
                                    type="submit"
                                    disabled={subscribed}
                                    className="absolute right-1.5 top-1.5 h-9 px-4 rounded-lg bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 transition-colors disabled:bg-emerald-600"
                                >
                                    {subscribed ? (
                                        <>
                                            <Check size={13} /> Subscribed
                                        </>
                                    ) : (
                                        <>
                                            Subscribe <ArrowRight size={13} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>

                {/* Middle: brand + link columns */}
                <div className="py-14 sm:py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">

                    <div className="col-span-2 sm:col-span-3 lg:col-span-2 pr-0 lg:pr-8">
                        <Link to="/" className="inline-flex items-center gap-1.5" aria-label="PeerY home">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-950" aria-hidden="true">
                                <path d="M4 4H10C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16H4V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 16H10C13.3137 16 16 18.6863 16 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="19" cy="5" r="2" className="fill-blue-600" />
                            </svg>
                            <span className="font-display font-bold text-lg tracking-tight text-zinc-950">PeerY</span>
                        </Link>

                        <p className="mt-4 text-sm text-zinc-500 leading-relaxed max-w-xs">
                            The network where developers match by stack, skill and timezone — then build together.
                        </p>

                        <div className="mt-6 flex items-center gap-2">
                            {SOCIALS.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-9 h-9 rounded-lg border border-zinc-200 bg-zinc-50/60 flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/60 transition-colors"
                                    >
                                        <Icon size={15} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {LINK_GROUPS.map((group) => (
                        <div key={group.title} className="col-span-1">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">
                                {group.title}
                            </h3>
                            <ul className="space-y-3">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-zinc-600 hover:text-blue-600 transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="py-6 sm:py-8 border-t border-zinc-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-400 text-center sm:text-left">
                        © {new Date().getFullYear()} PeerY. Built for developers, by developers.
                    </p>

                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}