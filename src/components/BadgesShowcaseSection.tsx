import React, { useState } from 'react';
import { AchievementBadge, BadgeRarity, UserPortfolio, Currency } from '../types';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Trophy,
  Zap,
  TrendingUp,
  ShieldCheck,
  Shield,
  Layers,
  DollarSign,
  Compass,
  Crown,
  PiggyBank,
  Check,
  Filter,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import { AchievementEvaluationResult } from '../utils/achievementSystem';

interface BadgesShowcaseSectionProps {
  evaluation: AchievementEvaluationResult;
  currency: Currency;
  onOpenBadgeDetails?: (badge: AchievementBadge) => void;
}

export const BadgesShowcaseSection: React.FC<BadgesShowcaseSectionProps> = ({
  evaluation,
  currency,
  onOpenBadgeDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadgeForModal, setSelectedBadgeForModal] = useState<AchievementBadge | null>(null);

  const categories = [
    'All',
    'Savings & Compounding',
    'Revenue & Streams',
    'Financial Freedom',
    'Emergency & Risk',
    'Platform Master',
  ];

  const filteredBadges = evaluation.badges.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'unlocked'
        ? b.unlocked
        : !b.unlocked;
    return matchesCategory && matchesStatus;
  });

  const getRarityBadgeStyle = (rarity: BadgeRarity, unlocked: boolean) => {
    if (!unlocked) {
      return {
        cardBg: 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-80',
        badgePill: 'bg-slate-100 text-slate-500 border-slate-200',
        iconBg: 'bg-slate-200/80 text-slate-400',
        borderGlow: 'border-slate-200',
      };
    }

    switch (rarity) {
      case 'Legendary':
        return {
          cardBg:
            'bg-gradient-to-br from-amber-50 via-amber-50/60 to-yellow-50 border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400',
          badgePill:
            'bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black shadow-xs border border-amber-400',
          iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white ring-4 ring-amber-100 shadow-md',
          borderGlow: 'border-amber-300',
        };
      case 'Epic':
        return {
          cardBg:
            'bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-indigo-50/80 border-indigo-200 shadow-sm hover:shadow-md hover:border-indigo-300',
          badgePill: 'bg-indigo-600 text-white font-bold shadow-xs border border-indigo-500',
          iconBg: 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white ring-4 ring-indigo-100 shadow-md',
          borderGlow: 'border-indigo-200',
        };
      case 'Rare':
        return {
          cardBg:
            'bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-emerald-50/80 border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-300',
          badgePill: 'bg-emerald-600 text-white font-bold shadow-xs border border-emerald-500',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-4 ring-emerald-100 shadow-md',
          borderGlow: 'border-emerald-200',
        };
      case 'Common':
      default:
        return {
          cardBg: 'bg-white border-slate-200 shadow-xs hover:border-slate-300',
          badgePill: 'bg-slate-100 text-slate-700 font-bold border border-slate-200',
          iconBg: 'bg-slate-800 text-white ring-4 ring-slate-100 shadow-sm',
          borderGlow: 'border-slate-200',
        };
    }
  };

  const renderBadgeIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'PiggyBank':
        return <PiggyBank className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'DollarSign':
        return <DollarSign className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Award':
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Trophy & Financial Mastery Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-amber-400 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                Visual Milestone Rewards System
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
              <span>Badges & Financial Achievements</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Unlock prestigious medals and financial sovereignty badges as you expand retainers, automate passive cashflow, and strengthen your emergency fortress.
            </p>
          </div>

          {/* Level & XP Capsule */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[260px] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Rank</span>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="text-amber-400 font-extrabold">Lvl {evaluation.currentLevel}</span>
                  <span>·</span>
                  <span className="text-slate-200">{evaluation.levelTitle}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Experience</span>
                <div className="text-xs font-mono font-bold text-amber-300">
                  {evaluation.totalXp} XP
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${evaluation.levelProgressPct}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-300">
              <span>{evaluation.levelProgressPct}% to Next Level</span>
              <span className="font-mono text-slate-300">
                · {evaluation.unlockedCount} / {evaluation.totalCount} Badges Unlocked ({evaluation.unlockedPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Status Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto shrink-0 text-xs font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({evaluation.totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('unlocked')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterStatus === 'unlocked'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unlocked ({evaluation.unlockedCount})
          </button>
          <button
            onClick={() => setFilterStatus('locked')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterStatus === 'locked'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Locked ({evaluation.totalCount - evaluation.unlockedCount})
          </button>
        </div>
      </div>

      {/* 3. Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const style = getRarityBadgeStyle(badge.rarity, badge.unlocked);

          return (
            <div
              key={badge.id}
              onClick={() => {
                if (onOpenBadgeDetails) onOpenBadgeDetails(badge);
                setSelectedBadgeForModal(badge);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${style.cardBg}`}
            >
              {/* Badge Top: Emblem & Rarity Tag */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${style.iconBg}`}
                  >
                    {renderBadgeIcon(badge.iconName, 'w-6 h-6')}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider ${style.badgePill}`}
                    >
                      {badge.rarity}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      +{badge.xpPoints} XP
                    </span>
                  </div>
                </div>

                {/* Badge Title & Description */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={`text-sm font-bold leading-tight ${
                        badge.unlocked ? 'text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {badge.title}
                    </h4>
                    {badge.unlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Badge Bottom: Progress / Unlock Status */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-sans truncate">{badge.criteria}</span>
                  {badge.unlocked ? (
                    <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px] shrink-0">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="font-bold text-slate-500 flex items-center gap-1 text-[10px] shrink-0">
                      <Lock className="w-3 h-3" />
                      <span>{badge.progressPct}%</span>
                    </span>
                  )}
                </div>

                {!badge.unlocked && (
                  <div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${badge.progressPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block text-right">
                      {badge.progressLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Badge Detailed Inspection Modal */}
      {selectedBadgeForModal && (
        <div
          onClick={() => setSelectedBadgeForModal(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-center relative overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedBadgeForModal(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emblem in Grand Scale */}
            <div className="flex justify-center pt-2">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${
                  getRarityBadgeStyle(selectedBadgeForModal.rarity, selectedBadgeForModal.unlocked).iconBg
                }`}
              >
                {renderBadgeIcon(selectedBadgeForModal.iconName, 'w-10 h-10')}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                    getRarityBadgeStyle(selectedBadgeForModal.rarity, selectedBadgeForModal.unlocked)
                      .badgePill
                  }`}
                >
                  {selectedBadgeForModal.rarity} BADGE
                </span>
                <span className="text-xs font-mono font-bold text-amber-600">
                  +{selectedBadgeForModal.xpPoints} XP
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedBadgeForModal.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                {selectedBadgeForModal.description}
              </p>
            </div>

            {/* Milestone Criteria & Status Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Unlock Milestone Requirement:</span>
                {selectedBadgeForModal.unlocked ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded font-bold text-[10px] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>In Progress</span>
                  </span>
                )}
              </div>

              <p className="text-slate-600">{selectedBadgeForModal.criteria}</p>

              <div className="pt-2 border-t border-slate-200/70">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Current Progress:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedBadgeForModal.progressLabel} ({selectedBadgeForModal.progressPct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedBadgeForModal.unlocked ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${selectedBadgeForModal.progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadgeForModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Close Achievement Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
