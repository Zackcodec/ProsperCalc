import React from 'react';
import { AchievementBadge } from '../types';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  Crown,
  Zap,
  TrendingUp,
  ShieldCheck,
  Shield,
  Layers,
  DollarSign,
  Compass,
  PiggyBank,
  Award,
} from 'lucide-react';

interface CelebrationBadgeModalProps {
  badge: AchievementBadge | null;
  onClose: () => void;
  onViewAllBadges: () => void;
}

export const CelebrationBadgeModal: React.FC<CelebrationBadgeModalProps> = ({
  badge,
  onClose,
  onViewAllBadges,
}) => {
  if (!badge) return null;

  const renderBadgeIcon = (iconName: string, className: string = 'w-10 h-10') => {
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-500/40 shadow-2xl p-6 sm:p-8 text-center space-y-5 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow Radial Backdrop */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Banner */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Achievement Unlocked!</span>
        </div>

        {/* Badge Icon Emblem */}
        <div className="flex justify-center my-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-xl ring-8 ring-amber-400/20">
              {renderBadgeIcon(badge.iconName, 'w-12 h-12')}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Title & XP */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/20">
            {badge.rarity} Badge
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
            {badge.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed px-2">
            {badge.description}
          </p>
        </div>

        {/* XP Reward Pill */}
        <div className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-sans">XP Reward:</span>
          <span className="text-amber-300 font-bold text-sm">+{badge.xpPoints} XP</span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onViewAllBadges();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
          >
            <span>View in Badges Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
