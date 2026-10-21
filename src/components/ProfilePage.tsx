import React, { useState } from 'react';
import { UserPortfolio, Currency } from '../types';
import { formatWealthCurrency } from '../utils/wealthPlanner';
import {
  User,
  Shield,
  CreditCard,
  Zap,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Edit3,
  Save,
  Download,
  Wallet,
  PiggyBank,
  PieChart,
  FileText,
  Phone,
  MapPin,
  Lock,
  Smartphone,
  Key,
  Compass,
  AlertCircle,
  LogIn,
} from 'lucide-react';

interface ProfilePageProps {
  portfolio: UserPortfolio;
  currency: Currency;
  onOpenPricing: () => void;
  onOpenAuth?: () => void;
  onUpdateProfile?: (updated: Partial<UserPortfolio>) => void;
  onNavigateToLifePlan?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  portfolio,
  currency,
  onOpenPricing,
  onOpenAuth,
  onUpdateProfile,
  onNavigateToLifePlan,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'wealth' | 'security' | 'billing'>('profile');

  // Form states initialized with current portfolio
  const [name, setName] = useState(portfolio.fullName);
  const [email, setEmail] = useState(portfolio.email);
  const [headline, setHeadline] = useState(portfolio.headline);
  const [phone, setPhone] = useState(portfolio.phone || '+91 98201 45892');
  const [location, setLocation] = useState(portfolio.location || 'Bengaluru, India');
  const [targetGoal, setTargetGoal] = useState(portfolio.targetMonthlyGoal);
  const [targetAge, setTargetAge] = useState(portfolio.targetRetirementAge || 42);
  const [savingsPct, setSavingsPct] = useState(portfolio.monthlySavingsPercent || 35);
  const [emergencyMonths, setEmergencyMonths] = useState(portfolio.emergencyFundMonths || 6);
  const [riskProfile, setRiskProfile] = useState<UserPortfolio['riskProfile']>(
    portfolio.riskProfile || 'Barbell Strategy'
  );

  React.useEffect(() => {
    setName(portfolio.fullName);
    setEmail(portfolio.email);
    setHeadline(portfolio.headline);
    setPhone(portfolio.phone || '');
    setLocation(portfolio.location || '');
    setTargetGoal(portfolio.targetMonthlyGoal);
    setTargetAge(portfolio.targetRetirementAge || 42);
    setSavingsPct(portfolio.monthlySavingsPercent || 35);
    setEmergencyMonths(portfolio.emergencyFundMonths || 6);
    setRiskProfile(portfolio.riskProfile || 'Barbell Strategy');
  }, [portfolio]);

  // Security tab states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Calculations
  const totalMonthlyInflow = portfolio.streams
    .filter((s) => s.status !== 'paused')
    .reduce((sum, s) => sum + s.monthlyGross, 0);

  const goalProgressPct = Math.min(
    100,
    portfolio.targetMonthlyGoal > 0
      ? (totalMonthlyInflow / portfolio.targetMonthlyGoal) * 100
      : 0
  );

  // 5-Year Compound Net Worth Projection based on savings & CAGR
  const monthlySavingsAmount = (totalMonthlyInflow * savingsPct) / 100;
  const cagr = riskProfile === 'Conservative' ? 0.08 : riskProfile === 'Balanced (14% CAGR)' ? 0.14 : riskProfile === 'Aggressive Growth' ? 0.18 : 0.15;
  const monthlyRate = cagr / 12;
  const months = 60; // 5 years
  const projected5YrNetWorth =
    monthlySavingsAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        fullName: name.trim(),
        email: email.trim(),
        headline: headline.trim(),
        phone: phone.trim(),
        location: location.trim(),
        targetMonthlyGoal: Number(targetGoal) || 250000,
        targetRetirementAge: Number(targetAge) || 42,
        monthlySavingsPercent: Number(savingsPct) || 35,
        emergencyFundMonths: Number(emergencyMonths) || 6,
        riskProfile,
      });
    }
    setIsEditing(false);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
      {/* 1. Profile Header Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
            {/* Avatar with Status Badge */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-sm">
                {portfolio.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                  {portfolio.fullName}
                </h2>
                <span
                  className={`text-[10px] uppercase font-extrabold px-3 py-0.5 rounded-full border whitespace-nowrap ${
                    portfolio.subscriptionPlan === 'accelerator'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : portfolio.subscriptionPlan === 'pro'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                      : portfolio.subscriptionPlan === 'starter'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {portfolio.subscriptionPlan === 'accelerator'
                    ? 'Elite Syndicate'
                    : portfolio.subscriptionPlan === 'pro'
                    ? 'Pro Trader'
                    : portfolio.subscriptionPlan === 'starter'
                    ? '₹2,000 Starter Blueprint'
                    : 'Free Edition'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">{portfolio.headline}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{portfolio.location || 'India'}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <span>{portfolio.email}</span>
                </span>
                {portfolio.phone && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{portfolio.phone}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Switch User</span>
              </button>
            )}

            <button
              onClick={onOpenPricing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Plan / Billing</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Editing Drawer */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Edit Profile & Personalized Wealth Settings</span>
              </h3>
              <span className="text-[11px] text-slate-500">All fields sync automatically</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div>
                <label className="text-slate-600 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Professional Title / Role</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">City / Region</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  Monthly Freedom Goal ({currency.symbol})
                </label>
                <input
                  type="number"
                  step="10000"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Target Freedom Age</label>
                <input
                  type="number"
                  min="25"
                  max="70"
                  value={targetAge}
                  onChange={(e) => setTargetAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Monthly Savings Target (%)</label>
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={savingsPct}
                  onChange={(e) => setSavingsPct(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Risk & Allocation Profile</label>
                <select
                  value={riskProfile}
                  onChange={(e) => setRiskProfile(e.target.value as UserPortfolio['riskProfile'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 cursor-pointer"
                >
                  <option value="Conservative">Conservative (8% Index CAGR)</option>
                  <option value="Balanced (14% CAGR)">Balanced (14% CAGR)</option>
                  <option value="Aggressive Growth">Aggressive Growth (18% CAGR)</option>
                  <option value="Barbell Strategy">Barbell Strategy (Safe + Asymmetric)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Marketing / Personalize Life Wealth Plan Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-indigo-800/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-emerald-400 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PERSONALIZED FOR {portfolio.fullName.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-medium">₹2,000 Starter Life Plan</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              Turn ₹2,000 into {formatWealthCurrency(projected5YrNetWorth, currency)} Projected 5-Year Net Worth
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your target of {formatWealthCurrency(portfolio.targetMonthlyGoal, currency)}/mo and {savingsPct}% monthly savings rate, your 4-phase career roadmap provides the exact step-by-step blueprint to scale from initial seed to compounding wealth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {onNavigateToLifePlan && (
              <button
                onClick={onNavigateToLifePlan}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Open Personalized Plan</span>
              </button>
            )}
            <button
              onClick={onOpenPricing}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Activate Starter Tier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Financial Milestone & Freedom Target Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Current Monthly Cashflow
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
            {formatWealthCurrency(totalMonthlyInflow, currency)}
            <span className="text-xs text-slate-400 font-normal ml-1">/mo</span>
          </div>
          <span className="text-xs text-emerald-600 font-medium block">
            Annual: {formatWealthCurrency(totalMonthlyInflow * 12, currency)}
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Freedom Target Velocity
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tracking-tight tabular-nums">
            {formatWealthCurrency(portfolio.targetMonthlyGoal, currency)}
            <span className="text-xs text-slate-400 font-normal ml-1">/mo</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${goalProgressPct}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {goalProgressPct.toFixed(0)}% achieved towards target freedom
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            5-Year Projected Net Worth
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight tabular-nums">
            {formatWealthCurrency(projected5YrNetWorth, currency)}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Compounding @ {Math.round(cagr * 100)}% CAGR ({savingsPct}% saved/mo)
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Emergency Runway & Buffer
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
            {emergencyMonths} Months
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Safeguards downside freedom before aggressive reinvestment.
          </p>
        </div>
      </div>

      {/* 4. Sub-Navigation Tabs for Account Details */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Asset Allocation Engine', icon: PieChart },
          { id: 'wealth', label: 'Milestones & Targets', icon: Award },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'billing', label: 'Invoices & Billing', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: Barbell Asset Allocation Engine */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {portfolio.fullName}&apos;s Barbell Wealth Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Allocating your monthly savings ({formatWealthCurrency(monthlySavingsAmount, currency)}/mo)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {Math.round(cagr * 100)}% Target Compound CAGR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Liquid Cash & Emergency (20%)
              </span>
              <div className="text-base font-bold text-slate-900 font-mono">
                {formatWealthCurrency(monthlySavingsAmount * 0.2, currency)}/mo
              </div>
              <p className="text-[11px] text-slate-500">Arbitrage / Overnight funds buffer</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Core Equity Index (50%)
              </span>
              <div className="text-base font-bold text-emerald-800 font-mono">
                {formatWealthCurrency(monthlySavingsAmount * 0.5, currency)}/mo
              </div>
              <p className="text-[11px] text-emerald-600">Nifty 50 & S&P 500 low-cost index</p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Midcap & Growth (20%)
              </span>
              <div className="text-base font-bold text-indigo-800 font-mono">
                {formatWealthCurrency(monthlySavingsAmount * 0.2, currency)}/mo
              </div>
              <p className="text-[11px] text-indigo-600">High-velocity wealth expansion</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Hard Assets & REITs (10%)
              </span>
              <div className="text-base font-bold text-amber-900 font-mono">
                {formatWealthCurrency(monthlySavingsAmount * 0.1, currency)}/mo
              </div>
              <p className="text-[11px] text-amber-700">Sovereign Gold Bonds & REITs</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Milestones & Stream Breakdown */}
      {activeSubTab === 'wealth' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Career & Income Stream Milestones</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {portfolio.milestones.filter((m) => m.achieved).length} of {portfolio.milestones.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {portfolio.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  milestone.achieved
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    milestone.achieved
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-slate-300 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{milestone.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                    <span className="font-bold text-indigo-600">
                      {formatWealthCurrency(milestone.targetAmount, currency)}
                    </span>
                    {milestone.dateAchieved && (
                      <span className="text-emerald-700 font-sans">· Verified {milestone.dateAchieved}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Security & Credentials */}
      {activeSubTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6 text-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Account Credentials & Security Controls</span>
            </h3>
            <p className="text-slate-500">
              Manage multi-factor authentication, active login sessions, and password credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-500">
                    Require OTP SMS or Authenticator App on new logins
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800">Password Security</h4>
                  <p className="text-[11px] text-slate-500">Last updated 14 days ago</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg font-bold text-slate-700 cursor-pointer shrink-0"
              >
                Change
              </button>
            </div>
          </div>

          {showPasswordChange && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
              <h4 className="font-bold text-slate-800">Update Password</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">New Secure Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  alert('Password successfully updated!');
                  setShowPasswordChange(false);
                  setCurrentPassword('');
                  setNewPassword('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
              >
                Confirm Update
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: Payment & Transaction History Ledger */}
      {activeSubTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Billing Ledger & Official Tax Invoices
              </h3>
            </div>
            <button
              onClick={onOpenPricing}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              + Upgrade Plan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice / Txn ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Plan / Service</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {portfolio.paymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{item.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.planName}</td>
                    <td className="py-3 px-4 text-slate-600">{item.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatWealthCurrency(item.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(item.id)}
                        className="px-2 py-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
