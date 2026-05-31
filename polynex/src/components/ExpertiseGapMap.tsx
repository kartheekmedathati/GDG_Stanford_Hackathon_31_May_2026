import React, { useState } from 'react';
import { HumanExpert, ExpertiseGap } from '../types';
import { 
  Users, Award, Cpu, ShieldAlert, AlertTriangle, 
  UserPlus, Check, Sparkles, TrendingUp, ShieldCheck 
} from 'lucide-react';

interface ExpertiseGapMapProps {
  gaps: ExpertiseGap[];
  experts: HumanExpert[];
  onOnboardExpert: (expertData: any) => Promise<any>;
}

export default function ExpertiseGapMap({
  gaps,
  experts,
  onOnboardExpert
}: ExpertiseGapMapProps) {
  const [showOnboardForm, setShowOnboardForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extended Onboarding Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [expertise, setExpertise] = useState('');
  const [avatar, setAvatar] = useState('🧑‍🔬');
  const [googleScholarId, setGoogleScholarId] = useState('');
  const [hIndex, setHIndex] = useState('24');
  const [citationsCount, setCitationsCount] = useState('1850');
  const [onboardedWithKey, setOnboardedWithKey] = useState('');
  const [occupancyPercent, setOccupancyPercent] = useState('35');

  // Math helper
  const criticalGapsCount = gaps.filter(g => g.scarcityScore >= 60).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email) {
      setErrorMsg('Name and email are strictly required.');
      return;
    }

    if (!onboardedWithKey) {
      setErrorMsg('Please input a valid Specialist Invite Key to access peer verification.');
      return;
    }

    const expArray = expertise
      ? expertise.split(',').map(s => s.trim()).filter(Boolean)
      : ['Generalist'];

    // Call state update on App level
    const result = await onOnboardExpert({
      name,
      email,
      role,
      expertise: expArray,
      avatar,
      googleScholarId: googleScholarId || undefined,
      hIndex: hIndex ? parseInt(hIndex, 10) : undefined,
      citationsCount: citationsCount ? parseInt(citationsCount, 10) : undefined,
      onboardedWithKey: onboardedWithKey.trim(),
      occupancyPercent: occupancyPercent ? parseInt(occupancyPercent, 10) : 30
    });

    if (result && result.success) {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 5000);

      // Reset form on success
      setName('');
      setEmail('');
      setRole('');
      setExpertise('');
      setGoogleScholarId('');
      setHIndex('24');
      setCitationsCount('1850');
      setOnboardedWithKey('');
      setOccupancyPercent('35');
      setShowOnboardForm(false);
    } else {
      setErrorMsg(result?.error || 'Verification of academic invite key failed.');
    }
  };

  return (
    <div className="space-y-6" id="expertise-gap-map">
      
      {/* High level directory info */}
      <div>
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="text-indigo-600 w-6 h-6 animate-pulse" />
          Active Core Co-op & Expert Vetting Console
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Polymath networks onboard real-world human academics via Google Scholar validation while routing heavy workloads to parallel cloud compute environments.
        </p>
      </div>

      {/* METRIC CARD BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-405 font-bold">Unmapped Scarcity Gaps</p>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{criticalGapsCount}</p>
              <p className="text-[10px] text-slate-400">Active categories needing human stars</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-405 font-bold">Vetted Academic Core</p>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{experts.length}</p>
              <p className="text-[10px] text-slate-400">Humans with active Google Scholar profiles</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-405 font-bold">In-Silico Research Nodes</p>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-405 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">5 Docs</p>
              <p className="text-[10px] text-slate-400">Compliant referee agents auditing logic</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GAP COVERAGE ANALYSIS LIST (Cols 1-2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-105 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Expertise Gap Scarcity Audit
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">SCARCITY SCORE: 0% (Covered) - 100% (Vacant)</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {gaps.map((gap, index) => {
              const scarcityColor = gap.scarcityScore >= 70 
                ? 'bg-rose-500 dark:bg-rose-600' 
                : gap.scarcityScore >= 45 
                ? 'bg-amber-500 dark:bg-amber-500' 
                : 'bg-emerald-500 dark:bg-emerald-500';

              const scarcityText = gap.scarcityScore >= 70 
                ? 'text-rose-600 dark:text-rose-455' 
                : gap.scarcityScore >= 45 
                ? 'text-amber-550 dark:text-amber-400' 
                : 'text-emerald-555 dark:text-emerald-450';

              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-4 shadow-xs space-y-3 shrink-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">
                        {gap.domain}
                      </span>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white mt-1.5">{gap.category}</h4>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${scarcityText}`}>
                        Scarcity: {gap.scarcityScore}%
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {gap.description}
                  </p>

                  {/* Horizontal progress indicators */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-150 dark:border-slate-850">
                      <div className={`h-full ${scarcityColor}`} style={{ width: `${gap.scarcityScore}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Demand Urgency: <strong>{gap.demandScore}%</strong></span>
                      <span className="flex items-center gap-2">
                        <span>Humans: <strong>{gap.availableHumanCount}</strong></span>
                        <span>•</span>
                        <span>AI: <strong>{gap.availableAICount}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HUMAN SPECIALIST DIRECTORY & ONBOARD PORTAL (Col 3) */}
        <div className="space-y-4">
          
          <button
            onClick={() => setShowOnboardForm(!showOnboardForm)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
          >
            <UserPlus className="w-4 h-4" />
            {showOnboardForm ? 'Close Reg Pipeline' : 'Onboard Scholar Network'}
          </button>

          {showOnboardForm && (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5 animate-fade-in text-slate-905 dark:text-slate-100">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Sparkles className="text-indigo-500 w-4 h-4 animate-spin-slow" />
                Vetting Academic Node
              </h3>

              {errorMsg && (
                <div className="bg-rose-50 dark:bg-rose-955/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-450 p-2.5 rounded-lg text-[10px] font-mono leading-normal">
                  {errorMsg}
                </div>
              )}

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-[10px] space-y-1 text-slate-500">
                <p className="font-semibold text-slate-705 dark:text-slate-350 flex items-center gap-1">
                  <span>ℹ️ Eligible Verification Keys for Test Onboarding:</span>
                </p>
                <div className="grid grid-cols-2 gap-1 font-mono text-[9px] mt-1 text-indigo-650 dark:text-indigo-400">
                  <span>• KARTHEEK-GUEST</span>
                  <span>• NEXUS-VET-909</span>
                  <span>• NEXUS-VET-882</span>
                  <span>• NEXUS-VET-111</span>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Scholar Key / Invite Code *</label>
                <input
                  type="text"
                  value={onboardedWithKey}
                  onChange={e => setOnboardedWithKey(e.target.value)}
                  placeholder="e.g. KARTHEEK-GUEST"
                  className="w-full px-2.5 py-1.5 border border-indigo-300 dark:border-indigo-900 bg-indigo-50/10 dark:bg-slate-950 text-xs rounded font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Jane Rostova"
                  className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Scholar Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@oxford.edu"
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Google Scholar ID</label>
                  <input
                    type="text"
                    value={googleScholarId}
                    onChange={e => setGoogleScholarId(e.target.value)}
                    placeholder="e.g. z1e_W44AAAAJ"
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Self-Reported h-index</label>
                  <input
                    type="number"
                    value={hIndex}
                    onChange={e => setHIndex(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Citation Count</label>
                  <input
                    type="number"
                    value={citationsCount}
                    onChange={e => setCitationsCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Role / Department</label>
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="Lead Macrocyclic Chemist"
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Current Occupancy Rate (%)</label>
                  <select
                    value={occupancyPercent}
                    onChange={e => setOccupancyPercent(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded text-slate-700 dark:text-slate-350"
                  >
                    <option value="15">Low Load (15% occupied)</option>
                    <option value="35">Balanced (35% occupied)</option>
                    <option value="60">High Occupancy (60% occupied)</option>
                    <option value="85">Full Demand (85% occupied)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Core Expertise Domains (Comma split)</label>
                <input
                  type="text"
                  value={expertise}
                  onChange={e => setExpertise(e.target.value)}
                  placeholder="e.g. Thermodynamic Perturbation, Lattice reduction"
                  className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-808 bg-slate-50 dark:bg-slate-950 text-xs rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-5 gap-2">
                <label className="block col-span-5 text-[9px] font-semibold text-slate-400 uppercase mb-0.5">Avatar Symbol</label>
                {['🧑‍🔬', '👩‍💻', '👨‍🚀', '👩‍🏫', '🕵️‍♂️'].map(emo => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => setAvatar(emo)}
                    className={`p-2 border rounded hover:bg-slate-50 text-center text-sm cursor-pointer ${avatar === emo ? 'border-indigo-500 bg-indigo-50/40 text-black dark:text-white' : 'border-slate-202 dark:border-slate-800 bg-white dark:bg-slate-950'}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded cursor-pointer transition-colors"
              >
                Submit Scholar Code & Request Onboarding
              </button>
            </form>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-955/45 border border-emerald-202 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-[11px] p-3 rounded-xl flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Scholar Vetted & Joined!</p>
                <p className="mt-0.5 text-[10px] opacity-90">Academic credentials checked with Google Scholar. Scarcity gap margins adjusted down.</p>
              </div>
            </div>
          )}

          {/* REGISTERED SCHOLARS DIRECTORY BOARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
              <span>Academic Core Directory</span>
              <span className="text-[10px] text-slate-400">{experts.length} active</span>
            </h3>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {experts.map((e) => {
                // Calculate domain relevance based on scarcity category overlapping
                const relevantScarcity = gaps.filter(g => 
                  e.expertise.some(tag => 
                    tag.toLowerCase().includes(g.category.toLowerCase()) || 
                    g.category.toLowerCase().includes(tag.toLowerCase()) ||
                    g.domain.toLowerCase().includes(tag.toLowerCase())
                  )
                );
                
                const relevanceScore = relevantScarcity.length > 0 
                  ? Math.min(100, 45 + relevantScarcity.length * 25) 
                  : 35;

                // Color code occupancy levels
                let occupancyColor = 'bg-emerald-500';
                let occupancyText = 'Highly Available';
                let occupancyTextClass = 'text-emerald-600 dark:text-emerald-400';
                
                if (e.occupancyPercent >= 75) {
                  occupancyColor = 'bg-rose-500';
                  occupancyText = 'Critical Load Only';
                  occupancyTextClass = 'text-rose-600 dark:text-rose-400';
                } else if (e.occupancyPercent >= 45) {
                  occupancyColor = 'bg-amber-500';
                  occupancyText = 'Moderately Busy';
                  occupancyTextClass = 'text-amber-600 dark:text-amber-400';
                }

                return (
                  <div key={e.id} className="border border-slate-100 dark:border-slate-850 p-3 rounded-lg bg-slate-50/40 dark:bg-slate-950/20 space-y-2 shrink-0">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl w-8 h-8 rounded-full bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 flex items-center justify-center shrink-0">
                        {e.avatar}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">{e.name}</h5>
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-900 px-1 py-0.2 rounded border border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
                            Relevance: {relevanceScore}%
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5">{e.role}</p>
                      </div>
                    </div>

                    {/* Scholar academic numbers (Google Scholar) */}
                    <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[10px] p-1.5 rounded">
                      <div className="text-slate-500">
                        h-index: <strong className="text-slate-800 dark:text-white">{e.hIndex || 18}</strong>
                      </div>
                      <div className="text-slate-500">
                        Citations: <strong className="text-slate-800 dark:text-white">{(e.citationsCount || 1200).toLocaleString()}</strong>
                      </div>
                      {e.googleScholarId && (
                        <div className="col-span-2 text-[8px] font-mono select-all text-indigo-600 dark:text-indigo-400 truncate">
                          id: {e.googleScholarId}
                        </div>
                      )}
                    </div>

                    {/* Occupancy state bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[8px] font-semibold">
                        <span className="text-slate-400">RESEARCH OCCUPANCY</span>
                        <span className={occupancyTextClass}>{e.occupancyPercent}% ({occupancyText})</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-1 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className={`h-full ${occupancyColor}`} style={{ width: `${e.occupancyPercent}%` }}></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {e.expertise.map((tag, i) => (
                        <span key={i} className="text-[8px] bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 px-1 py-0.2 rounded text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
