import React, { useState } from 'react';
import { UserPortfolio, IncomeStreamItem, Currency, AchievementBadge } from '../types';
import { formatCurrency, DEFAULT_USER_PORTFOLIO } from '../utils/calculator';
import {
  UserCheck,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  TrendingUp,
  Award,
  DollarSign,
  ShieldAlert,
  Users,
  Settings,
  Sliders,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { BadgesShowcaseSection } from './BadgesShowcaseSection';
import { AchievementEvaluationResult, evaluateAchievements } from '../utils/achievementSystem';

interface PortfolioSectionProps {
  portfolio: UserPortfolio;
  setPortfolio: React.Dispatch<React.SetStateAction<UserPortfolio>>;
  currency: Currency;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  adminMultiplier: number;
  setAdminMultiplier: (mult: number) => void;
  evaluation?: AchievementEvaluationResult;
  onOpenBadgeDetails?: (badge: AchievementBadge) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolio,
  setPortfolio,
  currency,
  isAdminMode,
  setIsAdminMode,
  adminMultiplier,
  setAdminMultiplier,
  evaluation,
  onOpenBadgeDetails,
}) => {
  const evaluatedData = evaluation || evaluateAchievements(portfolio);
  const [activePortfolioTab, setActivePortfolioTab] = useState<'streams' | 'milestones' | 'badges'>('streams');
  const [showAddStreamModal, setShowAddStreamModal] = useState(false);
  const [newStreamTitle, setNewStreamTitle] = useState('');
  const [newStreamCategory, setNewStreamCategory] = useState<IncomeStreamItem['category']>('Retainer');
  const [newStreamAmount, setNewStreamAmount] = useState<number>(2000);
  const [newStreamNotes, setNewStreamNotes] = useState('');

  // Calculate total monthly from active portfolio streams
  const totalMonthlyPortfolioGross = portfolio.streams
    .filter((s) => s.status !== 'paused')
    .reduce((sum, s) => sum + s.monthlyGross, 0);

  const goalProgressPct = Math.min(
    100,
    portfolio.targetMonthlyGoal > 0 ? (totalMonthlyPortfolioGross / portfolio.targetMonthlyGoal) * 100 : 0
  );

  const handleToggleMilestone = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === id
          ? {
              ...m,
              achieved: !m.achieved,
              dateAchieved: !m.achieved ? new Date().toISOString().split('T')[0] : undefined,
            }
          : m
      ),
    }));
  };

  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreamTitle) return;

    const newStream: IncomeStreamItem = {
      id: `stream-${Date.now()}`,
      title: newStreamTitle,
      category: newStreamCategory,
      monthlyGross: Math.max(0, newStreamAmount),
      status: 'active',
      notes: newStreamNotes || 'Client contract agreement',
    };

    setPortfolio((prev) => ({
      ...prev,
      streams: [newStream, ...prev.streams],
    }));

    setNewStreamTitle('');
    setNewStreamAmount(2000);
    setNewStreamNotes('');
    setShowAddStreamModal(false);
  };

  const handleDeleteStream = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      streams: prev.streams.filter((s) => s.id !== id),
    }));
  };

  const handleToggleStreamStatus = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      streams: prev.streams.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'active' ? 'paused' : 'active';
        return { ...s, status: nextStatus };
      }),
    }));
  };

  const handleQuickAddPassiveStream = () => {
    const passiveStream: IncomeStreamItem = {
      id: `stream-passive-${Date.now()}`,
      title: 'Digital Templates & AI Royalty Stream',
      category: 'Royalties/Digital',
      monthlyGross: 18000,
      status: 'active',
      notes: 'Scalable automated passive revenue channel',
    };
    setPortfolio((prev) => ({
      ...prev,
      streams: [passiveStream, ...prev.streams],
    }));
  };

  const handleQuickAddRetainer = () => {
    const retainerStream: IncomeStreamItem = {
      id: `stream-retainer-${Date.now()}`,
      title: 'Enterprise Cloud Retainer (Omni Systems)',
      category: 'Retainer',
      monthlyGross: 65000,
      status: 'active',
      notes: 'Monthly recurring contract securing predictable cashflow floor',
    };
    setPortfolio((prev) => ({
      ...prev,
      streams: [retainerStream, ...prev.streams],
    }));
  };

  const handleQuickBoostSavings = (targetPct: number = 10) => {
    setPortfolio((prev) => ({
      ...prev,
      monthlySavingsPercent: targetPct,
    }));
  };

  // Simulated multi-user team cohort for Admin view
  const simulatedCohort = [
    {
      name: portfolio.fullName,
      role: portfolio.headline,
      monthly: totalMonthlyPortfolioGross,
      positivity: 88,
      streamsCount: portfolio.streams.length,
      status: 'Verified High Performer',
    },
    {
      name: 'Elena Rostova',
      role: 'Staff ML Engineer & AI Automation',
      monthly: 14200,
      positivity: 92,
      streamsCount: 3,
      status: 'Top 5% Cohort',
    },
    {
      name: 'Marcus Chen',
      role: 'Cloud Architect & DevSecOps Lead',
      monthly: 11500,
      positivity: 84,
      streamsCount: 2,
      status: 'Stable Retainers',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Fractional Head of Growth & RevOps',
      monthly: 9800,
      positivity: 78,
      streamsCount: 4,
      status: 'Active Expansion',
    },
    {
      name: 'Devon Miller',
      role: 'Full-Stack TypeScript Contractor',
      monthly: 6200,
      positivity: 68,
      streamsCount: 2,
      status: 'Ramping Up',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Bar Switcher between User Portfolio & Admin Console */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isAdminMode ? 'Enterprise Admin & Benchmark Console' : 'Personal Earning Portfolio'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdminMode
              ? 'Global market calibration, cohort performance analytics, and system configurations'
              : 'Track multiple revenue streams, monthly cashflow goals, and milestone achievements'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setIsAdminMode(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              !isAdminMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Portfolio
          </button>
          <button
            onClick={() => setIsAdminMode(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              isAdminMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Console
          </button>
        </div>
      </div>

      {/* USER PORTFOLIO VIEW */}
      {!isAdminMode ? (
        <div className="space-y-6">
          {/* User Profile Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* User Identity info with clean CSS badge avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-sm">
                  {portfolio.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{portfolio.fullName}</h3>
                  <p className="text-xs text-slate-500">{portfolio.headline}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>Active Inflow:</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">
                      {formatCurrency(totalMonthlyPortfolioGross, currency.symbol)}/mo
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{portfolio.streams.length} distinct streams</span>
                  </div>

                  {/* Top Unlocked Achievement Rewards Preview */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rewards:</span>
                    {evaluatedData.badges
                      .filter((b) => b.unlocked)
                      .slice(0, 3)
                      .map((badge) => (
                        <button
                          key={badge.id}
                          onClick={() => {
                            if (onOpenBadgeDetails) {
                              onOpenBadgeDetails(badge);
                            } else {
                              setActivePortfolioTab('badges');
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer shadow-2xs"
                          title={`Click to view ${badge.title} badge`}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          <span>{badge.title}</span>
                        </button>
                      ))}
                    <button
                      onClick={() => setActivePortfolioTab('badges')}
                      className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer ml-0.5"
                    >
                      {evaluatedData.unlockedCount > 3
                        ? `+${evaluatedData.unlockedCount - 3} more`
                        : 'View Badges →'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Goal Progress Target */}
              <div className="min-w-[260px] p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Monthly Goal Target</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(portfolio.targetMonthlyGoal, currency.symbol)}/mo
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${goalProgressPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>{goalProgressPct.toFixed(0)}% achieved</span>
                  <span>
                    {formatCurrency(
                      Math.max(0, portfolio.targetMonthlyGoal - totalMonthlyPortfolioGross),
                      currency.symbol
                    )}{' '}
                    to goal
                  </span>
                </div>
              </div>
            </div>

            {/* Badges & Mastery Ribbon */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">
                    Mastery Rank: Lvl {evaluatedData.currentLevel} ({evaluatedData.levelTitle})
                  </span>
                  <span className="text-slate-500 block text-[11px]">
                    {evaluatedData.unlockedCount} of {evaluatedData.totalCount} Badges Unlocked · {evaluatedData.totalXp} Total XP
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActivePortfolioTab('badges')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Explore Badges & Visual Rewards</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Streams vs Milestones vs Badges (Responsive labels & scrollable) */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar touch-pan-x">
            <button
              onClick={() => setActivePortfolioTab('streams')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activePortfolioTab === 'streams'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>
                <span className="hidden sm:inline">Revenue Streams</span>
                <span className="sm:hidden">Streams</span> ({portfolio.streams.length})
              </span>
            </button>

            <button
              onClick={() => setActivePortfolioTab('milestones')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activePortfolioTab === 'milestones'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Milestones ({portfolio.milestones.filter((m) => m.achieved).length}/{portfolio.milestones.length})</span>
            </button>

            <button
              onClick={() => setActivePortfolioTab('badges')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                activePortfolioTab === 'badges'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-xs'
                  : 'text-amber-700 bg-amber-50/80 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <span>
                <span className="hidden sm:inline">Badges & Achievements</span>
                <span className="sm:hidden">Badges</span> 🏆 ({evaluatedData.unlockedCount}/{evaluatedData.totalCount})
              </span>
            </button>
          </div>

          {/* TAB 1: Active Revenue Streams */}
          {activePortfolioTab === 'streams' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Monthly Income Streams</h3>
                <p className="text-xs text-slate-500">
                  Individual contracts, retainers, and productized royalties
                </p>
              </div>
              <button
                onClick={() => setShowAddStreamModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stream</span>
              </button>
            </div>

            {/* Quick Financial Milestone Accelerator Quests */}
            <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 rounded-xl border border-amber-300/40 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    Milestone Quests: Reach Targets to Unlock Visual Badges
                  </span>
                </div>
                <button
                  onClick={() => setActivePortfolioTab('badges')}
                  className="text-[11px] font-bold text-amber-900 hover:text-amber-700 underline cursor-pointer self-start sm:self-auto"
                >
                  View Badges & Rewards ({evaluatedData.unlockedCount}/{evaluatedData.totalCount}) →
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleQuickAddPassiveStream}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-50 border border-amber-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Adds a digital royalties income stream to unlock First Passive Income Stream badge"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>+ Add Passive Stream (Unlock 'First Passive Income Stream')</span>
                </button>

                <button
                  onClick={handleQuickAddRetainer}
                  className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Adds another retainer client to unlock Retainer Titan badge"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>+ Add 2nd Retainer (Unlock 'Retainer Titan')</span>
                </button>

                <button
                  onClick={() => handleQuickBoostSavings(10)}
                  className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Sets savings target to 10% to unlock 10% Savings Guru badge"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Set 10% Savings (Unlock '10% Savings Guru')</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
              {portfolio.streams.map((stream) => (
                <div
                  key={stream.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{stream.title}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-medium">
                        {stream.category}
                      </span>
                      <button
                        onClick={() => handleToggleStreamStatus(stream.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm capitalize cursor-pointer ${
                          stream.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : stream.status === 'growing'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-slate-100 text-slate-500 line-through'
                        }`}
                      >
                        {stream.status}
                      </button>
                    </div>
                    {stream.notes && (
                      <p className="text-xs text-slate-500">{stream.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                        {formatCurrency(stream.monthlyGross, currency.symbol)}
                        <span className="text-xs text-slate-400 font-normal ml-0.5">/mo</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatCurrency(stream.monthlyGross * 12, currency.symbol)}/yr
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteStream(stream.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Delete stream"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* TAB 2: Milestones & Career Roadmaps */}
          {activePortfolioTab === 'milestones' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Career & Earnings Milestones
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track your financial checkpoints as your earning power grows
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {portfolio.milestones.filter((m) => m.achieved).length} of {portfolio.milestones.length} Completed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {portfolio.milestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      m.achieved
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    {m.achieved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            m.achieved ? 'text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {m.title}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600 tabular-nums">
                          {formatCurrency(m.targetAmount, currency.symbol)}
                        </span>
                      </div>
                      {m.achieved && m.dateAchieved && (
                        <span className="text-[10px] text-emerald-700 block mt-1">
                          Unlocked on {m.dateAchieved}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Badges & Achievements System */}
          {activePortfolioTab === 'badges' && (
            <BadgesShowcaseSection
              evaluation={evaluatedData}
              currency={currency}
              onOpenBadgeDetails={onOpenBadgeDetails}
            />
          )}
        </div>
      ) : (
        /* ADMIN CONSOLE VIEW */
        <div className="space-y-6">
          {/* Admin KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cohort Average Inflow
              </span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                {formatCurrency(10340 * adminMultiplier, currency.symbol)}/mo
              </div>
              <span className="text-xs text-emerald-600 mt-1 block">
                Across 5 tracked professional profiles
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Benchmark Inflation Adjuster
              </span>
              <div className="text-2xl font-extrabold text-indigo-600 font-mono tabular-nums mt-1">
                {(adminMultiplier * 100).toFixed(0)}%
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Adjusts global market rates across suite
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Avg Earning Positivity
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums mt-1">
                82.4 / 100
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Healthy financial buffer ratio
              </span>
            </div>
          </div>

          {/* Admin Global Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Global System Calibration & Rate Multipliers
            </h3>

            <div className="max-w-md space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Industry Rates Multiplier (Cost-of-Living / Market Adjustment):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={adminMultiplier}
                  onChange={(e) => setAdminMultiplier(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono text-sm font-bold text-indigo-700 min-w-16">
                  {adminMultiplier.toFixed(2)}x
                </span>
              </div>
              <div className="flex gap-2">
                {[1.0, 1.15, 1.3].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAdminMultiplier(val)}
                    className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
                  >
                    {val === 1.0 ? 'Standard (1.0x)' : `${val}x High CoL`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Consultant Cohort Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  Portfolio Cohort Performance Table
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time simulated directory of user portfolios & health scores
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600">5 Members Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Professional</th>
                    <th className="py-3 px-4">Headline Role</th>
                    <th className="py-3 px-4 text-right">Monthly Cashflow</th>
                    <th className="py-3 px-4 text-center">Positivity</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {simulatedCohort.map((member, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{member.name}</td>
                      <td className="py-3 px-4 text-slate-600">{member.role}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatCurrency(member.monthly * adminMultiplier, currency.symbol)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                          {member.positivity}/100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600">{member.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Stream Modal */}
      {showAddStreamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Add New Income Stream</h4>
              <button
                onClick={() => setShowAddStreamModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStream} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stream Name / Client</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme SaaS Advisory"
                  value={newStreamTitle}
                  onChange={(e) => setNewStreamTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newStreamCategory}
                    onChange={(e) =>
                      setNewStreamCategory(e.target.value as IncomeStreamItem['category'])
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Retainer">Retainer</option>
                    <option value="Contract">Contract</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Side Project">Side Project</option>
                    <option value="Royalties/Digital">Royalties/Digital</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Monthly Gross ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={newStreamAmount}
                    onChange={(e) => setNewStreamAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scope / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 8 hours/month advisory call + architecture audit"
                  value={newStreamNotes}
                  onChange={(e) => setNewStreamNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStreamModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
