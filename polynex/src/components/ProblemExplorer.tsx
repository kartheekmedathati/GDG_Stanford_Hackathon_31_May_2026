import React, { useState, useEffect } from 'react';
import { Problem } from '../types';
import { ShieldCheck, Plus, Sparkles, TrendingUp, Award, Layers, Search, Filter } from 'lucide-react';

interface ProblemExplorerProps {
  problems: Problem[];
  activeProblemId: string | null;
  onSelectProblem: (id: string) => void;
  onVoteProblem: (id: string) => void;
  onCreateProblem: (problemData: any) => void;
  currentUser: string;
  initialFilter?: 'all' | 'institutional' | 'sme' | 'reddit';
  onFilterChange?: (filter: 'all' | 'institutional' | 'sme' | 'reddit') => void;
}

export default function ProblemExplorer({
  problems,
  activeProblemId,
  onSelectProblem,
  onVoteProblem,
  onCreateProblem,
  currentUser,
  initialFilter,
  onFilterChange
}: ProblemExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Mathematics');
  const [description, setDescription] = useState('');
  const [detailDescription, setDetailDescription] = useState('');
  const [creator, setCreator] = useState('');
  const [difficulty, setDifficulty] = useState<'Hard' | 'Extreme' | 'Grand Challenge'>('Extreme');
  const [impactFactor, setImpactFactor] = useState<'Revolutionary' | 'High' | 'Medium'>('High');
  const [requiredExpertise, setRequiredExpertise] = useState('');

  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'institutional' | 'sme' | 'reddit'>(initialFilter || 'all');

  useEffect(() => {
    if (initialFilter) {
      setActiveTypeFilter(initialFilter);
    }
  }, [initialFilter]);

  const handleTypeFilterChange = (filter: 'all' | 'institutional' | 'sme' | 'reddit') => {
    setActiveTypeFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  // Dynamically extract all available unique domains from problems list to ensure none are hidden
  const domains = ['All', ...Array.from(new Set(problems.map(p => p.domain)))];

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
    
    // Type classification
    const isReddit = p.title.startsWith('[Scouted Reddit]');
    const isSme = p.title.startsWith('[SME RFS]');
    const isInst = !isReddit && !isSme;
    
    let matchesType = true;
    if (activeTypeFilter === 'institutional') {
      matchesType = isInst;
    } else if (activeTypeFilter === 'sme') {
      matchesType = isSme;
    } else if (activeTypeFilter === 'reddit') {
      matchesType = isReddit;
    }
    
    return matchesSearch && matchesDomain && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !domain) return;

    const expertiseArray = requiredExpertise
      ? requiredExpertise.split(',').map(s => s.trim()).filter(Boolean)
      : [domain];

    onCreateProblem({
      title,
      domain,
      description,
      detailDescription: detailDescription || description,
      creator: creator || 'Independent Contributor',
      difficulty,
      impactFactor,
      requiredExpertise: expertiseArray
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setDetailDescription('');
    setCreator('');
    setRequiredExpertise('');
    setShowForm(false);
  };

  return (
    <div id="problem-explorer" className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4">
        <div>
          <h1 className="text-2xl font-sans font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="text-indigo-600 w-6 h-6" />
            Grand Challenges Registry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            "In mathematics you don't understand things. You just get used to them." — John von Neumann. Prioritize and onboard deep problems.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {showForm ? 'Cancel New Proposal' : 'Propose Grand Challenge'}
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-indigo-500 w-5 h-5" />
            Designate a New Collaborative Problem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Problem Title / Proposition</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Proving finite limits of generalized Navier-Stokes singularities"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Category Domain</label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white focus:outline-none focus:secondary-outline focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Cryptography">Cryptography</option>
                <option value="Bioengineering">Bioengineering</option>
                <option value="Climate Tech">Climate Tech</option>
                <option value="Drug Discovery">Drug Discovery</option>
                <option value="Clinical Workflows">Clinical Workflows</option>
                <option value="Robotics">Robotics</option>
                <option value="Hardware Design">Hardware Design</option>
                <option value="Maintenance & CRM">Maintenance & CRM</option>
                <option value="Firmware">Firmware</option>
                <option value="Insurance">Insurance</option>
                <option value="Inspection">Inspection</option>
                <option value="Communications">Communications</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Short Abstract (Used for high-level cards)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="State the central mathematical or computational contradiction in 1-2 parameters."
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Detailed Scientific Specification</label>
            <textarea
              value={detailDescription}
              onChange={e => setDetailDescription(e.target.value)}
              rows={3}
              placeholder="Supply numerical bounds, unproven theorems, underlying algebraic mappings, or key empirical constraints necessary for human-agent collaboration."
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 field-sizing-content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Sponsor / Scholar Name</label>
              <input
                type="text"
                value={creator}
                onChange={e => setCreator(e.target.value)}
                placeholder="Your Name / Institution"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Difficulty Vector</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white"
              >
                <option value="Hard">Hard (Solved in weeks)</option>
                <option value="Extreme">Extreme (Polymath-level)</option>
                <option value="Grand Challenge">Grand Challenge (Millennium-grade)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Global Impact Potential</label>
              <select
                value={impactFactor}
                onChange={e => setImpactFactor(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white"
              >
                <option value="Medium">Medium Utility</option>
                <option value="High">High Catalyst</option>
                <option value="Revolutionary">Revolutionary (Paradigm Shift)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Required Expertise (Comma separated)</label>
              <input
                type="text"
                value={requiredExpertise}
                onChange={e => setRequiredExpertise(e.target.value)}
                placeholder="Number Theory, FFT, GPU Kernels"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Publish Proposition & Initiate Onboarding
          </button>
        </form>
      )}

      {/* Co-op Registry Source Classification Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-slate-100/50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => handleTypeFilterChange('all')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition-all flex flex-col items-center justify-center border cursor-pointer select-none ${
            activeTypeFilter === 'all'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span className="uppercase text-[9px] tracking-wider mb-0.5">All Portfolios</span>
          <span className="text-sm font-sans font-extrabold">{problems.length}</span>
        </button>

        <button
          onClick={() => handleTypeFilterChange('institutional')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition-all flex flex-col items-center justify-center border cursor-pointer select-none ${
            activeTypeFilter === 'institutional'
              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50/50 dark:hover:bg-slate-800'
          }`}
        >
          <span className="uppercase text-[9px] tracking-wider mb-0.5">Vetted Institutional</span>
          <span className="text-sm font-sans font-extrabold">{problems.filter(p => !p.title.startsWith('[Scouted Reddit]') && !p.title.startsWith('[SME RFS]')).length}</span>
        </button>

        <button
          onClick={() => handleTypeFilterChange('sme')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition-all flex flex-col items-center justify-center border cursor-pointer select-none ${
            activeTypeFilter === 'sme'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50/50 dark:hover:bg-slate-800'
          }`}
        >
          <span className="uppercase text-[9px] tracking-wider mb-0.5">SME Operational</span>
          <span className="text-sm font-sans font-extrabold">{problems.filter(p => p.title.startsWith('[SME RFS]')).length}</span>
        </button>

        <button
          onClick={() => handleTypeFilterChange('reddit')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition-all flex flex-col items-center justify-center border cursor-pointer select-none ${
            activeTypeFilter === 'reddit'
              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-orange-50/50 dark:hover:bg-slate-800'
          }`}
        >
          <span className="uppercase text-[9px] tracking-wider mb-0.5">Reddit Scouts</span>
          <span className="text-sm font-sans font-extrabold">{problems.filter(p => p.title.startsWith('[Scouted Reddit]')).length}</span>
        </button>
      </div>

      {/* Filtering and search panel */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems, creators, or keywords..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto items-center overflow-x-auto pb-1 sm:pb-0">
          <Filter className="text-slate-400 w-4 h-4 shrink-0" />
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedDomain === dom 
                  ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900' 
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of problems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProblems.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No grand challenges align with current filters. Create one above!</p>
          </div>
        ) : (
          filteredProblems.map(prob => {
            const isActive = activeProblemId === prob.id;
            const alreadyVoted = prob.votesList ? prob.votesList.includes(currentUser) : false;
            
            return (
              <div 
                key={prob.id}
                id={`problem-card-${prob.id}`}
                className={`flex flex-col bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                  isActive 
                    ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 border-indigo-200 dark:border-indigo-900' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-md'
                }`}
              >
                {/* Visual Ribbon / Classification Header */}
                <div className="px-5 py-4 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-[10px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-bold uppercase text-[9px] text-indigo-600 dark:text-indigo-400 bg-indigo-55/60 dark:bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
                        {prob.domain}
                      </span>
                                           {(() => {
                        const lowercaseTitle = prob.title.toLowerCase();
                        const lowercaseCreator = prob.creator ? prob.creator.toLowerCase() : '';
                        let sourceTag = { name: 'Academic Nexus', className: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' };
                        
                        if (prob.title.startsWith('[Scouted Reddit]')) {
                          sourceTag = { name: 'Reddit Scout Option', className: 'bg-orange-50 dark:bg-orange-955/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/35' };
                        } else if (prob.title.startsWith('[SME RFS]')) {
                          sourceTag = { name: 'SME Operational Gap', className: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/35' };
                        } else if (lowercaseTitle.includes('darpa') || lowercaseCreator.includes('darpa')) {
                          sourceTag = { name: 'DARPA BAA', className: 'bg-blue-50 dark:bg-blue-950/35 text-blue-600 dark:text-blue-450 border-blue-100 dark:border-blue-900/30' };
                        } else if (lowercaseTitle.includes('nih') || lowercaseCreator.includes('nih')) {
                          sourceTag = { name: 'NIH SBIR', className: 'bg-cyan-50 dark:bg-cyan-950/35 text-cyan-600 dark:text-cyan-455 border-cyan-100 dark:border-cyan-900/30' };
                        } else if (lowercaseTitle.includes('horizon') || lowercaseCreator.includes('horizon') || lowercaseCreator.includes('european commission')) {
                          sourceTag = { name: 'Horizon Europe', className: 'bg-purple-50 dark:bg-purple-950/35 text-purple-600 dark:text-purple-455 border-purple-100 dark:border-purple-900/30' };
                        } else if (lowercaseTitle.includes('drdo') || lowercaseCreator.includes('drdo')) {
                          sourceTag = { name: 'DRDO RFP', className: 'bg-amber-50 dark:bg-amber-955/30 text-amber-600 dark:text-amber-450 border-amber-100 dark:border-amber-900/35' };
                        } else if (lowercaseTitle.includes('yc rfs') || lowercaseCreator.includes('yc request') || lowercaseCreator.includes('y combinator') || lowercaseTitle.includes('y combinator')) {
                          sourceTag = { name: 'YC Startup RFS', className: 'bg-orange-50 dark:bg-orange-955/30 text-orange-600 dark:text-orange-450 border-orange-100 dark:border-orange-900/35' };
                        } else if (lowercaseTitle.includes('venture') || lowercaseCreator.includes('venture') || lowercaseCreator.includes('founders fund')) {
                          sourceTag = { name: 'VC Deep Tech Seek', className: 'bg-rose-50 dark:bg-rose-955/30 text-rose-600 dark:text-rose-455 border-rose-100 dark:border-rose-900/35' };
                        }
                        
                        return (
                          <span className={`text-[9px] px-2 py-0.5 border rounded font-bold uppercase tracking-wide shrink-0 ${sourceTag.className}`}>
                            {sourceTag.name}
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="flex gap-1.5 items-center shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        prob.difficulty === 'Grand Challenge' 
                          ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400' 
                          : prob.difficulty === 'Extreme' 
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight mt-3">
                    {prob.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {prob.description}
                  </p>

                  {/* Required Competence Vectors */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {prob.requiredExpertise.map((exp, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-1 rounded border border-slate-150 dark:border-slate-800">
                        • {exp}
                      </span>
                    ))}
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>Proposed by: <strong className="text-slate-600 dark:text-slate-350">{prob.creator}</strong></span>
                    <span>{new Date(prob.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                </div>

                {/* Card Action footer bar */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between gap-4">
                  {/* Priority Vote Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVoteProblem(prob.id);
                    }}
                    className={`flex items-center gap-1.5 py-1 px-3.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      alreadyVoted
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <TrendingUp className={`w-3.5 h-3.5 ${alreadyVoted ? 'text-white' : 'text-indigo-500'}`} />
                    Priority: <span className="font-bold">{prob.priority}</span>
                  </button>

                  {/* Action workspace router button */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectProblem(prob.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-4 rounded-lg cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {isActive ? 'Current Workroom' : 'Enter Brainstorming'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
