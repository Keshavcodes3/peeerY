import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Loader2, Check, AlertCircle, Plus, X,
    ArrowRight, Shield, Globe, User, ChevronLeft, ChevronRight, Lightbulb
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { api, ENDPOINT } from "../../../App/api";
import { useAuth } from "../Hooks/useAuth";
import { useClerk } from "@clerk/clerk-react";

interface Profile {
    name: string;
    avatar?: string;
    skills?: string[];
    socials?: string[];
    Bio?: string;
    college?: string;
    experience?: "Beginner" | "Intermediate" | "God";
    techstack?: string[];
    avaliabilty?: boolean;
    intent?: string;
}

// Premium Pinterest Anime Avatar Presets
const AVATAR_PRESETS = [
    { id: "a_1", url: "https://i.pinimg.com/736x/96/71/4f/96714f521ec59fd0637b76c5d4ffd3c7.jpg" },
    { id: "a_2", url: "https://i.pinimg.com/736x/28/14/52/2814521d4afecdc1fa119e488d22dd20.jpg" },
    { id: "a_3", url: "https://i.pinimg.com/736x/b5/fb/bd/b5fbbd50f3aab7abe6335069b03725d3.jpg" },
    { id: "a_4", url: "https://i.pinimg.com/736x/fe/f2/45/fef2456e70015e2ad91d8bff8eafd476.jpg" },
    { id: "a_5", url: "https://i.pinimg.com/736x/a6/bc/23/a6bc235c47ffde483b4d91a4eb0d3759.jpg" },
    { id: "a_6", url: "https://i.pinimg.com/736x/c3/ca/ac/c3caacabd993cf7aa869290eacd5bb44.jpg" }
];

export default function ProfileSettingsPage() {
    const { logout, user } = useAuth();
    const { user: clerkUser } = useClerk();
    const navigate = useNavigate();

    const [hasProfile, setHasProfile] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [showNameSuggestions, setShowNameSuggestions] = useState(false);
    const [formChanged, setFormChanged] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
    const [bio, setBio] = useState("");
    const [college, setCollege] = useState("");
    const [experience, setExperience] = useState<"Beginner" | "Intermediate" | "God">("Beginner");
    const [techStack, setTechStack] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [techInput, setTechInput] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [availability, setAvailability] = useState(true);
    const [intent, setIntent] = useState("");

    // Carousel slider state
    const [activeIndex, setActiveIndex] = useState(0);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Generate name suggestions based on user data
    const generateNameSuggestions = () => {
        const suggestions: string[] = [];

        // If we have clerk user data
        if (clerkUser) {
            if (clerkUser.firstName) {
                const firstName = clerkUser.firstName.trim();
                if (firstName && !suggestions.includes(firstName)) {
                    suggestions.push(firstName);
                }
            }
            if (clerkUser.lastName) {
                const lastName = clerkUser.lastName.trim();
                if (lastName && !suggestions.includes(lastName)) {
                    suggestions.push(lastName);
                }
            }
            if (clerkUser.firstName && clerkUser.lastName) {
                const fullName = `${clerkUser.firstName.trim()} ${clerkUser.lastName.trim()}`;
                if (fullName && !suggestions.includes(fullName)) {
                    suggestions.push(fullName);
                }
                const initialLast = `${clerkUser.firstName.trim()[0]}${clerkUser.lastName.trim()}`;
                if (initialLast && !suggestions.includes(initialLast)) {
                    suggestions.push(initialLast);
                }
            }
            if (clerkUser.username) {
                // Clean up username by removing Clerk ID suffix
                const cleanUsername = clerkUser.username.replace(/[0-9a-f]{8}$/i, '').trim();
                if (cleanUsername && !suggestions.includes(cleanUsername)) {
                    suggestions.push(cleanUsername);
                }
            }
        }

        // If we have auth user data
        if (user?.username) {
            const cleanUsername = user.username.replace(/[0-9a-f]{8}$/i, '').trim();
            if (cleanUsername && !suggestions.includes(cleanUsername)) {
                suggestions.push(cleanUsername);
            }
        }

        // If we have email, extract name from it
        if (user?.email) {
            const emailName = user.email.split('@')[0];
            // Convert email.name to Name
            const formattedName = emailName.replace(/[^.]/g, ' ').trim().split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ').trim();
            if (formattedName && !suggestions.includes(formattedName)) {
                suggestions.push(formattedName);
            }
        }

        // Add some generic suggestions
        const genericSuggestions = ["Developer", "Builder", "Coder", "Engineer", "Creator"];
        genericSuggestions.forEach(s => {
            if (!suggestions.includes(s)) {
                suggestions.push(s);
            }
        });

        return suggestions.slice(0, 5); // Return max 5 suggestions
    };

    // Sync state variable anytime the carousel pivots
    useEffect(() => {
        setAvatar(AVATAR_PRESETS[activeIndex].url);
    }, [activeIndex]);

    const handleNextAvatar = () => {
        setActiveIndex((prev) => (prev + 1) % AVATAR_PRESETS.length);
    };

    const handlePrevAvatar = () => {
        setActiveIndex((prev) => (prev - 1 + AVATAR_PRESETS.length) % AVATAR_PRESETS.length);
    };

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<{ success: boolean; profile: Profile }>("/api/v1/profile/me");
            if (res.data?.profile) {
                const prof = res.data.profile;
                setHasProfile(true);
                setName(prof.name || "");
                setBio(prof.Bio || "");
                setCollege(prof.college || "");
                setExperience(prof.experience || "Beginner");
                setTechStack(prof.techstack || []);
                setSkills(prof.skills || []);
                setAvailability(prof.avaliabilty !== false);
                setIntent(prof.intent || "");

                if (prof.avatar) {
                    setAvatar(prof.avatar);
                    // Look up matching index from current saved DB profile string path
                    const matchIdx = AVATAR_PRESETS.findIndex(p => p.url === prof.avatar);
                    if (matchIdx !== -1) {
                        setActiveIndex(matchIdx);
                    }
                }

                if (prof.socials) {
                    const gh = prof.socials.find(s => s.includes("github.com")) || "";
                    const web = prof.socials.find(s => !s.includes("github.com")) || "";
                    setGithubUrl(gh);
                    setWebsiteUrl(web);
                }
            } else {
                setHasProfile(false);
                // If no profile exists, try to pre-fill name from auth data
                const suggestions = generateNameSuggestions();
                if (suggestions.length > 0) {
                    setName(suggestions[0]);
                }
            }
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setHasProfile(false);
                // If no profile exists, try to pre-fill name from auth data
                const suggestions = generateNameSuggestions();
                if (suggestions.length > 0) {
                    setName(suggestions[0]);
                }
            } else {
                showToast("Could not synchronize profile data.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [clerkUser, user]);

    // Auto-show suggestions if name is empty and we have suggestions
    useEffect(() => {
        if (!isLoading && !name.trim() && !hasProfile) {
            const suggestions = generateNameSuggestions();
            if (suggestions.length > 0) {
                setShowNameSuggestions(true);
            }
        }
    }, [isLoading, name, hasProfile, clerkUser, user]);

    // Track form changes
    useEffect(() => {
        // Check if any field has been modified from its initial state
        const initialState = {
            name: "",
            avatar: AVATAR_PRESETS[0].url,
            bio: "",
            college: "",
            experience: "Beginner",
            techStack: [],
            skills: [],
            githubUrl: "",
            websiteUrl: "",
            availability: true,
            intent: ""
        };

        const currentState = {
            name,
            avatar,
            bio,
            college,
            experience,
            techStack,
            skills,
            githubUrl,
            websiteUrl,
            availability,
            intent
        };

        const hasChanged = JSON.stringify(currentState) !== JSON.stringify(initialState);
        setFormChanged(hasChanged);
    }, [name, avatar, bio, college, experience, techStack, skills, githubUrl, websiteUrl, availability, intent]);

    // Warn before leaving if form has changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (formChanged) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [formChanged]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            showToast("A display name is required.", "error");
            return;
        }

        setActionLoading(true);
        try {
            const socialsList = [githubUrl.trim(), websiteUrl.trim()].filter(Boolean);
            const payload = {
                name: name.trim(),
                avatar: avatar,
                Bio: bio.trim() || undefined,
                college: college.trim() || undefined,
                experience,
                techstack: techStack,
                skills: skills,
                avaliabilty: availability,
                intent: intent.trim() || undefined,
                socials: socialsList
            };

            let res;
            if (hasProfile) {
                res = await api.put("/api/v1/profile", payload);
            } else {
                res = await api.post("/api/v1/profile", payload);
            }

            if (res.data.success) {
                showToast("Profile changes saved.");
                setHasProfile(true);
                setShowNameSuggestions(false);
                setFormChanged(false);
                fetchProfile();
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to save data.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Handle name field focus and blur for suggestions
    const handleNameFocus = () => {
        if (!name.trim()) {
            setShowNameSuggestions(true);
        }
    };

    const handleNameBlur = () => {
        // Small timeout to allow click on suggestion before hiding
        setTimeout(() => setShowNameSuggestions(false), 200);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setName(suggestion);
        setShowNameSuggestions(false);
    };

    const handleAddTech = () => {
        if (techInput.trim() && !techStack.includes(techInput.trim())) {
            setTechStack([...techStack, techInput.trim()]);
            setTechInput("");
        }
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const handleDeleteProfile = async () => {
        if (!window.confirm("Are you sure you want to clear your card details?")) return;
        setActionLoading(true);
        try {
            const res = await api.delete("/api/v1/profile");
            if (res.data.success) {
                showToast("Profile data reset.");
                setHasProfile(false);
                setName(""); setBio(""); setCollege("");
                setExperience("Beginner"); setTechStack([]); setSkills([]);
                setGithubUrl(""); setWebsiteUrl(""); setIntent("");
                setActiveIndex(0);
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Failed to reset profile.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisableAccount = async () => {
        if (!window.confirm("Suspend account access temporarily? You will be logged out.")) return;
        setActionLoading(true);
        try {
            const res = await api.post(ENDPOINT.auth.disable);
            if (res.data.success) {
                await logout();
                navigate("/login");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Action failed.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("CRITICAL: Permanent deletion of your user account profile record. Continue?")) return;
        setActionLoading(true);
        try {
            const res = await api.delete(ENDPOINT.auth.delete);
            if (res.data.success) {
                await logout();
                navigate("/login");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.error ?? "Action failed.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
                <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                <p className="text-[11px] font-mono tracking-wider mt-4 text-zinc-400">SYNCING LIVE VIEW</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans selection:bg-blue-600 selection:text-white">
            {/* Toast Popups */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 shadow-2xl border text-xs font-mono font-medium ${toast.type === "error" ? "bg-white text-red-600 border-red-200" : "bg-black text-white border-black"
                            }`}
                    >
                        {toast.type === "error" ? <AlertCircle size={14} /> : <Check size={14} className="text-blue-400" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">

                {/* Left Layout Bar - Preview Card & Context Information */}
                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-12">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="group inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        BACK TO DASHBOARD
                    </button>

                    <div className="pt-4 border-t border-zinc-100">
                        <h1 className="text-3xl font-black tracking-tight text-black font-sans uppercase">
                            Profile Setup
                        </h1>
                        <p className="text-sm text-zinc-400 mt-2 font-medium leading-relaxed">
                            Configure your developer details, collaboration intent, and discoverability metrics.
                        </p>
                    </div>

                    {/* Premium Preview Dashboard Card */}
                    <div className="border border-zinc-200 p-6 bg-zinc-50/50 rounded-lg space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="w-14 h-14 bg-zinc-200 border border-zinc-300 rounded-full overflow-hidden shadow-inner flex items-center justify-center">
                                {avatar ? (
                                    <img src={avatar} alt="Selected Profile Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-zinc-400" />
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono border px-2 py-0.5 rounded-full bg-white shadow-sm font-bold">
                                <span className={`w-1.5 h-1.5 rounded-full ${availability ? "bg-blue-600 animate-pulse" : "bg-zinc-300"}`} />
                                {availability ? "MATCHING OPEN" : "PAUSED"}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-lg font-bold tracking-tight text-black truncate max-w-[180px]">
                                    {name.trim() || (showNameSuggestions ? "Select a name..." : "Anonymous Developer")}
                                </h2>
                                <span className="text-[9px] font-mono text-zinc-400 border px-1.5 py-0.2 uppercase">{experience}</span>
                            </div>
                            <p className="text-xs text-zinc-400 font-mono mt-0.5">{college || "No Affiliation Specified"}</p>
                        </div>

                        {intent && (
                            <div className="text-xs border-t border-zinc-200/60 pt-4 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Project Alignment Statement</span>
                                <p className="text-zinc-600 font-medium font-sans leading-relaxed">“{intent}”</p>
                            </div>
                        )}

                        {techStack.length > 0 && (
                            <div className="border-t border-zinc-200/60 pt-4 flex flex-wrap gap-1.5">
                                {techStack.map((tech, i) => (
                                    <span key={i} className="text-[10px] font-mono bg-white border border-zinc-200 px-2 py-0.5 text-black">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Layout Box - Form Configuration Modules */}
                <div className="lg:col-span-8 space-y-12">
                    <form onSubmit={handleSave} className="space-y-10">

                        {/* Module 1: Core Form Elements & Premium Circular Array Slider */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">
                                01 / Basic Identity
                            </h3>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-black font-sans">Display Name *</label>
                                <div className="relative">
                                    <input
                                        type="text" required value={name} onChange={e => setName(e.target.value)}
                                        onFocus={handleNameFocus}
                                        onBlur={handleNameBlur}
                                        placeholder="e.g. Alex Chen"
                                        className="w-full border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors font-medium pr-8"
                                    />
                                    {!name.trim() && (
                                        <button
                                            type="button"
                                            onClick={() => setShowNameSuggestions(!showNameSuggestions)}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-600 transition-colors p-1"
                                            title="Get name suggestions"
                                        >
                                            <Lightbulb size={14} />
                                        </button>
                                    )}
                                    {showNameSuggestions && !name.trim() && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 p-2">
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono pb-1 border-b border-zinc-100 mb-1">
                                                <Lightbulb size={12} className="text-yellow-500" />
                                                Suggested names
                                            </div>
                                            {generateNameSuggestions().map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSelectSuggestion(suggestion)}
                                                    className="w-full text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-black px-3 py-2 rounded transition-colors font-medium truncate"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {!name.trim() && !showNameSuggestions && (
                                    <p className="text-[10px] text-zinc-400 font-mono mt-1">
                                        Click the lightbulb icon for name suggestions based on your account
                                    </p>
                                )}
                            </div>

                            {/* Premium Circular Selection Array System */}
                            <div className="space-y-4 pt-2">
                                <label className="text-xs font-bold text-black font-sans block tracking-tight uppercase">
                                    Select Profile Identity
                                </label>

                                <div className="flex items-center gap-6 bg-zinc-50/60 p-6 border border-zinc-200/80 rounded-xl max-w-sm shadow-sm">

                                    {/* Prev Action Trigger */}
                                    <button
                                        type="button" onClick={handlePrevAvatar}
                                        className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-black hover:border-black shadow-sm transition-all cursor-pointer active:scale-95"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {/* Image Target Ring Layout */}
                                    <div className="flex-1 flex flex-col items-center justify-center gap-3">
                                        <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-500 via-zinc-200 to-zinc-400 shadow-md">
                                            <div className="w-full h-full rounded-full bg-white overflow-hidden border border-white flex items-center justify-center">
                                                <img
                                                    src={AVATAR_PRESETS[activeIndex].url}
                                                    alt="Premium Profile Preset Artwork"
                                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </div>

                                        <span className="text-[10px] font-mono font-black text-zinc-400 bg-white px-2.5 py-0.5 border border-zinc-200/60 tracking-wider rounded-full shadow-inner">
                                            {String(activeIndex + 1).padStart(2, '0')} / {String(AVATAR_PRESETS.length).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Next Action Trigger */}
                                    <button
                                        type="button" onClick={handleNextAvatar}
                                        className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-black hover:border-black shadow-sm transition-all cursor-pointer active:scale-95"
                                    >
                                        <ChevronRight size={16} />
                                    </button>

                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-black font-sans">Short Bio</label>
                                <textarea
                                    rows={2} value={bio} onChange={e => setBio(e.target.value)}
                                    placeholder="Describe your workflow parameters, focus metrics, or development timeline rules."
                                    className="w-full border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors font-sans resize-none leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-black font-sans">University / Organization</label>
                                <input
                                    type="text" value={college} onChange={e => setCollege(e.target.value)}
                                    placeholder="e.g. Stanford University"
                                    className="w-full border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors font-medium"
                                />
                            </div>
                        </div>

                        {/* Module 2: Experience & Intent Management Parameters */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">
                                02 / Developer Profile & Intent
                            </h3>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-black font-sans block">Experience Level</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {(["Beginner", "Intermediate", "God"] as const).map((tier) => (
                                        <button
                                            key={tier} type="button" onClick={() => setExperience(tier)}
                                            className={`py-3 px-4 text-center border font-mono text-xs transition-all cursor-pointer ${experience === tier ? "border-black bg-black text-white" : "border-zinc-200 hover:border-zinc-400 bg-white text-zinc-500"
                                                }`}
                                        >
                                            {tier.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tag System Controls */}
                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black font-sans block">Primary Tech Stack</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text" value={techInput} onChange={e => setTechInput(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                                            placeholder="Add tag (e.g. React, Docker, Go) + press Enter"
                                            className="w-full border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-blue-600 font-sans"
                                        />
                                        <button type="button" onClick={handleAddTech} className="px-4 border border-black hover:bg-zinc-50 transition-colors cursor-pointer text-xs font-mono">
                                            ADD
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {techStack.map(tech => (
                                            <span key={tech} className="bg-zinc-100 border text-black px-2.5 py-1 flex items-center gap-2 font-mono text-xs font-bold">
                                                {tech}
                                                <X size={12} className="cursor-pointer text-zinc-400 hover:text-black" onClick={() => setTechStack(techStack.filter(t => t !== tech))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black font-sans block">Additional Specialties</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                                            placeholder="Add design or framework skills (e.g. System Design, Redis Queues)"
                                            className="w-full border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-blue-600 font-sans"
                                        />
                                        <button type="button" onClick={handleAddSkill} className="px-4 border border-black hover:bg-zinc-50 transition-colors cursor-pointer text-xs font-mono">
                                            ADD
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {skills.map(skill => (
                                            <span key={skill} className="bg-blue-50/60 border border-blue-100 text-blue-950 px-2.5 py-1 flex items-center gap-2 font-mono text-xs font-bold">
                                                {skill}
                                                <X size={12} className="cursor-pointer text-blue-400 hover:text-blue-950" onClick={() => setSkills(skills.filter(s => s !== skill))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Matchmaking Objective Input */}
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-black font-sans">Active Project Objective (Intent)</label>
                                <input
                                    type="text" value={intent} onChange={e => setIntent(e.target.value)}
                                    placeholder="What are you actively trying to build? (e.g. Building an automated lightweight microservice cluster manager)"
                                    className="w-full border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-blue-600 font-medium font-sans"
                                />
                                <p className="text-[11px] text-zinc-400 font-mono mt-1">This forms the foundation of the mutual-intent pairing system check.</p>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center justify-between p-4 border border-zinc-200 bg-zinc-50/40 rounded-lg cursor-pointer hover:border-zinc-300 transition-all">
                                    <div className="pr-4">
                                        <span className="text-xs font-bold text-black font-sans block">Public Discovery Visibility</span>
                                        <span className="text-[11px] text-zinc-400 font-mono mt-0.5 block leading-relaxed">Allow your profile parameters to clear automated matches and display publicly.</span>
                                    </div>
                                    <input
                                        type="checkbox" checked={availability} onChange={e => setAvailability(e.target.checked)}
                                        className="w-4 h-4 text-black border-zinc-300 focus:ring-black accent-black cursor-pointer rounded-none"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Module 3: Portfolios & External Communication Handlers */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">
                                03 / Network Connections
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black font-sans flex items-center gap-2">
                                        <FaGithub size={14} /> GitHub Link
                                    </label>
                                    <input
                                        type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/username"
                                        className="w-full border-b border-zinc-300 py-2 text-sm text-zinc-600 focus:outline-none focus:border-blue-600 font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-black font-sans flex items-center gap-2">
                                        <Globe size={14} className="text-zinc-500" /> Website / Portfolio Link
                                    </label>
                                    <input
                                        type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)}
                                        placeholder="https://myworkspace.dev"
                                        className="w-full border-b border-zinc-300 py-2 text-sm text-zinc-600 focus:outline-none focus:border-blue-600 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Execution Trigger */}
                        <div className="pt-4">
                            <button
                                type="submit" disabled={actionLoading || !name.trim()}
                                className="w-full bg-black hover:bg-zinc-900 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-mono text-xs font-bold py-4 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                                {hasProfile ? "Save Profile Changes" : "Create Profile Registry"}
                            </button>
                        </div>
                    </form>

                    {/* Destructive Dev Mode Controls */}
                    {hasProfile && (
                        <div className="pt-8 border-t border-zinc-100 space-y-6">
                            <div className="flex items-center gap-2 text-zinc-900">
                                <Shield size={14} />
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Account Maintenance Controls</h4>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleDeleteProfile} disabled={actionLoading}
                                    className="text-xs font-mono border border-zinc-200 hover:border-red-200 hover:text-red-600 px-4 py-2.5 transition-colors cursor-pointer"
                                >
                                    Clear Profile Cards
                                </button>
                                <button
                                    onClick={handleDisableAccount} disabled={actionLoading}
                                    className="text-xs font-mono border border-zinc-200 hover:border-black hover:bg-zinc-50 px-4 py-2.5 transition-colors cursor-pointer"
                                >
                                    Deactivate Account Routing
                                </button>
                                <button
                                    onClick={handleDeleteAccount} disabled={actionLoading}
                                    className="text-xs font-mono bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 transition-colors cursor-pointer font-medium"
                                >
                                    Permanently Purge Records
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}