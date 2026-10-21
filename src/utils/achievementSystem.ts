import {
  AchievementBadge,
  UserPortfolio,
  CalculatorInputs,
  BadgeRarity,
} from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export const MASTERY_LEVELS: LevelInfo[] = [
  { level: 1, title: 'Novice Earner', minXp: 0, maxXp: 300 },
  { level: 2, title: 'Cashflow Builder', minXp: 300, maxXp: 750 },
  { level: 3, title: 'Sovereign Compounder', minXp: 750, maxXp: 1400 },
  { level: 4, title: 'Wealth Architect', minXp: 1400, maxXp: 2200 },
  { level: 5, title: 'Financial Titan', minXp: 2200, maxXp: 3500 },
];

export interface AchievementEvaluationResult {
  badges: AchievementBadge[];
  unlockedCount: number;
  totalCount: number;
  unlockedPct: number;
  totalXp: number;
  currentLevel: number;
  levelTitle: string;
  levelProgressPct: number;
  nextLevelXp: number;
}

/**
 * Pure evaluation function that calculates all visual badges based on user's portfolio and calculator inputs.
 */
export function evaluateAchievements(
  portfolio: UserPortfolio,
  inputs?: CalculatorInputs,
  storedUnlockDates: Record<string, string> = {}
): AchievementEvaluationResult {
  const activeStreams = portfolio.streams.filter((s) => s.status !== 'paused');
  const totalMonthlyInflow = activeStreams.reduce((sum, s) => sum + s.monthlyGross, 0);
  
  // Passive streams count (Side Project or Royalties/Digital)
  const passiveStreamCount = activeStreams.filter(
    (s) => s.category === 'Royalties/Digital' || s.category === 'Side Project'
  ).length;

  // Retainer count
  const retainerStreamCount = activeStreams.filter((s) => s.category === 'Retainer').length;

  // Savings percent (use portfolio setting or inputs)
  const savingsPercent =
    portfolio.monthlySavingsPercent !== undefined
      ? portfolio.monthlySavingsPercent
      : inputs
      ? inputs.savingsTargetPercent
      : 25;

  // Emergency buffer in months
  const emergencyMonths = portfolio.emergencyFundMonths !== undefined ? portfolio.emergencyFundMonths : 6;

  // Freedom goal progress %
  const goalProgressPct =
    portfolio.targetMonthlyGoal > 0
      ? (totalMonthlyInflow / portfolio.targetMonthlyGoal) * 100
      : 0;

  // Milestone manual checks
  const completedMilestoneCount = portfolio.milestones.filter((m) => m.achieved).length;

  // Definition of all achievements
  const badgeDefs: Array<{
    id: string;
    title: string;
    category: AchievementBadge['category'];
    description: string;
    criteria: string;
    rarity: BadgeRarity;
    xpPoints: number;
    iconName: string;
    isUnlocked: boolean;
    progressPct: number;
    progressLabel: string;
  }> = [
    {
      id: 'savings-guru-10',
      title: '10% Savings Guru',
      category: 'Savings & Compounding',
      description: 'Disciplined capital allocator saving at least 10% of monthly income.',
      criteria: 'Reach 10% or higher monthly savings rate',
      rarity: 'Common',
      xpPoints: 100,
      iconName: 'PiggyBank',
      isUnlocked: savingsPercent >= 10,
      progressPct: Math.min(100, (savingsPercent / 10) * 100),
      progressLabel: `${savingsPercent}% / 10% Target`,
    },
    {
      id: 'savings-quarter-25',
      title: 'Quarter Compounder',
      category: 'Savings & Compounding',
      description: 'Elite savings discipline channeling 25%+ of income into growth engines.',
      criteria: 'Reach 25% or higher monthly savings rate',
      rarity: 'Rare',
      xpPoints: 200,
      iconName: 'TrendingUp',
      isUnlocked: savingsPercent >= 25,
      progressPct: Math.min(100, (savingsPercent / 25) * 100),
      progressLabel: `${savingsPercent}% / 25% Target`,
    },
    {
      id: 'first-passive-stream',
      title: 'First Passive Income Stream',
      category: 'Revenue & Streams',
      description: 'Decoupled revenue from pure billable hours with scalable digital royalties.',
      criteria: 'Add 1 or more active Passive / Royalty or Digital streams',
      rarity: 'Rare',
      xpPoints: 250,
      iconName: 'Zap',
      isUnlocked: passiveStreamCount >= 1,
      progressPct: Math.min(100, (passiveStreamCount / 1) * 100),
      progressLabel: `${passiveStreamCount} / 1 Active Passive Stream`,
    },
    {
      id: 'retainer-titan',
      title: 'Retainer Titan',
      category: 'Revenue & Streams',
      description: 'Stabilized income floor with 2+ recurring monthly retainer contracts.',
      criteria: 'Secure 2 or more recurring monthly retainer clients',
      rarity: 'Epic',
      xpPoints: 300,
      iconName: 'ShieldCheck',
      isUnlocked: retainerStreamCount >= 2,
      progressPct: Math.min(100, (retainerStreamCount / 2) * 100),
      progressLabel: `${retainerStreamCount} / 2 Retainers Active`,
    },
    {
      id: 'multi-stream-maestro',
      title: 'Multi-Stream Maestro',
      category: 'Revenue & Streams',
      description: 'Built a resilient financial fortress across 3+ distinct income streams.',
      criteria: 'Run 3 or more simultaneous active revenue channels',
      rarity: 'Epic',
      xpPoints: 350,
      iconName: 'Layers',
      isUnlocked: activeStreams.length >= 3,
      progressPct: Math.min(100, (activeStreams.length / 3) * 100),
      progressLabel: `${activeStreams.length} / 3 Streams Active`,
    },
    {
      id: 'century-club',
      title: 'Century Club Cashflow',
      category: 'Financial Freedom',
      description: 'Crossed the six-figure monthly cashflow milestone (₹1,00,000+ or $1,200+/mo).',
      criteria: 'Generate ₹1,00,000 or $1,200+ in active monthly gross inflow',
      rarity: 'Common',
      xpPoints: 150,
      iconName: 'DollarSign',
      isUnlocked: totalMonthlyInflow >= (portfolio.currentCurrency === 'USD' ? 1200 : 100000),
      progressPct: Math.min(
        100,
        (totalMonthlyInflow / (portfolio.currentCurrency === 'USD' ? 1200 : 100000)) * 100
      ),
      progressLabel: `${Math.round(totalMonthlyInflow).toLocaleString()} Inflow`,
    },
    {
      id: 'freedom-velocity',
      title: 'Freedom Velocity',
      category: 'Financial Freedom',
      description: 'Achieved 50% or more of your primary monthly Financial Freedom goal.',
      criteria: 'Reach 50% of your target monthly income goal',
      rarity: 'Rare',
      xpPoints: 250,
      iconName: 'Compass',
      isUnlocked: goalProgressPct >= 50,
      progressPct: Math.min(100, (goalProgressPct / 50) * 100),
      progressLabel: `${goalProgressPct.toFixed(0)}% / 50% Goal`,
    },
    {
      id: 'crore-aspirant',
      title: '₹1 Crore Trajectory',
      category: 'Financial Freedom',
      description: 'Fully achieved 100% of your monthly freedom target velocity.',
      criteria: 'Achieve 100% of your primary financial freedom target',
      rarity: 'Legendary',
      xpPoints: 500,
      iconName: 'Crown',
      isUnlocked: goalProgressPct >= 100,
      progressPct: Math.min(100, goalProgressPct),
      progressLabel: `${goalProgressPct.toFixed(0)}% / 100% Goal`,
    },
    {
      id: 'emergency-fortress',
      title: 'Emergency Fortress',
      category: 'Emergency & Risk',
      description: 'Constructed an ironclad 6+ month living expense safety reserve.',
      criteria: 'Maintain 6 or more months of emergency runway buffer',
      rarity: 'Rare',
      xpPoints: 200,
      iconName: 'Shield',
      isUnlocked: emergencyMonths >= 6,
      progressPct: Math.min(100, (emergencyMonths / 6) * 100),
      progressLabel: `${emergencyMonths} / 6 Months Buffer`,
    },
    {
      id: 'barbell-strategist',
      title: 'Barbell Strategist',
      category: 'Emergency & Risk',
      description: 'Protected downside with safe cash while compounding asymmetric high-growth assets.',
      criteria: 'Adopt the Barbell Strategy allocation in your profile',
      rarity: 'Common',
      xpPoints: 100,
      iconName: 'Award',
      isUnlocked: portfolio.riskProfile === 'Barbell Strategy',
      progressPct: portfolio.riskProfile === 'Barbell Strategy' ? 100 : 0,
      progressLabel: portfolio.riskProfile === 'Barbell Strategy' ? 'Active' : 'Not Selected',
    },
    {
      id: 'milestone-crusher',
      title: 'Milestone Crusher',
      category: 'Platform Master',
      description: 'Consistently validated career wins by completing 3+ portfolio milestones.',
      criteria: 'Achieve 3 or more milestones in your career roadmap',
      rarity: 'Epic',
      xpPoints: 300,
      iconName: 'CheckCircle2',
      isUnlocked: completedMilestoneCount >= 3,
      progressPct: Math.min(100, (completedMilestoneCount / 3) * 100),
      progressLabel: `${completedMilestoneCount} / 3 Milestones Achieved`,
    },
    {
      id: 'starter-pioneer',
      title: '₹2,000 Blueprint Pioneer',
      category: 'Platform Master',
      description: 'Activated the ₹2,000 Starter Wealth Blueprint or Pro Edition tier.',
      criteria: 'Upgrade to Starter Wealth Blueprint, Pro Trader, or Accelerator',
      rarity: 'Legendary',
      xpPoints: 350,
      iconName: 'Sparkles',
      isUnlocked: portfolio.subscriptionPlan !== 'free',
      progressPct: portfolio.subscriptionPlan !== 'free' ? 100 : 0,
      progressLabel: portfolio.subscriptionPlan !== 'free' ? 'Plan Active' : 'Free Tier',
    },
  ];

  const badges: AchievementBadge[] = badgeDefs.map((b) => ({
    id: b.id,
    title: b.title,
    category: b.category,
    description: b.description,
    criteria: b.criteria,
    rarity: b.rarity,
    xpPoints: b.xpPoints,
    iconName: b.iconName,
    unlocked: b.isUnlocked,
    progressPct: Math.round(b.progressPct),
    progressLabel: b.progressLabel,
    unlockedDate: b.isUnlocked ? storedUnlockDates[b.id] || 'Verified' : undefined,
  }));

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const totalXp = unlockedBadges.reduce((sum, b) => sum + b.xpPoints, 0);

  // Compute Current Mastery Level
  let currentLevel = 1;
  let levelTitle = MASTERY_LEVELS[0].title;
  let nextLevelXp = MASTERY_LEVELS[0].maxXp;
  let levelProgressPct = 0;

  for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
    const lvl = MASTERY_LEVELS[i];
    if (totalXp >= lvl.minXp) {
      currentLevel = lvl.level;
      levelTitle = lvl.title;
      nextLevelXp = lvl.maxXp;
      const span = lvl.maxXp - lvl.minXp;
      const gained = totalXp - lvl.minXp;
      levelProgressPct = Math.min(100, Math.round((gained / span) * 100));
      break;
    }
  }

  return {
    badges,
    unlockedCount: unlockedBadges.length,
    totalCount: badges.length,
    unlockedPct: Math.round((unlockedBadges.length / badges.length) * 100),
    totalXp,
    currentLevel,
    levelTitle,
    levelProgressPct,
    nextLevelXp,
  };
}

/**
 * Checks if any badge was newly unlocked compared to a stored list of previously known unlocked badge IDs.
 */
export function detectNewlyUnlockedBadges(
  currentBadges: AchievementBadge[],
  previousUnlockedIds: string[]
): AchievementBadge[] {
  const prevSet = new Set(previousUnlockedIds);
  return currentBadges.filter((b) => b.unlocked && !prevSet.has(b.id));
}
