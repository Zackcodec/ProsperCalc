import React from 'react';
import { CalculationResults, Currency, CalculatorInputs } from '../types';
import { formatCurrency } from '../utils/calculator';
import { ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, ArrowUpRight, Zap } from 'lucide-react';

interface PositivityHealthScoreProps {
  results: CalculationResults;
  currency: Currency;
  inputs: CalculatorInputs;
  onQuickBoost: (updates: Partial<CalculatorInputs>) => void;
}

export const PositivityHealthScore: React.FC<PositivityHealthScoreProps> = ({
  results,
  currency,
  inputs,
  onQuickBoost,
}) => {
  const { positivity, monthlyNet, monthlyExpenses, monthlySavings } = results;
  const {
    score,
    tier,
    color,
    savingsRatioScore,
    runwayScore,
    incomeDiversityScore,
    discretionaryMarginScore,
    runwayMonths,
    actionableInsights,
  } = positivity;

  // Determine health color styles
  const getBadgeClass = (t: string) => {
    switch (t) {
      case 'Wealth Velocity':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Thriving':
        return 'bg-teal-50 text-teal-800 border-teal-300';
      case 'Stable':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Cautious':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Financial Positivity & Health Score
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic assessment of financial safety, runway depth, income diversity, and compounding velocity
          </p>
        </div>

        {/* Tier status indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadgeClass(tier)}`}
          >
            {tier}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Score Radial / Indicator */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-xl border border-slate-100 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Circular Ring */}
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={color}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - score / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {score}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">out of 100</span>
              </div>
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              {tier === 'Wealth Velocity' && 'Peak Wealth Velocity'}
              {tier === 'Thriving' && 'Thriving & Resilient'}
              {tier === 'Stable' && 'Stable Baseline'}
              {tier === 'Cautious' && 'Vulnerable to Shock'}
              {tier === 'Critical' && 'High Fragility Risk'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
              {runwayMonths} months liquid emergency buffer · {(
                (monthlyNet > 0 ? monthlySavings / monthlyNet : 0) * 100
              ).toFixed(0)}
              % savings retention
            </p>
          </div>

          {/* 4 Health Pillars Grid */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              The 4 Pillars of Financial Positivity
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Pillar 1: Savings Velocity */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">1. Savings Retention</span>
                  <span className="font-mono font-bold text-slate-900">{savingsRatioScore} / 25 pts</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(savingsRatioScore / 25) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Target is ≥ 20% net income. Saving {formatCurrency(monthlySavings, currency.symbol)}/mo.
                </p>
              </div>

              {/* Pillar 2: Emergency Runway */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">2. Emergency Runway</span>
                  <span className="font-mono font-bold text-slate-900">{runwayScore} / 25 pts</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(runwayScore / 25) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {runwayMonths} months buffer ({formatCurrency(inputs.currentEmergencyFund, currency.symbol)} reserve).
                </p>
              </div>

              {/* Pillar 3: Income Stream Diversity */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">3. Stream Diversity</span>
                  <span className="font-mono font-bold text-slate-900">{incomeDiversityScore} / 25 pts</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${(incomeDiversityScore / 25) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Multiple retainers & side assets guard against client churn.
                </p>
              </div>

              {/* Pillar 4: Discretionary Free Cash Margin */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">4. Discretionary Surplus</span>
                  <span className="font-mono font-bold text-slate-900">{discretionaryMarginScore} / 25 pts</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${(discretionaryMarginScore / 25) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Free breathing room after overhead: {formatCurrency(results.monthlyDiscretionary, currency.symbol)}/mo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Insights Section */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Diagnostic Positivity Report & Opportunities
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actionableInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 flex items-start gap-2.5 text-xs text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Positivity Boosters (Interactive Simulator) */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Quick Positivity Boosters (Test Scenarios)
              </span>
            </div>
            <span className="text-[11px] text-indigo-700 font-medium">Click to apply to calculator</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                onQuickBoost({
                  baseHourlyRate: Math.round(inputs.baseHourlyRate * 1.15),
                });
              }}
              className="px-3 py-2 text-left bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors text-xs text-indigo-900 font-medium flex items-center justify-between group"
            >
              <span>+15% Hourly Rate Bump</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button
              onClick={() => {
                const newClient = {
                  id: `client-${Date.now()}`,
                  name: 'New Advisory Client',
                  monthlyAmount: 2000,
                  category: 'Retainer' as const,
                };
                onQuickBoost({
                  retainerClients: [...inputs.retainerClients, newClient],
                });
              }}
              className="px-3 py-2 text-left bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors text-xs text-indigo-900 font-medium flex items-center justify-between group"
            >
              <span>+1 Retainer ($2,000/mo)</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button
              onClick={() => {
                onQuickBoost({
                  savingsTargetPercent: Math.min(50, (inputs.savingsTargetPercent || 20) + 5),
                });
              }}
              className="px-3 py-2 text-left bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors text-xs text-indigo-900 font-medium flex items-center justify-between group"
            >
              <span>+5% Savings Allocation</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
