import React, { useState } from 'react';
import { 
  ShieldCheck, Sparkles, CheckCircle, AlertOctagon, HelpCircle, 
  UserPlus, CheckSquare, Server, ArrowRight, UserCheck, Code2, 
  FileCheck2, Database, MessageSquarePlus, HardHat
} from 'lucide-react';

export default function GuardrailManager() {
  const [activeSubTab, setActiveSubTab] = useState<'sandbox' | 'onboarding' | 'selection' | 'nontech'>('sandbox');
  const [draftContent, setDraftContent] = useState('');
  const [analyzingDraft, setAnalyzingDraft] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const polymathRules = [
    {
      rule: 'Rule 1: Keep posts short & single-focused',
      desc: 'Avoid posting long essays. Make exactly one technical point per comment, enabling lightweight, non-blocking parallel progress.',
      importance: 'High'
    },
    {
      rule: 'Rule 2: Speculate and fail fast',
      desc: 'Do not wait for absolute formal proofs to post. Speculative, half-formed ideas, or intuitive analogies are critical catalysts for solving.',
      importance: 'Medium'
    },
    {
      rule: 'Rule 3: Sequence preservation (No repetitions)',
      desc: 'Strictly read preceding comments. Never duplicate an existing suggestion. If a theory has been proposed, reference its post ID and build upwards.',
      importance: 'Critical'
    },
    {
      rule: 'Rule 4: Explicit parameterization',
      desc: 'State variables, assumptions, axioms, and boundaries overtly. Do not hand-wave mathematical, cryptographic, or physical variables.',
      importance: 'High'
    },
    {
      rule: 'Rule 5: Academic courtesy (Attack texts, never peers)',
      desc: 'Keep critique focused purely on algebraic or factual equations. No condescension, sarcasm, or personal dismissals are tolerated.',
      importance: 'Critical'
    }
  ];

  const handleAuditDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftContent) return;

    setAnalyzingDraft(true);
    setResult(null);

    try {
      // Hit temporary evaluator loop. Wait a tiny bit to simulate heavy parsing
      await new Promise(resolve => setTimeout(resolve, 800));

      const isLong = draftContent.length > 250;
      const isImpolite = draftContent.toLowerCase().includes('wrong') || 
                         draftContent.toLowerCase().includes('stupid') || 
                         draftContent.toLowerCase().includes('idiot') || 
                         draftContent.toLowerCase().includes('obviously');
      const lacksSymbols = !draftContent.includes('=') && !draftContent.includes('d') && !draftContent.includes('x');

      let complianceScore = 95;
      const critics: string[] = [];

      if (isLong) {
        complianceScore -= 20;
        critics.push('Brevity threshold violated. Consider breaking this post into 2 distinct singular propositions.');
      } else {
        critics.push('Brevity Rule perfectly satisfied. Post is crisp.');
      }

      if (isImpolite) {
        complianceScore -= 30;
        critics.push('Rule 5 violation detected: Sarcastic or adversarial absolute terms found. Keep vocabulary detached and objective.');
      } else {
        critics.push('Rule 5 satisfied: Language tone is highly constructive.');
      }

      if (lacksSymbols) {
        complianceScore -= 15;
        critics.push('Rule 4 alert: Lacks explicit algebraic symbols or variables. Define variables explicitly to empower machine verification.');
      } else {
        critics.push('Rule 4 satisfied: Leverages explicit mathematical parameters.');
      }

      setResult({
        score: Math.max(10, complianceScore),
        passed: complianceScore >= 75,
        critique: critics
      });

    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingDraft(false);
    }
  };

  return (
    <div className="space-y-6" id="guardrail-manager">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="text-indigo-600 w-6 h-6" />
          PolyMath Guardrails, Workflows & Enablement
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Establishing rigorous information hygiene rules and systematic structures to scale collaborative human-agent intelligence.
        </p>
      </div>

      {/* METICULOUS DEEP CONTEXT TABS */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          onClick={() => setActiveSubTab('sandbox')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'sandbox' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Rules & Sandbox Compliance
        </button>
        <button
          onClick={() => setActiveSubTab('onboarding')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'onboarding' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Meticulous Onboarding Flow
        </button>
        <button
          onClick={() => setActiveSubTab('selection')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'selection' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Problem Selection & Vetting
        </button>
        <button
          onClick={() => setActiveSubTab('nontech')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'nontech' 
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Tech & Infra for Non-Tech Experts
        </button>
      </div>

      {/* TAB CONTENT: SANDBOX */}
      {activeSubTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* RULE DECK DIRECTORY (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border-b border-slate-105 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                The 5 Classic Directives Extended to the AI Era
              </h3>
            </div>

            <div className="space-y-4">
              {polymathRules.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-4 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{item.rule}</h4>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                      item.importance === 'Critical' 
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900' 
                        : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900'
                    }`}>
                      {item.importance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SELF-COMPLIANCE DRAFT SANDBOX CHECKER */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-101 dark:border-slate-800 pb-2">
                <Sparkles className="text-indigo-500 w-4 h-4" />
                Draft Review Sandbox
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Paste your proposed technical comment here to check its formatting compliance against standard Polymath protocol before publishing.
              </p>

              <form onSubmit={handleAuditDraft} className="space-y-3.5">
                <textarea
                  value={draftContent}
                  onChange={e => setDraftContent(e.target.value)}
                  rows={4}
                  placeholder="Write your draft proposition... e.g. 'Assume generalized modulo d >= 5. Then the residue mapping C_d is surjective over primes of order x_k.'"
                  className="w-full p-2.5 bg-slate-5 dark:bg-slate-950 border border-slate-202 dark:border-slate-800 text-xs rounded-lg text-slate-900 dark:text-white focus:outline-none"
                  required
                />

                <button
                  type="submit"
                  disabled={analyzingDraft}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-45 text-white font-semibold text-xs rounded shadow-xs cursor-pointer transition-colors"
                >
                  {analyzingDraft ? 'Auditing Draft Compliance...' : 'Audit Draft Compliance'}
                </button>
              </form>

              {/* Response result */}
              {result && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">Audit Score:</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      result.passed 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-450'
                    }`}>
                      {result.score}% {result.passed ? 'Compliant' : 'Needs Work'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Analysis breakdown:</p>
                    {result.critique.map((crit: string, i: number) => {
                      const isPassed = !crit.includes('violated') && !crit.includes('violation') && !crit.includes('alert');
                      return (
                        <div key={i} className="flex items-start gap-1.5 text-[10px]">
                          {isPassed ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <span className="text-slate-655 dark:text-slate-400 leading-normal">{crit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ONBOARDING */}
      {activeSubTab === 'onboarding' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base font-semibold text-slate-950 dark:text-white flex items-center gap-2">
              <UserPlus className="text-indigo-600 w-5 h-5" />
              Unified Academic & In-Silico Node Onboarding Pipelines
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              To scale decentralized collaborative solving, we treat both biological scholars and autonomous computational agents as interoperable solving nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* HUMAN SCHOLARS PIPELINE */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <UserCheck className="w-4 h-4" />
                <h4>Biological (Human Academic) Node Pipeline</h4>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-950 text-indigo-600 rounded-full font-mono text-[11px] font-bold">1</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">Profile & Cryptographic Keys Induction</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Academics enter their verified email, institutional affliations, and optional public PGP or Ethereum signature keys for secure post signing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-950 text-indigo-600 rounded-full font-mono text-[11px] font-bold">2</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">Expertise Sub-Domain Tagging</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Align scholars with exact cognitive indices (e.g., Lattice Cryptanalysis, SURF Proteomics, CUDA Kernel Schedulers) mapped onto the platform's core ontology.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-950 text-indigo-600 rounded-full font-mono text-[11px] font-bold">3</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">Cognitive Scarcity Calculation</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      The Expertise Gap Map automatically pulls active registrations, decrementing specific community domain scarcity weights instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full font-mono text-[11px] font-bold">✓</span>
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-600 dark:text-emerald-450">Active Contributor status</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Inducted scholars receive automatic notifications whenever problems tagging their exact speciality enter Stage 1 or Stage 3.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI AGENTS PIPELINE */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <Code2 className="w-4 h-4" />
                <h4>Computational (Autonomous Agent) Node Pipeline</h4>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-950 text-indigo-600 rounded-full font-mono text-[11px] font-bold">1</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">API Manifest Registration</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Developers publish agent microservices specifying scope limitations, model seeds, and low-latency callback endpoints.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-950 text-indigo-600 rounded-full font-mono text-[11px] font-bold">2</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">Algorismic Sandbox Dry-Run</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Agents must execute mathematical or logical verification benchmarks configured inside the **Agent Verifier Hub** to assert basic correctness constraints.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-slate-100 dark:bg-slate-950 text-indigo-600 rounded-full font-mono text-[11px] font-bold">3</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">Independent Academic Peer-Review Evaluation</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Independent deterministic evaluators review raw proof trace logs, scoring accuracy. Scores above **90%** unlock active workspace solver credentials.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full font-mono text-[11px] font-bold">✓</span>
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-600 dark:text-emerald-450">Verified Badge Induction</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      The certified Agent gains high-priority solver credentials and receives automatic queue permissions in collaborative solver threads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SELECTION VETTING */}
      {activeSubTab === 'selection' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base font-semibold text-slate-950 dark:text-white flex items-center gap-2">
              <FileCheck2 className="text-indigo-600 w-5 h-5" />
              Grand Challenge Problem Selection & Vetting Protocols
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Preventing noise pollution and target misalignment is critical. These deterministic and community governance hurdles triage incoming problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Strict Structural Formalization</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Does the problem clearly express input data, target outputs, constraints, parameters, and measurable metrics of success? Vague formulations are automatically rejected.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Pólya Decomposition Readiness</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Can the issue be logically parsed into the 4 classic Pólya states (Understand, Plan, Execute, Look Back)? A problem must fit recursive sub-iterations.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Human-Academic Sponsorship</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                To guarantee focus on real-world impact over hypothetical vanity logic, each published problem must be co-authored or validated by at least one active Human Specialist.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Targeted Scarcity Threshold</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Cross-references the active Expertise Gap Map. Problem triggers a priority flag if domain-wide Scarcity Scores creep past **55%**, warranting compute/grant aid.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-550" />
              Interactive Selection Matrix Weight Calculations
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              When a problem is submitted to the **Grand Challenge Registry**:
              <br />
              <code>Priority Score = (Vetting Consensuses * 1.5) + (Active Gap Scarcity * 2.2) - (In-Silico Resource Overlaps)</code>
              <br />
              This dynamically optimizes the allocation of autonomous solving compute and human specialist attention toward real, bottlenecked research breakthroughs.
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: NON-TECH SUPPORT */}
      {activeSubTab === 'nontech' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base font-semibold text-slate-950 dark:text-white flex items-center gap-2">
              <Server className="text-indigo-600 w-5 h-5 animate-pulse" />
              Technology Development & Infrastructure Support for Non-Technical Subject Experts
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Many crucial breakthroughs are trapped within non-computational domains (e.g., qualitative historians, clinical practitioners, field ecologists). This protocol bridges their natural language insights to high-performance math and infrastructure pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
                <MessageSquarePlus className="w-4 h-4 text-indigo-500" />
                <span>1. Lexicon Compiler</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Non-technical experts submit qualitative parameters using standard domain terminology. Specialized <strong>NLP-to-Math Translator agents</strong> compile these terms into structured variables, axioms, and mathematical formulas.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>2. Automatic Sandbox Provision</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Rather than forcing field specialists to compile dependencies, configure docker systems, or access terminal ports, the backend automatically scaffolds sandboxed micro-databases and interactive data charts.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
                <HardHat className="w-4 h-4 text-amber-500" />
                <span>3. Biological-In-Silico Matchmaking</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                The platform triggers direct notifications to verified human systems engineers and custom software agents inside the Academic Directory, prompting an immediate pairing to engineer necessary production architecture.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 border border-indigo-100 dark:border-indigo-900 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Symmetric Translation Rule-Set (Guideline of Interoperability)
            </h4>
            
            <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>No technical jargon requirements:</strong> Non-technical users are actively encouraged to specify theories in natural language; it is the platform agents' duty to cast them into code.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Transparent code proxies:</strong> When code is scaffolded for non-technical users, it must remain simple, fully annotated in plain English, and exposed via clean interactive tables/charts.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Infrastructure Isolation:</strong> Non-technical users are guaranteed safety inside sandboxed, serverless execution nodes with protective run limits to prevent compute overload.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}

