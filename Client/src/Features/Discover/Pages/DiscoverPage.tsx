import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, ArrowRight, X, Code2, Heart, Loader2,
  RefreshCw, Plus, ShieldAlert, TrendingUp,
  User, CheckCircle2, ChevronRight, ChevronDown, Bell, Sun, Moon
} from 'lucide-react';
import { useDiscover } from '../hooks/useDiscover';
import { api } from '../../../App/api';
import { useAuth } from '../../Auth/Hooks/useAuth';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ProjectFull {
  _id: string;
  title: string;
  description: string;
  bookMarksCount: number;
  membersCount: number;
  views: number;
}

// ─── Design tokens ───────────────────────────────────────────────────────────
// Loaded once via a <style> tag at the bottom of this file (DiscoverTokens).
// Palette: warm paper background, ink text, phosphor-green as the single
// signal color (reserved for the compatibility readout + live-status dot).
// Type: Space Grotesk (display) / IBM Plex Sans (body) / IBM Plex Mono (data).

// ─── Compatibility tiering + signature "readout" element ───────────────────

function getTier(score: number) {
  if (score > 5) return { label: 'High affinity', bars: 5, cls: 'db-signal', bg: 'db-signal-bg' };
  if (score > 2) return { label: 'Compatible', bars: 3, cls: 'db-signal-soft', bg: 'db-signal-bg-soft' };
  return { label: 'Base match', bars: 1, cls: 'db-ink-soft', bg: 'db-line-bg' };
}

function Readout({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  const t = getTier(score);
  const heights = size === 'lg' ? [10, 16, 22, 28, 34] : [6, 9, 12, 15, 18];
  return (
    <div className="flex items-end gap-3">
      <div className="flex items-end gap-[3px]">
        {heights.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full ${i < t.bars ? t.cls + '-bg-solid' : 'db-bar-off'}`}
            style={{ height: h }}
          />
        ))}
      </div>
      <span className={`font-mono ${size === 'lg' ? 'text-sm' : 'text-[10px]'} font-medium ${t.cls}`}>
        {String(Math.round(score)).padStart(2, '0')} pts
      </span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const navigate = useNavigate();
  useAuth();

  // Theme: read once on mount from localStorage, fall back to system preference
  const [theme] = useState<'light' | 'dark'>('light');

  // Tabs: For You (matchScore desc), High Match (score > 3), Most Active (exp tiered), New Builders (unmatched)
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [activeTab, setActiveTab] = useState<'For You' | 'Top Match' | 'Most Active' | 'New Builders' | 'All Users'>('For You');
  const { profiles, isLoading, error, likingId, like, refetch } = useDiscover(debouncedSearch, activeTab);
  const [banner, setBanner] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Selected Filters State
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [availabilities, setAvailabilities] = useState<{ [key: string]: boolean }>({
    'Full-time': true,
    'Part-time': true,
    'Just Exploring': false,
  });
  const [selectedExperience, setSelectedExperience] = useState<string>('All Experience');
  const [openFilter, setOpenFilter] = useState<null | 'role' | 'skills' | 'availability' | 'experience'>(null);

  // Async data states for sidebar widgets
  const [myProfile, setMyProfile] = useState<any>(null);
  const [trendingProjects, setTrendingProjects] = useState<ProjectFull[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch logged-in user's profile and projects
  useEffect(() => {
    // 1. Fetch own profile for profile completion widget
    api.get('/api/v1/profile/me')
      .then((res) => setMyProfile(res.data?.profile))
      .catch(() => console.log('[Discover] Current user profile not initialized yet.'));

    // 2. Fetch public projects for trending sidebar
    api.get<{ success: boolean; data: { project: ProjectFull[] } }>('/api/v1/project')
      .then((res) => {
        const list = res.data?.data?.project ?? [];
        // Sort by views + bookmarks desc to find trending
        const sorted = [...list].sort((a, b) =>
          ((b.views || 0) + (b.bookMarksCount || 0) * 3) - ((a.views || 0) + (a.bookMarksCount || 0) * 3)
        );
        setTrendingProjects(sorted.slice(0, 3));
      })
      .catch(() => console.log('[Discover] Failed to fetch trending projects.'))
      .finally(() => setIsTrendingLoading(false));
  }, []);

  const handleLike = async (authId: string) => {
    const result = await like(authId);
    setBanner({
      msg: result.ok
        ? result.mutual
          ? "It's a mutual match — start messaging now."
          : 'Connection request sent.'
        : result.message,
      type: result.ok ? "success" : "error"
    });
    window.setTimeout(() => setBanner(null), 3800);
  };

  const resetFilters = () => {
    setSelectedRole('All Roles');
    setSelectedSkills([]);
    setAvailabilities({
      'Full-time': true,
      'Part-time': true,
      'Just Exploring': false,
    });
    setSelectedExperience('All Experience');
  };

  const hasActiveFilters =
    selectedRole !== 'All Roles' ||
    selectedSkills.length > 0 ||
    selectedExperience !== 'All Experience' ||
    !availabilities['Full-time'] ||
    !availabilities['Part-time'] ||
    availabilities['Just Exploring'];

  // ─── Filter & Sorting Logic ──────────────────────────────────────────────

  const filteredAndSortedProfiles = profiles
    .filter((profile) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = profile.name?.toLowerCase().includes(q);
        const bioMatch = profile.Bio?.toLowerCase().includes(q);
        const skillMatch = [...(profile.techstack || []), ...(profile.skills || [])]
          .some((s) => s.toLowerCase().includes(q));
        if (!nameMatch && !bioMatch && !skillMatch) return false;
      }

      // 2. Role filter
      if (selectedRole !== 'All Roles') {
        const normalizedRole = selectedRole.toLowerCase();
        const expStr = profile.experience?.toLowerCase() || '';
        if (normalizedRole.includes('backend') && expStr === 'beginner') return false;
        if (normalizedRole.includes('frontend') && expStr === 'god') return false;
        if (normalizedRole.includes('devops') && expStr === 'beginner') return false;
      }

      // 3. Skills filter
      if (selectedSkills.length > 0) {
        const profileSkills = [...(profile.techstack || []), ...(profile.skills || [])].map((s) => s.toLowerCase());
        const matches = selectedSkills.some((skill) =>
          profileSkills.some((ps) => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
        );
        if (!matches) return false;
      }

      // 4. Availability filter
      const isAvail = profile.avaliabilty !== false;
      const wantAvail = availabilities['Full-time'] || availabilities['Part-time'];
      const wantNotAvail = availabilities['Just Exploring'];
      if (wantAvail && !wantNotAvail && !isAvail) return false;
      if (!wantAvail && wantNotAvail && isAvail) return false;

      // 5. Experience Filter
      if (selectedExperience !== 'All Experience') {
        const expStr = profile.experience?.toLowerCase() || '';
        if (expStr !== selectedExperience.toLowerCase()) return false;
      }

      return true;
    })
    .filter((profile) => {
      // 6. Tab filtering
      if (activeTab === 'Top Match') {
        return (profile.matchScore ?? 0) > 2; // only high affinity matches
      }
      return true;
    })
    .sort((a, b) => {
      // 7. Tab sorting overrides
      if (activeTab === 'Most Active') {
        const expWeight = (exp: string) => exp === 'god' ? 3 : exp === 'intermediate' ? 2 : 1;
        return expWeight(b.experience ?? '') - expWeight(a.experience ?? '');
      }
      if (activeTab === 'New Builders') {
        // Tie-breaker: lowest scores or random distribution to discover fresh faces
        return (a.matchScore ?? 0) - (b.matchScore ?? 0);
      }
      return (b.matchScore ?? 0) - (a.matchScore ?? 0); // default to For You
    });

  // ─── Profile completion calculation ───────────────────────────────────────

  let filledCount = 2; // base fields
  if (myProfile?.avatar) filledCount++;
  if (myProfile?.Bio && myProfile.Bio !== "Let's cook") filledCount++;
  if (myProfile?.college) filledCount++;
  if (myProfile?.skills?.some((s: string) => s !== '')) filledCount++;
  if (myProfile?.techstack?.some((t: string) => t !== '')) filledCount++;
  if (myProfile?.socials?.some((s: string) => s !== '')) filledCount++;
  const completionPercentage = Math.round((filledCount / 8) * 100);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="db-root min-h-full flex antialiased overflow-hidden h-screen" data-theme={theme}>
      <Helmet>
        <title>Discover Developers & Collaborate - PeerY</title>
        <meta name="description" content="Find and connect with talented developers on PeerY. Filter by skills, role, and experience to build your next project team." />
      </Helmet>
      <DiscoverTokens />

      {/* MIDDLE CONTENT BLOCK */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Search header */}
        <header className="db-surface h-16 border-b db-line px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 db-surface border db-line rounded-lg db-ink-soft hover:db-ink"
            >
              <User size={16} />
            </button>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 db-ink-soft" size={16} />
              <input
                type="text"
                placeholder="Search builders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="db-input w-full db-line-bg border db-line rounded-lg pl-9 pr-12 py-2 text-xs font-medium db-ink"
              />
              <span className="hidden md:block font-mono absolute right-3 top-1/2 -translate-y-1/2 text-[9px] db-ink-soft border db-line px-1.5 py-0.5 rounded db-surface">⌘ K</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              // onClick={toggleTheme}
              className="p-2 border db-line rounded-lg db-ink-soft hover:db-ink db-surface transition-all flex items-center justify-center cursor-pointer"
              title={(theme as string) === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {(theme as string) === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => navigate('/network')}
              className="p-2 border db-line rounded-lg db-ink-soft hover:db-ink db-surface transition-all flex items-center justify-center relative cursor-pointer"
              title="View network notifications"
            >
              <Bell size={14} />
            </button>
            <button
              onClick={refetch}
              className="p-2 border db-line rounded-lg db-ink-soft hover:db-ink db-surface transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer px-3"
              title="Refresh recommendations"
            >
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              Sync feed
            </button>
          </div>
        </header>

        {/* Feed section */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-6xl mx-auto w-full space-y-6">

            {/* Heading */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight db-ink">
                  Find builders. Build together.
                </h1>
                <p className="db-ink-soft text-sm mt-0.5">Ranked by overlap with your builder profile.</p>
              </div>
              <div className="font-mono flex items-center gap-1.5 text-[10px] db-ink-soft">
                <span className="w-1.5 h-1.5 rounded-full db-signal-bg-solid animate-pulse" />
                live feed
              </div>
            </div>

            {/* Tabs + filter toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex db-line-bg p-1 rounded-lg w-full sm:w-auto border db-line overflow-x-auto no-scrollbar shrink-0">
                {(['For You', 'Top Match', 'Most Active', 'New Builders', 'All Users'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab
                      ? 'db-surface db-ink shadow-sm'
                      : 'db-ink-soft hover:db-ink'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 relative w-full sm:w-auto">
                {/* Role dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === 'role' ? null : 'role')}
                    className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-colors cursor-pointer ${selectedRole !== 'All Roles' ? 'db-signal-bg db-signal border-transparent' : 'db-surface db-line db-ink-soft hover:db-ink'
                      }`}
                  >
                    {selectedRole === 'All Roles' ? 'Role' : selectedRole.split(' ')[0]}
                    <ChevronDown size={10} className="sm:w-3 sm:h-3" />
                  </button>
                  {openFilter === 'role' && (
                    <div className="absolute right-0 top-full mt-2 db-surface border db-line rounded-xl shadow-lg p-1.5 w-44 sm:w-52 z-50 space-y-0.5">
                      {['All Roles', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer'].map((role) => (
                        <button
                          key={role}
                          onClick={() => { setSelectedRole(role); setOpenFilter(null); }}
                          className={`w-full text-left text-[10px] sm:text-xs py-1 sm:py-1.5 px-2 rounded-md font-medium transition-all ${selectedRole === role ? 'db-signal-bg db-signal' : 'db-ink-soft hover:db-line-bg'
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === 'skills' ? null : 'skills')}
                    className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-colors cursor-pointer ${selectedSkills.length > 0 ? 'db-signal-bg db-signal border-transparent' : 'db-surface db-line db-ink-soft hover:db-ink'
                      }`}
                  >
                    {selectedSkills.length > 0 ? `Skills · ${selectedSkills.length}` : 'Skills'}
                    <ChevronDown size={10} className="sm:w-3 sm:h-3" />
                  </button>
                  {openFilter === 'skills' && (
                    <div className="absolute right-0 top-full mt-2 db-surface border db-line rounded-xl shadow-lg p-2.5 sm:p-3 w-56 sm:w-64 z-50 space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 db-ink-soft w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Type and press Enter..."
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newSkillInput.trim()) {
                              if (!selectedSkills.includes(newSkillInput.trim().toLowerCase())) {
                                setSelectedSkills([...selectedSkills, newSkillInput.trim().toLowerCase()]);
                              }
                              setNewSkillInput('');
                            }
                          }}
                          className="db-input w-full db-line-bg border db-line rounded-lg pl-7 pr-3 py-1 text-[10px] sm:text-xs db-ink"
                        />
                      </div>
                      {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {selectedSkills.map((skill) => (
                            <span key={skill} className="db-chip flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium">
                              {skill}
                              <button
                                onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                                className="db-ink-soft hover:db-ink"
                              >
                                <X size={8} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Availability dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === 'availability' ? null : 'availability')}
                    className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border db-surface db-line db-ink-soft hover:db-ink transition-colors cursor-pointer"
                  >
                    Availability
                    <ChevronDown size={10} className="sm:w-3 sm:h-3" />
                  </button>
                  {openFilter === 'availability' && (
                    <div className="absolute right-0 top-full mt-2 db-surface border db-line rounded-xl shadow-lg p-2.5 sm:p-3 w-40 sm:w-48 z-50 space-y-1.5">
                      {Object.keys(availabilities).map((key) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={availabilities[key]}
                            onChange={() => setAvailabilities({ ...availabilities, [key]: !availabilities[key] })}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-current db-signal rounded"
                          />
                          <span className="text-[10px] sm:text-xs font-medium db-ink-soft hover:db-ink">{key}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenFilter(openFilter === 'experience' ? null : 'experience')}
                    className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-colors cursor-pointer ${selectedExperience !== 'All Experience' ? 'db-signal-bg db-signal border-transparent' : 'db-surface db-line db-ink-soft hover:db-ink'
                      }`}
                  >
                    {selectedExperience === 'All Experience' ? 'Experience' : selectedExperience}
                    <ChevronDown size={10} className="sm:w-3 sm:h-3" />
                  </button>
                  {openFilter === 'experience' && (
                    <div className="absolute right-0 top-full mt-2 db-surface border db-line rounded-xl shadow-lg p-1.5 w-32 sm:w-40 z-50 space-y-0.5">
                      {['All Experience', 'Beginner', 'Intermediate', 'God'].map((exp) => (
                        <button
                          key={exp}
                          onClick={() => { setSelectedExperience(exp); setOpenFilter(null); }}
                          className={`w-full text-left text-[10px] sm:text-xs py-1 sm:py-1.5 px-2 rounded-md font-medium transition-all ${selectedExperience === exp ? 'db-signal-bg db-signal' : 'db-ink-soft hover:db-line-bg'
                            }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {hasActiveFilters && (
                  <button onClick={resetFilters} className="font-mono text-[9px] sm:text-[10px] db-ink-soft hover:db-ink underline underline-offset-2 ml-1">
                    reset
                  </button>
                )}
              </div>
            </div>

            {openFilter && (
              <div className="fixed inset-0 z-40" onClick={() => setOpenFilter(null)} />
            )}

            {/* Match affinity showcase */}
            {profiles.length > 0 && (
              <div className={`w-full p-8 rounded-3xl transition-colors duration-300 ${theme === 'light' ? 'bg-slate-100' : 'bg-gray-900'
                }`}>
                <div className="relative z-10 space-y-4">

                  {/* Label */}
                  <span className="block font-mono text-[10px] tracking-widest text-gray-500 uppercase">
                    Top Match
                  </span>

                  {/* Heading */}
                  <h2 className={`font-display text-2xl font-bold tracking-tight ${theme === 'light' ? 'text-blue-600' : 'text-gray-200'
                    }`}>
                    {profiles[0].name || "A compatible builder"}
                  </h2>

                  {/* Subtitle */}
                  <p className={`text-sm leading-relaxed max-w-xl ${theme === 'light'
                    ? 'text-blue-700 font-medium'
                    : 'text-gray-400'
                    }`}>
                    Ranked highest on shared stack and availability with your profile.
                  </p>

                  <div className="pt-2">
                    <Readout score={profiles[0].matchScore ?? 0} size="lg" />
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => navigate(`/discover/${profiles[0]._id}`)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all ${theme === 'light'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-[#FF9500] text-black hover:bg-[#e68600]'
                      }`}
                  >
                    View Profile <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Toast notifications */}
            <AnimatePresence>
              {banner && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`border p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${banner.type === "error"
                    ? "db-hero text-white border-transparent"
                    : "db-signal-bg db-signal border-transparent"
                    }`}
                >
                  {banner.type === "error" ? <ShieldAlert size={14} /> : <CheckCircle2 size={14} />}
                  {banner.msg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feed Grid */}
            <div className="space-y-4">

              {isLoading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="db-surface border db-line rounded-2xl p-5 h-48 space-y-3">
                      <div className="db-skel h-3 w-20 rounded" />
                      <div className="db-skel h-8 w-8 rounded-full" />
                      <div className="db-skel h-3 w-full rounded" />
                      <div className="db-skel h-3 w-3/4 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && error && (
                <div className="db-hero rounded-2xl p-8 text-center space-y-3">
                  <ShieldAlert size={26} className="text-white/70 mx-auto" />
                  <p className="text-xs font-medium text-white">Couldn't load your feed. {error}</p>
                  <button
                    onClick={refetch}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:underline"
                  >
                    <RefreshCw size={12} /> Try again
                  </button>
                </div>
              )}

              {!isLoading && !error && profiles.length === 0 && (
                <div className="db-surface border db-line rounded-2xl p-12 text-center space-y-3">
                  <User size={32} className="db-ink-soft mx-auto" />
                  <h3 className="text-base font-semibold db-ink">Nothing here yet</h3>
                  <p className="text-xs db-ink-soft max-w-sm mx-auto">
                    Fill out your profile and add a few more skills so we can find teammates worth matching.
                  </p>
                </div>
              )}

              {!isLoading && !error && profiles.length > 0 && filteredAndSortedProfiles.length === 0 && (
                <div className="db-surface border db-line rounded-2xl p-12 text-center space-y-3">
                  <X size={32} className="db-ink-soft mx-auto" />
                  <h3 className="text-base font-semibold db-ink">No matches found</h3>
                  <p className="text-xs db-ink-soft max-w-sm mx-auto">
                    Widen your filters to see more builders.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="h-8 px-4 db-hero text-white rounded-full text-xs font-medium transition-colors cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {!isLoading && !error && filteredAndSortedProfiles.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAndSortedProfiles.map((profile) => {
                    const pills = (profile.techstack?.length ? profile.techstack : profile.skills) || [];
                    const avatar = profile.avatar || `https://i.pravatar.cc/100?u=${profile.authId}`;
                    const t = getTier(profile.matchScore ?? 0);
                    return (
                      <motion.div
                        key={profile._id}
                        layout
                        whileHover={{ y: -2 }}
                        className="db-card db-surface border db-line rounded-2xl p-5 flex flex-col justify-between relative"
                      >
                        <div>
                          {/* Tags */}
                          <div className="flex justify-between items-start mb-4">
                            <span className={`font-mono text-[9px] font-medium px-2 py-0.5 rounded ${t.bg} ${t.cls}`}>
                              {t.label}
                            </span>
                            {profile.Rank && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 db-line-bg db-ink-soft rounded uppercase">
                                Rank {profile.Rank}
                              </span>
                            )}
                          </div>

                          {/* Profile Info */}
                          <div className="flex items-center gap-3.5 mb-4">
                            <div className="w-11 h-11 rounded-full db-line-bg flex items-center justify-center font-display text-sm font-semibold db-ink shrink-0 relative">
                              {profile.name?.[0] ?? "U"}
                              {profile.avatar && (
                                <img src={avatar} alt="avatar" className="absolute inset-0 w-full h-full rounded-full object-cover" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold db-ink truncate capitalize leading-tight">{profile.name}</h4>
                              <p className="font-mono text-[9px] db-ink-soft uppercase tracking-widest capitalize mt-0.5">{profile.experience || 'Builder'}</p>
                            </div>
                          </div>

                          {profile.Bio && (
                            <p className="text-[11px] db-ink-soft leading-relaxed line-clamp-2 mb-4">
                              {profile.Bio}
                            </p>
                          )}

                          {/* Tech Stack */}
                          {pills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-6">
                              {pills.slice(0, 3).map((p) => (
                                <span key={p} className="db-chip text-[9px] font-medium px-2 py-0.5 rounded capitalize">
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Connect controls */}
                        <div className="flex items-center justify-between pt-3 border-t db-line">
                          <Readout score={profile.matchScore ?? 0} />
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/discover/${profile._id}`)}
                              className="h-8 px-3 db-line-bg db-ink-soft hover:db-ink rounded-lg text-xs font-medium transition-all border db-line flex items-center justify-center cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleLike(profile.authId)}
                              disabled={likingId === profile.authId}
                              className="db-heart-btn w-8 h-8 border db-line rounded-lg flex items-center justify-center db-ink-soft transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                            >
                              {likingId === profile.authId ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Heart size={12} />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Explore categories */}
            <div className="space-y-3 pt-6 border-t db-line">
              <h3 className="font-mono text-[10px] db-ink-soft tracking-widest">EXPLORE CATEGORIES</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Backend Developer', count: 'Skills-weighted matching' },
                  { name: 'Frontend Developer', count: 'UI/UX integration' },
                  { name: 'Full Stack Developer', count: 'E2E systems' },
                  { name: 'DevOps Engineer', count: 'CI/CD pipeline shipping' },
                ].map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedRole(cat.name)}
                    className={`border rounded-xl p-4 flex items-center gap-3 transition-colors cursor-pointer ${selectedRole === cat.name
                      ? "db-signal-bg border-transparent"
                      : "db-surface db-line hover:border-current"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedRole === cat.name ? "db-signal-bg-solid text-white" : "db-line-bg db-ink-soft"
                      }`}>
                      <Code2 size={15} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold db-ink truncate leading-tight">{cat.name.split(" ")[0]}</h4>
                      <p className="text-[9px] db-ink-soft truncate mt-0.5">{cat.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`db-surface fixed inset-y-0 right-0 z-50 w-72 border-l db-line flex flex-col shrink-0 p-6 overflow-y-auto no-scrollbar gap-6 transform transition-transform duration-300 md:relative md:transform-none ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 db-surface border db-line rounded-lg"
        >
          <X size={16} />
        </button>

        {/* Profile completion */}
        <div className="border db-line rounded-2xl p-5 space-y-4">
          <h4 className="font-mono text-[10px] db-ink-soft tracking-widest">YOUR PROFILE</h4>

          <div className="flex items-center gap-4 pt-1">
            {/* Circular Ring Progress */}
            <div className="w-14 h-14 shrink-0 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" strokeWidth="4.5" fill="transparent" style={{ stroke: 'var(--line)' }} />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  className="transition-all duration-500"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray="150"
                  strokeDashoffset={150 - (150 * completionPercentage) / 100}
                  strokeLinecap="round"
                  style={{ stroke: 'var(--signal)' }}
                />
              </svg>
              <span className="absolute font-mono text-[10px] font-medium db-ink">{completionPercentage}%</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold db-ink leading-tight">Match quality</p>
              <p className="text-[10px] db-ink-soft leading-snug mt-1">
                {completionPercentage < 60
                  ? "Add more detail to sharpen your matches."
                  : "Your profile has strong signal."}
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="font-mono text-[9px] db-signal hover:underline flex items-center gap-0.5 mt-1 cursor-pointer"
              >
                finish profile <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Trending Projects in peerY */}
        <div className="border db-line rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-mono text-[10px] db-ink-soft tracking-widest flex items-center gap-1">
              <TrendingUp size={12} /> ACTIVE TEAMS
            </h4>
            <Link to="/projects" className="font-mono text-[10px] db-signal hover:underline">all</Link>
          </div>

          {isTrendingLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="db-skel h-8 w-full rounded" />
              ))}
            </div>
          ) : trendingProjects.length === 0 ? (
            <p className="text-[10px] db-ink-soft text-center">No projects launched yet.</p>
          ) : (
            <div className="space-y-3.5">
              {trendingProjects.map((proj) => (
                <div
                  key={proj._id}
                  onClick={() => navigate(`/project/${proj._id}/workspace`)}
                  className="group cursor-pointer select-none space-y-0.5"
                >
                  <div className="flex justify-between items-start gap-1">
                    <p className="text-xs font-semibold db-ink group-hover:db-signal transition-colors truncate">
                      {proj.title}
                    </p>
                    <span className="font-mono text-[9px] db-ink-soft shrink-0">
                      ★{proj.bookMarksCount || 0}
                    </span>
                  </div>
                  <p className="text-[10px] db-ink-soft line-clamp-1 leading-normal">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start a team */}
        <div className="border db-line rounded-2xl p-5 text-center space-y-3">
          <Code2 size={18} className="db-ink-soft mx-auto" />
          <div>
            <h4 className="text-xs font-semibold db-ink">Building something?</h4>
            <p className="text-[10px] db-ink-soft leading-relaxed mt-1">
              Start a team and pull in collaborators.
            </p>
          </div>
          <button
            onClick={() => navigate("/projects")}
            className="w-full h-8 db-hero text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus size={12} />
            <span>Start a team</span>
          </button>
        </div>

      </aside>

    </div>
  );
}

// ─── Design tokens (palette / type / component classes) ────────────────────
// Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (data/labels).
// Palette: white surfaces, black ink, one blue accent — reserved for the
// compatibility readout, the live-status dot, and active filter state.
// Black itself doubles as the "alert" tone (see .db-hero use on errors)
// instead of introducing a fourth color for danger states.
// Light/dark is driven entirely by CSS variables, switched via the
// [data-theme] attribute on .db-root — no per-element theme branching in JSX.

function DiscoverTokens() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

      .db-root {
        --bg: #FFFFFF;
        --surface: #FFFFFF;
        --ink: #0A0A0A;
        --ink-soft: rgba(10,10,10,0.55);
        --line: rgba(10,10,10,0.12);
        --line-bg: rgba(10,10,10,0.05);
        --signal: #2F6FED;
        --signal-soft: #6E9BF5;
        --signal-bg: rgba(47,111,237,0.10);
        --signal-bg-soft: rgba(47,111,237,0.07);
        --chip-bg: rgba(10,10,10,0.05);
        --chip-text: rgba(10,10,10,0.65);
        --skel-a: rgba(10,10,10,0.06);
        --skel-b: rgba(10,10,10,0.02);
        --card-shadow: rgba(10,10,10,0.14);

        background: var(--bg);
        color: var(--ink);
        font-family: 'IBM Plex Sans', sans-serif;
        transition: background-color .2s ease, color .2s ease;
      }

      .db-root[data-theme='dark'] {
        --bg: #0A0A0A;
        --surface: #131417;
        --ink: #F5F6F7;
        --ink-soft: rgba(245,246,247,0.55);
        --line: rgba(245,246,247,0.12);
        --line-bg: rgba(245,246,247,0.06);
        --signal: #4C8DFF;
        --signal-soft: #7FB0FF;
        --signal-bg: rgba(76,141,255,0.16);
        --signal-bg-soft: rgba(76,141,255,0.09);
        --chip-bg: rgba(245,246,247,0.07);
        --chip-text: rgba(245,246,247,0.65);
        --skel-a: rgba(245,246,247,0.08);
        --skel-b: rgba(245,246,247,0.03);
        --card-shadow: rgba(0,0,0,0.5);
      }

      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }

      .db-surface { background: var(--surface); }
      .db-line { border-color: var(--line); }
      .db-line-bg { background: var(--line-bg); }
      .db-ink { color: var(--ink); }
      .db-ink-soft { color: var(--ink-soft); }

      .db-signal { color: var(--signal); }
      .db-signal-bg { background: var(--signal-bg); }
      .db-signal-bg-solid { background: var(--signal); }
      .db-signal-soft { color: var(--signal-soft); }
      .db-signal-bg-soft { background: var(--signal-bg-soft); }
      .db-signal-soft-bg-solid { background: var(--signal-soft); }

      .db-bar-off { background: var(--line); }
      .db-ink-soft-bg-solid { background: var(--ink-soft); }
      .db-hero { background: #0A0A0A; }
      .db-input:focus { outline: none; border-color: var(--signal); }
      .db-card { transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
      .db-card:hover { box-shadow: 0 8px 24px -12px var(--card-shadow); border-color: var(--signal-soft); }
      .db-chip { background: var(--chip-bg); color: var(--chip-text); font-family: 'IBM Plex Mono', monospace; }
      .db-skel { background: linear-gradient(90deg, var(--skel-a) 25%, var(--skel-b) 37%, var(--skel-a) 63%); background-size: 400% 100%; animation: db-shimmer 1.4s ease infinite; }
      @keyframes db-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

      .db-heart-btn { color: var(--ink-soft); }
      .db-heart-btn:hover { border-color: var(--signal) !important; color: var(--signal); }
    `}</style>
  );
}