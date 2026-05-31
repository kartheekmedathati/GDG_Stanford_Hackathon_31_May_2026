import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProblemExplorer from './components/ProblemExplorer';
import CollaborativeWorkspace from './components/CollaborativeWorkspace';
import ExpertiseGapMap from './components/ExpertiseGapMap';
import AgentVerificationHub from './components/AgentVerificationHub';
import GuardrailManager from './components/GuardrailManager';
import PlatformLanding from './components/PlatformLanding';
import AcademicAuth from './components/AcademicAuth';
import Matchmaker from './components/Matchmaker';
import AgentBenchmarks from './components/AgentBenchmarks';
import { Problem, Agent, HumanExpert, Comment, ExpertiseGap, VerificationChallenge, User } from './types';
import { KeyRound, Sparkles, ServerCrash, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('welcome');
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [challengesFilter, setChallengesFilter] = useState<'all' | 'institutional' | 'sme' | 'reddit'>('all');
  
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved !== 'light'; // Defaults to dark mode for science hub aesthetics, customizable via switch
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  // App state
  const [problems, setProblems] = useState<Problem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [experts, setExperts] = useState<HumanExpert[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [gaps, setGaps] = useState<ExpertiseGap[]>([]);
  const [challenges, setChallenges] = useState<VerificationChallenge[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('kartheek@handybot.ai');
  
  // Real-time toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const triggerToast = (message: string, type: 'info' | 'success' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Flag to check if we've successfully loaded the initial state before
  const hasLoadedRef = React.useRef(false);

  // Sync state from server API
  const fetchState = async (retryCount = 0) => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Failed to retrieve system state.');
      const data = await res.json();
      
      setProblems(data.problems || []);
      setAgents(data.agents || []);
      setExperts(data.experts || []);
      setComments(data.comments || []);
      setGaps(data.gaps || []);
      setChallenges(data.challenges || []);
      setUsers(data.users || []);

      setErrorStatus(null);
      hasLoadedRef.current = true;

      // If activeProblemId is set but not present, clear it
      if (activeProblemId && !data.problems.some((p: Problem) => p.id === activeProblemId)) {
        setActiveProblemId(null);
      }
    } catch (err: any) {
      console.warn(`Fetch state failed (attempt ${retryCount + 1}):`, err);
      
      // If we already successfully loaded previously, do not interrupt the user with a giant error
      if (hasLoadedRef.current) {
        console.warn('Transient server syncing error. Continuing to display active cached state.');
        return;
      }

      // Auto-retry up to 3 times for initial load (with 2s delay) before showing full error
      if (retryCount < 3) {
        setTimeout(() => {
          fetchState(retryCount + 1);
        }, 1500);
      } else {
        setErrorStatus('The PolyAI Express API Server is currently loading. Please wait a moment while the server boots up.');
      }
    } finally {
      if (hasLoadedRef.current || retryCount >= 3) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchState();
    // Refresh periodically using arrow function to get latest updates
    const timer = setInterval(() => fetchState(), 15000);
    return () => clearInterval(timer);
  }, [activeProblemId]);

  // PROBLEM LEVEL MUTATIONS
  const handleSelectProblem = (id: string) => {
    setActiveProblemId(id);
    setCurrentTab('workspace');
    triggerToast('Workroom workspace loaded. Entering collaborative thread.', 'success');
  };

  const handleVoteProblem = async (id: string) => {
    try {
      const res = await fetch(`/api/problems/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentUser })
      });
      if (!res.ok) throw new Error('Upvoting problem failed.');
      await fetchState();
      triggerToast('Grand Challenge priority adjusted.', 'success');
    } catch (err) {
      triggerToast('Upvote priority syncing failed.', 'warn');
    }
  };

  const handleCreateProblem = async (problemData: any) => {
    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...problemData, creator: currentUser })
      });
      if (!res.ok) throw new Error('Problem publication failed.');
      await fetchState();
      triggerToast('New Grand Challenge successfully published to Registry.', 'success');
    } catch (err) {
      triggerToast('Problem creation failed.', 'warn');
    }
  };

  const handleAdvanceStep = async (step: number) => {
    if (!activeProblemId) return;
    try {
      const res = await fetch(`/api/problems/${activeProblemId}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step })
      });
      if (!res.ok) throw new Error('Setting Pólya step failed.');
      await fetchState();
      triggerToast(`Workflow advanced. Currently addressing Pólya Stage ${step}.`, 'success');
    } catch (err) {
      triggerToast('Setting workflow step failed.', 'warn');
    }
  };

  // COMMENT MUTATIONS
  const handleAddComment = async (commentData: any) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...commentData, authorId: currentUser })
      });
      if (!res.ok) throw new Error('Commenting failed.');
      await fetchState();
      triggerToast('Insight posted. compliance referee evaluation indexed.', 'success');
    } catch (err) {
      triggerToast('Post submission failed.', 'warn');
    }
  };

  const handleVoteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/comments/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentUser })
      });
      if (!res.ok) throw new Error('Upvoting comment failed.');
      await fetchState();
      triggerToast('Acknowledged discussion thought.', 'success');
    } catch (err) {
      triggerToast('Voting comment failed.', 'warn');
    }
  };

  // AGENT SPECIFIC SOLUTIONS
  const handleTriggerAgent = async (agentId: string, phase: number) => {
    if (!activeProblemId) return;
    try {
      const res = await fetch('/api/agent-brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: activeProblemId, agentId, selectedPhase: phase })
      });
      if (!res.ok) throw new Error('AI consultation session failed.');
      await fetchState();
      triggerToast(`${agents.find(a => a.id === agentId)?.name || 'Agent'} successfully contributed to the thread!`, 'success');
    } catch (err) {
      triggerToast('AI Agent reasoning turn failed.', 'warn');
    }
  };

  const handleRunChallenge = async (challengeId: string, agentId: string) => {
    try {
      const res = await fetch('/api/run-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, agentId })
      });
      if (!res.ok) throw new Error('Rigorous challenge run error.');
      await fetchState();
      const agentName = agents.find(a => a.id === agentId)?.name || 'Agent';
      triggerToast(`Rigorous evaluation completed for ${agentName}. Verification logged.`, 'success');
    } catch (err) {
      triggerToast('Rigor challenge execution failed.', 'warn');
    }
  };

  // ONBOARD EXPERT
  const handleOnboardExpert = async (expertData: any) => {
    try {
      const res = await fetch('/api/experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expertData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Onboarding human specialist failed.');
      }
      await fetchState();
      triggerToast('Expert registered. Academic profile appended to gaps database.', 'success');
      return { success: true };
    } catch (err: any) {
      triggerToast(err.message || 'Expert onboarding failed.', 'warn');
      return { success: false, error: err.message };
    }
  };

  // AGENT BENCHMARK EVALUATIONS
  const handleRateAgent = async (agentId: string, rating: number, review: string) => {
    try {
      const activeUser = users.find(u => u.email.toLowerCase() === currentUser.toLowerCase());
      const res = await fetch(`/api/agents/${agentId}/rate-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          review,
          authorName: activeUser ? activeUser.name : currentUser.split('@')[0]
        })
      });
      if (!res.ok) throw new Error('Rating agent failed.');
      await fetchState();
    } catch (err: any) {
      triggerToast(err.message || 'Appraisal logging errored.', 'warn');
      throw err;
    }
  };

  // CHANGE LOGIN STATE
  const handleLoginSuccess = (email: string, userDetails: any) => {
    setCurrentUser(email);
    fetchState(); // Fully refresh synced profiles
  };

  const handleLogout = () => {
    setCurrentUser('guest-' + Math.floor(Math.random() * 1000) + '@handybot.ai');
    triggerToast('Logged out of workspace profile.', 'info');
  };

  // SYSTEM RESET
  const handleReset = async () => {
    if (confirm('Rebuild solver database back to initial seeds? All temporary insights will be reset.')) {
      try {
        const res = await fetch('/api/state/reset', { method: 'POST' });
        if (!res.ok) throw new Error('State reset failed.');
        await fetchState();
        triggerToast('Solver database rebuilt successfully.', 'success');
      } catch (err) {
        triggerToast('Reset failed.', 'warn');
      }
    }
  };

  const activeProblem = problems.find(p => p.id === activeProblemId) || null;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] dark:bg-[#030509] font-sans text-slate-800 dark:text-slate-200 antialiased transition-colors duration-250 simulation-grid">
      
      {/* Top mounted Navbar */}
      <Navbar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        onReset={handleReset}
        currentUser={currentUser}
        activeProblemTitle={activeProblem ? activeProblem.title : null}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main viewport Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Toast Indicator */}
        {toast && (
          <div className="fixed top-6 right-6 z-55 max-w-xs bg-slate-900 border border-slate-850 text-white text-[11px] p-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Global Key status alert banner (Educational Context) */}
        <div className="bg-white/80 dark:bg-[#090d14]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-850/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm shadow-slate-100/50 dark:shadow-none">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/10">
              <KeyRound className="w-4.5 h-4.5" />
            </span>
            <div>
              <p className="text-xs font-bold font-display text-slate-900 dark:text-white leading-tight">Secure Server GenAI Routing Active</p>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                Models leverage local simulated reasoning heuristics. To test using native live Gemini endpoints, populate your <strong className="text-indigo-650 dark:text-indigo-300">GEMINI_API_KEY</strong> inside the **Settings {" > "} Secrets** panel.
              </p>
            </div>
          </div>
        </div>

        {/* API connection breakdown loader checks */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Retrieving PolyAI registries state...</p>
          </div>
        ) : errorStatus ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-rose-220 max-w-xl mx-auto space-y-4 shadow-sm animate-pulse">
            <ServerCrash className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-semibold text-sm text-slate-850 dark:text-white">API Sync Failure</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
              {errorStatus}
            </p>
            <button
              onClick={() => { setLoading(true); fetchState(); }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded transition-colors"
            >
              Retry Database Connection
            </button>
          </div>
        ) : (
          /* Workspaces Routing */
          <React.Fragment>
            {currentTab === 'welcome' && (
              <PlatformLanding 
                problems={problems}
                onImportProblem={handleCreateProblem}
                onNavigateToTab={(tab, filter) => {
                  setCurrentTab(tab);
                  if (filter) setChallengesFilter(filter);
                }}
                onSelectProblem={handleSelectProblem}
              />
            )}

            {currentTab === 'portal' && (
              <AcademicAuth 
                currentUserEmail={currentUser}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                usersList={users}
                triggerToast={triggerToast}
              />
            )}

            {currentTab === 'matchmaker' && (
              <Matchmaker 
                problems={problems}
                experts={experts}
                agents={agents}
                currentUserProfile={users.find(u => u.email.toLowerCase() === currentUser.toLowerCase()) || null}
                triggerToast={triggerToast}
              />
            )}

            {currentTab === 'benchboards' && (
              <AgentBenchmarks 
                agents={agents}
                onRateAgent={handleRateAgent}
                currentUserEmail={currentUser}
                triggerToast={triggerToast}
              />
            )}

            {currentTab === 'challenges' && (
              <ProblemExplorer 
                problems={problems}
                activeProblemId={activeProblemId}
                onSelectProblem={handleSelectProblem}
                onVoteProblem={handleVoteProblem}
                onCreateProblem={handleCreateProblem}
                currentUser={currentUser}
                initialFilter={challengesFilter}
                onFilterChange={setChallengesFilter}
              />
            )}

            {currentTab === 'workspace' && activeProblem && (
              <CollaborativeWorkspace 
                problem={activeProblem}
                agents={agents}
                comments={comments}
                onAddComment={handleAddComment}
                onVoteComment={handleVoteComment}
                onAdvanceStep={handleAdvanceStep}
                onTriggerAgent={handleTriggerAgent}
                onRefreshState={fetchState}
              />
            )}

            {currentTab === 'expertise' && (
              <ExpertiseGapMap 
                gaps={gaps}
                experts={experts}
                onOnboardExpert={handleOnboardExpert}
              />
            )}

            {currentTab === 'verifier' && (
              <AgentVerificationHub 
                agents={agents}
                challenges={challenges}
                onRunChallenge={handleRunChallenge}
              />
            )}

            {currentTab === 'guardrails' && (
              <GuardrailManager />
            )}
          </React.Fragment>
        )}

      </main>
    </div>
  );
}
