export interface Problem {
  id: string;
  title: string;
  description: string;
  detailDescription: string;
  domain: string;
  creator: string;
  createdAt: string;
  priority: number; // Vote count
  votesList: string[]; // List of user emails/names who voted
  status: 'In Onboarding' | 'Active Brainstorming' | 'Proof Verification' | 'Concluded';
  polyaStep: 1 | 2 | 3 | 4; // 1: Understand, 2: Devise Plan, 3: Carry Out, 4: Look Back
  requiredExpertise: string[];
  impactFactor: 'Revolutionary' | 'High' | 'Medium';
  difficulty: 'Hard' | 'Extreme' | 'Grand Challenge';
  // Advanced features requested
  expertCountMetric?: number;
  peerRating?: number; // 0.0 to 5.0
  ratingsCount?: number;
  decomposedTasks?: string[]; // Milestone steps parsed dynamically
  attachedCompute?: {
    providerName: string;
    region: string;
    gpuModel: string;
    gpusCount: number;
    ramGb: number;
    connected: boolean;
  } | null;
  sharedPeerCompute?: {
    nodesCount: number;
    aggregateTflops: number;
    gpusActive: number;
  } | null;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  expertise: string[];
  model: string;
  systemPrompt: string;
  rating: number; // 1.0 to 5.0
  reviewsCount: number;
  verified: boolean;
  accuracyScore: number; // percentage
  status: 'Idle' | 'Analyzing' | 'Refuting' | 'offline';
  achievements: string[];
}

export interface HumanExpert {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  expertise: string[];
  availability: 'Active Member' | 'Advisory Only' | 'Inactive';
  contributions: number;
  // Rigorous Academic Vetting & Onboarding Requested
  googleScholarId?: string;
  hIndex?: number;
  citationsCount?: number;
  onboardedWithKey?: string;
  occupancyPercent: number; // 0 to 100 (e.g. 75 means 75% busy)
  recentPublications?: string[];
}

export interface GuardrailRating {
  continuity: boolean; // Does it build on existing thoughts without needless repetition?
  relevance: boolean;  // Is it focused on the current problem/phase?
  constructive: boolean; // Is it strictly peer-focused without personal attack?
  concisenessScore: number; // 1-5 (5 = extremely focused/short)
  adherenceScore: number; // 0 - 100
  critique: string; // Dynamic critique explanation
}

export interface Comment {
  id: string;
  problemId: string;
  authorId: string;
  authorName: string;
  authorType: 'Human' | 'AI';
  authorRole: string; // Specialist / Technologist / Math Rigorist, etc.
  authorAvatar: string;
  content: string;
  timestamp: string;
  polyaPhase: 1 | 2 | 3 | 4; // The step this comment targets
  refPostId: string | null;     // Built on post X
  votes: number;
  votesList: string[];
  guardrailRating: GuardrailRating | null;
}

export interface ExpertiseGap {
  domain: string;
  category: string;
  scarcityScore: number; // 0 to 100 (100 is most scarce)
  availableHumanCount: number;
  availableAICount: number;
  demandScore: number; // 0 to 100
  description: string;
}

export interface VerificationChallenge {
  id: string;
  title: string;
  problemStatement: string;
  domain: string;
  inputs: string;
  expectedOutcome: string;
  running: boolean;
  lastTestPassed: boolean | null;
  lastTestOutput: string;
  lastTestScore: number | null; // out of 100
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  roleType: 'Scholar' | 'SME' | 'Independent';
  institution?: string;
  googleScholarId?: string;
  arnetMinerId?: string; // AMiner / ArnetMiner
  hIndex?: number;
  citationsCount?: number;
  smeWebsite?: string;
  smeIndustry?: string;
  smeAnalysis?: string; // Store parsed SME constraints structure
  onboardedWithKey?: string;
  recentPublications?: string[];
}

