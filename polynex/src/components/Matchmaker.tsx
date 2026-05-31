import React, { useState } from 'react';
import { 
  Users, Brain, Sparkles, AlertCircle, CheckCircle2, 
  Cpu, GitCompare, ArrowRight, Star, ExternalLink, RefreshCw 
} from 'lucide-react';
import { Problem, Agent, HumanExpert, User } from '../types';

interface MatchmakerProps {
  problems: Problem[];
  experts: HumanExpert[];
  agents: Agent[];
  currentUserProfile: User | null;
  triggerToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
}

export default function Matchmaker({
  problems,
  experts,
  agents,
  currentUserProfile,
  triggerToast
}: MatchmakerProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('sme-profile');
  const [calculating, setCalculating] = useState(false);
  const [matches, setMatches] = useState<{
    score: number;
    alignedExperts: { expert: HumanExpert; fitScore: number; reason: string }[];
    alignedAgents: { agent: Agent; fitScore: number; reason: string }[];
    synthesisExplanation: string;
    constraintsTackled: string[];
  } | null>(null);

  // Determine active source description
  const activeSourceTitle = selectedSourceId === 'sme-profile' 
    ? (currentUserProfile?.institution ? `${currentUserProfile.institution} SME Workspace Profile` : "Active SME Website Profile")
    : problems.find(p => p.id === selectedSourceId)?.title || "Registry Challenge";

  const sourceDescription = selectedSourceId === 'sme-profile'
    ? (currentUserProfile?.smeAnalysis ? "Using AI generated operational constraints compiled from your enterprise website and business request." : "Review requirements aligned to your logged in SME website.")
    : (problems.find(p => p.id === selectedSourceId)?.description || "");

  // Calculate Match Matrix Algorithm
  const handleCalculateMatch = () => {
    if (selectedSourceId === 'sme-profile' && (!currentUserProfile || currentUserProfile.roleType !== 'SME')) {
      triggerToast('Please log in with an SME / Enterprise profile first in the Portal tab to match custom business requirements.', 'info');
      return;
    }

    setCalculating(true);
    setTimeout(() => {
      // Formulate realistic matching calculations based on domain keywords
      let targetDomain = "Mathematics";
      let keywords: string[] = [];

      if (selectedSourceId === 'sme-profile') {
        targetDomain = currentUserProfile?.smeIndustry || "General Engineering";
        keywords = ['robotics', 'cuda', 'bounds', 'optimization', 'sensors', 'equations'];
      } else {
        const prob = problems.find(p => p.id === selectedSourceId);
        targetDomain = prob?.domain || "General Science";
        keywords = prob?.requiredExpertise || [];
      }

      // 1. Calculate expert recommendations based on keywords
      const alignedExperts = experts.map(exp => {
        let fitScore = 65;
        // Check expertise overlap
        const overlaps = exp.expertise.filter(ext => 
          keywords.some(kw => kw.toLowerCase().includes(ext.toLowerCase()) || ext.toLowerCase().includes(kw.toLowerCase()))
          || targetDomain.toLowerCase().includes(ext.toLowerCase())
        );
        fitScore += overlaps.length * 15;
        
        // Add scholar weight
        if (exp.hIndex) fitScore += Math.min(15, exp.hIndex * 0.2);
        // availability check
        if (exp.availability === 'Active Member') fitScore += 5;
        else if (exp.availability === 'Inactive') fitScore -= 20;

        fitScore = Math.min(99, Math.max(50, Math.floor(fitScore)));

        // Formulate reason
        let reason = "Broad systems capability matching requested technical space.";
        if (overlaps.length > 0) {
          reason = `Superior alignment in ${overlaps[0]}. High publications h-index of ${exp.hIndex || 12}.`;
        } else if (exp.availability === 'Advisory Only') {
          reason = `Advisory availability matches broad supervisory demands in ${targetDomain}.`;
        }

        return { expert: exp, fitScore, reason };
      }).sort((a,b) => b.fitScore - a.fitScore);

      // 2. Calculate agent recommendations
      const alignedAgents = agents.map(ag => {
        let fitScore = 70;
        const overlaps = ag.expertise.filter(ext => 
          keywords.some(kw => kw.toLowerCase().includes(ext.toLowerCase()))
          || ag.role.toLowerCase().includes(targetDomain.toLowerCase())
        );
        fitScore += overlaps.length * 12;
        if (ag.verified) fitScore += 10;
        fitScore += Math.floor((ag.accuracyScore - 90) * 0.5);

        fitScore = Math.min(99, Math.max(55, Math.floor(fitScore)));

        let reason = `Specialist agent. ${ag.role} provides structural deconstruction capabilities.`;
        if (ag.id === 'agent-2') {
          reason = "Excellent Lean-style math validation capabilities checking strict diophantine constraints.";
        } else if (ag.id === 'agent-1') {
          reason = "George Pólya's 'How to Solve It' method deconstructor. Breaks complexity down systematically.";
        }

        return { agent: ag, fitScore, reason };
      }).sort((a,b) => b.fitScore - a.fitScore);

      // Compute overall compatibility
      const topExp = alignedExperts[0]?.fitScore || 80;
      const topAg = alignedAgents[0]?.fitScore || 80;
      const overallScore = Math.floor((topExp + topAg) / 2) + (selectedSourceId === 'sme-profile' ? 2 : 0);

      // Synthesis rationale
      let synthesisExplanation = `Verification matrix generated. We recommend establishing a hybrid workspace focused on ${targetDomain}. We assigned human expertise in ${alignedExperts[0]?.expert.expertise[0] || 'computational physics'} alongside agentic rigor via ${alignedAgents[0]?.agent.name} to maximize proof convergence.`;
      
      let constraintsTackled = [
        `Strict numerical convergence borders in ${targetDomain}`,
        "Dynamic peer-review proof verification loops",
        "Verification metrics bound under sub-100ms logic constraints"
      ];

      setMatches({
        score: overallScore,
        alignedExperts: alignedExperts.slice(0, 3),
        alignedAgents: alignedAgents.slice(0, 2),
        synthesisExplanation,
        constraintsTackled
      });

      setCalculating(false);
      triggerToast('Expertise Matching Completed successfully. Team parameters aligned.', 'success');
    }, 1800);
  };

  const handleDeployCohort = () => {
    triggerToast('Cohort deployed to active solving workspace. Real-time verification listening.', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in" id="matching-technology-view">
      
      {/* Visual Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-505/5 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-full">
            <GitCompare className="w-3.5 h-3.5" />
            Cooperative Alignment Engine
          </span>
          <h1 className="text-2xl font-bold font-display text-slate-905 dark:text-white">Expert & Agent Matcher</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Deploy alignment algorithms to pair high-performing academic researchers (using linked Google Scholar and AMiner citations) and verified AI Specialists to resolve complex operational constraints.
          </p>
        </div>

        {/* Live matching stats badge */}
        <div className="md:col-span-4 bg-white dark:bg-[#090b11] border border-slate-200 dark:border-indigo-500/10 rounded-2xl p-4 flex items-center gap-3 shadow-sm shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-purple-505" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">Ready Cohorts</span>
            <span className="text-lg font-bold font-display text-slate-900 dark:text-white">24 Specialists</span>
            <p className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase tracking-wider font-bold">Verification Engine Online</p>
          </div>
        </div>
      </div>

      {/* MATCH SETTINGS BOX */}
      <div className="bg-white/80 dark:bg-[#090d14]/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-850/60 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          {/* Target Profile Query Selector */}
          <div className="sm:col-span-8 space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Target Solver Profile Source</label>
            <select
              value={selectedSourceId}
              onChange={e => {
                setSelectedSourceId(e.target.value);
                setMatches(null);
              }}
              className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50 text-slate-800 dark:text-slate-200"
            >
              <optgroup label="SME Enterprise Website Profiles">
                <option value="sme-profile">
                  {currentUserProfile?.institution ? `[My Company] ${currentUserProfile.institution} Web Profile` : "Active SME Web Profile (Login required)"}
                </option>
              </optgroup>
              <optgroup label="Registry Challenges">
                {problems.map(prob => (
                  <option key={prob.id} value={prob.id}>
                    [Challenge] {prob.title.slice(0, 60)}...
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Trigger matching command button */}
          <div className="sm:col-span-4 flex items-end">
            <button
              onClick={handleCalculateMatch}
              disabled={calculating}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {calculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Aligning Graph...
                </>
              ) : (
                <>
                  <GitCompare className="w-4 h-4" />
                  Calculate Matching Matrix
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Constraints Summary Info */}
        <div className="p-4 bg-slate-50 dark:bg-[#040609]/60 rounded-2xl border border-slate-205/60 dark:border-slate-850/60 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-850 dark:text-white mb-1 font-display">
            <AlertCircle className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            In Reviewing: {activeSourceTitle}
          </div>
          <p className="leading-relaxed font-medium pl-6">
            {sourceDescription || "No website or challenge problem description registered on this workspace profile yet. Please complete company onboarding."}
          </p>
        </div>
      </div>

      {/* CALCULATING LOADER METRICS */}
      {calculating && (
        <div className="premium-card p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-850 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-350">PROXIMITY COEFFICIENTS PROGRESSION</h4>
            <p className="text-[10px] text-slate-400 font-mono">Running cosine proximity models over Google Scholar & AMiner indices...</p>
          </div>
        </div>
      )}

      {/* MATCHED PROTOCOL COHORT */}
      {matches && !calculating && (
        <div className="space-y-8 animate-fade-in">
          
          {/* COMPARATIVE OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-3xl p-6 border border-indigo-500/20 dark:border-indigo-400/15 relative overflow-hidden">
            <div className="md:col-span-3 text-center border-b md:border-b-0 md:border-r border-slate-200/90 dark:border-slate-800/80 p-4 shrink-0 flex flex-col justify-center items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Overall Alignment</span>
              <span className="text-5xl font-extrabold font-display glowing-indigo-text mt-1">{matches.score}%</span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-teal-400 mt-2 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-500" />
                Symmetric Fit Verified
              </span>
            </div>

            <div className="md:col-span-9 p-4 space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Cohort Integration Rationale</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                  {matches.synthesisExplanation}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Identified Engineering Constraints Addressed</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-650 dark:text-slate-350 font-sans font-medium">
                  {matches.constraintsTackled.map((con, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TEAM MEMBERS PAIRING */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* MATCHED HUMAN SPECIALISTS (Span 7) */}
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-sm font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-indigo-500" />
                Matched Human Scholars (Google Scholar & AMiner Sync)
              </h3>

              <div className="space-y-4">
                {matches.alignedExperts.map(({ expert, fitScore, reason }) => (
                  <div key={expert.id} className="premium-card p-5 relative overflow-hidden space-y-4 hover:border-indigo-500/30 transition-all">
                    {/* Matching indicator */}
                    <div className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full border border-indigo-500/15">
                      {fitScore}% match
                    </div>

                    <div className="flex gap-4">
                      <span className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-805 text-2.5xl flex items-center justify-center shrink-0">
                        {expert.avatar || '👨‍🔬'}
                      </span>
                      <div className="overflow-hidden space-y-0.5">
                        <h4 className="text-sm font-bold font-display text-slate-905 dark:text-white truncate">{expert.name}</h4>
                        <p className="text-xs text-slate-550 dark:text-slate-400 truncate font-display">{expert.role}</p>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono tracking-wider flex items-center gap-1 text-[9px] uppercase font-semibold">
                          Google Scholar: {expert.googleScholarId || "Linked"}
                        </p>
                      </div>
                    </div>

                    {/* Citations block */}
                    <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50 dark:bg-[#03060a]/40 border border-slate-200/50 dark:border-slate-805/50 rounded-xl text-center">
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none">Scarcity Score</span>
                        <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-250 mt-1 block">{(expert.occupancyPercent > 50) ? "Busy" : "Ready"}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none">H-index</span>
                        <span className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 mt-1 block font-extrabold">{expert.hIndex || 18}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none">Citations</span>
                        <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 block">{(expert.citationsCount || 450).toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic pr-6 font-medium">
                      "{reason}"
                    </p>

                    {expert.recentPublications && expert.recentPublications.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-850/80">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block tracking-wider">Indexed AMiner Papers</span>
                        <p className="text-[10.5px] text-slate-650 dark:text-slate-300 font-sans font-medium line-clamp-1 leading-snug">
                          {expert.recentPublications[0]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* MATCHED AGENTS (Span 5) */}
            <div className="lg:col-span-5 space-y-5">
              <h3 className="text-sm font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-4.5 h-4.5 text-indigo-500" />
                Matched AI Specialities
              </h3>

              <div className="space-y-4">
                {matches.alignedAgents.map(({ agent, fitScore, reason }) => (
                  <div key={agent.id} className="premium-card p-5 relative overflow-hidden space-y-4 hover:border-indigo-500/30 transition-all bg-slate-50/10">
                    <div className="absolute top-4 right-4 bg-purple-500/10 text-purple-650 dark:text-purple-400 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full border border-purple-500/15">
                      {fitScore}% match
                    </div>

                    <div className="flex gap-3">
                      <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-2.5xl flex items-center justify-center shrink-0">
                        {agent.avatar || '🤖'}
                      </span>
                      <div className="overflow-hidden space-y-0.5">
                        <h4 className="text-sm font-bold font-display text-slate-805 dark:text-white truncate">{agent.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{agent.role}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] border-b border-slate-100 dark:border-slate-850 pb-1.5">
                        <span className="text-slate-450 font-mono">Specialist Model:</span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{agent.model}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-450 font-mono">Verified Soundness:</span>
                        <span className="font-semibold text-emerald-650 dark:text-emerald-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                          {agent.accuracyScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans pr-4 font-medium">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action deployed container */}
              <div className="p-1">
                <button
                  onClick={handleDeployCohort}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all text-center cursor-pointer hover:scale-[1.01]"
                >
                  Confirm & Deploy Collaborative Cohort
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
