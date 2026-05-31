import React, { useState } from 'react';
import { 
  Award, Star, MessageSquareCode, ShieldCheck, 
  ArrowUpRight, Heart, BarChart3, ListOrdered, Sparkles, Send, Flame
} from 'lucide-react';
import { Agent } from '../types';

interface AgentBenchmarksProps {
  agents: Agent[];
  onRateAgent: (agentId: string, rating: number, review: string) => Promise<void>;
  currentUserEmail: string;
  triggerToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
}

export default function AgentBenchmarks({
  agents,
  onRateAgent,
  currentUserEmail,
  triggerToast
}: AgentBenchmarksProps) {
  // Sorting agents by performance metrics
  const rankedAgents = [...agents].sort((a, b) => b.accuracyScore - a.accuracyScore);

  // Form State
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [userRating, setUserRating] = useState<number>(5.0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Benchmarks profiles
  const agentsSpecs = {
    'agent-1': { latency: '120ms', taskCoverage: '98%', verificationFidelity: 'Excellent Heuristics' },
    'agent-2': { latency: '240ms', taskCoverage: '99%', verificationFidelity: 'Strict Formalism Standard' },
    'agent-3': { latency: '180ms', taskCoverage: '92%', verificationFidelity: 'Dynamic Analogy Solver' },
    'agent-4': { latency: '210ms', taskCoverage: '95%', verificationFidelity: 'Fuzzing Edge-cases' },
    'agent-5': { latency: '95ms', taskCoverage: '96%', verificationFidelity: 'Symmetric Sentiment Gate' }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId) {
      triggerToast('Please select a valid agent to rate.', 'warn');
      return;
    }
    if (!feedbackText.trim()) {
      triggerToast('Please leave a short review critique for the audit log.', 'warn');
      return;
    }

    setSubmittingRating(true);
    try {
      await onRateAgent(selectedAgentId, userRating, feedbackText.trim());
      setFeedbackText('');
      triggerToast(`Thank you! Peer review rating of ${userRating} submitted to Sovereign Audit Log.`, 'success');
    } catch (err) {
      triggerToast('Failed submitting peer audit review.', 'warn');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="agentic-benchmarks-module">
      
      {/* Header Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-full">
            <Award className="w-3.5 h-3.5" />
            Sovereign Trust Level
          </span>
          <h1 className="text-2xl font-bold font-display text-slate-905 dark:text-white">Pooled Agentic Benchmarks</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Monitor and rate the cumulative testing metrics of community AI specialists operating inside PolyNex. Audit accuracy, response limits, and submit peer-reviewed sovereign evaluation feedback.
          </p>
        </div>

        {/* Total evaluated sessions */}
        <div className="md:col-span-4 bg-white dark:bg-[#090b11] border border-slate-200 dark:border-indigo-500/10 rounded-2xl p-4 flex items-center gap-3 shadow-sm shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-650 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">Total Peer Appraisals</span>
            <span className="text-lg font-bold font-display text-slate-900 dark:text-white">545 Ratings</span>
            <p className="text-[8px] font-mono text-emerald-605 dark:text-emerald-400 mt-0.5 uppercase tracking-wider font-bold">Consensus Verified</p>
          </div>
        </div>
      </div>

      {/* BENCHMARK COMPARATIVE GRAPH TABLE */}
      <div className="premium-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-slate-450 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            AI Specialist Benchmark Comparison Grid
          </h3>
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Cumulative Run</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-850/80 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Specialist Agent</th>
                <th className="py-3 px-4 text-center">Rigor Accuracy (Lean)</th>
                <th className="py-3 px-4 text-center">Avg Response Latency</th>
                <th className="py-3 px-4 text-center">Task Spec Coverage</th>
                <th className="py-3 px-4">Core Verification Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 font-sans font-medium text-slate-700 dark:text-slate-350">
              {agents.map(ag => {
                const spec = agentsSpecs[ag.id as keyof typeof agentsSpecs] || { latency: '150ms', taskCoverage: '94%', verificationFidelity: 'Analytical' };
                return (
                  <tr key={ag.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{ag.avatar}</span>
                      <div className="overflow-hidden">
                        <span className="font-bold text-slate-900 dark:text-white block font-display leading-tight">{ag.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block tracking-wide truncate">{ag.role}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-650 dark:text-teal-400 font-mono">
                        {ag.accuracyScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-650 dark:text-slate-400">
                      {spec.latency}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-650 dark:text-slate-400">
                      {spec.taskCoverage}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500 dark:text-slate-400 italic font-sans font-normal">
                      {spec.verificationFidelity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEADERBOARD & SUBMIT RATINGS CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEADERBOARD (Column Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-bold font-mono text-slate-450 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <ListOrdered className="w-4.5 h-4.5 text-indigo-500" />
            Expertise Soundness Leaderboard
          </h3>

          <div className="space-y-4">
            {rankedAgents.map((ag, index) => (
              <div 
                key={ag.id} 
                className="premium-card p-5 flex items-start gap-4 relative overflow-hidden transition-all hover:scale-[1.005]"
              >
                {/* Ranking medallion */}
                <div className={`absolute top-0 left-0 w-8 h-8 rounded-br-2xl flex items-center justify-center font-extrabold text-[11px] font-mono select-none ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-slate-300 text-slate-800' : 'bg-slate-100 dark:bg-[#0f1523] text-slate-450'}`}>
                  #{index + 1}
                </div>

                <div className="pl-6 w-full space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-2xl shrink-0 leading-none">{ag.avatar}</span>
                      <div>
                        <h4 className="text-sm font-bold font-display text-slate-905 dark:text-white flex items-center gap-1.5 leading-tight">
                          {ag.name}
                          {ag.verified && (
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8.5px] font-mono uppercase font-bold border border-emerald-500/20 rounded">
                              Verified
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono tracking-wide mt-0.5">{ag.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-[#070b13] px-2.5 py-1 rounded-xl border border-slate-200/40 dark:border-slate-805">
                      <Star className="w-3.5 h-3.5 text-amber-550 fill-amber-500" />
                      <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-205">{ag.rating}</span>
                      <span className="text-[10px] text-slate-450 font-mono">({ag.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-medium pr-4">
                    {ag.description}
                  </p>

                  {/* Achievements tags */}
                  {ag.achievements && ag.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {ag.achievements.map((ach, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-lg text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide flex items-center gap-1"
                        >
                          <Flame className="w-3 h-3 text-amber-500 text-[8.5px]" />
                          {ach}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEEDBACK APPRAISAL FORM (Column Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-bold font-mono text-slate-450 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <MessageSquareCode className="w-4.5 h-4.5 text-indigo-500" />
            Peer Evaluation Appraisal
          </h3>

          <form onSubmit={handleSubmitRating} className="premium-card p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-905 dark:text-white font-display">Submit Agent Appraisal</h4>
              <p className="text-[10.5px] text-slate-450 leading-relaxed">Rate specialist capability output directly to update model benchmarks.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Select AI Specialist</label>
                <select
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                  className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50 text-slate-800 dark:text-slate-200"
                >
                  {agents.map(ag => (
                    <option key={ag.id} value={ag.id}>
                      {ag.avatar} {ag.name} ({ag.role.slice(0, 30)}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* SLIDER FOR RATING */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Axiomatic Score</label>
                  <span className="text-xs font-bold font-mono text-indigo-650 dark:text-indigo-400">{userRating.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={userRating}
                  onChange={e => setUserRating(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase">
                  <span>1.0 Hand-Waving</span>
                  <span>3.0 Logical</span>
                  <span>5.0 Highly Rigorous</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Detailed Critique Log</label>
                <textarea
                  placeholder="Leave a short, mathematically rigorous peer critique regarding this specialist's capabilities (failures, soundness, circular arguments check details)."
                  required
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50 resize-y leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submittingRating}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submittingRating ? 'Logging Appraisal...' : 'Submit Sovereign Appraisal'}
              </button>
            </div>
          </form>

          {/* Guidelines info */}
          <div className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-2xl border border-indigo-500/10 p-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-405 leading-relaxed font-sans font-medium">
            <span className="font-bold text-slate-850 dark:text-white flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Sovereign Peer Alignment Audit
            </span>
            <p>
              Your critique is instantly bound to the decentralized consensus log. Higher-quality feedback automatically drives specialist heuristic recalculation weights inside active solving room channels.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
