import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Layers, TrendingUp, Cpu, Award, ArrowRight, Check, 
  MessageSquare, ThumbsUp, AlertCircle, Share2, HelpCircle, 
  User, CheckCircle2, ChevronRight, Bookmark, Flame, ShieldAlert, Zap,
  Atom, Settings, ShieldCheck, Microscope, Database, Users, HelpCircle as HelpIcon,
  Globe, Server, Heart, Terminal, BookOpen, Activity, Play, Pause, RefreshCw, Send,
  Brain, Store, Briefcase, Building
} from 'lucide-react';
import { Problem } from '../types';

interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  author: string;
  upvotes: number;
  commentsCount: number;
  description: string;
  bottleneck: string;
  suggestedDomain: string;
  suggestedExpertise: string[];
  suggestedDifficulty: 'Hard' | 'Extreme' | 'Grand Challenge';
  suggestedImpact: 'Revolutionary' | 'High' | 'Medium';
}

interface PlatformLandingProps {
  problems: Problem[];
  onImportProblem: (problemData: any) => void;
  onNavigateToTab: (tab: string, initialFilter?: 'all' | 'institutional' | 'sme' | 'reddit') => void;
  onSelectProblem?: (id: string) => void;
}

export default function PlatformLanding({
  problems,
  onImportProblem,
  onNavigateToTab,
  onSelectProblem
}: PlatformLandingProps) {
  // Real world scraped subreddits
  const [scoutedPosts, setScoutedPosts] = useState<RedditPost[]>([
    {
      id: 'reddit-1',
      subreddit: 'r/aquaponics',
      title: 'Need a tool to calculate chemical equilibrium decay with varying pH values',
      author: 'u/microbe_farm_boy',
      upvotes: 142,
      commentsCount: 38,
      description: 'I operate a small rural farm in Ohio and want to build a computerized nutrient lookup. The issue is ammonia (NH3) vs ammonium (NH4+) ratios shift wildly based on temperature and fluctuating pH levels. I don\'t know how to write Differential Equations or configure thermodynamic reactions. Existing software is commercial, extremely clunky, or written in outdated Fortran.',
      bottleneck: 'Requires exact biochemical formulas running in a lightweight browser solver with real-time feedback curves. No compiler installation needed.',
      suggestedDomain: 'Bioengineering',
      suggestedExpertise: ['Biochemical Equilibrium', 'Reaction Kinetics', 'Nutrient Simulation'],
      suggestedDifficulty: 'Hard',
      suggestedImpact: 'Medium'
    },
    {
      id: 'reddit-2',
      subreddit: 'r/conservation',
      title: 'Triangulating low-frequency sound arrivals of illegal chainsaws without expensive MATLAB toolkits',
      author: 'u/wild_canopy',
      upvotes: 218,
      commentsCount: 47,
      description: 'We are field conservationists deploying acoustic nodes to detect poaching and illegal logging. We have GPS tracker coordinates for five cheap microphone rigs and high-fidelity arrival delay times. We want to convert these delay differences into chainsaw coordinates using hyperbola intersection solvers, but we are field biologists, not geomatics systems engineers. Direct tools are locked behind expensive institutional licenses.',
      bottleneck: 'Requires a Time Difference of Arrival (TDoA) coordinate math engine mapped dynamically on an interactive satellite view.',
      suggestedDomain: 'Climate Tech',
      suggestedExpertise: ['Acoustic Triangulation', 'Spatial Mapping', 'TDoA Heuristics'],
      suggestedDifficulty: 'Extreme',
      suggestedImpact: 'High'
    },
    {
      id: 'reddit-3',
      subreddit: 'r/RenewableEnergy',
      title: 'How to estimate snow-reflection bounce offsets (Albedo) for dual-sided solar arrays?',
      author: 'u/photovoltaic_dr',
      upvotes: 189,
      commentsCount: 29,
      description: 'Bifacial solar panels generate incredible power by harvesting ground reflections. For snow, this albedo coefficient increases drastically. However, there\'s no straightforward, simple interface to calculate these diffuse reflections for custom coordinates without compiling massive legacy research files or installing heavy Fortran wrappers. We desperately need a simple equation solver.',
      bottleneck: 'Lacks an uncompiled optical geometry playground showing light bounced albedo values as interactive bar meters.',
      suggestedDomain: 'Climate Tech',
      suggestedExpertise: ['Optoelectronic Math', 'Albedo Modeling', 'Ray Trace Approximations'],
      suggestedDifficulty: 'Hard',
      suggestedImpact: 'High'
    },
    {
      id: 'reddit-4',
      subreddit: 'r/Linguistics',
      title: 'Map vocal mouth-resonance frequencies onto standardized visual IPA charts automatically',
      author: 'u/phonetics_enthusiast',
      upvotes: 95,
      commentsCount: 17,
      description: 'We are documenting endangered languages. We have audio recordings and extract prime formants (F1, F2 coordinates in Hertz). However, getting these coordinates onto a standardized vowel chart currently involves copying numbers into Excel grids manually. Praat (vowel software) has an outdated interface from 1995 and doesn\'t connect to external research databases.',
      bottleneck: 'Needs direct spectrogram/formant audio parsing values feeding into an interactive vowel grid and persistent researcher databases.',
      suggestedDomain: 'Mathematics',
      suggestedExpertise: ['Formant Extraction', 'Dynamic Canvas Charting', 'Phonetic Mapping'],
      suggestedDifficulty: 'Hard',
      suggestedImpact: 'Medium'
    }
  ]);

  const [importedPostIds, setImportedPostIds] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Enhanced Interactive Onboarding States with Hybrid Identities support
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(['scholar', 'business']); // default is Scholar and SME Business Partner
  const selectedPersona = selectedPersonas[0] || 'scholar'; // compatibility fallback

  // Small Business Requirements Intake Form states
  const [smeCompanyName, setSmeCompanyName] = useState<string>('');
  const [smeBottleneckTitle, setSmeBottleneckTitle] = useState<string>('');
  const [smeDomain, setSmeDomain] = useState<string>('Quantum & Materials Science');
  const [smeDescription, setSmeDescription] = useState<string>('');
  const [smeRequiredExpertise, setSmeRequiredExpertise] = useState<string>('');
  const [smeExpectedImpact, setSmeExpectedImpact] = useState<'Revolutionary' | 'High' | 'Medium'>('High');
  const [smeSuccessMessage, setSmeSuccessMessage] = useState<string>('');
  const [isContributingCompute, setIsContributingCompute] = useState<boolean>(false);
  const [computeThreads, setComputeThreads] = useState<number>(4);
  const [gigaflopsContributed, setGigaflopsContributed] = useState<number>(0);
  const [volunteerHours, setVolunteerHours] = useState<number>(0);
  const [peerReviewsDone, setPeerReviewsDone] = useState<number>(0);
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorRole, setVisitorRole] = useState<string>('Subject Expert');
  const [visitorNote, setVisitorNote] = useState<string>('');
  const [visitorStories, setVisitorStories] = useState<Array<{name: string, role: string, text: string}>>([
    { name: 'Dr. Sarah Jenkins', role: 'Subject Scholar', text: 'Modeling non-Markovian septic transition limits in pediatric care.' },
    { name: 'Dr. Lars Gustafsson', role: 'Systems Engineer', text: 'Securing RISC-V double-buffered lockless Circular DMAs.' },
    { name: 'Evelyn Vance', role: 'Technologist', text: 'Testing memory-safe bounds for aerospace flight telemetry.' }
  ]);

  // Real-time server-side simulated thread compute scheduler
  useEffect(() => {
    let interval: any;
    if (isContributingCompute) {
      interval = setInterval(() => {
        setGigaflopsContributed(prev => prev + (computeThreads * 485.4));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isContributingCompute, computeThreads]);

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorNote.trim()) return;
    setVisitorStories(prev => [
      { name: visitorName, role: visitorRole, text: visitorNote },
      ...prev
    ]);
    setVisitorName('');
    setVisitorNote('');
  };

  const togglePersona = (persona: string) => {
    setSelectedPersonas(prev => {
      if (prev.includes(persona)) {
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== persona);
      } else {
        return [...prev, persona];
      }
    });
  };

  const handleSmeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smeCompanyName.trim() || !smeBottleneckTitle.trim() || !smeDescription.trim()) {
      return;
    }

    const formattedProblem = {
      title: `[SME RFS] ${smeBottleneckTitle}`,
      domain: smeDomain,
      description: `Targeting bottleneck for ${smeCompanyName}: ${smeDescription.substring(0, 140)}...`,
      detailDescription: `SME OPPORTUNITY INTAKE:\n\nEnterprise/Business: ${smeCompanyName}\n\nCORE BOTTLENECK STATEMENT:\n${smeDescription}\n\nREQUIRED VERIFICATIONS:\n- Translate physical variables into live, interactive simulation components.\n- Formulate math coefficients to ensure calculation boundaries hold in real-world deployment.\n- Connect domain scholars with software developers to verify the logic flow.`,
      creator: `${smeCompanyName} (SME Partner)`,
      difficulty: 'Hard' as const,
      impactFactor: smeExpectedImpact,
      requiredExpertise: smeRequiredExpertise.trim() 
        ? smeRequiredExpertise.split(',').map(s => s.trim()).filter(Boolean)
        : ['Analytical Modeling', 'Systems Design']
    };

    onImportProblem(formattedProblem);

    // Append to live visitor feed
    setVisitorStories(prev => [
      { name: smeCompanyName, role: 'SME Partner', text: `Submitted requirement: "${smeBottleneckTitle}" targeting ${smeDomain}.` },
      ...prev
    ]);

    setSmeSuccessMessage(`Successfully compiled "${smeBottleneckTitle}" and registered workroom under SME Requirements!`);
    
    // Clear inputs
    setSmeCompanyName('');
    setSmeBottleneckTitle('');
    setSmeDescription('');
    setSmeRequiredExpertise('');

    setTimeout(() => {
      setSmeSuccessMessage('');
    }, 7000);
  };

  const handleImport = (post: RedditPost) => {
    if (importedPostIds.includes(post.id)) return;

    // Convert into a formal Problem schema
    const formattedProblem = {
      title: `[Scouted Reddit] ${post.title}`,
      domain: post.suggestedDomain,
      description: `Reddit Scout Opportunity (${post.subreddit}): ${post.description.substring(0, 160)}...`,
      detailDescription: `SUBREDDIT BOTTLENECK PARSING:\n\nScouted Post by ${post.author} on ${post.subreddit} (Upvotes: ${post.upvotes}).\n\nPROBLEM STATEMENT:\n${post.description}\n\nTECHNICAL REALIZATION BARRIER:\n${post.bottleneck}\n\nREQUIRED WORKSPACE CO-OP SETUP:\n- Connect domain researchers with systems specialists\n- Harness specialised Agent runtimes to build verification checklists`,
      creator: `${post.author} via PolyNex Scanner`,
      difficulty: post.suggestedDifficulty,
      impactFactor: post.suggestedImpact,
      requiredExpertise: post.suggestedExpertise
    };

    onImportProblem(formattedProblem);
    setImportedPostIds(prev => [...prev, post.id]);
  };

  const steps = [
    {
      title: '1. Uncover Gaps',
      badge: 'FRONTIER DECOUPLE',
      desc: 'Qualitative, real-world friction is extracted from niche field-industry channels (like our automated Reddit scraper) where non-technical domain practitioners are currently bottlenecked.'
    },
    {
      title: '2. Pair the Trio',
      badge: 'SYNERGETIC BRIDGE',
      desc: 'The problem is loaded into a dedicated Workspace. We bridge the Subject Expert (defining criteria) with elite Technologists (translating code templates) inside single synchronous boards.'
    },
    {
      title: '3. Spark Specialized Agents',
      badge: 'AUTONOMOUS BRAINS',
      desc: 'Specialized Agent personas (such as Rigorist Fermat or Lateral Synthesizer Aura-7) analyze the math, review safety constraints, generate simulations, and coordinate peer reviews.'
    },
    {
      title: '4. Sandbox & Verify',
      badge: 'RIGOROUS OUTCOMES',
      desc: 'Deploy interactive, sandboxed prototypes with clean charts. Run verification suits and automated code benchmarking so non-CS stakeholders can confidently inspect physical outcomes.'
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in" id="welcome-portal-landing">
      
      {/* 1. WELCOMING INVITATION BANNER & LIVE METRICS */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#090e15] to-[#040608] dark:from-[#090d14] dark:to-[#030508] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 lg:p-12 shadow-xl space-y-8 animate-fade-in">
        {/* Decorative ambient gradients */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-teal-500/5 rounded-full blur-3xl pointer-events-none select-none"></div>
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none select-none"></div>
        
        <div className="relative z-10 max-w-5xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-550/5 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Operating System for Frontier Advancement
          </span>
          
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              PolyNex
            </h1>
            <p className="text-xs lg:text-sm font-mono tracking-widest text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              Science & Technology, Together
            </p>
          </div>

          <div className="border-l-2 border-indigo-500/40 pl-4 space-y-3 max-w-4xl">
            <p className="text-sm lg:text-base font-mono text-indigo-700 dark:text-indigo-200/90 leading-relaxed font-semibold">
              The Collaborative Operating System for Frontier Science & Engineering
            </p>
            <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium">
              Polynex is a collaborative operating system for frontier advancement in science and engineering, a shared coordination layer where experts, builders, organizations, and AI agents work together to solve problems that exceed the capacity of any individual, laboratory, company, or institution.
            </p>
            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-300 leading-relaxed font-sans italic text-indigo-600/80 dark:text-indigo-300/90 font-medium">
              Rather than creating another discussion forum or static research repository, PolyNex is designed as a dynamic execution environment for verified collaborative breakthroughs.
            </p>
          </div>

          {/* Quick Stats Well */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white/40 dark:bg-[#03060a]/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/85">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500 uppercase block">Active Co-op Solvers</span>
              <span className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                1,842 <span className="text-[9px] text-[#10b981] font-mono font-bold animate-pulse">● LIVE</span>
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500 uppercase block">Sovereign Thread Pool</span>
              <span className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-purple-500" />
                {isContributingCompute ? `${(12513 + computeThreads).toLocaleString()}` : "12,513"} Threads
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500 uppercase block">Active Workrooms</span>
              <span className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-teal-500" />
                {problems.filter(p => !p.title.startsWith('[Scouted Reddit]')).length} RRF Solicited
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500 uppercase block">Simulated Flops Donated</span>
              <span className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
                {gigaflopsContributed > 0 ? `${(gigaflopsContributed / 1000).toFixed(2)} TF` : "0.00 TF"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateToTab('challenges')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
            >
              Explore Grand Challenges
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </button>
            <button
              onClick={() => onNavigateToTab('challenges', 'reddit')}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              Analyze Reddit Gaps
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE PATH TO VERIFICATION: GRAPHIC PLATFORM MAP */}
      <div className="bg-white/85 dark:bg-[#090d14]/85 backdrop-blur-md border border-slate-200/70 dark:border-slate-850/70 rounded-3xl p-6 lg:p-8 space-y-5 shadow-sm shadow-slate-100/30 dark:shadow-[#040609]/60">
        <div>
          <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-500 uppercase">COOPERATIVE LOGIC FLOW</span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
            How PolyNex Aligns the Scientific Breakthrough Curve
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-4xl">
            Click on any phase below to visualize how raw physical friction transitions into structurally verified math layouts.
          </p>
        </div>

        {/* CSS Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-indigo-400/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">PHASE 1</span>
              </div>
              <h4 className="text-xs font-bold text-slate-850 dark:text-white">Field Scout</h4>
              <p className="text-[10px] text-slate-500 leading-snug">
                Detect qualitative physical bottlenecks inside specialized subreddits or institutional open-calls.
              </p>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-3 text-[9px] font-mono text-indigo-500 flex items-center gap-1">
              <span>Input: Real qualitative drag</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-purple-400/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">PHASE 2</span>
              </div>
              <h4 className="text-xs font-bold text-slate-850 dark:text-white">Formula Modeling</h4>
              <p className="text-[10px] text-slate-500 leading-snug">
                Establish rigorous physical boundary conditions and mathematical variables inside live workspaces.
              </p>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-3 text-[9px] font-mono text-purple-500 flex items-center gap-1">
              <span>Setup: Differential equations</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-emerald-400/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">PHASE 3</span>
              </div>
              <h4 className="text-xs font-bold text-slate-850 dark:text-white">Agent Validation</h4>
              <p className="text-[10px] text-slate-500 leading-snug">
                Trigger symmetric verification checkers and Agent solvers (e.g. Fermat) to test mathematical boundaries.
              </p>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-3 text-[9px] font-mono text-emerald-500 flex items-center gap-1">
              <span>Check: Formal checklist proof</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-indigo-500">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">PHASE 4</span>
              </div>
              <h4 className="text-xs font-bold text-slate-850 dark:text-white">Dynamic Sandbox</h4>
              <p className="text-[10px] text-slate-500 leading-snug">
                Compile uncompiled interactive charts so domain scholars can run simulations from any mobile browser.
              </p>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-3 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <span>Outcome: Interactive widget</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CO-OP NARRATIVE: THE PROBLEM & HISTORICAL MODELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/85 dark:bg-[#090d14]/85 backdrop-blur-md border border-slate-200/70 dark:border-slate-850/70 rounded-3xl p-6 lg:p-8 shadow-sm shadow-slate-100/30 dark:shadow-[#040609]/60">
        
        {/* Left Column: The Problem Statement (Span 5) */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-rose-500 uppercase">THE CRITICAL DEFICIT</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              The Coordination Problem
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              The modern research ecosystem suffers from a coordination problem rather than a talent problem.
            </p>
          </div>

          <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
            The world possesses billions of knowledgeable individuals, millions of scientists and engineers, unprecedented computational resources, and rapidly improving AI systems. Yet scientific and engineering work remains fragmented across institutions, disciplines, and software platforms.
          </p>

          {/* Core Disconnect Scenarios */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 bg-rose-50/40 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/55 dark:border-rose-950/40">
              <span className="text-sm shrink-0">🔬</span>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-slate-850 dark:text-rose-400">The Biologist's Silo</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Understands a critical cellular transition or disease mechanism but lacks the machine learning pipelines to calculate it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-amber-50/40 dark:bg-amber-950/10 p-3 rounded-xl border border-amber-100/55 dark:border-amber-950/40">
              <span className="text-sm shrink-0">⚙️</span>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-slate-850 dark:text-amber-400">The Simulation Gap</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  An engineer builds highly accurate physical solver blocks but lacks a pathway to connect with the right scientific audience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-50/40 dark:bg-blue-950/10 p-3 rounded-xl border border-blue-100/55 dark:border-blue-950/40">
              <span className="text-sm shrink-0">🌱</span>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-slate-850 dark:text-blue-400">The Public Observer</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  A field practitioner possesses pristine climate or bio observations but lacks institutional credentials and tools to contribute.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-purple-50/40 dark:bg-purple-950/10 p-3 rounded-xl border border-purple-100/55 dark:border-purple-950/40">
              <span className="text-sm shrink-0">🤖</span>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold text-slate-850 dark:text-purple-400">The Autonomous Agent Limit</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  AI systems can synthesize vast amounts of knowledge but remain entirely disconnected from real, productive collaborative execution.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-550 dark:text-slate-400 italic">
            The result is that many important problems remain unsolved not because the required knowledge does not exist, but because the people, tools, and information required to solve them are not effectively connected.
          </p>
        </div>

        {/* Right Column: Historical Precedents Grid (Span 7) */}
        <div className="lg:col-span-7 space-y-5 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-500 uppercase">HISTORIC PROCEDENTS</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Decentralized Human Alignment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              History repeatedly demonstrates the monumental power of large-scale open collaboration:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                <span className="text-xs">📖</span> Wikipedia
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Became the largest, most accurate decentralized knowledge repository in history, maintained entirely by volunteers without centralized hierarchy.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                <span className="text-xs">🐧</span> Linux OS
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Coordinates thousands of independent global developers to write and secure earth's critical backend server infrastructure.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                <span className="text-xs">🧩</span> Foldit
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                A gamified network where non-experts co-folded complex three-dimensional proteins, bypassing long-standing structural biochemistry bottlenecks.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                <span className="text-xs">🧠</span> EyeWire
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Mobilized hundreds of thousands of participants worldwide to trace and map dense, intricate retinal neural paths on interactive canvas visualizers.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                <span className="text-xs">🍁</span> iNaturalist
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Transformed global ecological and biodiversity monitoring by networking millions of public field observations into structured scientific datasets.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                <span className="text-xs">🖼️</span> LAION
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Demonstrated that decentralized communities could index, filter, and compile massive foundational datasets for general machine intelligence.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-950/25 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium font-sans italic">
            "These successes reveal a broader, systemic opportunity: building the custom coordination infrastructure that enables collaborative discovery itself."
          </div>
        </div>
      </div>

      {/* 4. CHOOSE YOUR COMMUNITY PERSONA & ROLE */}
      <div className="space-y-6 bg-white/85 dark:bg-[#090d14]/85 backdrop-blur-md border border-slate-200/70 dark:border-slate-850/70 rounded-3xl p-6 lg:p-8 shadow-sm shadow-slate-100/30 dark:shadow-[#040609]/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-purple-550 uppercase">Interactive Persona Configurator</span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Select Your Role & Tailor Your Interface Gaps
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Define your profile. <strong className="text-indigo-600 dark:text-indigo-400">Select multiple roles to activate a Hybrid Identity</strong> and merge your collective workspace directives!
            </p>
          </div>
          <div className="shrink-0 flex gap-1.5 flex-wrap">
            {selectedPersonas.map(p => {
              const label = p === 'scholar' ? 'Scholar' : p === 'technologist' ? 'System Tech' : p === 'citizen' ? 'Citizen' : 'SME Partner';
              const color = p === 'scholar' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400' : p === 'technologist' ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-900/40 dark:text-purple-400' : p === 'citizen' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/40 dark:text-amber-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/40 dark:text-emerald-400';
              return (
                <span key={p} className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 border rounded ${color}`}>
                  ✓ {label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => togglePersona('scholar')}
            className={`text-left p-5 rounded-xl border transition-all cursor-pointer select-none ${
              selectedPersonas.includes('scholar')
                ? 'bg-indigo-500/5 border-indigo-500 dark:bg-indigo-950/20 ring-1 ring-indigo-500/20 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Microscope className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Domain Experts</h4>
                <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">Subject Scholars</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Scientists, physicians, farmers, ecologists, operators, and practitioners contribute problem definitions, constraints, observations, and specialized domain knowledge. Do not require programming skills.
            </p>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-[8px] text-slate-400">
              <span className="truncate">Partner: <strong className="text-indigo-500">Rigorist Fermat</strong></span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 shrink-0 font-bold">
                {selectedPersonas.includes('scholar') ? 'ACTIVE ✓' : 'TOGGLE'}
              </span>
            </div>
          </button>

          {/* Card 2: Technical Contributors */}
          <button
            onClick={() => togglePersona('technologist')}
            className={`text-left p-5 rounded-xl border transition-all cursor-pointer select-none ${
              selectedPersonas.includes('technologist')
                ? 'bg-purple-500/5 border-purple-500 dark:bg-purple-950/20 ring-1 ring-purple-500/20 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Technical Contributors</h4>
                <p className="text-[9px] text-purple-600 dark:text-purple-400 font-mono font-bold">Builders & Transpilers</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Engineers, developers, researchers, designers, and builders. Create uncompiled software models, simulations, datasets, Experiments, and hardware components.
            </p>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-[8px] text-slate-400">
              <span className="truncate">Partner: <strong className="text-purple-500">Aura-7 Planner</strong></span>
              <span className="font-mono text-purple-600 dark:text-purple-400 shrink-0 font-bold">
                {selectedPersonas.includes('technologist') ? 'ACTIVE ✓' : 'TOGGLE'}
              </span>
            </div>
          </button>

          {/* Card 3: AI Agents */}
          <button
            onClick={() => togglePersona('citizen')}
            className={`text-left p-5 rounded-xl border transition-all cursor-pointer select-none ${
              selectedPersonas.includes('citizen')
                ? 'bg-amber-500/5 border-amber-500 dark:bg-amber-955/15 ring-1 ring-amber-500/20 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-805 dark:text-white">AI Agents</h4>
                <p className="text-[9px] text-amber-600 dark:text-amber-500 font-mono font-bold">Force Multipliers</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Specialized agents automating literature synthesis, task decomposition, contributor matching, data analysis, and project knowledge. Turn raw friction into repeatable breakthroughs.
            </p>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-[8px] text-slate-400">
              <span className="truncate">Peer: <strong className="text-amber-500">Coordination Core</strong></span>
              <span className="font-mono text-amber-600 dark:text-amber-450 shrink-0 font-bold">
                {selectedPersonas.includes('citizen') ? 'ACTIVE ✓' : 'TOGGLE'}
              </span>
            </div>
          </button>

          {/* Card 4: Small Business / Enterprise Partner */}
          <button
            onClick={() => togglePersona('business')}
            className={`text-left p-5 rounded-xl border transition-all cursor-pointer select-none ${
              selectedPersonas.includes('business')
                ? 'bg-emerald-500/5 border-emerald-500 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">SME / enterprise</h4>
                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Business Partner</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Submits actual logistics, mechanical constraints, or software requirements to formal verifiers to speed up physical workflows.
            </p>
            <div className="border-t border-slate-150 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-[8px] text-slate-400">
              <span className="truncate">Peer: <strong className="text-emerald-500">Industry Aligner</strong></span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">
                {selectedPersonas.includes('business') ? 'ACTIVE ✓' : 'TOGGLE'}
              </span>
            </div>
          </button>
        </div>

        {/* Dynamic Persona Checklist Well */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" />
            Your Aligned Onboarding Directives (Consolidated Core Checklist)
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600 dark:text-slate-400">
            {selectedPersonas.includes('scholar') && (
              <>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-indigo-500 font-bold shrink-0">1.</span>
                  <span>Scout qualitative subreddit posts highlighting physical code constraints.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-indigo-500 font-bold shrink-0">2.</span>
                  <span>Formulate equations and reaction variables inside live workrooms.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-indigo-500 font-bold shrink-0">3.</span>
                  <span>Validate physical equations alongside Rigorist Fermat agent proofs.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-indigo-500 font-bold shrink-0">4.</span>
                  <span>Authorize deployments to the Public Simulation Pool.</span>
                </li>
              </>
            )}
            {selectedPersonas.includes('technologist') && (
              <>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-purple-500 font-bold shrink-0">5.</span>
                  <span>Translate physical parameters into lightweight Javascript calculators.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-purple-500 font-bold shrink-0">6.</span>
                  <span>Connect frontends to secure, server-side simulated database keys.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-purple-500 font-bold shrink-0">7.</span>
                  <span>Implement unit benchmarking over all computational operations.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-purple-500 font-bold shrink-0">8.</span>
                  <span>Run sandboxed testing containers securely targeting port 3000.</span>
                </li>
              </>
            )}
            {selectedPersonas.includes('citizen') && (
              <>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-500 font-bold shrink-0">9.</span>
                  <span>Toggle Local Compute Sovereign Threads below to generate research blocks.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-500 font-bold shrink-0">10.</span>
                  <span>Evaluate mathematical checklists submitted by physical researchers.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-500 font-bold shrink-0">11.</span>
                  <span>Upload local sensor sheets (*.csv) to train open-source solvers.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-500 font-bold shrink-0">12.</span>
                  <span>Play sequence alignment matrix games inside active focus frames.</span>
                </li>
              </>
            )}
            {selectedPersonas.includes('business') && (
              <>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-emerald-500 font-bold shrink-0">13.</span>
                  <span>Submit operations logistics, hardware calculations, or chemical criteria.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-emerald-500 font-bold shrink-0">14.</span>
                  <span>Configure specific manufacturing tolerances or testing limits.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-emerald-500 font-bold shrink-0">15.</span>
                  <span>Coordinate with domain researchers to construct verified calculations.</span>
                </li>
                <li className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-emerald-500 font-bold shrink-0">16.</span>
                  <span>Leverage compiled web sandboxes to perform live stress testing.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Small Business RFS Intake Portal - Renders when the business persona is toggled/selected */}
        {selectedPersonas.includes('business') && (
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border-2 border-dashed border-emerald-500/25 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-605 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Business Requirement / RFS Intake Portal</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Specify material constraints, operational bottlenecks or logistical calculations</p>
              </div>
            </div>

            {smeSuccessMessage && (
              <div className="p-3 bg-emerald-55 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[11px] font-semibold">
                ✓ {smeSuccessMessage}
              </div>
            )}

            <form onSubmit={handleSmeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-mono text-slate-500 font-bold uppercase block mb-1">Company / Enterprise Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Apex Thermal Fabricators LLC"
                    value={smeCompanyName}
                    onChange={(e) => setSmeCompanyName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-slate-500 font-bold uppercase block mb-1">Operational Requirement or Bottleneck Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Brass Alloy Hardness Gradients"
                    value={smeBottleneckTitle}
                    onChange={(e) => setSmeBottleneckTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-mono text-slate-500 font-bold uppercase block mb-1">Select Domain Focus</label>
                  <select
                    value={smeDomain}
                    onChange={(e) => setSmeDomain(e.target.value)}
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-white"
                  >
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Biomaterials & Medical Technology">Biomaterials & Medical Technology</option>
                    <option value="Supply Chain Economics">Supply Chain Economics</option>
                    <option value="Quantum & Materials Science">Quantum & Materials Science</option>
                    <option value="Applied Electromagnetics">Applied Electromagnetics</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[9px] font-mono text-slate-500 font-bold uppercase block mb-1">Key Specialized Expertise Needed (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., Thermal Expansion, Copper Gradients, Rust simulation"
                    value={smeRequiredExpertise}
                    onChange={(e) => setSmeRequiredExpertise(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-500 font-bold uppercase block mb-1">Describe the Physical Constraints & Practical Friction</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain exactly where your current process gets stuck. E.g. we fail to achieve consistent cooling rates below 120°C with default fan mounts, causing metallic shear failures..."
                  value={smeDescription}
                  onChange={(e) => setSmeDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-850 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-between items-center pt-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold">Severity Matrix:</span>
                  <div className="flex gap-1.5">
                    {(['Medium', 'High', 'Revolutionary'] as const).map(impact => (
                      <button
                        key={impact}
                        type="button"
                        onClick={() => setSmeExpectedImpact(impact)}
                        className={`text-[8px] font-mono font-bold px-2 py-0.5 border rounded cursor-pointer ${
                          smeExpectedImpact === impact
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {impact}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:scale-[1.01]"
                >
                  Publish SMEs Operational Challenge
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 5. ACTIVE CO-OP RESOURCE CONTRIBUTION CONTROLLER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Compute Thread Donator */}
        <div className="bg-gradient-to-b from-[#0f172a]/95 to-[#050914] border border-indigo-500/15 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                <Zap className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Sovereign Grid Contributor</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Donate idle CPU/GPU threads to academic solvers</p>
              </div>
            </div>
            <button
              onClick={() => setIsContributingCompute(!isContributingCompute)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                isContributingCompute
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700'
              }`}
            >
              {isContributingCompute ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Active (Ticking)
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Start Worker
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Allocated CPU Thread Cores</span>
                <span className="font-mono text-amber-400 font-semibold">{computeThreads} Threads / Cores</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                value={computeThreads}
                onChange={(e) => setComputeThreads(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Simulated Live Worker Stats */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-850 text-center">
              <div>
                <span className="text-[9px] text-slate-450 block uppercase font-mono">Simulated FLOPs Rate</span>
                <span className="text-xs font-bold text-slate-200 mt-1 block">
                  {isContributingCompute ? `${(computeThreads * 48.5).toFixed(1)} GLOPs/s` : "0.0 GLOPs/s"}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-450 block uppercase font-mono">Hash Blocks Found</span>
                <span className="text-xs font-bold text-indigo-400 mt-1 block">
                  {isContributingCompute ? Math.floor(gigaflopsContributed / 380) : 0}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-450 block uppercase font-mono">Co-op Credits</span>
                <span className="text-xs font-bold text-amber-400 mt-1 block">
                  {(gigaflopsContributed / 1000).toFixed(3)} Credits
                </span>
              </div>
            </div>

            {/* Interactive Volunteer Credits Toggler */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setVolunteerHours(prev => prev + 1);
                  setPeerReviewsDone(prev => prev + 2);
                }}
                className="flex-1 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors"
              >
                Volunteer 1hr Document Review
              </button>
              <button
                onClick={() => {
                  setPeerReviewsDone(prev => prev + 5);
                }}
                className="flex-1 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-indigo-300 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors"
              >
                Validate 5 Formula Checklists
              </button>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Volunteered Document Hours: <strong className="text-white">{volunteerHours} hrs</strong></span>
              <span>Validations Verified: <strong className="text-indigo-400">{peerReviewsDone}</strong></span>
            </div>
          </div>
        </div>

        {/* Live Collaborator Bulletin Story Form */}
        <div className="bg-white/85 dark:bg-[#090d14]/85 backdrop-blur-md border border-slate-200/70 dark:border-slate-850/70 rounded-3xl p-6 shadow-sm shadow-slate-100/30 dark:shadow-[#040609]/60 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-600 rounded-lg">
                <Bookmark className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-905 dark:text-white">Live On-Site Bulletin</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Submit your deep tech background or problem mission</p>
              </div>
            </div>

            {/* Bulletin Feed */}
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
              {visitorStories.map((story, idx) => (
                <div key={idx} className="text-[10px] border-b border-slate-100 dark:border-slate-850 pb-2 last:border-b-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-800 dark:text-slate-300">{story.name}</span>
                    <span className="text-[8px] bg-slate-200 dark:bg-slate-800 dark:text-slate-400 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      {story.role}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5 leading-relaxed italic">"{story.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAddStory} className="space-y-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name (e.g., Prof. Alex)"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="text-[10px] p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded focus:outline-indigo-500"
              />
              <select
                value={visitorRole}
                onChange={(e) => setVisitorRole(e.target.value)}
                className="text-[10px] p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded focus:outline-indigo-500"
              >
                <option value="Subject Scholar">Subject Scholar</option>
                <option value="Systems Engineer">Systems Engineer</option>
                <option value="Citizen Contributor">Citizen Contributor</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="What deep tech challenge or perspective do you advocate?"
                value={visitorNote}
                onChange={(e) => setVisitorNote(e.target.value)}
                className="flex-1 text-[10px] p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded focus:outline-indigo-500"
              />
              <button
                type="submit"
                className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* 6. THE COLLABORATION WORKFLOW (STEPPER) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="text-indigo-650 w-5 h-5 shrink-0" />
              The Seamless Collaboration Pipeline
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive stepper of how raw experimental ideas transform into verified scientific applications. Click steps to view.
            </p>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded">
            Integrated Suite Standard
          </span>
        </div>

        {/* STEPPERS CHIPS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-4 rounded-xl border transition-all ${
                activeStep === idx 
                  ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-850 shadow-inner' 
                  : 'bg-slate-50/50 dark:bg-slate-950/10 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-955/30 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-[8px] font-mono font-bold ${activeStep === idx ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {step.badge}
                </span>
                <span className={`text-xs font-mono font-semibold ${activeStep === idx ? 'text-white' : 'text-slate-400'}`}>
                  0{idx + 1}
                </span>
              </div>
              <h4 className="text-xs font-bold mt-2 truncate">{step.title}</h4>
            </button>
          ))}
        </div>

        {/* ACTIVE HOVER WELL */}
        <div className="bg-slate-50 dark:bg-slate-955/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm border border-indigo-500">
            {activeStep === 0 && <Flame className="w-6 h-6 animate-pulse" />}
            {activeStep === 1 && <Users className="w-6 h-6" />}
            {activeStep === 2 && <Cpu className="w-6 h-6" />}
            {activeStep === 3 && <ShieldCheck className="w-6 h-6 text-emerald-305" />}
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
              {steps[activeStep].title} – {steps[activeStep].badge}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-450 leading-relaxed max-w-3xl">
              {steps[activeStep].desc}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab(activeStep === 0 ? 'challenges' : activeStep === 2 ? 'verifier' : 'expertise')}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Work Segment</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* THE ARCHITECTURE OF DISCOVERY */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">THE ARCHITECTURE OF DISCOVERY</span>
          <h2 className="text-sm lg:text-base font-bold text-slate-900 dark:text-white mt-0.5">
            How PolyNex Accelerates Coordinated Breakthroughs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-4xl">
            A real-time sovereign execution engine engineered for physical, chemical, and computational validation cycles rather than passive discussion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Technological Timing */}
          <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">Technological Timing</h3>
            </div>
            <p className="text-[11px] text-slate-350 leading-relaxed">
              Three critical shifts converge to make the PolyNex collaborative operating system viable today:
            </p>
            <div className="space-y-3 pt-1">
              <div className="border-l-2 border-indigo-500 pl-3 space-y-0.5">
                <h4 className="text-[11px] font-bold text-white">AI as a Coordination Layer</h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Large language models and specialized agents dramatically reduce the logistical overhead associated with organizing highly complex mathematical and physical tasks.
                </p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3 space-y-0.5">
                <h4 className="text-[11px] font-bold text-white">Global Technical Participation</h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  The number of individuals capable of writing code, modeling equations, and refining criteria has grown exponentially, yet legacy institutions remain too rigid to utilize them.
                </p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3 space-y-0.5">
                <h4 className="text-[11px] font-bold text-white">Open Science Momentum</h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Open source software, open data collections, and voluntary crowdsourcing have proven that top-tier innovation consistently flourishes outside traditional boundaries.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Strategic Pillars */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Product Pillars</h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Why class-based repository portals or static wikis fall short of backing active physical discovery cycles:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-white uppercase font-mono">Discovery-Centric</h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Engineered and measured entirely around production outcomes, verifiable math, and simulations, never passive discussions.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-white uppercase font-mono">Integrated AI Agents</h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sovereign AI Agents are woven directly into workspace pipelines as checklist verifiers rather than isolated sidebar chatbot widgets.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-white uppercase font-mono">Cross-Disciplinary</h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Unifies biologists, mechanical devs, data researchers, and field specialists under singular workrooms.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-0.5">
                <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-white uppercase font-mono">Attributable Ledger</h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every calculation generated maintains real, granular attribution so achievements are cumulative and reusable.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Active Sectors */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-lg">
                <Microscope className="w-5 h-5" />
              </span>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Active Sectors</h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              We deploy our live Reddit scrapers, agent pipelines, and verification suites to key physical and computational boundaries:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-200">
                🤖 Robotics & Autonomy
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-200">
                🌾 Agriculture & Food
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-200">
                ☘️ Biodiversity & Ecology
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-200">
                🔌 Open Hardware
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-200 col-span-2">
                📊 Scientific Data Analysis
              </div>
            </div>
          </div>

          {/* Card 4: Long-Term Vision */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/60 rounded-2xl p-6 text-white flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Globe className="w-5 h-5 animate-pulse" />
                </span>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">The Long-Term Vision</h3>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                The greatest breakthroughs of the next century will increasingly emerge from highly cohesive **networks** rather than isolated historical **institutions**.
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Just as Git transformed software development and Wikipedia transformed knowledge coordination, PolyNex aims to transform scientific and engineering discovery by making massive, multi-agent collaboration a first-class capability.
              </p>
            </div>
            <div className="border-t border-slate-800/65 pt-3 mt-4 text-[10px] font-mono text-indigo-400 flex justify-between items-center">
              <span>Goal: Global Sovereign Discovery Infrastructure</span>
              <span className="text-emerald-400 animate-pulse font-bold">● CONTINUOUS LOOP</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3.5 VETTED GRAND CHALLENGES PORTFOLIO */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-500 flex items-center justify-center">
                <Microscope className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Vetted Active Portfolio: Institutional BAA, RFP & Venture Solicitations
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Active co-op workrooms addressing high-impact research, open requests from **DARPA**, **NIH**, **Horizon Europe (EC)**, **DRDO**, **Y Combinator (RFS)**, and venture deep-tech teams.
            </p>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded">
            {problems.filter(p => !p.title.startsWith('[Scouted Reddit]')).length} Active Solicitations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((prob) => {
            const isScouted = prob.title.startsWith('[Scouted Reddit]');
            if (isScouted) return null; // keep this section focused on the core vetted academic/agency roster

            // Extract beautiful tag classification helper
            const lowercaseTitle = prob.title.toLowerCase();
            const lowercaseCreator = prob.creator.toLowerCase();
            let sourceTag = { name: 'Academic Nexus', className: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' };
            
            if (lowercaseTitle.includes('darpa') || lowercaseCreator.includes('darpa')) {
              sourceTag = { name: 'DARPA BAA', className: 'bg-blue-50 dark:bg-blue-950/35 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' };
            } else if (lowercaseTitle.includes('nih') || lowercaseCreator.includes('nih')) {
              sourceTag = { name: 'NIH SBIR', className: 'bg-cyan-50 dark:bg-cyan-950/35 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30' };
            } else if (lowercaseTitle.includes('horizon') || lowercaseCreator.includes('horizon') || lowercaseCreator.includes('european commission')) {
              sourceTag = { name: 'Horizon Europe (EC)', className: 'bg-purple-50 dark:bg-purple-950/35 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' };
            } else if (lowercaseTitle.includes('drdo') || lowercaseCreator.includes('drdo')) {
              sourceTag = { name: 'DRDO technical rfp', className: 'bg-amber-50 dark:bg-amber-955/30 text-amber-600 dark:text-amber-450 border-amber-100 dark:border-amber-900/35' };
            } else if (lowercaseTitle.includes('yc rfs') || lowercaseCreator.includes('y combinator') || lowercaseTitle.includes('y combinator')) {
              sourceTag = { name: 'YC Startup RFS', className: 'bg-orange-50 dark:bg-orange-955/30 text-orange-600 dark:text-orange-450 border-orange-100 dark:border-orange-900/35' };
            } else if (lowercaseTitle.includes('venture') || lowercaseCreator.includes('venture') || lowercaseCreator.includes('founders fund')) {
              sourceTag = { name: 'VC Deep Tech Seek', className: 'bg-rose-50 dark:bg-rose-955/30 text-rose-600 dark:text-rose-450 border-rose-100 dark:border-rose-900/35' };
            }

            return (
              <div
                key={prob.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-955/35 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 rounded font-mono font-bold uppercase text-[9px]">
                      {prob.domain}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 border rounded font-bold uppercase tracking-wide ${sourceTag.className}`}>
                      {sourceTag.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      prob.difficulty === 'Grand Challenge' 
                        ? 'bg-rose-100 dark:bg-rose-955/45 text-rose-700 dark:text-rose-400' 
                        : prob.difficulty === 'Extreme' 
                        ? 'bg-amber-100 dark:bg-amber-955/45 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-955/45 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {prob.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {prob.description}
                    </p>
                  </div>

                  {prob.requiredExpertise && (
                    <div className="flex flex-wrap gap-1">
                      {prob.requiredExpertise.slice(0, 3).map((exp, i) => (
                        <span key={i} className="text-[8px] font-mono bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-400">
                      Proposed By: <span className="text-slate-600 dark:text-slate-350 font-medium truncate max-w-[120px] inline-block align-bottom">{prob.creator}</span>
                    </span>
                    <span className="text-[9px] text-slate-400">
                      Priority Score: <strong className="text-slate-600 dark:text-slate-350">{prob.priority || 10}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectProblem && onSelectProblem(prob.id)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Enter Workroom
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
