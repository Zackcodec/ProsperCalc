export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rate * Currency
  isINR?: boolean;
}

export const CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 87.5, isINR: true },
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateToUSD: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.52 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToUSD: 1.35 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateToUSD: 3.67 },
];

export interface RetainerClient {
  id: string;
  name: string;
  monthlyAmount: number;
  category: 'Retainer' | 'Maintenance' | 'Advisory' | 'Production';
}

export interface CalculatorInputs {
  earningModel: 'hourly' | 'salary' | 'freelance' | 'hybrid';
  baseHourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  monthlySalary: number;
  retainerClients: RetainerClient[];
  sideGigMonthly: number;
  passiveIncomeMonthly: number;
  monthlyExpenses: number;
  taxRatePercent: number;
  savingsTargetPercent: number; // Target % of net income to save
  currentEmergencyFund: number;
  annualBonus: number;
}

export interface PositivityBreakdown {
  score: number; // 0 - 100
  tier: 'Critical' | 'Cautious' | 'Stable' | 'Thriving' | 'Wealth Velocity';
  color: string;
  savingsRatioScore: number;
  runwayScore: number;
  incomeDiversityScore: number;
  discretionaryMarginScore: number;
  runwayMonths: number;
  actionableInsights: string[];
}

export interface MonthlyBreakdownItem {
  month: string;
  gross: number;
  net: number;
  expenses: number;
  savings: number;
}

export interface ProjectionYear {
  year: number;
  gross: number;
  net: number;
  cumulativeSavings: number;
}

export interface CandlestickPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20: number;
  bbUpper?: number;
  bbLower?: number;
  rsi?: number;
  changePct: number;
}

export interface TradingStats {
  periodGainPct: number;
  bullishMonthsWinRatePct: number;
  maxDrawdownPct: number;
  profitFactor: number;
  sharpeRatio: number;
}

export interface CalculationResults {
  monthlyGross: number;
  monthlyNet: number;
  annualGross: number;
  annualNet: number;
  monthlyTax: number;
  effectiveHourlyRate: number;
  monthlyExpenses: number;
  monthlySavings: number;
  monthlyDiscretionary: number;
  positivity: PositivityBreakdown;
  incomeStreamBreakdown: {
    primary: number;
    retainers: number;
    sideGigs: number;
    passive: number;
    bonusMonthly: number;
  };
  monthlyCashflowSeries: MonthlyBreakdownItem[];
  threeYearProjections: ProjectionYear[];
  candlestickSeries: CandlestickPoint[];
  tradingStats: TradingStats;
}

export interface SkillRoadmapItem {
  id: string;
  title: string;
  category: 'AI & Data' | 'Engineering' | 'Design & Media' | 'Growth & Marketing' | 'Cloud & Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToFirstDollarWeeks: number;
  entryHourlyRateUSD: number;
  entryHourlyRateINR: number;
  proHourlyRateUSD: number;
  proHourlyRateINR: number;
  monthlyPotentialMinINR: number;
  monthlyPotentialMaxINR: number;
  earnWhileLearnStrategy: string;
  beginnerMilestones: string[];
  recommendedPlatforms: string[];
  demandLevel: 'High' | 'Very High' | 'Surging';
}

export interface IndustryBenchmark {
  id: string;
  name: string;
  sector: string;
  entryMonthlyINR: number;
  midMonthlyINR: number;
  seniorMonthlyINR: number;
  entryMonthlyUSD: number;
  midMonthlyUSD: number;
  seniorMonthlyUSD: number;
  projectedAnnualGrowth: number;
  remoteFriendlyPct: number;
  inDemandSpecializations: string[];
  briefOutlook: string;
}

export interface IncomeStreamItem {
  id: string;
  title: string;
  category: 'Full-time' | 'Contract' | 'Retainer' | 'Side Project' | 'Royalties/Digital';
  monthlyGross: number;
  status: 'active' | 'growing' | 'paused';
  notes?: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  headline: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  role?: 'freelancer' | 'founder' | 'student' | 'pro_trader' | 'consultant';
  joinedDate: string;
  subscriptionPlan: 'free' | 'starter' | 'pro' | 'accelerator';
  targetMonthlyGoal: number;
  monthlySavingsPercent: number;
  emergencyFundMonths: number;
  riskProfile: 'Conservative' | 'Balanced (14% CAGR)' | 'Aggressive Growth' | 'Barbell Strategy';
}

export interface UserPortfolio {
  id: string;
  fullName: string;
  email: string;
  headline: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  role?: string;
  targetMonthlyGoal: number;
  targetRetirementAge?: number;
  monthlySavingsPercent?: number;
  emergencyFundMonths?: number;
  riskProfile?: 'Conservative' | 'Balanced (14% CAGR)' | 'Aggressive Growth' | 'Barbell Strategy';
  currentCurrency: string;
  subscriptionPlan: 'free' | 'starter' | 'pro' | 'accelerator';
  planExpiryDate?: string;
  isLoggedIn?: boolean;
  streams: IncomeStreamItem[];
  milestones: Array<{
    id: string;
    title: string;
    targetAmount: number;
    achieved: boolean;
    dateAchieved?: string;
  }>;
  paymentHistory: Array<{
    id: string;
    date: string;
    planName: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: 'Completed' | 'Pending';
  }>;
}

export interface FAQItem {
  id: string;
  category: 'Calculations & Taxes' | 'Earn While Learning' | 'Pricing & Rates' | 'Financial Positivity' | 'Industry Shifting' | 'Wealth Roadmap';
  question: string;
  answer: string;
}

export interface LifeWealthPhase {
  phaseNumber: number;
  title: string;
  timeline: string;
  targetMonthlyCashflowINR: number;
  targetMonthlyCashflowUSD: number;
  milestoneNetWorthINR: number;
  milestoneNetWorthUSD: number;
  coreAction: string;
  whereToStartStep: string;
  howToEarnStep: string;
  whereToInvestStep: string;
  pitfallsToAvoid: string;
  actionChecklist: string[];
}

export interface AssetExchangeItem {
  id: string;
  name: string;
  category: 'Infrastructure' | 'AI Tools' | 'Legal/Contracts' | 'Investment' | 'Client Pipeline';
  costINR: number;
  description: string;
  returnOnInvestmentROI: string;
  urgencyPriority: 'Must-Have Day 1' | 'Month 1' | 'Ongoing Compounding';
}

export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface AchievementBadge {
  id: string;
  title: string;
  category: 'Savings & Compounding' | 'Revenue & Streams' | 'Financial Freedom' | 'Emergency & Risk' | 'Platform Master';
  description: string;
  criteria: string;
  rarity: BadgeRarity;
  xpPoints: number;
  iconName: string;
  unlocked: boolean;
  progressPct: number;
  progressLabel: string;
  unlockedDate?: string;
}

export interface PricingPlan {
  id: 'free' | 'starter' | 'pro' | 'accelerator';
  name: string;
  tagline: string;
  priceINR: number;
  priceUSD: number;
  billingCadence: 'Free Forever' | 'per month' | 'one-time starter access' | 'one-time lifetime access';
  badge?: string;
  features: string[];
  isPopular?: boolean;
}

