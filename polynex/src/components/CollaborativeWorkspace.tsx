import React, { useState } from 'react';
import { Problem, Agent, Comment } from '../types';
import { 
  Compass, Lightbulb, CheckSquare, RefreshCw, 
  ChevronRight, Brain, AlertTriangle, CheckCircle, 
  Send, User, ArrowRight, ShieldAlert, Sparkles, MessageSquare, ThumbsUp,
  Star, Database, Cpu, Plus, Server, Check, Trash2, ShieldAlert as GuardIcon
} from 'lucide-react';

interface CollaborativeWorkspaceProps {
  problem: Problem;
  agents: Agent[];
  comments: Comment[];
  onAddComment: (commentData: any) => Promise<void>;
  onVoteComment: (id: string) => void;
  onAdvanceStep: (step: number) => void;
  onTriggerAgent: (agentId: string, phase: number) => Promise<void>;
  onRefreshState: () => Promise<void>;
}

export default function CollaborativeWorkspace({
  problem,
  agents,
  comments,
  onAddComment,
  onVoteComment,
  onAdvanceStep,
  onTriggerAgent,
  onRefreshState
}: CollaborativeWorkspaceProps) {
  const [activeTabPhase, setActiveTabPhase] = useState<1 | 2 | 3 | 4>(problem.polyaStep);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [refPostId, setRefPostId] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [consultingAgentId, setConsultingAgentId] = useState<string | null>(null);

  // Advanced feature: rating state
  const [userRating, setUserRating] = useState<number>(5);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  // Advanced feature: decomposition milestone state
  const [newTaskText, setNewTaskText] = useState('');
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  // Advanced feature: check off simulation tasks state (local mapping state for instant gratification)
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    'Task 1.1: Map the parity progression of 3x + d for coprimes d <= 101': true,
    'Task 2.1: Model NTT execution time across ARM Neon vectors': true
  });

  // Advanced feature: compute node attachment form option state
  const [computeMode, setComputeMode] = useState<'none' | 'cloud' | 'peer'>('none');
  const [cloudProvider, setCloudProvider] = useState('Google Cloud Platform');
  const [cloudRegion, setCloudRegion] = useState('us-central1-a');
  const [cloudGpu, setCloudGpu] = useState('NVIDIA A100-SXM4-80GB');
  const [cloudGpuCount, setCloudGpuCount] = useState('8');
  const [cloudRam, setCloudRam] = useState('640');
  
  const [peerNodes, setPeerNodes] = useState('8');
  const [peerTflops, setPeerTflops] = useState('160.0');
  const [computeSubmitting, setComputeSubmitting] = useState(false);

  // Filter list of comments targeting the active tab phase
  const phaseComments = comments.filter(c => c.problemId === problem.id && c.polyaPhase === activeTabPhase);

  // Eligible prior posts that can be built upon in active tab phase
  const possibleRefs = comments.filter(c => c.problemId === problem.id && c.polyaPhase === activeTabPhase);

  // Pólya Step details
  const polyaSteps = [
    {
      num: 1,
      title: 'Understand',
      desc: 'Identify unknowns & boundary bounds',
      icon: Compass,
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
      activeColor: 'bg-indigo-600 border-indigo-600 text-white'
    },
    {
      num: 2,
      title: 'Devise Plan',
      desc: 'Find analogies & auxiliary models',
      icon: Lightbulb,
      bgColor: 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-indigo-900',
      activeColor: 'bg-amber-600 border-amber-600 text-white'
    },
    {
      num: 3,
      title: 'Carry Out',
      desc: 'Check logic steps & check proofs',
      icon: CheckSquare,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border-emerald-200 dark:border-indigo-900',
      activeColor: 'bg-emerald-600 border-emerald-600 text-white'
    },
    {
      num: 4,
      title: 'Look Back',
      desc: 'Reflect, check alternatives & generalize',
      icon: RefreshCw,
      bgColor: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900',
      activeColor: 'bg-rose-600 border-rose-600 text-white'
    }
  ];

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !authorName) return;

    setSubmitting(true);
    try {
      await onAddComment({
        problemId: problem.id,
        authorName,
        authorType: 'Human',
        authorRole: authorRole || 'Subject Matter Specialist',
        authorAvatar: '🧑‍🔬',
        content: newComment,
        polyaPhase: activeTabPhase,
        refPostId: refPostId
      });
      setNewComment('');
      setRefPostId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConsultAgent = async (agentId: string) => {
    setConsultingAgentId(agentId);
    try {
      await onTriggerAgent(agentId, activeTabPhase);
    } catch (err) {
      console.error(err);
    } finally {
      setConsultingAgentId(null);
    }
  };

  // Submit Rating
  const handleSubmitRating = async (ratingVal: number) => {
    setRatingSubmitting(true);
    try {
      const res = await fetch(`/api/problems/${problem.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingVal })
      });
      if (res.ok) {
        await onRefreshState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRatingSubmitting(false);
    }
  };

  // Decompose Task addition
  const handleAddTaskMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTaskSubmitting(true);
    try {
      const res = await fetch(`/api/problems/${problem.id}/decompose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription: newTaskText.trim() })
      });
      if (res.ok) {
        setNewTaskText('');
        await onRefreshState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTaskSubmitting(false);
    }
  };

  const toggleTaskCheckbox = (task: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  // Compute Attachment Submission
  const handleRegisterCompute = async (e: React.FormEvent) => {
    e.preventDefault();
    setComputeSubmitting(true);
    try {
      const payload: any = { mode: computeMode };
      if (computeMode === 'cloud') {
        payload.providerName = cloudProvider;
        payload.region = cloudRegion;
        payload.gpuModel = cloudGpu;
        payload.gpusCount = cloudGpuCount;
        payload.ramGb = cloudRam;
      } else if (computeMode === 'peer') {
        payload.nodesCount = peerNodes;
        payload.aggregateTflops = peerTflops;
        payload.gpusCount = Math.floor(parseInt(peerNodes, 10) * 1.5);
      }

      const res = await fetch(`/api/problems/${problem.id}/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await onRefreshState();
        setComputeMode('none');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setComputeSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* LEFT & CENTER WORKROOM (Pólya stages and thread) */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Active Problem details box with peer-rating display */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <Brain className="w-48 h-48 text-indigo-505 translate-x-12 -translate-y-8" />
          </div>
          <div className="relative space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900">
                {problem.domain}
              </span>
              <span className="text-[10px] text-slate-450">• Current Active Workspace</span>
              
              {/* Problem Score / Rating Indicator */}
              <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded flex items-center gap-1 shrink-0 font-mono">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                Rating: {problem.peerRating ? `${problem.peerRating} / 5.0` : 'Unrated'} ({problem.ratingsCount || 0} peer evaluations)
              </span>
            </div>

            <h2 className="text-xl font-semibold tracking-tight">{problem.title}</h2>
            
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded-lg border border-slate-800/60 font-serif">
              {problem.detailDescription}
            </div>

            {/* Quick Peer Rating Widget */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/50 p-2.5 rounded-lg border border-slate-850/80 mt-3 pt-3">
              <span className="text-[10.5px] text-slate-400 font-sans">Verify this problem complexity and clarity? Sign academic rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleSubmitRating(star)}
                    disabled={ratingSubmitting}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-4 h-4 text-amber-400 ${star <= (problem.peerRating || 5) ? 'fill-amber-400' : 'text-slate-600'}`} 
                    />
                  </button>
                ))}
                <span className="text-[10px] text-slate-500 ml-1 font-mono">{ratingSubmitting ? 'Posting...' : 'Peer Sign'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC TASK DECOMPOSITION & CHECKLIST MANIFEST */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                Milestone Task Decomposition Checklist
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                A grand challenge is conquered by parsing it into tiny, verifiable lemmas. Peer contributors and agents check off subtasks when steps conclude.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
              {problem.decomposedTasks?.length || 0} subtasks registered
            </span>
          </div>

          {/* Subtask listing with checking option */}
          <div className="space-y-2.5">
            {(!problem.decomposedTasks || problem.decomposedTasks.length === 0) ? (
              <div className="text-center py-4 text-slate-400 text-xs font-serif bg-slate-50/40 dark:bg-slate-950 rounded">
                No active subtasks decomposed yet. Fill the quick parser below to register a milestone step.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {problem.decomposedTasks.map((task, idx) => {
                  const isChecked = !!checkedTasks[task];
                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleTaskCheckbox(task)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/15 dark:bg-emerald-950/10 opacity-75' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked 
                          ? 'bg-emerald-550 border-emerald-555 text-white' 
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </span>
                      <span className={`text-[11.5px] leading-snug font-serif ${isChecked ? 'line-through text-slate-450 dark:text-slate-500' : 'text-slate-800 dark:text-slate-300'}`}>
                        {task}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Append custom subtask form */}
          <form onSubmit={handleAddTaskMilestone} className="flex gap-2 border-t border-slate-100 dark:border-slate-850 pt-3">
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="e.g., Task 1.5: Compute modular exponents using parallel ring rings..."
              className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={taskSubmitting}
              required
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg shrink-0 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Decompose Step</span>
            </button>
          </form>
        </div>

        {/* GEORGE PÓLYA 4-STEP SELECTOR HEADER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <Compass className="w-4 h-4 text-indigo-500" />
              Active Co-op Synthesis Workflow (Pólya Standard)
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Problem Step: <strong>Step {problem.polyaStep}</strong></span>
              {problem.polyaStep < 4 && (
                <button
                  onClick={() => onAdvanceStep(problem.polyaStep + 1)}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 font-medium rounded border border-slate-250 dark:border-slate-800 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Advance Problem Step
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {polyaSteps.map((step) => {
              const isProblemCurrent = problem.polyaStep === step.num;
              const isSelectedTab = activeTabPhase === step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => setActiveTabPhase(step.num as any)}
                  className={`flex flex-col items-start text-left p-3 rounded-lg border transition-all cursor-pointer relative ${
                    isSelectedTab
                      ? step.bgColor
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/40 bg-white dark:bg-slate-950'
                  }`}
                >
                  {isProblemCurrent && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 font-semibold text-xs tracking-tight">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelectedTab ? 'bg-indigo-605 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                    }`}>
                      {step.num}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-450 mt-1 lines-clamp-2 leading-relaxed">
                    {step.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* THREADED COLLABORATIVE COMMENTS TIMELINE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Active Postings for Phase {activeTabPhase}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {phaseComments.length} contributions
            </span>
          </div>

          <div className="space-y-4" id="comments-timeline">
            {phaseComments.length === 0 ? (
              <div className="text-center py-10 bg-slate-50/40 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <Brain className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">No active posts for this Pólya stage.</p>
                <p className="text-[11px] text-slate-400">Share your speculative thoughts or wake up an AI specialist agent on the right!</p>
              </div>
            ) : (
              phaseComments.map(comment => {
                const gr = comment.guardrailRating;
                const scoreColor = gr && gr.adherenceScore >= 80 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200' 
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200';

                return (
                  <div 
                    key={comment.id}
                    className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-850 p-4 rounded-xl space-y-3.5 shadow-xs shrink-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex items-center justify-center">
                          {comment.authorAvatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-850 dark:text-white">{comment.authorName}</span>
                            <span className="text-[8px] tracking-wide font-mono bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-1 py-0.2 rounded text-slate-505">
                              {comment.authorType}
                            </span>
                          </div>
                          <p className="text-[9px] text-indigo-600 dark:text-indigo-405 font-medium leading-none">{comment.authorRole}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950 border border-slate-150/40 dark:border-slate-850 p-2.5 rounded-lg font-serif">
                      {comment.content}
                    </div>

                    {/* Referee Guardrail score tag */}
                    {gr && (
                      <div className={`p-2 rounded border text-[9.5px] flex items-start gap-2 ${scoreColor}`}>
                        <GuardIcon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-500" />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Compliance Referee Score: {gr.adherenceScore}%</span>
                            <span>•</span>
                            <span>Brevity Index: {gr.concisenessScore}/5</span>
                          </div>
                          <p className="opacity-90">{gr.critique}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-2.5">
                      <span className="text-[9px] text-slate-400 font-mono">
                        {comment.refPostId ? `↳ Linked step-back referencing: #${comment.refPostId.substring(5, 9)}` : 'Independent speculative statement'}
                      </span>
                      <button
                        onClick={() => onVoteComment(comment.id)}
                        className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-450 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors font-medium text-[11px]"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-500" />
                        Acknowledge Thought ({comment.votes || 0})
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* HUMAN INPUT FORM */}
        <form onSubmit={handlePostComment} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-semibold text-slate-505 dark:text-slate-450 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <User className="w-4 h-4 text-emerald-500" />
            Contribute Speculative / Rigorous Insight (Human)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-450 uppercase mb-1">Your Name</label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Dr. Samantha Cooper"
                className="w-full px-3 py-1.5 border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded-lg text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-455 uppercase mb-1">Expertise Vector Role</label>
              <input
                type="text"
                value={authorRole}
                onChange={e => setAuthorRole(e.target.value)}
                placeholder="Lattice-Crypto Cryptographer"
                className="w-full px-3 py-1.5 border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-550 uppercase mb-1">Build directly upon relative prior post (Pólya Sequence Context)</label>
              <select
                value={refPostId || ''}
                onChange={e => setRefPostId(e.target.value ? e.target.value : null)}
                className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] rounded text-slate-900 dark:text-white focus:outline-none bg-white"
              >
                <option value="">-- Post autonomous thought (not linked to previous post) --</option>
                {possibleRefs.map(c => (
                  <option key={c.id} value={c.id}>
                    Re: [{c.authorName}] {c.content.substring(0, 60)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-450 uppercase mb-1">Your Proposed Logical Steps</label>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={3}
              placeholder="Post short, singular mathematical propositions. Avoid sweeping generalizations or conversational bloat. Link equations clearly."
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-55"
          >
            {submitting ? 'Submitting with Real-time Referee Guardrail Rating...' : 'Submit Speculation & Auto-Referee'}
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* RIGHT SIDEBAR: RESOURCE POOLS + REGISTRIES */}
      <div className="space-y-6">
        
        {/* COMPUTE HARWARE RESOURCE POOL MANAGEMENT */}
        <div className="bg-slate-900 text-white border border-slate-850 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-2.5 flex items-start justify-between">
            <div>
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                GPU/CPU Resource Matrix
              </h3>
              <p className="text-[10.5px] text-slate-400 mt-1">
                Attach external cloud compute hardware clusters or share individual system cores to accelerate logical check runs.
              </p>
            </div>
          </div>

          {/* Connected Computing indicators */}
          <div className="space-y-3">
            {problem.attachedCompute ? (
              <div className="p-3 bg-slate-950/80 border border-emerald-900/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Server className="w-3.5 h-3.5" />
                    Dedicated Cloud Cluster Attached
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-[11px] space-y-0.5 text-slate-300">
                  <p>Provider: <strong className="text-white">{problem.attachedCompute.providerName}</strong></p>
                  <p>Region: <strong className="text-white">{problem.attachedCompute.region}</strong></p>
                  <p>Silicon: <strong className="text-slate-300">{problem.attachedCompute.gpusCount}x {problem.attachedCompute.gpuModel}</strong></p>
                  <p>Compute RAM: <strong className="text-slate-300">{problem.attachedCompute.ramGb} GB VRAM / SYSTEM</strong></p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[10.5px] text-center font-serif">
                No dedicated cloud silicon attached. Heavy proof checks run on baseline sandboxed servers.
              </div>
            )}

            {problem.sharedPeerCompute ? (
              <div className="p-3 bg-slate-950/80 border border-indigo-900/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    Co-op Swarm Grid Joined
                  </span>
                  <span className="text-[10px] text-indigo-450 font-mono">ACTIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    Nodes connected: <strong className="text-white">{problem.sharedPeerCompute.nodesCount} systems</strong>
                  </div>
                  <div>
                    Active shared GPUs: <strong className="text-white">{problem.sharedPeerCompute.gpusActive} units</strong>
                  </div>
                  <div className="col-span-2">
                    Aggregate Acceleration: <strong className="text-indigo-400">{problem.sharedPeerCompute.aggregateTflops} FLOPS</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[10.5px] text-center font-serif">
                No active P2P peer GPU cores connected.
              </div>
            )}
          </div>

          {/* Action buttons list */}
          {computeMode === 'none' ? (
            <div className="grid grid-cols-2 gap-2 pt-2 text-slate-950">
              <button
                type="button"
                onClick={() => setComputeMode('cloud')}
                className="py-1.5 px-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-[10px] rounded-lg transition-colors cursor-pointer text-center"
              >
                + Cloud Cluster
              </button>
              <button
                type="button"
                onClick={() => setComputeMode('peer')}
                className="py-1.5 px-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-[10px] rounded-lg transition-colors cursor-pointer text-center"
              >
                + Join My Node
              </button>
              {(problem.attachedCompute || problem.sharedPeerCompute) && (
                <button
                  type="button"
                  onClick={async () => {
                    setComputeSubmitting(true);
                    try {
                      await fetch(`/api/problems/${problem.id}/compute`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mode: 'disconnect' })
                      });
                      await onRefreshState();
                    } catch (err) { console.error(err); }
                    setComputeSubmitting(false);
                  }}
                  className="col-span-2 py-1 bg-red-650 hover:bg-red-700 text-white text-[10px] uppercase font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Disconnect Computation Matrix
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleRegisterCompute} className="bg-slate-950 border border-slate-800 p-3 rounded-lg space-y-3 text-xs">
              <h4 className="font-semibold text-indigo-400 text-[10.5px] uppercase">
                {computeMode === 'cloud' ? 'Configure Cloud Hardware Cluster' : 'Share My Local Chipset Node'}
              </h4>

              {computeMode === 'cloud' ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase">Cloud Provider</label>
                    <select 
                      value={cloudProvider} 
                      onChange={e => setCloudProvider(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 p-1 rounded text-white text-[10px]"
                    >
                      <option value="Google Cloud Platform">Google Cloud (GCP)</option>
                      <option value="Amazon Web Services">Amazon Web Services (AWS)</option>
                      <option value="Lambda Labs">Lambda Labs Cluster</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">Region</label>
                      <input 
                        type="text" 
                        value={cloudRegion} 
                        onChange={e => setCloudRegion(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-750 p-1 rounded text-white text-[10px] font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">GPU Type</label>
                      <input 
                        type="text" 
                        value={cloudGpu} 
                        onChange={e => setCloudGpu(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-750 p-1 rounded text-white text-[10px]" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">GPU Units Count</label>
                      <input 
                        type="number" 
                        value={cloudGpuCount} 
                        onChange={e => setCloudGpuCount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-750 p-1 rounded text-white text-[10px]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">System VRAM (GB)</label>
                      <input 
                        type="number" 
                        value={cloudRam} 
                        onChange={e => setCloudRam(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-750 p-1 rounded text-white text-[10px]" 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 leading-normal">
                    This registers your local computer as an decentralized worker node to verify parallel mathematical models. We record peer metrics.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">Node Threads Limit</label>
                      <input 
                        type="number" 
                        value={peerNodes} 
                        onChange={e => setPeerNodes(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-750 p-1 rounded text-white text-[10px]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase">Self-reported Tflops</label>
                      <input 
                        type="text" 
                        value={peerTflops} 
                        onChange={e => setPeerTflops(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-750 p-1 rounded text-white text-[10px] font-mono" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1 text-slate-950">
                <button
                  type="submit"
                  disabled={computeSubmitting}
                  className="flex-1 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-[10px] rounded cursor-pointer transition-colors"
                >
                  Activate Node
                </button>
                <button
                  type="button"
                  onClick={() => setComputeMode('none')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[10px] rounded cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT SIDEBAR: REGISTERED COOPERATIVE AI AGENTS CONSULTATION LEVEL */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-850 pb-2">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="text-indigo-600 w-4 h-4" />
              Solicit AI Agent Brainstorming
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Trigger a task-specific specialized AI model. The AI scans preceding posts and produces a complementary, rule-compliant post.
            </p>
          </div>

          <div className="space-y-4">
            {agents.map(agent => {
              const isConsulting = consultingAgentId === agent.id;
              
              return (
                <div 
                  key={agent.id}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-3 shadow-xs space-y-2.5 transition-all hover:shadow-xs shrink-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 flex items-center justify-center">
                        {agent.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-1 text-slate-950 dark:text-white">
                          <span className="font-semibold text-xs">{agent.name}</span>
                          {agent.verified && (
                            <span className="text-[8px] bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900 px-1 rounded font-bold font-mono shrink-0">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium">{agent.role}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-slate-400 font-medium">Score: {agent.accuracyScore}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 p-2 rounded">
                    {agent.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-2.5">
                    <span className="text-[9px] text-slate-400 font-mono">
                      Status: <strong className={agent.status === 'Idle' ? 'text-emerald-500' : 'text-indigo-500'}>{agent.status}</strong>
                    </span>
                    <button
                      onClick={() => handleConsultAgent(agent.id)}
                      disabled={isConsulting || consultingAgentId !== null}
                      className="text-[10px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      {isConsulting ? (
                        <>
                          <Brain className="w-3 h-3 animate-pulse" />
                          Analyzing Thread...
                        </>
                      ) : (
                        <>
                          Consult Agent
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
