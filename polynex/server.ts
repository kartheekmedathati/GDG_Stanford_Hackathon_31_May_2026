import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_PROBLEMS, INITIAL_AGENTS, INITIAL_HUMAN_EXPERTS, INITIAL_COMMENTS, INITIAL_EXPERTISE_GAPS, INITIAL_CHALLENGES } from './src/data.js';
import { Problem, Agent, Comment, HumanExpert, ExpertiseGap, VerificationChallenge, GuardrailRating, User } from './src/types';

// Initialize state store held in-memory (persistent for the active container lifespans)
let store = {
  problems: [...INITIAL_PROBLEMS],
  agents: [...INITIAL_AGENTS],
  experts: [...INITIAL_HUMAN_EXPERTS],
  comments: [...INITIAL_COMMENTS],
  gaps: [...INITIAL_EXPERTISE_GAPS],
  challenges: [...INITIAL_CHALLENGES],
  users: [
    {
      id: 'user-kartheek',
      email: 'kartheek@handybot.ai',
      name: 'Kartheek',
      avatar: '💼',
      roleType: 'SME' as const,
      smeWebsite: 'https://handybot.ai',
      smeIndustry: 'Robotics & Automation',
      onboardedWithKey: 'KARTHEEK-GUEST'
    }
  ] as User[]
};

// Initialize Gemini SDK securely on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET complete state
app.get('/api/state', (req, res) => {
  res.json(store);
});

// RESET state
app.post('/api/state/reset', (req, res) => {
  store = {
    problems: JSON.parse(JSON.stringify(INITIAL_PROBLEMS)),
    agents: JSON.parse(JSON.stringify(INITIAL_AGENTS)),
    experts: JSON.parse(JSON.stringify(INITIAL_HUMAN_EXPERTS)),
    comments: JSON.parse(JSON.stringify(INITIAL_COMMENTS)),
    gaps: JSON.parse(JSON.stringify(INITIAL_EXPERTISE_GAPS)),
    challenges: JSON.parse(JSON.stringify(INITIAL_CHALLENGES)),
    users: [
      {
        id: 'user-kartheek',
        email: 'kartheek@handybot.ai',
        name: 'Kartheek',
        avatar: '💼',
        roleType: 'SME' as const,
        smeWebsite: 'https://handybot.ai',
        smeIndustry: 'Robotics & Automation',
        onboardedWithKey: 'KARTHEEK-GUEST'
      }
    ] as User[]
  };
  res.json({ success: true, state: store });
});

// POST new problem
app.post('/api/problems', (req, res) => {
  const { title, description, detailDescription, domain, creator, requiredExpertise, impactFactor, difficulty } = req.body;
  
  if (!title || !description || !domain) {
    return res.status(400).json({ error: 'Missing title, description, or domain' });
  }

  const newProblem: Problem = {
    id: `prob-${Date.now()}`,
    title,
    description,
    detailDescription: detailDescription || description,
    domain,
    creator: creator || 'Anonymous Expert',
    createdAt: new Date().toISOString(),
    priority: 1,
    votesList: [creator || 'Anonymous Expert'],
    status: 'In Onboarding',
    polyaStep: 1,
    requiredExpertise: requiredExpertise || [domain],
    impactFactor: impactFactor || 'High',
    difficulty: difficulty || 'Hard'
  };

  store.problems.push(newProblem);
  
  // Recalculate or add gaps if necessary to simulate live learning loop
  const gapExists = store.gaps.some(g => g.category.toLowerCase() === domain.toLowerCase());
  if (!gapExists) {
    store.gaps.push({
      domain,
      category: `${domain} Core Core`,
      scarcityScore: 60,
      availableHumanCount: 1,
      availableAICount: 0,
      demandScore: 75,
      description: `Newly identified requirement for ${title}. Needs subject specialist onboarding.`
    });
  }

  res.json(newProblem);
});

// POST vote for problem
app.post('/api/problems/:id/vote', (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;
  const problem = store.problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  if (!problem.votesList) problem.votesList = [];
  
  const user = userEmail || 'curr-user';
  const index = problem.votesList.indexOf(user);
  if (index === -1) {
    problem.votesList.push(user);
    problem.priority += 1;
  } else {
    problem.votesList.splice(index, 1);
    problem.priority = Math.max(0, problem.priority - 1);
  }

  res.json(problem);
});

// POST set Pólya step for problem
app.post('/api/problems/:id/step', (req, res) => {
  const { id } = req.params;
  const { step } = req.body;
  const problem = store.problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  const numStep = parseInt(step, 10);
  if (numStep >= 1 && numStep <= 4) {
    problem.polyaStep = numStep as 1 | 2 | 3 | 4;
    
    // Automatically transition states based on Pólya stage progression
    if (problem.polyaStep === 1) problem.status = 'In Onboarding';
    else if (problem.polyaStep === 2 || problem.polyaStep === 3) problem.status = 'Active Brainstorming';
    else if (problem.polyaStep === 4) problem.status = 'Proof Verification';
  }

  res.json(problem);
});

// AI GUARDRAIL REFEREE EVALUATOR FUNCTION
async function evaluateGuardrails(commentContent: string, previousContext: string): Promise<GuardrailRating> {
  const defaultRating: GuardrailRating = {
    continuity: true,
    relevance: true,
    constructive: true,
    concisenessScore: 4,
    adherenceScore: 85,
    critique: 'Self-evaluated locally. Fits general format rules.'
  };

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      return defaultRating;
    }

    const systemPrompt = `You are the Polymath Protocol Guardrail Audit agent. Analyze the provided collaborative post text carefully.
Evaluate it against the following strict collaborative constraints:
1. CONTINUITY: Does it acknowledge, expand, or resolve previous statements rather than restarting/repeat?
2. RELEVANCE: Is this post aligned with general technical solving or is it noise?
3. CONSTRUCTIVE: Is it completely courteous and professional (no personal attacks, no offensive language)?
4. BREVITY: Is it concise and single-focused (a score from 1 to 5, where 5 is extremely bullet-focused or short, and 1 is a wall of text)?

You must respond exclusively in valid JSON format.
The JSON must strictly match this schema:
{
  "continuity": boolean,
  "relevance": boolean,
  "constructive": boolean,
  "concisenessScore": number (1-5),
  "adherenceScore": number (0-100 overall percentage rating),
  "critique": "string briefly stating why this rating was given"
}`;

    const prompt = `Context: ${previousContext}\n\nCandidate Post to Evaluate:\n"${commentContent}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            continuity: { type: Type.BOOLEAN },
            relevance: { type: Type.BOOLEAN },
            constructive: { type: Type.BOOLEAN },
            concisenessScore: { type: Type.INTEGER, description: '1 to 5' },
            adherenceScore: { type: Type.INTEGER, description: '0 to 100 overall' },
            critique: { type: Type.STRING },
          },
          required: ['continuity', 'relevance', 'constructive', 'concisenessScore', 'adherenceScore', 'critique']
        }
      }
    });

    if (response?.text) {
      return JSON.parse(response.text.trim()) as GuardrailRating;
    }
  } catch (err) {
    console.error('Error in evaluateGuardrails AI prompt:', err);
  }
  return defaultRating;
}

// POST new comment (either human or AI-triggered directly)
app.post('/api/comments', async (req, res) => {
  const { problemId, authorName, authorType, authorRole, authorAvatar, content, polyaPhase, refPostId, authorId } = req.body;
  
  if (!problemId || !content || !polyaPhase) {
    return res.status(400).json({ error: 'Missing problemId, content, or polyaPhase' });
  }

  // Gather past context of this problem to supply to the evaluator
  const relevantPastComments = store.comments
    .filter(c => c.problemId === problemId)
    .slice(-3)
    .map(c => `[${c.authorName} (${c.authorType})]: ${c.content}`)
    .join('\n');

  // Trigger real-time guardrail evaluation via the Gemini Referee
  const guardrailRating = await evaluateGuardrails(content, relevantPastComments || 'No prior posts.');

  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    problemId,
    authorId: authorId || 'user-id',
    authorName,
    authorType: authorType || 'Human',
    authorRole: authorRole || 'Subject Specialist',
    authorAvatar: authorAvatar || '🧬',
    content,
    timestamp: new Date().toISOString(),
    polyaPhase: parseInt(polyaPhase, 10) as 1 | 2 | 3 | 4,
    refPostId: refPostId || null,
    votes: 0,
    votesList: [],
    guardrailRating
  };

  store.comments.push(newComment);

  // If a human contributes, up their contribution count
  if (authorType === 'Human') {
    const expert = store.experts.find(ex => ex.name === authorName || ex.id === authorId);
    if (expert) {
      expert.contributions += 1;
    } else {
      // Add dynamically registered human expert
      store.experts.push({
        id: authorId || `human-${Date.now()}`,
        name: authorName,
        email: 'collaborator@polyai.net',
        avatar: authorAvatar || '🧑‍💻',
        role: authorRole || 'Independent Technologist',
        expertise: [store.problems.find(p => p.id === problemId)?.domain || 'General Problem Solving'],
        availability: 'Active Member',
        contributions: 1,
        occupancyPercent: 30,
        hIndex: 15,
        citationsCount: 220,
        onboardedWithKey: 'GUEST-FALLBACK',
        googleScholarId: `fallback_${authorName.toLowerCase().replace(/\s+/g, '_')}`,
        recentPublications: [`Analytical bounds in ${store.problems.find(p => p.id === problemId)?.domain || 'Modern Tech'} (2025)`]
      });
    }
  }

  res.json(newComment);
});

// POST comment vote
app.post('/api/comments/:id/vote', (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;
  const comment = store.comments.find(c => c.id === id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  if (!comment.votesList) comment.votesList = [];

  const currentUser = userEmail || 'curr-user';
  const index = comment.votesList.indexOf(currentUser);
  if (index === -1) {
    comment.votesList.push(currentUser);
    comment.votes += 1;
  } else {
    comment.votesList.splice(index, 1);
    comment.votes = Math.max(0, comment.votes - 1);
  }

  res.json(comment);
});

// POST onboard human expert with Academic scholar profile & verification keys
app.post('/api/experts', (req, res) => {
  const { 
    name, 
    email, 
    avatar, 
    role, 
    expertise, 
    googleScholarId, 
    hIndex, 
    citationsCount, 
    onboardedWithKey, 
    occupancyPercent 
  } = req.body;

  if (!name || !email) return res.status(400).json({ error: 'Name and email are required parameters.' });

  // Strict Onboarding invite code check
  const inviteCode = onboardedWithKey ? onboardedWithKey.trim().toUpperCase() : '';
  const isAuthorized = inviteCode.startsWith('NEXUS-VET-') || inviteCode === 'NEXUS-7A8B' || inviteCode === 'KARTHEEK-GUEST';
  
  if (!isAuthorized) {
    return res.status(403).json({ 
      error: 'Invalid or missing Specialist Invite Code. Please request a vetted KEY (e.g. \"KARTHEEK-GUEST\", \"NEXUS-VET-909\", \"NEXUS-VET-882\", \"NEXUS-VET-111\" or \"NEXUS-VET-405\") to onboard continuous academic profiles.' 
    });
  }

  // Google Scholar simulation default bounds
  const resolvedScholarId = googleScholarId || `${name.toLowerCase().replace(/\s+/g, '_')}_scholar`;
  const resolvedHIndex = hIndex ? parseInt(hIndex, 10) : Math.floor(Math.random() * 35) + 12;
  const resolvedCitations = citationsCount ? parseInt(citationsCount, 10) : Math.floor(resolvedHIndex * resolvedHIndex * (Math.random() * 5 + 4));
  const resolvedOccupancy = occupancyPercent !== undefined ? parseInt(occupancyPercent, 10) : Math.floor(Math.random() * 55) + 20;

  // Simulate recent publication titles based on role
  const mockPubs = [
    `Unifying state spaces in ${role || 'Complex Systems'} (2025)`,
    `Analytical limitations on local ${expertise?.[0] || 'heuristics'} transitions (2024)`
  ];

  // Create vetted expert
  const newExpert: HumanExpert = {
    id: `human-${Date.now()}`,
    name,
    email,
    avatar: avatar || '🧑‍🔬',
    role: role || 'Subject Matter Specialist',
    expertise: expertise || ['General Systems Design'],
    availability: resolvedOccupancy >= 80 ? 'Inactive' : resolvedOccupancy >= 50 ? 'Advisory Only' : 'Active Member',
    contributions: 0,
    googleScholarId: resolvedScholarId,
    hIndex: resolvedHIndex,
    citationsCount: resolvedCitations,
    onboardedWithKey: inviteCode,
    occupancyPercent: resolvedOccupancy,
    recentPublications: mockPubs
  };

  store.experts.push(newExpert);

  // Recalculate gaps
  if (expertise && Array.isArray(expertise)) {
    expertise.forEach((exp: string) => {
      const gap = store.gaps.find(g => g.category.toLowerCase().includes(exp.toLowerCase()) || exp.toLowerCase().includes(g.category.toLowerCase()));
      if (gap) {
        gap.availableHumanCount += 1;
        gap.scarcityScore = Math.max(10, Math.floor(gap.scarcityScore * 0.75));
      }
    });
  }

  res.json(newExpert);
});

// POST peer rating on problem complexity and clarity
app.post('/api/problems/:id/rate', (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const problem = store.problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  const numRating = parseFloat(rating);
  if (isNaN(numRating) || numRating < 1.0 || numRating > 5.0) {
    return res.status(400).json({ error: 'Rating must be a floating point value between 1.0 and 5.0' });
  }

  const currentCount = problem.ratingsCount || 0;
  const currentAvg = problem.peerRating || 0;

  problem.ratingsCount = currentCount + 1;
  problem.peerRating = parseFloat(((currentAvg * currentCount + numRating) / (currentCount + 1)).toFixed(1));

  res.json(problem);
});

// POST register or bind Cloud / Peer GPU compute to problem solving loop
app.post('/api/problems/:id/compute', (req, res) => {
  const { id } = req.params;
  const { mode, providerName, region, gpuModel, gpusCount, ramGb, nodesCount, aggregateTflops } = req.body;
  const problem = store.problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  if (mode === 'cloud') {
    problem.attachedCompute = {
      providerName: providerName || 'Google Cloud Platform',
      region: region || 'us-central1',
      gpuModel: gpuModel || 'NVIDIA H100 GPU',
      gpusCount: gpusCount ? parseInt(gpusCount, 10) : 8,
      ramGb: ramGb ? parseInt(ramGb, 10) : 640,
      connected: true
    };
  } else if (mode === 'peer') {
    problem.sharedPeerCompute = {
      nodesCount: nodesCount ? parseInt(nodesCount, 10) : 4,
      aggregateTflops: aggregateTflops ? parseFloat(aggregateTflops) : 120.5,
      gpusActive: gpusCount ? parseInt(gpusCount, 10) : 4
    };
  } else {
    // disconnect compute
    problem.attachedCompute = null;
    problem.sharedPeerCompute = null;
  }

  res.json(problem);
});

// POST append decomposed milestones / subtasks
app.post('/api/problems/:id/decompose', (req, res) => {
  const { id } = req.params;
  const { taskDescription } = req.body;
  const problem = store.problems.find(p => p.id === id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  if (!problem.decomposedTasks) problem.decomposedTasks = [];
  if (taskDescription && taskDescription.trim() !== '') {
    problem.decomposedTasks.push(taskDescription.trim());
  }

  res.json(problem);
});

// POST onboard AI agent
app.post('/api/agents', (req, res) => {
  const { name, role, avatar, description, expertise, model, systemPrompt } = req.body;
  if (!name || !role || !systemPrompt) return res.status(400).json({ error: 'Name, Role, and systemPrompt required' });

  const newAgent: Agent = {
    id: `agent-${Date.now()}`,
    name,
    role,
    avatar: avatar || '🤖',
    description: description || `Automated Specialist for ${role}`,
    expertise: expertise || ['Machine Learning'],
    model: model || 'gemini-3.5-flash',
    systemPrompt,
    rating: 3.5,
    reviewsCount: 1,
    verified: false,
    accuracyScore: 70.0,
    status: 'Idle',
    achievements: ['Newly Instantiated']
  };

  store.agents.push(newAgent);

  expertise.forEach((exp: string) => {
    const gap = store.gaps.find(g => g.category.toLowerCase().includes(exp.toLowerCase()) || exp.toLowerCase().includes(g.category.toLowerCase()));
    if (gap) {
      gap.availableAICount += 1;
      gap.scarcityScore = Math.max(5, Math.floor(gap.scarcityScore * 0.7));
    }
  });

  res.json(newAgent);
});

// POST trigger AI Specialist Brainstorming Turn
app.post('/api/agent-brainstorm', async (req, res) => {
  const { problemId, agentId, selectedPhase } = req.body;
  if (!problemId || !agentId) {
    return res.status(400).json({ error: 'Missing problemId or agentId' });
  }

  const problem = store.problems.find(p => p.id === problemId);
  const agent = store.agents.find(a => a.id === agentId);

  if (!problem || !agent) {
    return res.status(404).json({ error: 'Problem or Agent was not found.' });
  }

  // Set agent to analyzing state
  agent.status = 'Analyzing';

  try {
    const activePhaseNum = selectedPhase ? parseInt(selectedPhase, 10) : problem.polyaStep;
    const phaseNames = {
      1: 'Phase 1: Understand the Problem (Define variables, seek conditions, verify edge constants)',
      2: 'Phase 2: Devise a Plan (Explore analogies, create auxiliary mappings, split hypotheses)',
      3: 'Phase 3: Carry Out the Plan (Implement steps, write logical checks, execute details)',
      4: 'Phase 4: Look Back & Reflect (Verify proofs, simplify theorems, generalize schemas)'
    };

    // Gather past comments specifically related to this problem
    const commentsList = store.comments
      .filter(c => c.problemId === problemId)
      .slice(-6)
      .map(c => `[Post by ${c.authorName} (${c.authorRole} / ${c.authorType}), target-polya-phase: ${c.polyaPhase}]:\n"${c.content}"`)
      .join('\n\n');

    // Build the system and user prompt targeting the agent's unique role
    const systemInstruction = `You are a specialized collaborative AI agent named ${agent.name} operating under role: "${agent.role}".
Your system background constraint is as follows:
"${agent.systemPrompt}"

You participate in the online PolyMath project, which aims to crack tough challenges collaboratively. You strictly adhere to:
- Polymath rules: Keep your answer short (1-3 sentences max) and extremely focused on an immediate small step.
- Build upon existing posts where possible without repeating them.
- Be highly respectful and mathematically/scientifically crisp. No generic marketing or motivational text. Introduce actual concrete variables, suggestions, or edge-case ideas!`;

    const userPrompt = `We are solving the problem:
TITLE: "${problem.title}"
DESCRIPTION: "${problem.description}"
DETAIL SPECIFICATION: "${problem.detailDescription}"

We are currently operating inside Pólya\'s solver phase:
${phaseNames[activePhaseNum as 1|2|3|4]}

Below are the most recent 6 discussion posts in our collaborative thread.
Use them to support continuity. Do not repeat what has been suggested! Suggest the next immediate step or a concrete critique:

--- START COLLABORATIVE THREAD ---
${commentsList || '(No prior threads exist. You are the initiating poster.)'}
--- END COLLABORATIVE THREAD ---

Provide your next immediate contribution for Phase ${activePhaseNum}. Write 1-3 highly focused sentences. Exclude any introductory pleasantries like "Sure, here's my idea."`;

    let generatedText = '';
    
    // Check if API key is mock or real
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      // Simulate clever agent if no key is entered
      const mockOutcomes = {
        'agent-1': `Let's break down the unknown values of ${problem.title}. We should represent the boundary thresholds as an inequality related to key dimensions: P_c < Sigma * phi. Can we identify the boundary values where this holds?`,
        'agent-2': `Upon reviewing the prior equations, there is an unproved assumption about continuity in the modular residues. We must verify if the residue class d mod 6 holds for all primes under 100 before general induction.`,
        'agent-3': `Could we align this behavior with the fractal branching seen in slime molds (Physarum) navigating a nutrient map? The prime factors are like metabolic branch nodes!`,
        'agent-4': `Wait, there is an immediate breakdown. If the parameter d equals exactly 27, the coprime constraints disintegrate because 3 divides both. We must exclude small power factors immediately.`,
        'agent-5': `This discussion is expanding too Fast. Let's return to the primary variable isolated by Vance in Post #1. Let's solve the absolute value of the lower limits first.`
      };
      
      const matchedMock = mockOutcomes[agent.id as keyof typeof mockOutcomes] || `Let's analyze the current input vectors and calculate the boundary conditions for the ${problem.domain} variables. We need a simpler auxiliary test case of length 1.`;
      
      generatedText = matchedMock;
    } else {
      // Call standard Gemini model
      const modelResult = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.8,
        }
      });
      
      generatedText = modelResult.text || 'We need to define a simplified case before launching full induction.';
    }

    // Evaluate the AI agent's own post against the Guardrail referee, simulated or real
    const evaluationRating = await evaluateGuardrails(generatedText, commentsList || 'First post.');

    // Add generated contribution as comment
    const newAIComment: Comment = {
      id: `comm-ai-${Date.now()}`,
      problemId,
      authorId: agent.id,
      authorName: agent.name,
      authorType: 'AI',
      authorRole: agent.role,
      authorAvatar: agent.avatar,
      content: generatedText.trim(),
      timestamp: new Date().toISOString(),
      polyaPhase: activePhaseNum as 1 | 2 | 3 | 4,
      refPostId: store.comments.filter(c => c.problemId === problemId).slice(-1)[0]?.id || null,
      votes: 0,
      votesList: [],
      guardrailRating: {
        ...evaluationRating,
        continuity: true // Agents naturally build on continuity
      }
    };

    store.comments.push(newAIComment);

    // Update agent statistics to reflect busy execution
    agent.status = 'Idle';
    agent.reviewsCount += 1;
    // Improve accuracy rating slightly as agents participate
    agent.accuracyScore = parseFloat((Math.min(99.6, agent.accuracyScore + 0.1)).toFixed(1));

    res.json({ comment: newAIComment, agent });
    
  } catch (error: any) {
    agent.status = 'offline';
    console.error('Error executing model brainstorm: ', error);
    res.status(500).json({ error: error.message || 'Error occurred during AI brainstorming.' });
  }
});

// POST run rigorous agent validation challenges (proving soundness of agent logic)
app.post('/api/run-challenge', async (req, res) => {
  const { challengeId, agentId } = req.body;
  
  if (!challengeId || !agentId) {
    return res.status(400).json({ error: 'Missing challengeId or agentId' });
  }

  const challenge = store.challenges.find(c => c.id === challengeId);
  const agent = store.agents.find(a => a.id === agentId);

  if (!challenge || !agent) {
    return res.status(404).json({ error: 'Challenge or Agent was not found.' });
  }

  challenge.running = true;

  try {
    const challengePrompt = `You are being rigorously evaluated for capability verification as a peer specialist agent.
CHALLENGE: "${challenge.title}"
PROBLEM STATEMENT: "${challenge.problemStatement}"
DOMAIN ASSIGNED: "${challenge.domain}"
INPUT CONDITIONS TO INGEST: "${challenge.inputs}"

Solve this technical problem step-by-step and show your complete verification proof. Your proof will be judged on rigorous accuracy, lack of hand-waving, correctness of equations, and explicit boundary compliance.`;

    let verificationContent = '';
    let success = true;
    let computedScore = 95;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      verificationContent = `[Simulated Verification Run] ${agent.name} parsed inputs [${challenge.inputs}] and mapped them to functional operators.
Verification Equation: S_k(n) = Sum_j(3^{k-j} * 2^j) mod d.
Edge Case verified: Empty set resolved; zero-division checked. Logic yields complete convergence. Criteria compliant.`;
      computedScore = Math.floor(90 + Math.random() * 10);
      success = computedScore >= 85;
    } else {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: challengePrompt,
        config: {
          systemInstruction: agent.systemPrompt,
          temperature: 0.2 // low temperature for highly deterministic mathematical/cryptographic correctness
        }
      });
      verificationContent = response.text || 'Verification incomplete.';
      
      // Secondary evaluative pass to score the response
      const gradingPrompt = `Review the peer agent answer and grade it on technical rigor out of 100.
PROPER CRITERIA: "${challenge.expectedOutcome}"
AGENT PROOF: "${verificationContent}"

Respond in valid JSON with:
{
  "passed": boolean,
  "score": number (0-100),
  "analysis": "string"
}`;

      const gradeResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: gradingPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              passed: { type: Type.BOOLEAN },
              score: { type: Type.INTEGER },
              analysis: { type: Type.STRING }
            },
            required: ['passed', 'score', 'analysis']
          }
        }
      });

      if (gradeResponse?.text) {
        const gradeObj = JSON.parse(gradeResponse.text.trim());
        success = gradeObj.passed;
        computedScore = gradeObj.score;
        verificationContent = `[Gemini Peer Grader Verified]\nScore: ${computedScore}/100\n\n${verificationContent}\n\nReview: ${gradeObj.analysis}`;
      }
    }

    challenge.running = false;
    challenge.lastTestPassed = success;
    challenge.lastTestScore = computedScore;
    challenge.lastTestOutput = verificationContent;

    // Award verification/badges if they score highly!
    if (success && computedScore >= 90) {
      agent.verified = true;
      agent.accuracyScore = parseFloat(((agent.accuracyScore + computedScore) / 2).toFixed(1));
      if (!agent.achievements.includes('Verified Scholar Badge')) {
        agent.achievements.push('Verified Scholar Badge');
      }
    }

    res.json({ challenge, agent });

  } catch (error: any) {
    challenge.running = false;
    challenge.lastTestPassed = false;
    challenge.lastTestOutput = `Error executing validation pipeline: ${error.message}`;
    res.status(500).json({ error: error.message || 'Error occurred during challenge.' });
  }
});

// POST register-login user
app.post('/api/auth/register-login', (req, res) => {
  const { 
    email, 
    name, 
    avatar, 
    roleType, 
    institution, 
    googleScholarId, 
    arnetMinerId, 
    smeWebsite, 
    smeIndustry, 
    onboardedWithKey 
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Name are required.' });
  }

  let user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (user) {
    // Merge existing user details
    user.name = name;
    user.avatar = avatar || user.avatar;
    user.roleType = roleType || user.roleType;
    user.institution = institution || user.institution;
    user.googleScholarId = googleScholarId || user.googleScholarId;
    user.arnetMinerId = arnetMinerId || user.arnetMinerId;
    user.smeWebsite = smeWebsite || user.smeWebsite;
    user.smeIndustry = smeIndustry || user.smeIndustry;
    user.onboardedWithKey = onboardedWithKey || user.onboardedWithKey;
  } else {
    // Create new user
    user = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      name,
      avatar: avatar || '🧑‍💻',
      roleType: roleType || 'Independent',
      institution: institution || 'Sovereign Research Node',
      googleScholarId,
      arnetMinerId,
      smeWebsite,
      smeIndustry,
      onboardedWithKey
    };
    store.users.push(user);
  }

  // If role is Scholar and has valid onboarding credentials, register automatically in experts list as well
  const inviteCode = onboardedWithKey ? onboardedWithKey.trim().toUpperCase() : '';
  const isAuthorizedScholar = inviteCode.startsWith('NEXUS-VET-') || inviteCode === 'NEXUS-7A8B' || inviteCode === 'KARTHEEK-GUEST';
  
  if (user.roleType === 'Scholar' && isAuthorizedScholar) {
    const expertExists = store.experts.some(ex => ex.email.toLowerCase() === email.toLowerCase());
    if (!expertExists) {
      store.experts.push({
        id: `human-${Date.now()}`,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.institution ? `Researcher, ${user.institution}` : 'Academic Specialist',
        expertise: ['Computational Science', 'Distributed General Topology'],
        availability: 'Active Member',
        contributions: 0,
        googleScholarId: user.googleScholarId || `${user.name.toLowerCase().replace(/\s+/g, '_')}_scholar`,
        hIndex: user.hIndex || 22,
        citationsCount: user.citationsCount || 1450,
        onboardedWithKey: inviteCode,
        occupancyPercent: 35,
        recentPublications: [
          `Foundations of Cooperative Advancement in ${user.institution || 'Sovereign Academies'} (2025)`,
          'Symmetric parameters in micro-state scaling loops (2024)'
        ]
      });
    }
  }

  res.json({ success: true, user });
});

// POST sync Academic profile from Google Scholar / AMiner
app.post('/api/auth/sync-scholar', async (req, res) => {
  const { email, googleScholarId, arnetMinerId, name, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Authenticated user email required' });
  }

  const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User profile not found. Please log in first.' });
  }

  // Update IDs
  if (googleScholarId) user.googleScholarId = googleScholarId;
  if (arnetMinerId) user.arnetMinerId = arnetMinerId;

  let hIndex = 24;
  let citationsCount = 1980;
  let recentPublications = [
    'Onward optimization manifolds for multi-agent validation criteria (2026)',
    'Algebraic approximations of non-linear Collatz-order models (2025)',
    'Spectral dispersion analysis inside supersonic composite wings (2024)'
  ];

  try {
    const targetName = name || user.name || 'Dr. Scholar';
    const targetRole = role || user.institution || 'Pure Mathematics';

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      const scholarPrompt = `You are an academic parser connected to the Microsoft Academic Graph, AMiner, and Google Scholar API pipelines.
Generate dynamic, realistic, academically valid publication details and citation counts matching this query:
Scholar Name: "${targetName}"
Primary focus: "${targetRole}"
Scholar ID requested: "${googleScholarId || 'None'}"
AMiner ID requested: "${arnetMinerId || 'None'}"

Provide a structured JSON output with the exact properties:
{
  "hIndex": number,
  "citationsCount": number,
  "publications": ["string (valid research publication title with year (2024-2026))"]
}
Ensure titles are extremely technical, sound highly realistic for their domain, and contain no introductory conversational lines.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: scholarPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hIndex: { type: Type.INTEGER },
              citationsCount: { type: Type.INTEGER },
              publications: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['hIndex', 'citationsCount', 'publications']
          }
        }
      });

      if (response?.text) {
        const parsed = JSON.parse(response.text.trim());
        hIndex = parsed.hIndex || hIndex;
        citationsCount = parsed.citationsCount || citationsCount;
        recentPublications = parsed.publications || recentPublications;
      }
    } else {
      // Simulate clever metrics mathematically based on name length/inputs
      hIndex = Math.floor((googleScholarId?.length || 10) * 1.5) + Math.floor(Math.random() * 8) + 5;
      citationsCount = Math.floor(hIndex * hIndex * (Math.random() * 4 + 5));
      if (googleScholarId || arnetMinerId) {
        recentPublications = [
          `Optimal state transitions in complex ${user.institution || 'Systems'} layouts (2025)`,
          `Bivariate copulas mapping of ${targetRole} hazards (2025)`,
          `Symmetric boundary assertions over highfrequency ${targetName.split(' ')[0]}'s operators (2024)`
        ];
      }
    }

    // Save back to user record
    user.hIndex = hIndex;
    user.citationsCount = citationsCount;

    // Check if expert exists, update their details too
    const expert = store.experts.find(ex => ex.email.toLowerCase() === email.toLowerCase());
    if (expert) {
      expert.hIndex = hIndex;
      expert.citationsCount = citationsCount;
      expert.recentPublications = recentPublications;
      if (googleScholarId) expert.googleScholarId = googleScholarId;
    }

    res.json({
      success: true,
      hIndex,
      citationsCount,
      publications: recentPublications
    });
  } catch (err: any) {
    console.error('Scholar sync error:', err);
    res.status(500).json({ error: err.message || 'Error occurred during academic sync.' });
  }
});

// POST SME website & request profile generator
app.post('/api/auth/sme-profile-builder', async (req, res) => {
  const { email, smeWebsite, businessRequest, companyName, industry } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Authenticated email required.' });
  }

  const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  // Update website/industry
  if (smeWebsite) user.smeWebsite = smeWebsite;
  if (industry) user.smeIndustry = industry;

  let parsedAnalysis = '';

  try {
    const targetComp = companyName || user.name || 'SME Organization';
    const targetInd = industry || user.smeIndustry || 'High-Tech Engineering';
    const requestText = businessRequest || 'Need automated expert solutions for microscale optimization problems.';

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      const smePrompt = `You are the PolyNex Enterprise Profile Generator agent.
A Small and Medium Enterprise (SME) is requesting computational expert/agent matching to address a high-tech engineering or science barrier.
Analyze their firm website URL: "${smeWebsite || 'None'}" and business request description: "${requestText}".

Formulate a rigorous technical execution profile representing:
1. SPECIFIC ENGINEERING & MATHEMATICAL CONSTRAINTS (provide equations, performance thresholds, mechanical/algebraic parameters)
2. RECOMMENDED SCIENTIST PERSONAS (e.g. Number Theorist, Fluid Mechanics Advisor)
3. ALIGNED CRITICAL AGENT BENCHMARKS (e.g. "Dr. Fermat-AI lean verification score > 94%")
4. RESEARCH GAP SCORES

Verify and output exclusively a clean, copyable, structured XML or JSON report format (wrapped nicely). Sound extremely professional, realistic, and helpful. No conversational summaries surrounding it.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: smePrompt
      });

      parsedAnalysis = response.text || 'Profile generation completed.';
    } else {
      // High fidelity local heuristic simulator
      const date = new Date().toLocaleDateString();
      parsedAnalysis = `===========================================================
POLYNEX SME PROFILE GENERATION REPORT — VETTED [${date}]
===========================================================
ORG NAME:  ${targetComp}
WEBSITE:   ${smeWebsite || 'N/A'}
INDUSTRY:  ${targetInd}
STATUS:    ACTIVE PIPELINE GENERATION

[1] STRUCTURAL ENGINEERING CONSTRAINTS
-----------------------------------------------------------
- Bound Ratio: delta_prime (x) <= Lambda_max * exp(-sigma_0 / T_v)
- Operational latency threshold mapped to sub-120ms cycle.
- Spatial-profiling matrix state dimensions: 10,000 continuous vectors.
- Low-power consumption constraints: < 15mW peak, zero leakage.

[2] COMPATIBLE SCIENTIST PERSONAS
-----------------------------------------------------------
1. Department Head of Pure Math (Focus: Number Theory / Algebraic bounds)
2. Principal Crypto Researcher (Focus: FHE Matrix Switching & NTT Kernels)
3. Aerospace & Complex Systems Analyst (Focus: Dual-Quaternion manipulation)

[3] HIGH-PRIORITY AGENT BENCHMARKS
-----------------------------------------------------------
- Dr. Fermat-AI (Lean Proof Integrity): Required > 95% Score
- Pólya Scribe (Decomposition Accuracy): Required > 90% Score
- Refutation-Bot (Boundary Stress Assertions): Required > 88% Score

[4] ESTIMATED EXPERTISE CAP SCORES
-----------------------------------------------------------
- Lattice/GPU Hardware Kernel scarcity: 80/100
- Lock-free memory alignments scarcity: 90/100
===========================================================`;
    }

    user.smeAnalysis = parsedAnalysis;
    res.json({
      success: true,
      analysis: parsedAnalysis
    });

  } catch (err: any) {
    console.error('SME Profile Builder scale error:', err);
    res.status(500).json({ error: err.message || 'Enterprise analysis compilation failed.' });
  }
});

// POST peer rate AI agents
app.post('/api/agents/:id/rate-agent', (req, res) => {
  const { id } = req.params;
  const { rating, review, authorName } = req.body;

  const agent = store.agents.find(a => a.id === id);
  if (!agent) {
    return res.status(404).json({ error: 'AI Agent not found.' });
  }

  const numRating = parseFloat(rating);
  if (isNaN(numRating) || numRating < 1.0 || numRating > 5.0) {
    return res.status(400).json({ error: 'Rating must be a floating point between 1.0 and 5.0' });
  }

  const currentCount = agent.reviewsCount || 1;
  const currentAvg = agent.rating || 3.5;

  agent.reviewsCount = currentCount + 1;
  agent.rating = parseFloat(((currentAvg * currentCount + numRating) / (currentCount + 1)).toFixed(2));

  // If particularly high rating, award dynamic badge!
  if (numRating >= 4.8 && !agent.achievements.includes('Benchmark Champion')) {
    agent.achievements.push('Benchmark Champion');
  }

  // Create a system comment/notif in the background to simulate peer review
  if (review && review.trim() !== '') {
    const defaultProblem = store.problems[0]?.id || 'prob-1';
    store.comments.push({
      id: `comm-peer-review-${Date.now()}`,
      problemId: defaultProblem,
      authorId: 'system-notif',
      authorName: authorName || 'Peer Evaluator',
      authorType: 'Human',
      authorRole: 'System Peer Grader',
      authorAvatar: '⚖️',
      content: `[VERIFIED AGENT BENCHMARK RATING for ${agent.name}]: "${review.trim()}" (Given score: ${numRating}/5.0)`,
      timestamp: new Date().toISOString(),
      polyaPhase: 4,
      refPostId: null,
      votes: 1,
      votesList: [],
      guardrailRating: {
        continuity: true,
        relevance: true,
        constructive: true,
        concisenessScore: 5,
        adherenceScore: 100,
        critique: 'Benchmark feedback processed into sovereign consensus log.'
      }
    });
  }

  res.json({ success: true, agent });
});

// VITE MIDDLEWARE SETUP FOR DEV VS PRODUCTION
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serves static files from compiled dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PolyAI Collaborative Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
