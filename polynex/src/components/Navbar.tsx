import React from 'react';
import { 
  Compass, Layers, Brain, ShieldAlert, ShieldCheck, 
  RotateCcw, Sparkles, Sun, Moon, HelpCircle,
  GraduationCap, GitCompare, Award
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onReset: () => void;
  currentUser: string;
  activeProblemTitle: string | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({
  currentTab,
  onSelectTab,
  onReset,
  currentUser,
  activeProblemTitle,
  darkMode,
  onToggleDarkMode
}: NavbarProps) {
  const menuItems = [
    { id: 'welcome', label: 'Welcome', icon: Sparkles, desc: 'Scout Hub' },
    { id: 'portal', label: 'Partner Portal', icon: GraduationCap, desc: 'Onboarding & Sync' },
    { id: 'matchmaker', label: 'Matchmaker', icon: GitCompare, desc: 'Expert/SME Math Alignment' },
    { id: 'benchboards', label: 'Agent Benchmarks', icon: Award, desc: 'Leaderboards & Ratings' },
    { id: 'challenges', label: 'Challenges', icon: Layers, desc: 'Registry' },
    { id: 'workspace', label: 'Workroom Focus', icon: Brain, desc: 'Active Workspace', disabled: !activeProblemTitle },
    { id: 'expertise', label: 'Expertise Gap Map', icon: ShieldAlert, desc: 'Specialist Directory' },
    { id: 'verifier', label: 'Agent Verifier', icon: ShieldCheck, desc: 'Verification' },
    { id: 'guardrails', label: 'Guidelines', icon: HelpCircle, desc: 'Symmetric Guide' }
  ];

  return (
    <header className="w-full bg-white/90 dark:bg-[#07090e]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-850/80 sticky top-0 z-50 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 lg:h-16 gap-3">
          
          {/* Logo Brand Header & Focus Indicators */}
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('welcome')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 border border-indigo-400/20 shrink-0">
                <Compass className="w-5 h-5 text-indigo-50 animate-pulse-slow" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-extrabold font-display text-slate-900 dark:text-white tracking-wider uppercase bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent">PolyNex</h1>
                </div>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium font-display tracking-wide leading-none">Cooperative Science Hub</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-850" />

            {/* Selected Focus Indicator - simplified design */}
            <div className="flex items-center">
              {activeProblemTitle ? (
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-400/20 px-3 py-1 rounded-full text-[10px] text-emerald-700 dark:text-emerald-400 font-medium font-mono flex items-center gap-1.5 max-w-[150px] sm:max-w-[200px] lg:max-w-[240px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="truncate">Focus: {activeProblemTitle}</span>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/80 px-2.5 py-1 rounded-full text-[10px] text-slate-405 dark:text-slate-500 font-mono italic">
                  Not Focused
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links Controls */}
          <nav className="flex items-center gap-1.5 overflow-x-auto scroller-hidden pb-1 lg:pb-0">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isCurrent = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => !item.disabled && onSelectTab(item.id)}
                  disabled={item.disabled}
                  title={item.desc}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    item.disabled 
                      ? 'opacity-25 cursor-not-allowed text-slate-400' 
                      : 'cursor-pointer'
                  } ${
                    isCurrent 
                      ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-500/20 font-bold shadow-sm shadow-indigo-500/5' 
                      : !item.disabled 
                      ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/45 dark:hover:text-white border border-transparent' 
                      : ''
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="font-display tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Extra tools: Theme Switcher & Reset database & User Avatar */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 lg:gap-3 border-t lg:border-t-0 border-slate-200 dark:border-slate-800 pt-3 lg:pt-0">
            
            {/* Database Rebuilder Trigger */}
            <button
              onClick={onReset}
              title="Reset Solver Database to original seed configurations"
              className="px-3 py-1.5 border border-rose-200 dark:border-rose-950/40 bg-white dark:bg-[#0c0e12] hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-300 dark:hover:border-rose-900/60 text-[10px] font-mono font-medium text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-1 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-3 h-3 text-rose-500 shrink-0" />
              <span>Rebuild DB</span>
            </button>

            {/* Dark/White Theme Toggler */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0e12] hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl text-slate-550 dark:text-slate-400 cursor-pointer transition-all shrink-0 hover:scale-[1.03]"
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              )}
            </button>

            {/* User credentials badge */}
            <div className="bg-slate-50 dark:bg-[#0c0e12] border border-slate-200 dark:border-slate-800/80 pl-2 px-3 py-1.5 rounded-xl flex items-center gap-2 max-w-[180px] shrink-0">
              <span className="text-sm shrink-0 select-none">👨‍🔬</span>
              <div className="overflow-hidden min-w-[70px]">
                <h5 className="text-[10px] font-bold font-display text-slate-800 dark:text-slate-350 truncate tracking-wide leading-none">{currentUser.split('@')[0]}</h5>
                <p className="text-[7.5px] font-mono text-emerald-600 dark:text-emerald-400 leading-none mt-0.5 uppercase tracking-wider font-semibold">Verified</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
