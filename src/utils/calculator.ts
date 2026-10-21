import {
  CalculatorInputs,
  CalculationResults,
  PositivityBreakdown,
  MonthlyBreakdownItem,
  ProjectionYear,
  SkillRoadmapItem,
  IndustryBenchmark,
  UserPortfolio,
  FAQItem,
} from '../types';
import { generateCandlestickSeries } from './wealthPlanner';

/**
 * Pure function to calculate monthly & annual earnings, taxes, savings, cashflow, and positivity score.
 */
export function calculateEarnings(inputs: CalculatorInputs): CalculationResults {
  const weeks = Math.max(1, Math.min(52, inputs.weeksPerYear || 50));
  const hoursPerWeek = Math.max(0, inputs.hoursPerWeek || 0);
  const hourlyRate = Math.max(0, inputs.baseHourlyRate || 0);

  // 1. Primary Monthly Income based on model
  let primaryMonthly = 0;
  if (inputs.earningModel === 'salary') {
    primaryMonthly = Math.max(0, inputs.monthlySalary || 0);
  } else if (inputs.earningModel === 'hourly') {
    const annualHourly = hourlyRate * hoursPerWeek * weeks;
    primaryMonthly = annualHourly / 12;
  } else if (inputs.earningModel === 'freelance') {
    // Freelance billable hours + retainers
    const annualHourly = hourlyRate * hoursPerWeek * weeks;
    primaryMonthly = annualHourly / 12;
  } else {
    // Hybrid: salary + partial hourly rate
    primaryMonthly = Math.max(0, inputs.monthlySalary || 0) + (hourlyRate * hoursPerWeek * weeks) / 12;
  }

  // 2. Retainers
  const retainersMonthly = (inputs.retainerClients || []).reduce(
    (sum, client) => sum + Math.max(0, client.monthlyAmount || 0),
    0
  );

  // 3. Side gig and Passive
  const sideGigsMonthly = Math.max(0, inputs.sideGigMonthly || 0);
  const passiveMonthly = Math.max(0, inputs.passiveIncomeMonthly || 0);
  const bonusMonthly = Math.max(0, inputs.annualBonus || 0) / 12;

  // Total Gross
  const monthlyGross = primaryMonthly + retainersMonthly + sideGigsMonthly + passiveMonthly + bonusMonthly;
  const annualGross = monthlyGross * 12;

  // 4. Tax Calculation
  const taxRate = Math.max(0, Math.min(60, inputs.taxRatePercent || 0)) / 100;
  const monthlyTax = monthlyGross * taxRate;
  const monthlyNet = Math.max(0, monthlyGross - monthlyTax);
  const annualNet = monthlyNet * 12;

  // 5. Total hours worked per month for effective hourly rate
  const totalMonthlyHours = Math.max(1, (hoursPerWeek * weeks) / 12);
  const effectiveHourlyRate = totalMonthlyHours > 0 ? monthlyGross / totalMonthlyHours : 0;

  // 6. Expenses & Savings
  const monthlyExpenses = Math.max(0, inputs.monthlyExpenses || 0);
  const savingsPct = Math.max(0, Math.min(100, inputs.savingsTargetPercent || 0)) / 100;
  const monthlySavings = monthlyNet * savingsPct;
  const monthlyDiscretionary = Math.max(0, monthlyNet - monthlyExpenses - monthlySavings);

  // 7. Positivity Score Calculation
  const positivity = calculatePositivityScore({
    monthlyGross,
    monthlyNet,
    monthlyExpenses,
    monthlySavings,
    currentEmergencyFund: inputs.currentEmergencyFund || 0,
    hasSideGigs: sideGigsMonthly > 0 || passiveMonthly > 0,
    activeStreamCount:
      (primaryMonthly > 0 ? 1 : 0) +
      (inputs.retainerClients?.length || 0) +
      (sideGigsMonthly > 0 ? 1 : 0) +
      (passiveMonthly > 0 ? 1 : 0),
  });

  // 8. 12-Month Cashflow Series with realistic seasonality variations
  // Q1 ramp, mid-year stability, Q4 year-end retainer bonuses / seasonality
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const seasonalFactors = [
    0.95, 0.98, 1.02, 1.00, 1.01, 1.04,
    0.97, 0.96, 1.03, 1.05, 1.08, 1.11,
  ];

  const monthlyCashflowSeries: MonthlyBreakdownItem[] = monthNames.map((month, idx) => {
    const factor = seasonalFactors[idx];
    const monthGross = monthlyGross * factor;
    const monthTax = monthGross * taxRate;
    const monthNet = monthGross - monthTax;
    // slight holiday season uptick in Nov/Dec expenses
    const expenseFactor = idx >= 10 ? 1.08 : 1.0;
    const monthExp = monthlyExpenses * expenseFactor;
    const monthSav = Math.max(0, (monthNet - monthExp) * (savingsPct > 0 ? savingsPct : 0.2));

    return {
      month,
      gross: Math.round(monthGross),
      net: Math.round(monthNet),
      expenses: Math.round(monthExp),
      savings: Math.round(monthSav),
    };
  });

  // 9. 3-Year Growth Projections with conservative compound skill / rate expansion (12% YoY)
  const threeYearProjections: ProjectionYear[] = [
    {
      year: 1,
      gross: Math.round(annualGross),
      net: Math.round(annualNet),
      cumulativeSavings: Math.round(monthlySavings * 12 + (inputs.currentEmergencyFund || 0)),
    },
    {
      year: 2,
      gross: Math.round(annualGross * 1.15),
      net: Math.round(annualNet * 1.14),
      cumulativeSavings: Math.round(
        (inputs.currentEmergencyFund || 0) + monthlySavings * 12 + monthlySavings * 1.14 * 12
      ),
    },
    {
      year: 3,
      gross: Math.round(annualGross * 1.32),
      net: Math.round(annualNet * 1.30),
      cumulativeSavings: Math.round(
        (inputs.currentEmergencyFund || 0) +
          monthlySavings * 12 +
          monthlySavings * 1.14 * 12 +
          monthlySavings * 1.30 * 12
      ),
    },
  ];

  // 10. Technical Candlestick Series & Quantitative Stats for Trading Chart
  const { points: candlestickSeries, stats: tradingStats } = generateCandlestickSeries(monthlyGross, 24);

  return {
    monthlyGross: Math.round(monthlyGross),
    monthlyNet: Math.round(monthlyNet),
    annualGross: Math.round(annualGross),
    annualNet: Math.round(annualNet),
    monthlyTax: Math.round(monthlyTax),
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 10) / 10,
    monthlyExpenses: Math.round(monthlyExpenses),
    monthlySavings: Math.round(monthlySavings),
    monthlyDiscretionary: Math.round(monthlyDiscretionary),
    positivity,
    incomeStreamBreakdown: {
      primary: Math.round(primaryMonthly),
      retainers: Math.round(retainersMonthly),
      sideGigs: Math.round(sideGigsMonthly),
      passive: Math.round(passiveMonthly),
      bonusMonthly: Math.round(bonusMonthly),
    },
    monthlyCashflowSeries,
    threeYearProjections,
    candlestickSeries,
    tradingStats,
  };
}

/**
 * Computes financial positivity score (0-100) based on financial wellness fundamentals:
 * - Savings ratio (0-25 pts)
 * - Emergency Runway depth (0-25 pts)
 * - Income diversification (0-25 pts)
 * - Net discretionary buffer margin (0-25 pts)
 */
export function calculatePositivityScore(params: {
  monthlyGross: number;
  monthlyNet: number;
  monthlyExpenses: number;
  monthlySavings: number;
  currentEmergencyFund: number;
  hasSideGigs: boolean;
  activeStreamCount: number;
}): PositivityBreakdown {
  const {
    monthlyGross,
    monthlyNet,
    monthlyExpenses,
    monthlySavings,
    currentEmergencyFund,
    activeStreamCount,
  } = params;

  if (monthlyGross <= 0) {
    return {
      score: 0,
      tier: 'Critical',
      color: '#DC2626',
      savingsRatioScore: 0,
      runwayScore: 0,
      incomeDiversityScore: 0,
      discretionaryMarginScore: 0,
      runwayMonths: 0,
      actionableInsights: [
        'Establish your initial primary client or job to unlock earnings velocity.',
        'Review the Skills & Earn-While-Learn section to land your first paid micro-contract.',
      ],
    };
  }

  // 1. Savings Ratio Score (Target 20% - 30% of net)
  const savingsRatio = monthlyNet > 0 ? monthlySavings / monthlyNet : 0;
  let savingsRatioScore = 0;
  if (savingsRatio >= 0.3) savingsRatioScore = 25;
  else if (savingsRatio >= 0.2) savingsRatioScore = 20;
  else if (savingsRatio >= 0.1) savingsRatioScore = 14;
  else if (savingsRatio > 0) savingsRatioScore = 8;

  // 2. Runway Score (Emergency fund / monthly expenses)
  const safeExpenses = monthlyExpenses > 0 ? monthlyExpenses : 1000;
  const runwayMonths = Math.round((currentEmergencyFund / safeExpenses) * 10) / 10;
  let runwayScore = 0;
  if (runwayMonths >= 6) runwayScore = 25;
  else if (runwayMonths >= 4) runwayScore = 20;
  else if (runwayMonths >= 2) runwayScore = 14;
  else if (runwayMonths >= 1) runwayScore = 8;
  else runwayScore = 3;

  // 3. Income Diversity Score (Multiple income streams hedge volatility)
  let incomeDiversityScore = 0;
  if (activeStreamCount >= 4) incomeDiversityScore = 25;
  else if (activeStreamCount === 3) incomeDiversityScore = 21;
  else if (activeStreamCount === 2) incomeDiversityScore = 16;
  else incomeDiversityScore = 10; // Relying solely on 1 income source

  // 4. Discretionary Margin Score (Net minus expenses)
  const netSurplus = monthlyNet - monthlyExpenses;
  const marginRatio = monthlyNet > 0 ? netSurplus / monthlyNet : 0;
  let discretionaryMarginScore = 0;
  if (marginRatio >= 0.4) discretionaryMarginScore = 25;
  else if (marginRatio >= 0.25) discretionaryMarginScore = 19;
  else if (marginRatio >= 0.1) discretionaryMarginScore = 13;
  else if (marginRatio > 0) discretionaryMarginScore = 7;
  else discretionaryMarginScore = 0;

  const totalScore = Math.min(
    100,
    savingsRatioScore + runwayScore + incomeDiversityScore + discretionaryMarginScore
  );

  let tier: PositivityBreakdown['tier'] = 'Stable';
  let color = '#2563EB';

  if (totalScore >= 85) {
    tier = 'Wealth Velocity';
    color = '#16A34A';
  } else if (totalScore >= 70) {
    tier = 'Thriving';
    color = '#059669';
  } else if (totalScore >= 50) {
    tier = 'Stable';
    color = '#2563EB';
  } else if (totalScore >= 35) {
    tier = 'Cautious';
    color = '#D97706';
  } else {
    tier = 'Critical';
    color = '#DC2626';
  }

  // Generate tailored actionable insights
  const actionableInsights: string[] = [];

  if (activeStreamCount <= 1) {
    actionableInsights.push(
      'Single Point of Failure: 100% of income relies on 1 source. Add 1 retainer or freelance micro-gig to raise stability.'
    );
  } else {
    actionableInsights.push(
      `Strong Diversification: ${activeStreamCount} active cashflow streams provide resilient downside protection.`
    );
  }

  if (runwayMonths < 3) {
    actionableInsights.push(
      `Short Runway (${runwayMonths} mo): Prioritize building a 3-6 month liquid emergency buffer ($${Math.round(
        safeExpenses * 3
      ).toLocaleString()}).`
    );
  } else {
    actionableInsights.push(
      `Healthy Runway: ${runwayMonths} months of living reserves allows you to negotiate higher pricing with zero desperation.`
    );
  }

  if (savingsRatio < 0.2) {
    actionableInsights.push(
      `Savings Velocity: Currently saving ${(savingsRatio * 100).toFixed(0)}%. Bumping to 20% accelerates compounding significantly.`
    );
  } else {
    actionableInsights.push(
      `High Savings Power: Saving ${(savingsRatio * 100).toFixed(0)}% of net puts you in the top 15th percentile of cashflow compounders.`
    );
  }

  if (marginRatio < 0.15) {
    actionableInsights.push(
      'Tight Living Margin: Expenses consume >85% of net earnings. Consider raising hourly rates or renegotiating recurring fixed overhead.'
    );
  }

  return {
    score: totalScore,
    tier,
    color,
    savingsRatioScore,
    runwayScore,
    incomeDiversityScore,
    discretionaryMarginScore,
    runwayMonths,
    actionableInsights,
  };
}

/**
 * Currency Formatter
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  const rounded = Math.round(amount);
  return `${symbol}${rounded.toLocaleString()}`;
}

/**
 * Initial Default Calculator Inputs
 */
export const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
  earningModel: 'freelance',
  baseHourlyRate: 75,
  hoursPerWeek: 35,
  weeksPerYear: 48,
  monthlySalary: 6500,
  retainerClients: [
    { id: 'c1', name: 'Acme SaaS Corp', monthlyAmount: 2500, category: 'Retainer' },
    { id: 'c2', name: 'Horizon Media', monthlyAmount: 1400, category: 'Maintenance' },
  ],
  sideGigMonthly: 850,
  passiveIncomeMonthly: 300,
  monthlyExpenses: 4200,
  taxRatePercent: 24,
  savingsTargetPercent: 25,
  currentEmergencyFund: 18000,
  annualBonus: 4000,
};

/**
 * Curated High-Earning Skills with "Earn While You Learn" Roadmap
 */
export const HIGH_EARNING_SKILLS: SkillRoadmapItem[] = [
  {
    id: 'skill-ai-automation',
    title: 'AI Workflow & LLM Automation',
    category: 'AI & Data',
    difficulty: 'Intermediate',
    timeToFirstDollarWeeks: 3,
    entryHourlyRateUSD: 45,
    entryHourlyRateINR: 2000,
    proHourlyRateUSD: 150,
    proHourlyRateINR: 8500,
    monthlyPotentialMinINR: 85000,
    monthlyPotentialMaxINR: 450000,
    earnWhileLearnStrategy:
      'Build 3 practical Make.com/n8n/Gemini workflow automations for local businesses or friends for free, then charge ₹25,000 setup + ₹12,000/mo retainer to maintain.',
    beginnerMilestones: [
      'Master prompt engineering & structured JSON schemas',
      'Deploy 1 automated customer lead routing bot',
      'Connect vector search / RAG knowledge base for a small business',
    ],
    recommendedPlatforms: ['Upwork Pro', 'X/Twitter Inbound', 'Contra', 'Direct Cold Loom'],
    demandLevel: 'Surging',
  },
  {
    id: 'skill-fullstack-cloud',
    title: 'Full-Stack TypeScript & Cloud APIs',
    category: 'Engineering',
    difficulty: 'Intermediate',
    timeToFirstDollarWeeks: 6,
    entryHourlyRateUSD: 50,
    entryHourlyRateINR: 1800,
    proHourlyRateUSD: 135,
    proHourlyRateINR: 7500,
    monthlyPotentialMinINR: 75000,
    monthlyPotentialMaxINR: 380000,
    earnWhileLearnStrategy:
      'Create custom landing pages and interactive dashboards for indie hackers or pre-seed startups on Contra while studying database architecture.',
    beginnerMilestones: [
      'Build and deploy responsive React/Next.js web apps',
      'Integrate Postgres database schemas & authentication',
      'Optimize API routes with edge latency & rate limiting',
    ],
    recommendedPlatforms: ['Contra', 'Wellfound', 'GitHub Bounties', 'Freelancer'],
    demandLevel: 'Very High',
  },
  {
    id: 'skill-ui-ux-design',
    title: 'Product UI/UX & Design Systems',
    category: 'Design & Media',
    difficulty: 'Beginner',
    timeToFirstDollarWeeks: 4,
    entryHourlyRateUSD: 40,
    entryHourlyRateINR: 1400,
    proHourlyRateUSD: 110,
    proHourlyRateINR: 6000,
    monthlyPotentialMinINR: 60000,
    monthlyPotentialMaxINR: 300000,
    earnWhileLearnStrategy:
      'Redesign broken checkout funnels or onboarding screens of existing SaaS products and send quick video teardowns to the founders.',
    beginnerMilestones: [
      'Master auto-layout, tokens, and components in Figma',
      'Conduct 5 recorded usability audits',
      'Ship a cohesive design system component kit',
    ],
    recommendedPlatforms: ['Dribbble Pro', 'Contra', 'Upwork', 'Twitter/X'],
    demandLevel: 'High',
  },
  {
    id: 'skill-cloud-security',
    title: 'Cloud Security & DevOps Infra',
    category: 'Cloud & Security',
    difficulty: 'Advanced',
    timeToFirstDollarWeeks: 8,
    entryHourlyRateUSD: 70,
    entryHourlyRateINR: 2500,
    proHourlyRateUSD: 185,
    proHourlyRateINR: 10500,
    monthlyPotentialMinINR: 95000,
    monthlyPotentialMaxINR: 550000,
    earnWhileLearnStrategy:
      'Earn AWS/GCP cloud certifications and write clear implementation case studies. Offer cloud bill audits (save ₹50,000/mo for a ₹15,000 fee).',
    beginnerMilestones: [
      'Configure Docker containerized deployments with CI/CD',
      'Perform IAM least-privilege security hardening',
      'Set up CloudWatch/Prometheus anomaly monitoring',
    ],
    recommendedPlatforms: ['Toptal', 'Gun.io', 'Braintrust', 'Enterprise Contracts'],
    demandLevel: 'Surging',
  },
  {
    id: 'skill-growth-revops',
    title: 'B2B Growth & Revenue Operations',
    category: 'Growth & Marketing',
    difficulty: 'Intermediate',
    timeToFirstDollarWeeks: 3,
    entryHourlyRateUSD: 45,
    entryHourlyRateINR: 1600,
    proHourlyRateUSD: 125,
    proHourlyRateINR: 6800,
    monthlyPotentialMinINR: 65000,
    monthlyPotentialMaxINR: 350000,
    earnWhileLearnStrategy:
      'Set up cold email domains, deliverability monitoring, and CRM pipeline tracking for early B2B agencies on performance bonuses.',
    beginnerMilestones: [
      'Configure DKIM, SPF, and DMARC domain warming',
      'Write high-converting cold email sequences with personalized hooks',
      'Build automated HubSpot/Pipedrive deal syncs',
    ],
    recommendedPlatforms: ['LinkedIn Inbound', 'Cold Outreach', 'Agency Partnerships'],
    demandLevel: 'High',
  },
  {
    id: 'skill-tech-writing',
    title: 'Technical Writing & Developer Docs',
    category: 'Growth & Marketing',
    difficulty: 'Beginner',
    timeToFirstDollarWeeks: 2,
    entryHourlyRateUSD: 35,
    entryHourlyRateINR: 1200,
    proHourlyRateUSD: 95,
    proHourlyRateINR: 4800,
    monthlyPotentialMinINR: 45000,
    monthlyPotentialMaxINR: 220000,
    earnWhileLearnStrategy:
      'Write tutorials on newly launched open-source tools or SDKs and submit them to developer publications that pay $200-$500 per article.',
    beginnerMilestones: [
      'Publish 3 sample tutorials with working code repos',
      'Create step-by-step API integration quickstarts',
      'Write clear CHANGELOG and architectural decision records',
    ],
    recommendedPlatforms: ['Substack', 'Dev.to Sponsored', 'Draft.dev', 'Company Blogs'],
    demandLevel: 'High',
  },
];

/**
 * Top Earning Modern Industries with Real INR and USD Market Compensation
 */
export const BEST_EARNING_INDUSTRIES: IndustryBenchmark[] = [
  {
    id: 'ind-ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    sector: 'Deep Tech & Software',
    entryMonthlyINR: 85000,
    midMonthlyINR: 240000,
    seniorMonthlyINR: 650000,
    entryMonthlyUSD: 7500,
    midMonthlyUSD: 14000,
    seniorMonthlyUSD: 24000,
    projectedAnnualGrowth: 34,
    remoteFriendlyPct: 92,
    inDemandSpecializations: ['Agentic Workflows', 'Model Fine-tuning', 'Vector Databases & RAG', 'AI Orchestration'],
    briefOutlook:
      'Highest compensation growth worldwide. Indian AI specialists serving global enterprises command ₹30L–₹80L+ LPA easily, with top fractional roles crossing ₹1 Cr.',
  },
  {
    id: 'ind-fintech',
    name: 'FinTech & High-Frequency Systems',
    sector: 'Financial Technology',
    entryMonthlyINR: 80000,
    midMonthlyINR: 220000,
    seniorMonthlyINR: 580000,
    entryMonthlyUSD: 7000,
    midMonthlyUSD: 13000,
    seniorMonthlyUSD: 21500,
    projectedAnnualGrowth: 22,
    remoteFriendlyPct: 80,
    inDemandSpecializations: ['Payment Gateways', 'Low-Latency Pipes', 'Algorithmic Arbitrage', 'Cross-Border Settlements'],
    briefOutlook:
      'Extremely high cash compensation, retention bonuses, and equity upside. Zero tolerance for downtime makes reliable talent premium.',
  },
  {
    id: 'ind-cybersecurity',
    name: 'Cybersecurity & Cloud Defense',
    sector: 'Information Security',
    entryMonthlyINR: 75000,
    midMonthlyINR: 210000,
    seniorMonthlyINR: 520000,
    entryMonthlyUSD: 6500,
    midMonthlyUSD: 12000,
    seniorMonthlyUSD: 19500,
    projectedAnnualGrowth: 26,
    remoteFriendlyPct: 86,
    inDemandSpecializations: ['Zero Trust Architecture', 'Cloud Penetration Testing', 'Incident Response', 'SecOps Automation'],
    briefOutlook:
      'Completely recession-proof sector. High demand from enterprise banking, healthcare, and defence sectors globally.',
  },
  {
    id: 'ind-cloud-devops',
    name: 'Cloud Infrastructure & Site Reliability',
    sector: 'Cloud Services',
    entryMonthlyINR: 70000,
    midMonthlyINR: 195000,
    seniorMonthlyINR: 480000,
    entryMonthlyUSD: 6200,
    midMonthlyUSD: 11200,
    seniorMonthlyUSD: 18500,
    projectedAnnualGrowth: 20,
    remoteFriendlyPct: 95,
    inDemandSpecializations: ['Kubernetes Orchestration', 'Terraform/IaC', 'Multi-Cloud Resilience', 'FinOps Cloud Cost Slashing'],
    briefOutlook:
      'High remote flexibility and predictable recurring retainers. Companies eagerly pay top dollar to save multi-crore cloud billing leaks.',
  },
  {
    id: 'ind-digital-consulting',
    name: 'Specialized Productized Advisory & Fractional CTO',
    sector: 'Independent Professional',
    entryMonthlyINR: 65000,
    midMonthlyINR: 200000,
    seniorMonthlyINR: 550000,
    entryMonthlyUSD: 5500,
    midMonthlyUSD: 11000,
    seniorMonthlyUSD: 20000,
    projectedAnnualGrowth: 28,
    remoteFriendlyPct: 98,
    inDemandSpecializations: ['Product Strategy', 'Conversion Funnels', 'Technical Audits', 'Fractional Executive Leadership'],
    briefOutlook:
      'Unlimited upside potential through value-based pricing and monthly retainers. Maximum lifestyle autonomy from India for global clients in US/UK/EU.',
  },
  {
    id: 'ind-product-design',
    name: 'Design Engineering & UI/UX Systems',
    sector: 'Design & Software',
    entryMonthlyINR: 60000,
    midMonthlyINR: 175000,
    seniorMonthlyINR: 420000,
    entryMonthlyUSD: 5200,
    midMonthlyUSD: 10000,
    seniorMonthlyUSD: 17500,
    projectedAnnualGrowth: 21,
    remoteFriendlyPct: 94,
    inDemandSpecializations: ['Design Systems', 'Micro-interactions', 'Design-to-Code', 'Conversion Optimization'],
    briefOutlook:
      'Companies moving away from static mockups to interactive code-based design pay premium retainers for hybrid designers who code.',
  },
];

/**
 * Default User Portfolio Data
 */
export const DEFAULT_USER_PORTFOLIO: UserPortfolio = {
  id: 'portfolio-user-1',
  fullName: 'Arjun Patel',
  email: 'arjun.patel@prospercalc.io',
  headline: 'Senior Freelance AI Solutions Architect & Quant Consultant',
  phone: '+91 98201 45892',
  location: 'Bengaluru, India',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  role: 'freelancer',
  targetMonthlyGoal: 250000,
  targetRetirementAge: 42,
  monthlySavingsPercent: 35,
  emergencyFundMonths: 6,
  riskProfile: 'Barbell Strategy',
  currentCurrency: 'INR',
  subscriptionPlan: 'starter',
  isLoggedIn: true,
  streams: [
    {
      id: 'stream-1',
      title: 'Principal AI Automation Retainer (Nexus Tech)',
      category: 'Retainer',
      monthlyGross: 125000,
      status: 'active',
      notes: 'Weekly 10-hour advisory and workflow maintenance',
    },
    {
      id: 'stream-2',
      title: 'Fractional Cloud Architect (Horizon Labs)',
      category: 'Contract',
      monthlyGross: 85000,
      status: 'active',
      notes: 'Bi-weekly infrastructure sprints',
    },
    {
      id: 'stream-3',
      title: 'Weekend B2B Micro-Automations',
      category: 'Side Project',
      monthlyGross: 35000,
      status: 'growing',
      notes: 'Landing page performance optimizations',
    },
    {
      id: 'stream-4',
      title: 'Developer Template Royalties & Guides',
      category: 'Royalties/Digital',
      monthlyGross: 12000,
      status: 'active',
      notes: 'Gumroad & GitHub Sponsors passive stream',
    },
  ],
  milestones: [
    {
      id: 'm1',
      title: 'First ₹50,000 Client Retainer Signed',
      targetAmount: 50000,
      achieved: true,
      dateAchieved: '2025-06-15',
    },
    {
      id: 'm2',
      title: 'Cross ₹1,50,000/month Total Cashflow',
      targetAmount: 150000,
      achieved: true,
      dateAchieved: '2026-01-20',
    },
    {
      id: 'm3',
      title: 'Target: ₹2,50,000/month Freedom Velocity',
      targetAmount: 250000,
      achieved: true,
      dateAchieved: '2026-03-10',
    },
    {
      id: 'm4',
      title: 'Stretch Goal: ₹5,00,000/month Productized Agency Level',
      targetAmount: 500000,
      achieved: false,
    },
  ],
  paymentHistory: [
    {
      id: 'inv-101',
      date: '2026-02-01',
      planName: 'Starter Free Edition',
      amount: 0,
      currency: 'INR',
      paymentMethod: 'Complimentary Tier',
      status: 'Completed',
    },
  ],
};

/**
 * Comprehensive Financial & Career FAQs
 */
export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-wealth-1',
    category: 'Wealth Roadmap',
    question: 'How can a ₹2,000 INR ($25 USD) starter capital really compound into a ₹1 Crore+ net worth?',
    answer:
      'Starting from ₹2,000 INR is not about financial market investing on Day 1—it is about high-leverage skill capital. ₹800 goes to a professional domain and portfolio, and ₹1,200 goes to AI automation tokens. You land your first 3 micro-clients (₹15,000 each) within 60 days. Once your monthly cashflow reaches ₹1,50,000–₹2,50,000, automated monthly SIPs into Nifty 50/Midcap index funds compound rapidly over 3 to 7 years to reach multi-crore sovereignty.',
  },
  {
    id: 'faq-trading-charts',
    category: 'Calculations & Taxes',
    question: 'Why does ProsperCalc use TradingView-style candlestick and volatility charts for monthly earnings?',
    answer:
      'Freelancers and consultants run independent micro-enterprises. Treating your revenue like a traded equity ticker (with Open/High/Low/Close periods, 20-period moving averages, and volatility wicks) teaches you to view revenue fluctuations as normal market cycles, manage cash reserves during dips, and break out during high-volume contract expansions.',
  },
  {
    id: 'faq-1',
    category: 'Calculations & Taxes',
    question: 'How should I accurately estimate my tax withholding as an independent contractor or freelancer?',
    answer:
      'A reliable rule of thumb is setting aside 25% to 30% of every payment in a dedicated high-yield tax savings account before touching your operational budget. As an independent contractor in the US, you pay both employer and employee halves of FICA (Self-Employment Tax ~15.3%) plus federal and state income tax, though you can deduct qualified business expenses (software, home office, hardware depreciation) to lower adjusted gross income.',
  },
  {
    id: 'faq-2',
    category: 'Earn While Learning',
    question: 'How do I start earning money before I consider myself a "master" or expert in a skill?',
    answer:
      'Avoid waiting for complete mastery. Follow the "1-Chapter Ahead" rule: identify real micro-problems people with zero technical skills experience (e.g. automating a Google Sheet to send Slack notifications, or designing a clean single-page landing page). Offer a guaranteed risk-free trial or nominal $150-$300 fee. You learn by solving actual client constraints rather than passive video tutorials.',
  },
  {
    id: 'faq-3',
    category: 'Pricing & Rates',
    question: 'When and how should I raise my hourly rate or retainer prices?',
    answer:
      'Raise your rates when your calendar is at 80% capacity for 2 consecutive months. The easiest way to raise rates without risking existing revenue is applying new rates only to incoming new clients. For existing clients, give 30 days notice highlighting the tangible business outcomes and efficiency gains delivered over the past year.',
  },
  {
    id: 'faq-4',
    category: 'Financial Positivity',
    question: 'What is the "Earning Positivity Index" and why does it matter more than raw income?',
    answer:
      'Raw income alone is deceiving—someone earning $15,000/month while burning $14,500 with zero emergency savings is in extreme financial peril. ProsperCalc calculates your Earning Positivity Index by analyzing your savings retention velocity, emergency runway depth, cashflow diversification across multiple streams, and net discretionary margin.',
  },
  {
    id: 'faq-5',
    category: 'Pricing & Rates',
    question: 'What is the difference between hourly billing and monthly client retainers?',
    answer:
      'Hourly billing penalizes efficiency—as you get faster and more skilled, you earn less money for the same outcome. Monthly retainers decouple your income from raw clock hours, giving clients predictable expenses and guaranteed availability, while giving you recurring baseline revenue to plan your life.',
  },
  {
    id: 'faq-6',
    category: 'Industry Shifting',
    question: 'Which industries currently provide the highest return on investment for career pivoters?',
    answer:
      'AI & Machine Learning Workflow Engineering, Cloud Infrastructure (FinOps & Kubernetes), and Cybersecurity currently boast the highest compensation trajectories and remote-work acceptance rates. Even without a formal computer science degree, practical proficiency in agentic workflows and cloud integrations can command $90-$140/hr within 6 to 9 months of focused project-building.',
  },
  {
    id: 'faq-7',
    category: 'Calculations & Taxes',
    question: 'How many billable hours per week should a full-time freelancer realistically expect to log?',
    answer:
      'Full-time employment is 40 hours, but a healthy sustainable freelancing workload is 25 to 30 billable client hours per week. The remaining 10 to 15 hours are absorbed by non-billable administrative tasks: prospecting, client calls, proposals, invoicing, and continuous skill refinement. Factoring this into your base hourly rate is crucial.',
  },
  {
    id: 'faq-8',
    category: 'Financial Positivity',
    question: 'How much emergency fund runway should I hold before transitioning to full freelancing or contracting?',
    answer:
      'A safe benchmark is 6 months of mandatory baseline living expenses (rent/mortgage, groceries, healthcare, debt minimums). With 6 months of runway in a high-yield account, you will never accept low-ball client offers out of panic, dramatically improving your negotiating leverage and psychological well-being.',
  },
];
