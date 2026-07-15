import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export default function Register() {
    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8 font-sans text-zinc-900">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[1200px] min-h-[720px] bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex border border-zinc-100"
            >
                {/* LEFT PANEL */}
                <div className="hidden lg:flex w-[50%] relative overflow-hidden bg-zinc-900 items-center px-16 xl:px-20 py-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10 pointer-events-none" />
                    <div className="relative z-10 max-w-[420px]">
                        <div className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                            <span className="h-px w-6 bg-blue-400" />
                            Join the builders
                        </div>
                        <h1 className="text-5xl lg:text-6xl leading-[1.05] font-bold text-white tracking-tight">
                            Find your <span className="text-blue-400">co-founder.</span>
                        </h1>
                        <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
                            Connect with developers, designers, and builders who share your ambition. Your next project starts here.
                        </p>

                        <div className="mt-12 flex flex-col gap-4">
                            {["Connect with builders", "Collaborate on projects", "Ship together"].map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                                    className="flex items-center gap-3 text-zinc-300"
                                >
                                    <span className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs">✓</span>
                                    <span className="text-sm">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Clerk SignUp */}
                <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-10 sm:px-16 xl:px-20 bg-white py-12">
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="w-full flex justify-center"
                    >
                        <SignUp
                            routing="path"
                            path="/register"
                            signInUrl="/login"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-0 p-0 bg-transparent w-full",
                                    headerTitle: "text-3xl font-bold text-zinc-900",
                                    headerSubtitle: "text-zinc-500",
                                    socialButtonsBlockButton: "border border-zinc-200 rounded-[14px] h-12 hover:bg-zinc-50 transition-all",
                                    formButtonPrimary: "bg-zinc-900 hover:bg-zinc-800 rounded-[14px] h-12 font-medium transition-all",
                                    formFieldInput: "rounded-[14px] border-zinc-200 h-12 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                                    footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                                }
                            }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
