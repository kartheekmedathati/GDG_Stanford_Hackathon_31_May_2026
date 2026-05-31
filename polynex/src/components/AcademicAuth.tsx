import React, { useState } from 'react';
import { 
  User, KeyRound, CheckCircle, Sparkles, Building2, 
  Globe, BookOpen, GraduationCap, Cpu, UploadCloud, Copy, LogOut
} from 'lucide-react';
import { User as UserType } from '../types';

interface AcademicAuthProps {
  currentUserEmail: string | null;
  onLoginSuccess: (email: string, userDetails: any) => void;
  onLogout: () => void;
  usersList: UserType[];
  triggerToast: (msg: string, type?: 'success' | 'info' | 'warn') => void;
}

export default function AcademicAuth({
  currentUserEmail,
  onLoginSuccess,
  onLogout,
  usersList,
  triggerToast
}: AcademicAuthProps) {
  // Try to find if user is logged in
  const loggedInUser = usersList.find(u => u.email.toLowerCase() === currentUserEmail?.toLowerCase());

  const [activeTab, setActiveTab] = useState<'login' | 'register-scholar' | 'register-sme'>(currentUserEmail ? 'login' : 'login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  
  // Scholar Register form state
  const [scholarName, setScholarName] = useState('');
  const [scholarEmail, setScholarEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [googleScholarId, setGoogleScholarId] = useState('');
  const [arnetMinerId, setArnetMinerId] = useState('');
  const [specialistKey, setSpecialistKey] = useState('');

  // SME Register form state
  const [smeName, setSmeName] = useState('');
  const [smeEmail, setSmeEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [smeIndustry, setSmeIndustry] = useState('');
  const [smeWebsite, setSmeWebsite] = useState('');
  const [businessRequest, setBusinessRequest] = useState('');

  const [syncingAcademic, setSyncingAcademic] = useState(false);
  const [buildingProfile, setBuildingProfile] = useState(false);

  // Handle Simple Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      triggerToast('Please enter an email.', 'warn');
      return;
    }
    const matchedUser = usersList.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (matchedUser) {
      onLoginSuccess(matchedUser.email, matchedUser);
      triggerToast(`Welcome back, ${matchedUser.name}! Profile session loaded.`, 'success');
    } else {
      // Simulate guest session register if they don't exist
      const simulatedGuest = {
        name: loginEmail.split('@')[0],
        email: loginEmail,
        avatar: '🧬',
        roleType: 'Independent' as const,
        institution: 'Independent Research Node'
      };
      onLoginSuccess(loginEmail, simulatedGuest);
      triggerToast(`Guest session created for ${loginEmail}.`, 'info');
    }
  };

  // Handle Scholar Registry Onboarding
  const handleScholarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarEmail.trim() || !scholarName.trim()) {
      triggerToast('Name and Email are required.', 'warn');
      return;
    }

    try {
      const response = await fetch('/api/auth/register-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: scholarEmail.trim(),
          name: scholarName.trim(),
          roleType: 'Scholar',
          institution: institution.trim() || 'Sovereign Research Node',
          googleScholarId: googleScholarId.trim(),
          arnetMinerId: arnetMinerId.trim(),
          onboardedWithKey: specialistKey.trim() || 'GUEST-FALLBACK'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onLoginSuccess(scholarEmail.trim(), data.user);
      triggerToast(`Scholar onboarding successful for ${scholarName}! Registered in Specialist Index.`, 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Onboarding error.', 'warn');
    }
  };

  // Handle SME Register Onboarding
  const handleSmeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smeEmail.trim() || !companyName.trim() || !smeName.trim()) {
      triggerToast('Main parameters (Email, Company, Point of Contact) are required.', 'warn');
      return;
    }

    try {
      const response = await fetch('/api/auth/register-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: smeEmail.trim(),
          name: smeName.trim(),
          roleType: 'SME',
          institution: companyName.trim(),
          smeWebsite: smeWebsite.trim(),
          smeIndustry: smeIndustry.trim() || 'General Tech',
          onboardedWithKey: 'KARTHEEK-GUEST' // Pre-vetted guest access
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Onboarding failed');
      }

      onLoginSuccess(smeEmail.trim(), data.user);
      triggerToast(`Enterprise profile established for ${companyName}! Proceed to sync parameters.`, 'success');
    } catch (err: any) {
      triggerToast(err.message || 'SME Onboarding errored.', 'warn');
    }
  };

  // Trigger Scholar Publications & h-index Graph Parse
  const handleAcademicSync = async () => {
    if (!loggedInUser) return;
    setSyncingAcademic(true);
    try {
      const response = await fetch('/api/auth/sync-scholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loggedInUser.email,
          googleScholarId: googleScholarId || loggedInUser.googleScholarId,
          arnetMinerId: arnetMinerId || loggedInUser.arnetMinerId,
          name: loggedInUser.name,
          role: loggedInUser.institution
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Academic syncing errored.');

      onLoginSuccess(loggedInUser.email, {
        ...loggedInUser,
        ...data
      });

      triggerToast(`Synced with Academic Networks. H-index updated to ${data.hIndex}, citation count ${data.citationsCount}!`, 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Failed seeking Google Scholar network.', 'warn');
    } finally {
      setSyncingAcademic(false);
    }
  };

  // Trigger SME Website parsing analyzer tool
  const handleSmeParse = async () => {
    if (!loggedInUser) return;
    setBuildingProfile(true);
    try {
      const response = await fetch('/api/auth/sme-profile-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loggedInUser.email,
          smeWebsite: smeWebsite || loggedInUser.smeWebsite,
          businessRequest: businessRequest || 'Optimize real-time constraint solvers.',
          companyName: loggedInUser.institution,
          industry: loggedInUser.smeIndustry
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Profile building errored.');

      onLoginSuccess(loggedInUser.email, {
        ...loggedInUser,
        smeAnalysis: data.analysis
      });

      triggerToast('AI Analysis of website & requirements finished. Model constraints established!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'SME Profile generation failed.', 'warn');
    } finally {
      setBuildingProfile(false);
    }
  };

  // Copy Profile analysis to Clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast('Technical requirements profile copied to clipboard.', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in" id="academic-auth-module">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-200/20 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-400 bg-indigo-505/10 border border-indigo-500/20 rounded-full">
            <GraduationCap className="w-3.5 h-3.5" />
            Cooperative Onboarding
          </span>
          <h1 className="text-2xl lg:text-3.5xl font-display font-bold tracking-tight">
            Academic & Enterprise Portal
          </h1>
          <p className="text-slate-350 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Link dynamic researchers using **Google Scholar** and **AMiner/Microsoft Academic** profiles, or utilize the profile builder to parse **SME websites** and map high-tech requirements directly to expert cohorts.
          </p>
        </div>
      </div>

      {loggedInUser ? (
        /* LOGGED IN VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* USER STATEMENT (Left Column - Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="premium-card p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-teal-500"></div>
              
              <div className="flex items-center gap-4">
                <span className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-805 text-3xl flex items-center justify-center shrink-0">
                  {loggedInUser.avatar || '🧬'}
                </span>
                <div className="overflow-hidden space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display truncate">{loggedInUser.name}</h3>
                  <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">{loggedInUser.roleType} Partner</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{loggedInUser.email}</p>
                </div>
              </div>

              {/* Verified Badge / Specialist Credentials */}
              <div className="p-4 bg-slate-50 dark:bg-[#040609]/60 rounded-xl border border-slate-200/60 dark:border-slate-805/60 space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Institution Node:</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200 font-display">{loggedInUser.institution || 'Sovereign Node'}</span>
                </div>
                {loggedInUser.roleType === 'Scholar' && (
                  <>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Google Scholar Profile:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{loggedInUser.googleScholarId || 'Linked'}</span>
                    </div>
                    {loggedInUser.hIndex !== undefined && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                        <div className="text-center p-2 bg-white dark:bg-[#0a0f18] rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block">h-index</span>
                          <span className="text-lg font-bold text-teal-650 dark:text-teal-400">{loggedInUser.hIndex}</span>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-[#0a0f18] rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block">Citations</span>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{(loggedInUser.citationsCount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {loggedInUser.roleType === 'SME' && (
                  <>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Website URL:</span>
                      <a href={loggedInUser.smeWebsite} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 select-none">
                        <Globe className="w-3.5 h-3.5" />
                        Domain Website
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Business Sector:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-300">{loggedInUser.smeIndustry || 'Advanced Technology'}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Logout Session Profile
                </button>
              </div>
            </div>

            {/* Academic Social Search Info widget */}
            <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10 p-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold flex items-center gap-1 text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse-slow" />
                Network Co-alignment Guide
              </span>
              <p className="leading-relaxed">
                By linking your **Google Scholar** identifier or **AMiner (Microsoft Academic)** credentials, PolyNex automatically retrieves citation vectors and primary indexing scores, which it translates to custom competence ratings in the **Matchmaker** view.
              </p>
            </div>
          </div>

          {/* ACTIVE TOOLING (Right Column - Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {loggedInUser.roleType === 'Scholar' && (
              /* SCHOLAR TOOLING */
              <div className="premium-card p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Academic Graph Connector</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Connect and parse active indices from Microsoft AMiner, ArnetMiner academic graphs, and Google Scholar databases.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Google Scholar ID</label>
                      <input
                        type="text"
                        placeholder="eVance_Oxford_2026"
                        value={googleScholarId}
                        onChange={e => setGoogleScholarId(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">AMiner / ArnetMiner ID</label>
                      <input
                        type="text"
                        placeholder="aminer-10251"
                        value={arnetMinerId}
                        onChange={e => setArnetMinerId(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAcademicSync}
                    disabled={syncingAcademic}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <BookOpen className="w-4 h-4" />
                    {syncingAcademic ? 'Ingesting Academic Coordinates...' : 'Sync & Parse Research Profile'}
                  </button>
                </div>

                {loggedInUser.recentPublications && loggedInUser.recentPublications.length > 0 && (
                  <div className="border-t border-slate-200/60 dark:border-slate-850/60 pt-5 space-y-3">
                    <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">Parsed Research Publications</span>
                    <div className="space-y-2.5">
                      {loggedInUser.recentPublications.map((pub, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-[#03060a]/40 border border-slate-200/50 dark:border-slate-805/50 rounded-xl flex items-start gap-2.5 text-xs">
                          <CheckCircle className="w-4.5 h-4.5 text-teal-500 mt-0.5 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-350 leading-relaxed font-sans font-medium">{pub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {loggedInUser.roleType === 'SME' && (
              /* SME WEBSITE PARSING TOOLING */
              <div className="premium-card p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Automated SME Profile Builder</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Enter your organization website URL and a short description of your technical requirements. PolyNex will parse the content using Gemini to automatically draft critical constraints and benchmark thresholds.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Enterprise Website URL</label>
                    <input
                      type="url"
                      placeholder="https://handybot.ai"
                      value={smeWebsite}
                      onChange={e => setSmeWebsite(e.target.value)}
                      className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Technical Constraints / Project Request</label>
                    <textarea
                      placeholder="Summarize your engineering problem or research requirement (e.g., We need high frequency algorithms for multi-rotor swarms, mapping low-altitude drag, and ensuring low power boundaries.)"
                      value={businessRequest}
                      onChange={e => setBusinessRequest(e.target.value)}
                      rows={4}
                      className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50 resize-y leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleSmeParse}
                    disabled={buildingProfile}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Cpu className="w-4 h-4" />
                    {buildingProfile ? 'Synthesizing SME Engineering Matrix...' : 'Analyze & Generate SME Profile'}
                  </button>
                </div>

                {loggedInUser.smeAnalysis && (
                  <div className="border-t border-slate-200/60 dark:border-slate-850/60 pt-5 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">Generated SME Profile Specification</span>
                      <button
                        onClick={() => copyToClipboard(loggedInUser.smeAnalysis || '')}
                        className="text-xs text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-1 select-none cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Profile
                      </button>
                    </div>
                    {/* Visual terminal */}
                    <div className="bg-[#030509] border border-slate-850 rounded-2xl p-4 font-mono text-xs text-emerald-400 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                      {loggedInUser.smeAnalysis}
                    </div>
                  </div>
                )}
              </div>
            )}

            {loggedInUser.roleType === 'Independent' && (
              /* INDEPENDENT PARTNER TOOLING */
              <div className="premium-card p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Specialist Verification Console</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You have logged in with an Independent Specialist session profile. To link detailed **Google Scholar** publications, upgrade to an Academic Scholar profile, or register as an **SME Industry Partner** in the onboarding screens.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0a0f18] rounded-xl border border-slate-200/65 dark:border-slate-805 space-y-3">
                  <span className="text-xs font-semibold text-slate-850 dark:text-slate-350 block leading-tight">Fast Sandbox Capabilities</span>
                  <ul className="text-xs text-slate-550 dark:text-slate-400 list-disc list-inside space-y-1.5 leading-relaxed">
                    <li>Submit research contributions to Grand Challenges</li>
                    <li>Upvote priority thresholds inside the Challenges registry</li>
                    <li>Donate local workstation threads inside the Sovereign Thread Pool</li>
                    <li>Audit AI Agent interactions inside verification channels</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* REGISTER OR LOGIN FORMS */
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Form Tabs */}
          <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-850/50 flex w-full">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all select-none cursor-pointer ${activeTab === 'login' ? 'bg-white dark:bg-[#0e1420] text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-450 hover:text-slate-800'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register-scholar')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all select-none cursor-pointer ${activeTab === 'register-scholar' ? 'bg-white dark:bg-[#0e1420] text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-450 hover:text-slate-800'}`}
            >
              Onboard Scholar
            </button>
            <button
              onClick={() => setActiveTab('register-sme')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all select-none cursor-pointer ${activeTab === 'register-sme' ? 'bg-white dark:bg-[#0e1420] text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-450 hover:text-slate-800'}`}
            >
              Onboard SME Enterprise
            </button>
          </div>

          <div className="premium-card p-6 sm:p-8 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-650"></div>
            
            {activeTab === 'login' && (
              /* SIGN IN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Sign In to PolyNex</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Load your persistent specialist profile using your registered email.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Specialist email</label>
                    <input
                      type="email"
                      required
                      placeholder="evelyn.vance@oxford.edu"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Load Specialist Node
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'register-scholar' && (
              /* ONBOARD SCHOLAR FORM */
              <form onSubmit={handleScholarSubmit} className="space-y-4">
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Onboard Human Scholar</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Join the verified Specialist Directory with your research credentials.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Prof. Evelyn Vance"
                        value={scholarName}
                        onChange={e => setScholarName(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Scholar Email</label>
                      <input
                        type="email"
                        required
                        placeholder="evelyn.vance@oxford.edu"
                        value={scholarEmail}
                        onChange={e => setScholarEmail(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Primary Institution</label>
                    <input
                      type="text"
                      placeholder="Oxford University / Caltech"
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Google Scholar ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="eVance_Oxford_2026"
                        value={googleScholarId}
                        onChange={e => setGoogleScholarId(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">AMiner / Microsoft ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="aminer-10251"
                        value={arnetMinerId}
                        onChange={e => setArnetMinerId(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Specialist Invite Code</label>
                    <input
                      type="text"
                      placeholder="NEXUS-VET-909 or KARTHEEK-GUEST"
                      value={specialistKey}
                      onChange={e => setSpecialistKey(e.target.value)}
                      className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                    />
                    <p className="text-[9.5px] text-slate-400">
                      Vetted invitation code certifies expert integrity in the registry. Sandbox key fallback: <strong className="text-[#312e81] dark:text-indigo-405 font-mono">KARTHEEK-GUEST</strong>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
                  >
                    Onboard Specialist Node
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'register-sme' && (
              /* ONBOARD SME FORM */
              <form onSubmit={handleSmeSubmit} className="space-y-4">
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Onboard SME / Industry Partner</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Link your company details, analyze operations, and match resources.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Enterprise Name</label>
                      <input
                        type="text"
                        required
                        placeholder="HandyBot.ai"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Point of Contact Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Kartheek"
                        value={smeName}
                        onChange={e => setSmeName(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Main Contact Email</label>
                      <input
                        type="email"
                        required
                        placeholder="kartheek@handybot.ai"
                        value={smeEmail}
                        onChange={e => setSmeEmail(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Business Industry</label>
                      <input
                        type="text"
                        placeholder="Robotics / Green Tech"
                        value={smeIndustry}
                        onChange={e => setSmeIndustry(e.target.value)}
                        className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Company Website URL</label>
                    <input
                      type="url"
                      placeholder="https://handybot.ai"
                      value={smeWebsite}
                      onChange={e => setSmeWebsite(e.target.value)}
                      className="w-full bg-[#fafbfc] dark:bg-[#07090d] border border-slate-200 dark:border-slate-850 rounded-xl p-3 text-xs outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-550 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
                  >
                    Establish Enterprise Session
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
