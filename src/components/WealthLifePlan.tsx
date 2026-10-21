import React, { useState } from 'react';
import { Currency, LifeWealthPhase, CURRENCIES, UserPortfolio, CalculatorInputs } from '../types';
import {
  LIFE_WEALTH_PHASES,
  ASSET_EXCHANGE_EQUIVALENTS_2000_INR,
  calculateLifeWealthProjection,
  formatWealthCurrency,
  exchangeCurrencyAmount,
} from '../utils/wealthPlanner';
import {
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Wallet,
  Zap,
  Repeat,
  DollarSign,
  PackageCheck,
  Award,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react';

interface WealthLifePlanProps {
  currency: Currency;
  onApplyPhaseTarget: (targetMonthly: number, phaseTitle: string) => void;
  portfolio?: UserPortfolio;
  inputs?: CalculatorInputs;
  onOpenPricing?: () => void;
}

export const WealthLifePlan: React.FC<WealthLifePlanProps> = ({
  currency,
  onApplyPhaseTarget,
  portfolio,
  inputs,
  onOpenPricing,
}) => {
  const [initialSeed, setInitialSeed] = useState<number>(currency.isINR ? 2000 : 24);
  const [monthlySavings, setMonthlySavings] = useState<number>(
    currency.isINR
      ? inputs
        ? Math.round((inputs.monthlySalary * (inputs.savingsTargetPercent || 25)) / 100) || 25000
        : 25000
      : 300
  );
  const [annualReturnPct, setAnnualReturnPct] = useState<number>(14);
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(60); // 5 Years default
  const [activeTab, setActiveTab] = useState<'roadmap' | 'exchange' | 'simulator'>('roadmap');

  // Interactive Checklist State
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('wealth_plan_completed_steps');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'p1-0': true, // initial domain registered
      'p1-1': true, // AI automation configured
    };
  });

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [stepKey]: !prev[stepKey] };
      try {
        localStorage.setItem('wealth_plan_completed_steps', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Custom Currency & Asset Converter State
  const [exchangeFromAmount, setExchangeFromAmount] = useState<number>(currency.isINR ? 2000 : 24);
  const [exchangeFromCode, setExchangeFromCode] = useState<string>(currency.code);

  // Compound projection series
  const projectionSeries = calculateLifeWealthProjection({
    initialSeedINR: currency.isINR ? initialSeed : initialSeed * currency.rateToUSD,
    monthlySavingsINR: currency.isINR ? monthlySavings : monthlySavings * currency.rateToUSD,
    expectedAnnualReturnPct: annualReturnPct,
    months: timeHorizonMonths,
  });

  const finalProjection = projectionSeries[projectionSeries.length - 1];
  const finalNetWorth = currency.isINR
    ? finalProjection.totalNetWorth
    : finalProjection.totalNetWorth / currency.rateToUSD;

  const activePhaseData =
    LIFE_WEALTH_PHASES.find((p) => p.phaseNumber === selectedPhase) || LIFE_WEALTH_PHASES[0];

  const userName = portfolio?.fullName || 'Arjun Patel';
  const freedomGoal = portfolio?.targetMonthlyGoal || 250000;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
      {/* 1. Hero Master Plan Banner (Personalized for Current User) */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-indigo-900/60 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personalized Career & Wealth Sovereignty</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Target: {formatWealthCurrency(freedomGoal, currency)}/mo
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {userName}&apos;s {currency.isINR ? '₹2,000 Starter Seed' : '$24 Starter Seed'} to Wealth Plan
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Real generational wealth is an engineered system, not a lottery. By deploying a focused {currency.symbol}2,000 seed into high-leverage client acquisition infrastructure, locking in recurring retainers, and systematically compounding equity assets, you can scale from zero to multi-Crore financial sovereignty.
          </p>
        </div>

        {/* Quick Simulator Highlights (Responsive grid protected from margin bleed) */}
        <div className="relative z-10 mt-6 pt-6 border-t border-indigo-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-mono">
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[11px] font-sans">Starter Seed Capital</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-indigo-400 font-bold">{currency.symbol}</span>
              <input
                type="number"
                min="100"
                step="500"
                value={initialSeed}
                onChange={(e) => setInitialSeed(Math.max(10, Number(e.target.value)))}
                className="w-full bg-transparent text-white font-bold text-base focus:outline-none border-b border-indigo-500/50"
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[11px] font-sans">Monthly Compounding SIP</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-emerald-400 font-bold">{currency.symbol}</span>
              <input
                type="number"
                min="500"
                step="2500"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Math.max(100, Number(e.target.value)))}
                className="w-full bg-transparent text-white font-bold text-base focus:outline-none border-b border-emerald-500/50"
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[11px] font-sans">
              Projected Net Worth in {timeHorizonMonths / 12} Yrs ({annualReturnPct}% CAGR)
            </span>
            <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
              {formatWealthCurrency(finalNetWorth, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Marketing / High-ROI Comparison Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Why ₹2,000 is the Highest ROI Investment in 2026</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
              Spending ₹2,000 on dining or streaming evaporates immediately. Deploying ₹2,000 into a custom domain, automated Gemini API workflows, and validated B2B retainer templates generates an asymmetric <strong>25x–50x cashflow return</strong> within your first 90 days.
            </p>
          </div>

          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Activate ₹2,000 Starter Tier</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Navigation Sub-Tabs (Safe horizontal scrolling on mobile/tablet) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>4-Phase Life Blueprint</span>
        </button>

        <button
          onClick={() => setActiveTab('exchange')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'exchange'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>What ₹2,000 Buys & FX Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Compound Wealth Simulator</span>
        </button>
      </div>

      {/* TAB 1: 4-PHASE ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Phase Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LIFE_WEALTH_PHASES.map((phase) => {
              const isSelected = selectedPhase === phase.phaseNumber;
              const targetMonthly = currency.isINR
                ? phase.targetMonthlyCashflowINR
                : phase.targetMonthlyCashflowUSD;
              const targetNetWorth = currency.isINR
                ? phase.milestoneNetWorthINR
                : phase.milestoneNetWorthUSD;

              return (
                <button
                  key={phase.phaseNumber}
                  onClick={() => setSelectedPhase(phase.phaseNumber)}
                  className={`p-5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Phase {phase.phaseNumber}
                    </span>
                    <span className="text-slate-500 font-medium">{phase.timeline}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {phase.title}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Monthly Cashflow:</span>
                      <span className="font-bold font-mono text-emerald-600">
                        {formatWealthCurrency(targetMonthly, currency)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Milestone Capital:</span>
                      <span className="font-bold font-mono text-indigo-600">
                        {formatWealthCurrency(targetNetWorth, currency)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Deep Dive */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                  Detailed Strategic Playbook · Phase {activePhaseData.phaseNumber} ({activePhaseData.timeline})
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {activePhaseData.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{activePhaseData.coreAction}</p>
              </div>

              <button
                onClick={() =>
                  onApplyPhaseTarget(
                    currency.isINR
                      ? activePhaseData.targetMonthlyCashflowINR
                      : activePhaseData.targetMonthlyCashflowUSD,
                    `Phase ${activePhaseData.phaseNumber}`
                  )
                }
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Simulate Target in Calculator</span>
              </button>
            </div>

            {/* 4 Pillars of the Phase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* 1. Where to Start */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>1. Where to Start (Tactical Setup)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activePhaseData.whereToStartStep}
                </p>
              </div>

              {/* 2. How to Earn */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>2. How to Earn (Client Acquisition & Revenue)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activePhaseData.howToEarnStep}
                </p>
              </div>

              {/* 3. Where to Invest */}
              <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  <Wallet className="w-4 h-4" />
                  <span>3. Where to Invest (Systematic Compounding)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activePhaseData.whereToInvestStep}
                </p>
              </div>

              {/* 4. Pitfalls to Avoid */}
              <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>4. Pitfalls & Career Traps to Avoid</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activePhaseData.pitfallsToAvoid}
                </p>
              </div>
            </div>

            {/* Interactive Action Checklist for the Phase */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  <span>Action Milestones for Phase {activePhaseData.phaseNumber}</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  {
                    activePhaseData.actionChecklist.filter(
                      (_, idx) => completedSteps[`p${activePhaseData.phaseNumber}-${idx}`]
                    ).length
                  }{' '}
                  of {activePhaseData.actionChecklist.length} Milestones Checked
                </span>
              </div>

              <div className="space-y-2">
                {activePhaseData.actionChecklist.map((stepText, idx) => {
                  const key = `p${activePhaseData.phaseNumber}-${idx}`;
                  const isDone = !!completedSteps[key];
                  return (
                    <div
                      key={key}
                      onClick={() => toggleStep(key)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                        {stepText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSET EXCHANGE & LIVE CURRENCY CONVERTER */}
      {activeTab === 'exchange' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Asset Exchange Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Value Multipliers in 2026
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                What {currency.symbol}2,000 Actually Buys You in Production Assets
              </h3>
              <p className="text-xs text-slate-500">
                How allocating ₹2,000 strategically constructs an entire career infrastructure
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {ASSET_EXCHANGE_EQUIVALENTS_2000_INR.map((asset) => {
                const cost = currency.isINR ? asset.costINR : asset.costINR / currency.rateToUSD;
                return (
                  <div
                    key={asset.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
                          {asset.category}
                        </span>
                        <span className="font-mono font-bold text-emerald-600">
                          {formatWealthCurrency(cost, currency)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {asset.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {asset.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 block font-sans">Tangible ROI:</span>
                      <span className="font-semibold text-emerald-700 mt-0.5 block">
                        {asset.returnOnInvestmentROI}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Multi-Currency Exchange Matrix */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Real-Time Foreign Exchange Valuation
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Global Currency Exchange Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Convert any rate or seed capital into all major trading currencies instantly
                </p>
              </div>

              {/* Quick Converter Input */}
              <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 pl-2">Amount:</span>
                <input
                  type="number"
                  value={exchangeFromAmount}
                  onChange={(e) => setExchangeFromAmount(Number(e.target.value) || 0)}
                  className="w-24 sm:w-28 bg-transparent text-white font-mono font-bold text-sm focus:outline-none px-1"
                />
                <select
                  value={exchangeFromCode}
                  onChange={(e) => setExchangeFromCode(e.target.value)}
                  className="bg-slate-700 text-white text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid of Converted Amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {CURRENCIES.map((targetCurr) => {
                const converted = exchangeCurrencyAmount(
                  exchangeFromAmount,
                  exchangeFromCode,
                  targetCurr.code
                );

                return (
                  <div
                    key={targetCurr.code}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate">{targetCurr.name}</span>
                      <span className="font-bold text-slate-300">{targetCurr.code}</span>
                    </div>
                    <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 tabular-nums">
                      {targetCurr.symbol}{converted.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      1 USD = {targetCurr.rateToUSD} {targetCurr.code}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPOUND WEALTH GROWTH SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Systematic Wealth Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Exponential Compound Interest Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Witness how consistent monthly investments compound aggressively over 3 to 15 years
              </p>
            </div>

            {/* Horizon Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
              {[
                { label: '3 Yrs', val: 36 },
                { label: '5 Yrs', val: 60 },
                { label: '10 Yrs', val: 120 },
                { label: '15 Yrs', val: 180 },
              ].map((h) => (
                <button
                  key={h.val}
                  onClick={() => setTimeHorizonMonths(h.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    timeHorizonMonths === h.val
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Compound Schedule Table with safe horizontal scroll */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4 text-right">Deposited Capital</th>
                  <th className="py-3 px-4 text-right">Compound Returns</th>
                  <th className="py-3 px-4 text-right">Liquid Buffer</th>
                  <th className="py-3 px-4 text-right">Equity Portfolio</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-900">Total Net Worth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium font-mono">
                {projectionSeries.map((row) => {
                  const toCurr = (valINR: number) =>
                    currency.isINR ? valINR : valINR / currency.rateToUSD;

                  return (
                    <tr key={row.month} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">
                        Month {row.month} (Year {row.year})
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 tabular-nums">
                        {formatWealthCurrency(toCurr(row.investedCapital), currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold tabular-nums">
                        +{formatWealthCurrency(toCurr(row.compoundReturns), currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 tabular-nums">
                        {formatWealthCurrency(toCurr(row.liquidBuffer), currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-indigo-600 tabular-nums">
                        {formatWealthCurrency(toCurr(row.equityMutualFunds), currency)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums text-sm">
                        {formatWealthCurrency(toCurr(row.totalNetWorth), currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
