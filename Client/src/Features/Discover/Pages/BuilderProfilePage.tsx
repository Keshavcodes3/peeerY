import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from "react-icons/fa";
import {
  ArrowLeft, Users, Trophy, Activity, Share2, Loader2, AlertCircle, Globe,
  Briefcase, CheckCircle, MessageSquare, ExternalLink, TrendingUp, Zap, Sparkles,
  Database, Code2, Layers, MapPin, ShieldCheck, Check, X
} from 'lucide-react';
import discoverService from '../services/discover.service';
import type { PublicProfile, PublicProject, LikeResult } from '../types/discover.types';
import { useAuth } from '../../Auth/Hooks/useAuth';

type TabType = 'Overview' | 'Projects' | 'Impact & Milestones';

export default function BuilderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!id) return;
    discoverService.getPublicProfile(id)
      .then(res => {
        setProfile(res.profile);
        setProjects(res.projects ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to resolve builder configuration data.');
        setIsLoading(false);
      });
  }, [id]);

  const handleLikeBuilder = async () => {
    if (!profile || !user) return;
    setIsLiking(true);
    try {
      const result: LikeResult = await discoverService.likeUser(profile.authId);
      if (result.mutual) {
        showToast(`🎉 Mutual match with ${profile.name}!`, "success");
      } else {
        showToast(`Request sent to ${profile.name}!`, "success");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to send request.", "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!profile || !user) {
      showToast("Please log in to connect with builders.", "error");
      return;
    }
    setIsMessaging(true);
    try {
      // Check if user has already connected with this builder
      // For now, we'll treat this as sending a connection request
      // In a full implementation, you would check existing matches first
      const result: LikeResult = await discoverService.likeUser(profile.authId);
      if (result.mutual) {
        showToast(`🎉 ${profile.name} has accepted your request! You can now message each other.`, "success");
      } else {
        showToast(`✉️ Connection request sent to ${profile.name}! They need to accept to enable messaging.`, "success");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to send connection request.", "error");
    } finally {
      setIsMessaging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen bg-slate-50 items-center justify-center">
        <Loader2 className="animate-spin text-slate-800" size={24} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen w-screen bg-slate-50 flex-col items-center justify-center gap-3 text-slate-500 text-xs font-medium">
        <AlertCircle className="text-red-500" size={20} />
        <p>{error || "Profile not found."}</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-900 text-white rounded-lg transition hover:bg-slate-800">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 antialiased pb-20 selection:bg-slate-200">

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-xs font-semibold transition">
            <ArrowLeft size={16} /> Back to Discover
          </button>
          <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition">
            <Share2 size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-6">

        {/* CARD 1: PROFILE HERO */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-5">
               <div className="relative">
                 <img
                   src={profile.avatar || "/api/placeholder/80/80"}
                   alt={profile.name}
                   className="w-20 h-20 rounded-full border border-slate-200 object-cover bg-slate-50"
                 />
                 <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${profile.avaliabilty ? 'bg-emerald-500' : 'bg-slate-400'}`} />
               </div>

               <div className="space-y-1">
                 <div className="flex items-center gap-2">
                   <h1 className="text-xl font-bold tracking-tight text-slate-900">{profile.name}</h1>
                   {profile.Rank && <span className="inline-flex text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium border border-blue-100">{profile.Rank}</span>}
                 </div>
                 <p className="text-xs font-medium text-slate-500">{profile.intent || profile.experience || "Developer"}</p>
                 <div className="flex items-center gap-3 text-xs text-slate-400">
                   {profile.college && <span className="flex items-center gap-1"><MapPin size={12} /> {profile.college}</span>}
                   <span className={`flex items-center gap-1 font-medium ${profile.avaliabilty ? 'text-emerald-600' : 'text-slate-400'}`}>● {profile.avaliabilty ? 'Available' : 'Not Available'}</span>
                 </div>
               </div>
             </div>

             {/* Quick Stats Grid Inline */}
             <div className="flex gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
               <div className="text-center md:text-left">
                 <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Score</span>
                 <span className="text-lg font-bold text-slate-800">{profile.matchScore || 0}</span>
               </div>
               <div className="w-px bg-slate-200 hidden md:block self-stretch" />
               <div className="text-center md:text-left">
                 <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Projects</span>
                 <span className="text-lg font-bold text-slate-800">{profile.totalProject || projects.length}</span>
               </div>
               <div className="w-px bg-slate-200 hidden md:block self-stretch" />
               <div className="text-center md:text-left">
                 <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Contributions</span>
                 <span className="text-lg font-bold text-slate-800">{profile.totalContribution || 0}</span>
               </div>
             </div>
           </div>

           {/* Bio block layout */}
           <div className="mt-6 pt-5 border-t border-slate-100">
             <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
               {profile.Bio || "No bio available."}
             </p>
           </div>
        </div>

        {/* TWO-COLUMN LOWER SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* CARD 2: DYNAMIC WORK CONTENT MATRIX */}
          <div className="lg:col-span-8 space-y-4">

            {/* Minimalist Tabs */}
            <div className="flex gap-5 border-b border-slate-200 pb-px">
              {(['Overview', 'Projects', 'Impact & Milestones'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 relative cursor-pointer ${activeTab === tab
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {tab === 'Projects' ? `Projects (${projects.length})` : tab}
                </button>
              ))}
            </div>

            {/* Tab Container */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs min-h-[340px]">
              <AnimatePresence mode="wait">
                {activeTab === 'Overview' && (
                   <motion.div
                     key="overview"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="space-y-6"
                   >
                     {/* Verified Skill Infrastructure */}
                     <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">Verified Skill Infrastructure</h3>
                        <p className="text-[11px] text-slate-400">Vetted competencies mapped by architectural abstraction stack layers.</p>
                      </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {profile.skills && profile.skills.length > 0 && (
                           <div className="p-3 border border-slate-100 bg-[#fbfbfb] rounded-lg space-y-2 sm:col-span-2">
                             <div className="flex items-center gap-2 text-slate-400">
                               <Code2 size={14} className="text-slate-900" />
                               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skills</span>
                             </div>
                             <div className="flex flex-wrap gap-1.5">
                               {profile.skills.map((skill, idx) => (
                                 <span key={idx} className="text-[11px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800 shadow-3xs">{skill}</span>
                               ))}
                             </div>
                           </div>
                         )}
                         {profile.techstack && profile.techstack.length > 0 && (
                           <div className="p-3 border border-slate-100 bg-[#fbfbfb] rounded-lg space-y-2 sm:col-span-2">
                             <div className="flex items-center gap-2 text-slate-400">
                               <Database size={14} className="text-slate-900" />
                               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tech Stack</span>
                             </div>
                             <div className="flex flex-wrap gap-1.5">
                               {profile.techstack.map((tech, idx) => (
                                 <span key={idx} className="text-[11px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800 shadow-3xs">{tech}</span>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* PROJECTS VIEW */}
                {activeTab === 'Projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {projects.length === 0 ? (
                      <div className="col-span-full border border-dashed border-slate-200 rounded-xl py-12 px-4 text-center">
                        <Layers className="mx-auto text-slate-300 mb-2" size={20} />
                        <p className="text-xs text-slate-400 font-medium">No public projects documented active on this node.</p>
                      </div>
                    ) : (
                      projects.map((project) => (
                        <div
                          key={project._id}
                          className="group relative bg-white border border-slate-200/70 hover:border-slate-400 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                        >
                          {/* Subtle Top Accent Glow on Hover */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-500/0 via-slate-900/40 to-slate-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="space-y-3">
                            {/* Top Line: App/System Meta */}
                           <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${project.Stage === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : project.Stage === 'COMPLETED' ? 'bg-blue-500' : project.Stage === 'PAUSED' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                 <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                   {project.Stage}
                                 </span>
                               </div>

                               {project.banner && (
                                 <a
                                   href={project.banner}
                                   target="_blank"
                                   rel="noreferrer"
                                   className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-all duration-150"
                                   title="View Project"
                                 >
                                   <ExternalLink size={13} />
                                 </a>
                               )}
                             </div>

                             {/* Heading Description Matrix */}
                             <div className="space-y-1">
                               <h4 className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-black transition-colors">
                                 {project.title}
                               </h4>
                               <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-3">
                                 {project.description}
                               </p>
                             </div>
                           </div>

                           {/* Tech Stack Footer Matrix */}
                           <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-1">
                             {project.techStack?.slice(0, 4).map((tech, idx) => (
                               <span
                                 key={idx}
                                 className="text-[10px] text-slate-600 font-medium bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md transition-colors group-hover:bg-slate-100/70"
                               >
                                 {tech}
                               </span>
                             ))}
                             {project.techStack && project.techStack.length > 4 && (
                               <span className="text-[9px] font-mono font-bold text-slate-400 px-1">
                                 +{project.techStack.length - 4}
                               </span>
                             )}
                           </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'Impact & Milestones' && (
                  <motion.div
                    key="impact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                     {profile.Achievements && profile.Achievements.length > 0 && (
                       <div className="pt-4 border-t border-slate-100 space-y-3">
                         <h3 className="text-xs font-bold text-slate-800">Achievements</h3>
                         <div className="space-y-2.5">
                           {profile.Achievements.map((achievement, idx) => (
                             <div key={idx} className="flex items-start gap-2.5 text-xs">
                               <Trophy size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                               <div>
                                 <span className="font-bold text-slate-900">{achievement}</span>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CARD 3: FOUNDER QUICK DECISION PANEL WITH COOL VETTING METADATA */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <h3 className="text-xs font-bold text-slate-800">Founder Decision Panel</h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Accelerate builder procurement loops</p>
              </div>

               {/* Action Buttons */}
               <div className="space-y-2">
                 <button
                   onClick={handleLikeBuilder}
                   disabled={isLiking || !user}
                   className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-semibold py-2.5 rounded-lg transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                 >
                   {isLiking ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                   {isLiking ? 'Processing...' : 'Hire / Invite Builder'}
                 </button>
                 <button
                   onClick={handleSendMessage}
                   disabled={isMessaging || !user}
                   className="w-full border border-slate-200 hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
                 >
                   {isMessaging ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                   {isMessaging ? 'Connecting...' : 'Connect & Message'}
                 </button>
               </div>

               {/* Trust Indicators */}
               <div className="pt-4 border-t border-slate-100 space-y-3">
                 <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Trust Indicators</span>

                 <div className="bg-[#fbfbfb] border border-slate-200/60 rounded-lg p-2.5 space-y-2">
                   <div className="flex items-center justify-between text-[11px]">
                     <span className="text-slate-400 flex items-center gap-1"><ShieldCheck size={12} className="text-slate-900" /> Identity</span>
                     <span className="font-bold text-slate-800">{profile.Rank ? 'Verified' : 'Pending'}</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px]">
                     <span className="text-slate-400 flex items-center gap-1"><TrendingUp size={12} className="text-slate-900" /> Match Score</span>
                     <span className="font-bold text-emerald-600">{profile.matchScore || 0}%</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px]">
                     <span className="text-slate-400 flex items-center gap-1"><Users size={12} className="text-slate-900" /> Followers</span>
                     <span className="font-bold text-slate-800">{profile.followerCount || 0}</span>
                   </div>
                 </div>
               </div>

               {/* Social Links */}
               {profile.socials && profile.socials.length > 0 && (
                 <div className="pt-2 space-y-2">
                   <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Social Links</span>
                   <div className="space-y-1.5">
                     {profile.socials.map((social, idx) => {
                       const isGithub = social.includes('github.com');
                       return (
                         <a key={idx} href={social} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition font-medium group">
                           {isGithub ? (
                             <FaGithub size={13} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                           ) : (
                             <Globe size={13} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                           )}
                           {isGithub ? 'GitHub Profile' : 'Portfolio/Website'}
                         </a>
                       );
                     })}
                   </div>
                 </div>
               )}
            </div>
          </div>

         </div>
       </main>

       {/* Toast notifications */}
       <AnimatePresence>
         {toast && (
           <motion.div
             initial={{ opacity: 0, y: -8 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             className={`fixed top-20 right-8 z-50 border p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xl ${toast.type === "error"
               ? "bg-white text-red-600 border-red-200"
               : "bg-slate-900 text-white border-slate-800"
               }`}
           >
             {toast.type === "error" ? <X size={14} /> : <Check size={14} className="text-blue-400" />}
             {toast.msg}
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   );
}