import React from 'react';
import { CalculatorInputs, CalculationResults, Currency, RetainerClient } from '../types';
import { formatCurrency } from '../utils/calculator';
import {
  DollarSign,
  Clock,
  Calendar,
  Building,
  Plus,
  Trash2,
  Sliders,
  Wallet,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CalculatorSectionProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  results: CalculationResults;
  currency: Currency;
  onNavigateToLifePlan?: () => void;
  userName?: string;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  inputs,
  setInputs,
  results,
  currency,
  onNavigateToLifePlan,
  userName = 'Arjun Patel',
}) => {
  const handleModelChange = (model: CalculatorInputs['earningModel']) => {
    setInputs((prev) => ({ ...prev, earningModel: model }));
  };

  const handleAddRetainer = () => {
    const newClient: RetainerClient = {
      id: `client-${Date.now()}`,
      name: `Client #${inputs.retainerClients.length + 1}`,
      monthlyAmount: 1500,
      category: 'Retainer',
    };
    setInputs((prev) => ({
      ...prev,
      retainerClients: [...prev.retainerClients, newClient],
    }));
  };

  const handleRemoveRetainer = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      retainerClients: prev.retainerClients.filter((c) => c.id !== id),
    }));
  };

  const handleUpdateRetainer = (id: string, updates: Partial<RetainerClient>) => {
    setInputs((prev) => ({
      ...prev,
      retainerClients: prev.retainerClients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  // Preset quick-loads
  const loadPreset = (type: 'freelancer' | 'agency' | 'salary' | 'starter') => {
    if (type === 'freelancer') {
      setInputs({
        earningModel: 'freelance',
        baseHourlyRate: 85,
        hoursPerWeek: 32,
        weeksPerYear: 48,
        monthlySalary: 0,
        retainerClients: [
          { id: 'p1', name: 'Tech Client Retainer', monthlyAmount: 3000, category: 'Retainer' },
          { id: 'p2', name: 'Support Agreement', monthlyAmount: 1200, category: 'Maintenance' },
        ],
        sideGigMonthly: 600,
        passiveIncomeMonthly: 250,
        monthlyExpenses: 4500,
        taxRatePercent: 25,
        savingsTargetPercent: 25,
        currentEmergencyFund: 22000,
        annualBonus: 0,
      });
    } else if (type === 'agency') {
      setInputs({
        earningModel: 'freelance',
        baseHourlyRate: 120,
        hoursPerWeek: 35,
        weeksPerYear: 50,
        monthlySalary: 0,
        retainerClients: [
          { id: 'a1', name: 'Enterprise Client A', monthlyAmount: 5000, category: 'Retainer' },
          { id: 'a2', name: 'Growth Retainer B', monthlyAmount: 4000, category: 'Retainer' },
          { id: 'a3', name: 'Advisory Retainer C', monthlyAmount: 2500, category: 'Advisory' },
        ],
        sideGigMonthly: 1200,
        passiveIncomeMonthly: 800,
        monthlyExpenses: 6500,
        taxRatePercent: 28,
        savingsTargetPercent: 35,
        currentEmergencyFund: 45000,
        annualBonus: 10000,
      });
    } else if (type === 'salary') {
      setInputs({
        earningModel: 'hybrid',
        baseHourlyRate: 60,
        hoursPerWeek: 8,
        weeksPerYear: 48,
        monthlySalary: 7500,
        retainerClients: [],
        sideGigMonthly: 800,
        passiveIncomeMonthly: 150,
        monthlyExpenses: 4000,
        taxRatePercent: 22,
        savingsTargetPercent: 20,
        currentEmergencyFund: 18000,
        annualBonus: 8000,
      });
    } else {
      // Starter
      setInputs({
        earningModel: 'hourly',
        baseHourlyRate: 35,
        hoursPerWeek: 25,
        weeksPerYear: 48,
        monthlySalary: 0,
        retainerClients: [],
        sideGigMonthly: 300,
        passiveIncomeMonthly: 0,
        monthlyExpenses: 2200,
        taxRatePercent: 18,
        savingsTargetPercent: 15,
        currentEmergencyFund: 4000,
        annualBonus: 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Life Wealth Plan Marketing Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-indigo-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              {userName}&apos;s Personalized Wealth Blueprint
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Inflow: {formatCurrency(results.monthlyGross, currency.symbol)}/mo
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            Scale from {currency.symbol}2,000 Starter Seed to Financial Freedom
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            See our 4-phase career roadmap: how a ₹2,000 tactical setup unlocks high-ticket retainers and compounds your monthly savings into a multi-Crore net worth.
          </p>
        </div>

        {onNavigateToLifePlan && (
          <button
            onClick={onNavigateToLifePlan}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>View Personalized Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Top Presets bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Quick Benchmark Archetypes:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadPreset('starter')}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Junior / Starter
          </button>
          <button
            onClick={() => loadPreset('freelancer')}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Mid Freelancer
          </button>
          <button
            onClick={() => loadPreset('salary')}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Salaried + Moonlighting
          </button>
          <button
            onClick={() => loadPreset('agency')}
            className="px-2.5 py-1 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
          >
            High-Leverage Consultant
          </button>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          {/* Earning Model Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Primary Compensation Structure
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'freelance', label: 'Freelance & Retainers' },
                { id: 'hourly', label: 'Pure Hourly Rate' },
                { id: 'salary', label: 'Salaried Base' },
                { id: 'hybrid', label: 'Hybrid (Salary + Gig)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id as CalculatorInputs['earningModel'])}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                    inputs.earningModel === m.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model-specific Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {(inputs.earningModel === 'hourly' ||
              inputs.earningModel === 'freelance' ||
              inputs.earningModel === 'hybrid') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Base Hourly Rate ({currency.symbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={inputs.baseHourlyRate}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        baseHourlyRate: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {(inputs.earningModel === 'salary' || inputs.earningModel === 'hybrid') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Base Salary ({currency.symbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="250"
                    value={inputs.monthlySalary}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        monthlySalary: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billable Hours / Week
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={inputs.hoursPerWeek}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      hoursPerWeek: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Weeks / Year
              </label>
              <input
                type="number"
                min="20"
                max="52"
                value={inputs.weeksPerYear}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    weeksPerYear: Math.max(1, Math.min(52, Number(e.target.value))),
                  }))
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {52 - inputs.weeksPerYear} weeks vacation/time-off
              </span>
            </div>
          </div>

          {/* Client Retainers Module (Essential for high-earning freelancers) */}
          {(inputs.earningModel === 'freelance' || inputs.earningModel === 'hybrid') && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recurring Monthly Client Retainers
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Predictable monthly contracts decouple revenue from clock hours
                  </p>
                </div>
                <button
                  onClick={handleAddRetainer}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Retainer</span>
                </button>
              </div>

              {inputs.retainerClients.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                  No recurring retainers added yet. Click &quot;Add Retainer&quot; to include ongoing client agreements.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {inputs.retainerClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <input
                        type="text"
                        value={client.name}
                        onChange={(e) => handleUpdateRetainer(client.id, { name: e.target.value })}
                        placeholder="Client or Project Name"
                        className="w-full sm:flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-36">
                          <span className="absolute left-2.5 top-2 text-slate-400 font-bold">
                            {currency.symbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={client.monthlyAmount}
                            onChange={(e) =>
                              handleUpdateRetainer(client.id, {
                                monthlyAmount: Math.max(0, Number(e.target.value)),
                              })
                            }
                            className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-slate-800"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveRetainer(client.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors shrink-0"
                          title="Remove retainer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Secondary Streams: Side Gigs, Passive, Bonus */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Secondary Streams & Annual Incentives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Side Gigs / Ad-hoc Projects ({currency.symbol}/mo)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.sideGigMonthly}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        sideGigMonthly: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passive / Digital Royalties ({currency.symbol}/mo)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.passiveIncomeMonthly}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        passiveIncomeMonthly: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Bonus / Profit Share ({currency.symbol}/yr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.annualBonus}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualBonus: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Living Costs, Taxes & Savings Targets */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Living Overhead, Taxes & Savings Target
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Living Costs ({currency.symbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={inputs.monthlyExpenses}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      monthlyExpenses: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tax Rate (%)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={inputs.taxRatePercent}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        taxRatePercent: Math.max(0, Math.min(60, Number(e.target.value))),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div className="flex gap-1 mt-1">
                  {[18, 24, 30].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setInputs((prev) => ({ ...prev, taxRatePercent: rate }))}
                      className="text-[10px] text-slate-500 hover:text-indigo-600 underline cursor-pointer"
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Savings Target (% of Net)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.savingsTargetPercent}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      savingsTargetPercent: Math.max(0, Math.min(100, Number(e.target.value))),
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                <div className="flex gap-1 mt-1">
                  {[15, 25, 35].map((rate) => (
                    <button
                      key={rate}
                      onClick={() =>
                        setInputs((prev) => ({ ...prev, savingsTargetPercent: rate }))
                      }
                      className="text-[10px] text-slate-500 hover:text-indigo-600 underline cursor-pointer"
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Fund ({currency.symbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={inputs.currentEmergencyFund}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      currentEmergencyFund: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Real-time Live Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
              Monthly Inflow Summary
            </span>

            {/* Big Headline Gross */}
            <div className="mt-3">
              <span className="text-xs text-indigo-300 font-medium">Estimated Monthly Gross</span>
              <div className="text-3xl font-extrabold font-mono tracking-tight text-white mt-0.5">
                {formatCurrency(results.monthlyGross, currency.symbol)}
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums block mt-1">
                {formatCurrency(results.annualGross, currency.symbol)} / year gross
              </span>
            </div>

            {/* Net take home */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Estimated Net Take-Home:</span>
                <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  {formatCurrency(results.monthlyNet, currency.symbol)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1.5">
                <span>Estimated Monthly Taxes:</span>
                <span className="font-mono tabular-nums text-rose-300">
                  -{formatCurrency(results.monthlyTax, currency.symbol)}
                </span>
              </div>
            </div>

            {/* Effective Hourly Rate */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Effective Hourly Rate</span>
                <span className="text-xs text-slate-500 block">All income / billable hours</span>
              </div>
              <span className="text-base font-bold font-mono text-white tabular-nums">
                {currency.symbol}
                {results.effectiveHourlyRate.toFixed(1)}/hr
              </span>
            </div>

            {/* Monthly Savings & Discretionary */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Monthly Target Savings:</span>
                <span className="font-semibold text-emerald-400 font-mono tabular-nums">
                  {formatCurrency(results.monthlySavings, currency.symbol)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Living Costs Overhead:</span>
                <span className="font-semibold text-amber-300 font-mono tabular-nums">
                  -{formatCurrency(results.monthlyExpenses, currency.symbol)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 font-semibold">
                <span className="text-white">Free Cash Discretionary:</span>
                <span className="font-mono text-indigo-300 tabular-nums">
                  {formatCurrency(results.monthlyDiscretionary, currency.symbol)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Positivity Mini-Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Financial Positivity:</span>
              <span
                className="font-bold px-2 py-0.5 rounded-full text-[11px]"
                style={{
                  backgroundColor: `${results.positivity.color}15`,
                  color: results.positivity.color,
                }}
              >
                {results.positivity.tier} ({results.positivity.score}/100)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${results.positivity.score}%`,
                  backgroundColor: results.positivity.color,
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {results.positivity.runwayMonths} months emergency buffer. Check the &quot;Earning Positivity&quot; tab for full diagnostics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
