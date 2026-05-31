import React, { useState } from 'react';
import { Agent, VerificationChallenge } from '../types';
import { 
  Sparkles, Award, Play, RotateCw, CheckCircle2, 
  XOctagon, FileCode, ShieldCheck, Star, Cpu 
} from 'lucide-react';

interface AgentVerificationHubProps {
  agents: Agent[];
  challenges: VerificationChallenge[];
  onRunChallenge: (challengeId: string, agentId: string) => Promise<void>;
}

export default function AgentVerificationHub({
  agents,
  challenges,
  onRunChallenge
}: AgentVerificationHubProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[1]?.id || agents[0]?.id || '');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const handleExecuteVerification = async (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    try {
      await onRunChallenge(challengeId, selectedAgentId);
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedChallengeId(null);
    }
  };

  return (
    <div className="space-y-6" id="agent-verification-hub">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="text-indigo-600 w-6 h-6" />
          Agent Verification Hub & Leaderboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rigorous technical verification challenge pipeline to assert the mathematical correctness, completeness, and logical accuracy of specialist agents.
        </p>
      </div>

      {/* AGENT REGISTRY LEADERBOARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-505" />
          Task-Specific Agent Directory
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => {
            const isSelected = selectedAgentId === agent.id;

            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-55/30 dark:bg-indigo-950/25 ring-2 ring-indigo-550/20' 
                    : 'border-slate-250 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/40 bg-white dark:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 flex items-center justify-center shrink-0">
                        {agent.avatar}
                      </span>
                      <div>
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                          {agent.name}
                          {agent.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-sky-505 shrink-0 fill-sky-550/10" />
                          )}
                        </h4>
                        <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono font-medium uppercase">{agent.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-750 dark:text-amber-450 border border-amber-100/50">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                      {agent.rating.toFixed(1)}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-505 dark:text-slate-400 mt-2 line-clamp-2">
                    {agent.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-900 pt-2.5 flex items-center justify-between text-[10px]">
                  <span>Accuracy Score: <strong className="text-slate-700 dark:text-slate-350">{agent.accuracyScore}%</strong></span>
                  <div className="flex gap-1">
                    {agent.achievements.map((ach, idx) => (
                      <span key={idx} className="text-[8px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.2 rounded font-mono text-slate-500 border border-slate-200 dark:border-slate-800">
                        {ach.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGOR CHALLENGE BENCHMARK SUITE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHALLENGES COLUMN (Cols 1-2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-slate-205 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-840 dark:text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-505" />
              Active Verification Challenges
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Select an agent from above, then run one of the mathematical or technical challenges below. Successful proof outputs verify agent competence.
            </p>
          </div>

          <div className="space-y-4">
            {challenges.map(chal => {
              const isExecuting = selectedChallengeId === chal.id;
              const hasRun = chal.lastTestPassed !== null;

              return (
                <div 
                  key={chal.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-55/65 dark:bg-indigo-950/20 px-1.5 py-0.5 rounded">
                        {chal.domain}
                      </span>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white mt-1.5">{chal.title}</h4>
                    </div>

                    <button
                      onClick={() => handleExecuteVerification(chal.id)}
                      disabled={isExecuting || chal.running}
                      className="px-3.5 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {isExecuting || chal.running ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          Testing Agent...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 shrink-0" />
                          Run Challenge
                        </>
                      )}
                    </button>
                  </div>

                  {/* Challenge description content */}
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-2">
                    <p className="text-[11px] text-slate-700 dark:text-slate-350">
                      <strong>Problem:</strong> {chal.problemStatement}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      <strong>Target Criteria:</strong> {chal.expectedOutcome}
                    </p>
                  </div>

                  {/* Test pipeline response box if has run */}
                  {hasRun && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-420">Latest Test Pipeline Score:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${
                            chal.lastTestPassed 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-450' 
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-505 dark:text-rose-400'
                          }`}>
                            {chal.lastTestPassed ? <CheckCircle2 className="w-3 h-3" /> : <XOctagon className="w-3 h-3" />}
                            {chal.lastTestPassed ? 'Passed' : 'Inconclusive'}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">Grade: {chal.lastTestScore}/100</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded p-3">
                        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-2">
                          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Verification Output Log</span>
                        </div>
                        <pre className="text-[10px] text-slate-300 font-mono whitespace-pre-wrap select-text leading-relaxed">
                          {chal.lastTestOutput}
                        </pre>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* VERIFICATION CRITERIA EXPLAINER (Col 3) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-802 dark:text-slate-200 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Sparkles className="text-emerald-500 w-4 h-4 animate-pulse" />
              PolyMath Peer Evaluation
            </h3>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed">
              When an agent runs a verification challenge, the system initiates the **Polymath Peer Validator pipeline**:
            </p>

            <ul className="space-y-3 text-[11px] text-slate-655 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="font-mono text-indigo-500 text-xs mt-0.5 font-bold">1.</span>
                <span>The candidate agent consumes the specific challenge constraints.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-indigo-500 text-xs mt-0.5 font-bold">2.</span>
                <span>The model outputs a meticulous algebraic or structural proof.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-indigo-500 text-xs mt-0.5 font-bold">3.</span>
                <span>An independent, high-capability evaluator model rates correctness out of 100 on a strict mathematical scale.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-indigo-500 text-xs mt-0.5 font-bold">4.</span>
                <span>Scores crossing **90%** award the agent a permanent **Verified Badge** on the registry platform.</span>
              </li>
            </ul>

            <div className="bg-slate-50 dark:bg-slate-900 p-2 text-[10px] border border-slate-200 dark:border-slate-800 rounded text-slate-500">
              <strong>Active Validator Config:</strong> Gemini Pro / Flash Peer-Grader utilizing low-temperature deterministic evaluations to assure algebraic correctness.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
