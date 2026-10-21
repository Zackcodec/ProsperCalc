import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Currency,
  CURRENCIES,
  CalculatorInputs,
  UserPortfolio,
  PricingPlan,
  AchievementBadge,
} from './types';
import {
  DEFAULT_CALCULATOR_INPUTS,
  DEFAULT_USER_PORTFOLIO,
  calculateEarnings,
} from './utils/calculator';
import { evaluateAchievements, detectNewlyUnlockedBadges } from './utils/achievementSystem';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { AuthModal } from './components/AuthModal';
import { CalculatorSection } from './components/CalculatorSection';
import { VisualGraphs } from './components/VisualGraphs';
import { TradingEarningChart } from './components/TradingEarningChart';
import { WealthLifePlan } from './components/WealthLifePlan';
import { PricingModal } from './components/PricingModal';
import { ProfilePage } from './components/ProfilePage';
import { PositivityHealthScore } from './components/PositivityHealthScore';
import { EarnWhileLearnSection } from './components/EarnWhileLearnSection';
import { BestIndustriesSection } from './components/BestIndustriesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { FAQSection } from './components/FAQSection';
import { ExportModal } from './components/ExportModal';
import { CelebrationBadgeModal } from './components/CelebrationBadgeModal';
import { CheckCircle2, TrendingUp, Compass, Sparkles } from 'lucide-react';

const STORAGE_KEY_INPUTS = 'prospercalc_inputs_v2';
const STORAGE_KEY_PORTFOLIO = 'prospercalc_portfolio_v2';
const STORAGE_KEY_UNLOCKED_BADGES = 'prospercalc_unlocked_badges_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // Default to INR ₹
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminMultiplier, setAdminMultiplier] = useState<number>(1.0);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize inputs from localStorage or defaults
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INPUTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    // Default to modern realistic freelance setup
    return {
      earningModel: 'freelance',
      baseHourlyRate: 2000,
      hoursPerWeek: 32,
      weeksPerYear: 48,
      monthlySalary: 125000,
      retainerClients: [
        { id: 'c1', name: 'AI Workflows Retainer (Nexus Tech)', monthlyAmount: 75000, category: 'Retainer' },
        { id: 'c2', name: 'Cloud Infrastructure Sprint (Horizon)', monthlyAmount: 45000, category: 'Maintenance' },
      ],
      sideGigMonthly: 25000,
      passiveIncomeMonthly: 12000,
      monthlyExpenses: 65000,
      taxRatePercent: 20,
      savingsTargetPercent: 25,
      currentEmergencyFund: 350000,
      annualBonus: 100000,
    };
  });

  // Initialize portfolio from localStorage or defaults
  const [portfolio, setPortfolio] = useState<UserPortfolio>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_USER_PORTFOLIO;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(inputs));
    } catch (e) {}
  }, [inputs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(portfolio));
    } catch (e) {}
  }, [portfolio]);

  // Badges & Achievements state
  const [celebratingBadge, setCelebratingBadge] = useState<AchievementBadge | null>(null);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED_BADGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const hasInitializedBadges = useRef(false);

  // Derived calculation results
  const results = useMemo(() => {
    return calculateEarnings(inputs);
  }, [inputs]);

  // Derived achievement evaluation based on portfolio and calculator inputs
  const evaluation = useMemo(() => {
    return evaluateAchievements(portfolio, inputs);
  }, [portfolio, inputs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Automatically detect and celebrate newly unlocked visual achievement badges
  useEffect(() => {
    const currentlyUnlockedIds = evaluation.badges.filter((b) => b.unlocked).map((b) => b.id);
    if (!hasInitializedBadges.current) {
      setUnlockedBadgeIds(currentlyUnlockedIds);
      try {
        localStorage.setItem(STORAGE_KEY_UNLOCKED_BADGES, JSON.stringify(currentlyUnlockedIds));
      } catch (e) {}
      hasInitializedBadges.current = true;
      return;
    }

    const newlyUnlocked = detectNewlyUnlockedBadges(evaluation.badges, unlockedBadgeIds);
    if (newlyUnlocked.length > 0) {
      const highestBadge = newlyUnlocked[0];
      setCelebratingBadge(highestBadge);
      const nextUnlocked = Array.from(new Set([...unlockedBadgeIds, ...newlyUnlocked.map((b) => b.id)]));
      setUnlockedBadgeIds(nextUnlocked);
      try {
        localStorage.setItem(STORAGE_KEY_UNLOCKED_BADGES, JSON.stringify(nextUnlocked));
      } catch (e) {}
      showToast(`🏆 Milestone Reached: "${highestBadge.title}" Unlocked! (+${highestBadge.xpPoints} XP)`);
    }
  }, [evaluation.badges, unlockedBadgeIds]);

  const handleLoginSuccess = (userData: Partial<UserPortfolio>) => {
    setPortfolio((prev) => {
      const updated: UserPortfolio = {
        ...prev,
        ...userData,
        isLoggedIn: true,
      };
      return updated;
    });
    showToast(`👋 Welcome back, ${userData.fullName?.split(' ')[0] || 'User'}! Profile loaded.`);
  };

  const handleApplySkillRate = (rate: number, skillName: string) => {
    setInputs((prev) => ({
      ...prev,
      baseHourlyRate: rate,
      earningModel: prev.earningModel === 'salary' ? 'freelance' : prev.earningModel,
    }));
    setActiveTab('calculator');
    showToast(`Applied ${skillName} rate (${currency.symbol}${rate}/hr) to Calculator`);
  };

  const handleApplyIndustry = (monthly: number, hourly: number, industryName: string) => {
    setInputs((prev) => ({
      ...prev,
      monthlySalary: monthly,
      baseHourlyRate: hourly,
      earningModel: 'hybrid',
    }));
    setActiveTab('calculator');
    showToast(`Simulating ${industryName} benchmark (${currency.symbol}${monthly.toLocaleString()}/mo)`);
  };

  const handleApplyPhaseTarget = (targetMonthly: number, phaseTitle: string) => {
    setPortfolio((prev) => ({
      ...prev,
      targetMonthlyGoal: targetMonthly,
    }));
    setInputs((prev) => ({
      ...prev,
      monthlySalary: targetMonthly,
    }));
    setActiveTab('calculator');
    showToast(`Loaded ${phaseTitle} target (${currency.symbol}${targetMonthly.toLocaleString()}/mo) into Calculator & Goal!`);
  };

  const handleUpgradePlan = (
    planId: PricingPlan['id'],
    planName: string,
    amount: number,
    paymentMethod: string
  ) => {
    const newInvoice = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      planName,
      amount,
      currency: currency.code,
      paymentMethod,
      status: 'Completed' as const,
    };

    setPortfolio((prev) => ({
      ...prev,
      subscriptionPlan: planId,
      paymentHistory: [newInvoice, ...prev.paymentHistory],
    }));

    showToast(`🎉 Congratulations! You have upgraded to ${planName}. All features unlocked.`);
  };

  const handleQuickBoost = (updates: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...updates,
    }));
    showToast('Applied scenario boost to your financial calculation');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        portfolio={portfolio}
      />

      {/* Main Workspace Viewport (with safe padding bottom for mobile bottom dock) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8 space-y-6 sm:space-y-8 overflow-hidden">
        {/* TAB 1: Monthly Earning Calculator & Visual Graphs */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 sm:space-y-8">
            <CalculatorSection
              inputs={inputs}
              setInputs={setInputs}
              results={results}
              currency={currency}
              userName={portfolio.fullName}
              onNavigateToLifePlan={() => setActiveTab('wealthplan')}
            />

            <VisualGraphs results={results} currency={currency} />
          </div>
        )}

        {/* TAB 2: Dedicated Trading Terminal View */}
        {activeTab === 'trading' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trading Terminal Architecture</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Revenue TradingView Candlestick & Technical Terminal
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analyze your freelance cashflow volatility, 20-period exponential moving average, and volume momentum
                </p>
              </div>

              <button
                onClick={() => setIsPricingOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Pro Trader</span>
              </button>
            </div>

            <TradingEarningChart
              results={results}
              currency={currency}
              onNavigateToLifePlan={() => setActiveTab('wealthplan')}
              onOpenPricing={() => setIsPricingOpen(true)}
            />
          </div>
        )}

        {/* TAB 3: Full Life Wealth Plan (Personalized ₹2,000 Starter to Wealthy) */}
        {activeTab === 'wealthplan' && (
          <WealthLifePlan
            currency={currency}
            onApplyPhaseTarget={handleApplyPhaseTarget}
            portfolio={portfolio}
            inputs={inputs}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {/* TAB 4: Financial Positivity & Health Score */}
        {activeTab === 'positivity' && (
          <div className="space-y-6 sm:space-y-8">
            <PositivityHealthScore
              results={results}
              currency={currency}
              inputs={inputs}
              onQuickBoost={handleQuickBoost}
            />

            <VisualGraphs results={results} currency={currency} />
          </div>
        )}

        {/* TAB 5: Skills & How to Earn While Learn */}
        {activeTab === 'learn' && (
          <EarnWhileLearnSection
            currency={currency}
            onApplySkillRate={handleApplySkillRate}
            onNavigateToLifePlan={() => setActiveTab('wealthplan')}
          />
        )}

        {/* TAB 6: Best Earning Industries */}
        {activeTab === 'industries' && (
          <BestIndustriesSection
            currency={currency}
            onApplyIndustry={handleApplyIndustry}
            adminMultiplier={adminMultiplier}
            onNavigateToLifePlan={() => setActiveTab('wealthplan')}
          />
        )}

        {/* TAB 7: Portfolio (User & Admin Mode) */}
        {activeTab === 'portfolio' && (
          <PortfolioSection
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            currency={currency}
            isAdminMode={isAdminMode}
            setIsAdminMode={setIsAdminMode}
            adminMultiplier={adminMultiplier}
            setAdminMultiplier={setAdminMultiplier}
            evaluation={evaluation}
            onOpenBadgeDetails={(badge) => setCelebratingBadge(badge)}
          />
        )}

        {/* TAB 8: Dedicated User Profile & Account Page */}
        {activeTab === 'profile' && (
          <ProfilePage
            portfolio={portfolio}
            currency={currency}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateToLifePlan={() => setActiveTab('wealthplan')}
            onUpdateProfile={(updated) => {
              setPortfolio((prev) => ({ ...prev, ...updated }));
              showToast('Profile and wealth target saved successfully!');
            }}
          />
        )}

        {/* TAB 9: FAQ */}
        {activeTab === 'faq' && <FAQSection />}
      </main>

      {/* Pricing & Checkout Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currency={currency}
        portfolio={portfolio}
        onUpgradePlan={handleUpgradePlan}
      />

      {/* Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currency={currency}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Export / Printable Statement Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        results={results}
        inputs={inputs}
        portfolio={portfolio}
        currency={currency}
      />

      {/* Visual Achievement Rewards Celebration Modal */}
      <CelebrationBadgeModal
        badge={celebratingBadge}
        onClose={() => setCelebratingBadge(null)}
        onViewAllBadges={() => {
          setCelebratingBadge(null);
          setActiveTab('portfolio');
        }}
      />

      {/* Mobile & Tablet Automatic Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portfolio={portfolio}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Footer (hidden on print) */}
      <footer className="no-print bg-white border-t border-slate-200 py-8 mt-12 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">ProsperCalc</span>
            <span>·</span>
            <span>Earning Calculator, Trading Graphs, ₹2,000 Starter Life Plan & Wealth Portfolio</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => setActiveTab('calculator')}
              className="hover:text-slate-900 transition-colors"
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('trading')}
              className="hover:text-slate-900 transition-colors"
            >
              Trading Chart
            </button>
            <button
              onClick={() => setActiveTab('wealthplan')}
              className="hover:text-slate-900 transition-colors"
            >
              Life Wealth Plan
            </button>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-slate-900 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className="hover:text-slate-900 transition-colors"
            >
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
