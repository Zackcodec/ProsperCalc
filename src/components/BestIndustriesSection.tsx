import React, { useState } from 'react';
import { IndustryBenchmark, Currency } from '../types';
import { BEST_EARNING_INDUSTRIES, formatCurrency } from '../utils/calculator';
import { formatWealthCurrency } from '../utils/wealthPlanner';
import { Briefcase, TrendingUp, Globe, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface BestIndustriesSectionProps {
  currency: Currency;
  onApplyIndustry: (monthlyAmount: number, hourlyRate: number, industryName: string) => void;
  adminMultiplier?: number;
  onNavigateToLifePlan?: () => void;
}

export const BestIndustriesSection: React.FC<BestIndustriesSectionProps> = ({
  currency,
  onApplyIndustry,
  adminMultiplier = 1.0,
  onNavigateToLifePlan,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'entry' | 'mid' | 'senior'>('mid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndustries = BEST_EARNING_INDUSTRIES.filter(
    (ind) =>
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.inDemandSpecializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Marketing Banner for Life Wealth Plan */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Career Trajectory Playbook
            </span>
            <span className="text-xs text-slate-400 font-mono">Senior AI & Cloud: ₹4,50,000+/mo</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            Break into High-Earning Industry Tiers with our ₹2,000 Starter Blueprint
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            You don&apos;t need years of unpaid internships. Follow our 4-phase roadmap to build high-leverage portfolio assets, pitch B2B clients directly, and command top-quartile market rates.
          </p>
        </div>

        {onNavigateToLifePlan && (
          <button
            onClick={onNavigateToLifePlan}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore 4-Phase Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {/* Editorial Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Global Compensation Benchmarks</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Best High-Earning Modern Industries & Compensation Tiers
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Live market intelligence across top sectors with remote prevalence and salary trajectories
            </p>
          </div>

          {/* Level Switcher (Entry, Mid, Senior) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
            {(['entry', 'mid', 'senior'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                  selectedLevel === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl} Level
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <input
            type="text"
            placeholder="Search industries, tech stack, or specializations (e.g., AI, Cloud, FinOps)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </div>
      </div>

      {/* Industry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIndustries.map((ind) => {
          const isINR = currency.isINR || currency.code === 'INR';
          const entryVal = Math.round(
            (isINR ? ind.entryMonthlyINR : ind.entryMonthlyUSD) * adminMultiplier
          );
          const midVal = Math.round(
            (isINR ? ind.midMonthlyINR : ind.midMonthlyUSD) * adminMultiplier
          );
          const seniorVal = Math.round(
            (isINR ? ind.seniorMonthlyINR : ind.seniorMonthlyUSD) * adminMultiplier
          );

          const currentLevelVal =
            selectedLevel === 'entry' ? entryVal : selectedLevel === 'mid' ? midVal : seniorVal;

          const hourlyEquivalent = Math.round(
            isINR ? currentLevelVal / 140 : currentLevelVal / 130
          );

          return (
            <div
              key={ind.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div>
                {/* Sector & Name */}
                <div className="text-xs text-slate-500 font-medium">{ind.sector}</div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                  {ind.name}
                </h3>

                {/* Main Compensation Box */}
                <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize">{selectedLevel} Monthly Benchmark</span>
                    <span className="font-semibold text-emerald-600 font-mono">
                      +{ind.projectedAnnualGrowth}% YoY
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                    {formatWealthCurrency(currentLevelVal, currency)}
                    <span className="text-xs text-slate-500 font-normal ml-1">/mo</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center justify-between font-mono">
                    <span>
                      Annual: {formatWealthCurrency(currentLevelVal * 12, currency, true)}
                    </span>
                    <span>
                      ~{currency.symbol}
                      {hourlyEquivalent}/hr
                    </span>
                  </div>
                </div>

                {/* Remote & Outlook */}
                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Remote Flexibility</span>
                    </span>
                    <span className="font-semibold text-slate-900">{ind.remoteFriendlyPct}%</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed italic">
                    &quot;{ind.briefOutlook}&quot;
                  </p>
                </div>

                {/* Specializations Tags */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    High-Demand Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.inDemandSpecializations.map((spec) => (
                      <span
                        key={spec}
                        className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Transfer into Calculator */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() =>
                    onApplyIndustry(
                      currentLevelVal,
                      hourlyEquivalent,
                      ind.name
                    )
                  }
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Simulate {selectedLevel} Level in Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
