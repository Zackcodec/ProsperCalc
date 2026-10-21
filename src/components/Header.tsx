import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  UserCheck,
  HelpCircle,
  Settings,
  Download,
  BarChart3,
  Compass,
  User,
  Sparkles,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Currency, CURRENCIES, UserPortfolio } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  onOpenExport: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  portfolio: UserPortfolio;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  isAdminMode,
  setIsAdminMode,
  onOpenExport,
  onOpenPricing,
  onOpenAuth,
  portfolio,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'calculator', label: 'Calculator', icon: TrendingUp },
    { id: 'trading', label: 'Trading Chart', icon: BarChart3 },
    { id: 'wealthplan', label: 'Life Wealth Plan', icon: Compass, badge: '₹2,000' },
    { id: 'positivity', label: 'Earning Positivity', icon: ShieldCheck },
    { id: 'learn', label: 'Earn While Learn', icon: GraduationCap },
    { id: 'industries', label: 'Best Industries', icon: Briefcase },
    { id: 'portfolio', label: isAdminMode ? 'Admin & Portfolio' : 'Portfolio', icon: UserCheck },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('calculator')}
              className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none"
              aria-label="ProsperCalc Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm">
                P
              </div>
              <div className="min-w-0">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight truncate">
                  ProsperCalc
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 hidden sm:block leading-none">
                  Earning & Career Suite
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-sm font-medium text-slate-600 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'text-indigo-600 font-semibold'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-[-19px] left-0 right-0 h-0.5 bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Protected from screen margin overflow) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Currency Selector */}
            <div className="relative">
              <label htmlFor="currency-select" className="sr-only">
                Select Currency
              </label>
              <select
                id="currency-select"
                value={currency.code}
                onChange={(e) => {
                  const found = CURRENCIES.find((c) => c.code === e.target.value);
                  if (found) setCurrency(found);
                }}
                className="text-[11px] sm:text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg px-2 sm:px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing / Upgrade Button */}
            <button
              onClick={onOpenPricing}
              className="px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
              title="View Software Pricing & Payment Plans"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden xs:inline">Pricing</span>
            </button>

            {/* Admin / User toggle (Hidden on very narrow mobile, accessible via More drawer) */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`hidden md:flex text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors items-center gap-1.5 whitespace-nowrap ${
                isAdminMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle between User Portfolio and Admin Overview"
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span>{isAdminMode ? 'Admin' : 'User'}</span>
            </button>

            {/* Export Action (Desktop / Tablet) */}
            <button
              onClick={onOpenExport}
              className="hidden sm:flex px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors items-center gap-1.5 shadow-xs whitespace-nowrap"
              title="Export Earning Plan & Statement"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Export</span>
            </button>

            {/* User Account / Auth Button & Dropdown */}
            <div className="relative">
              {portfolio.isLoggedIn ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {portfolio.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[90px]">
                      {portfolio.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block leading-tight">
                      {portfolio.subscriptionPlan === 'starter'
                        ? '₹2k Starter'
                        : portfolio.subscriptionPlan === 'pro'
                        ? 'Pro Trader'
                        : portfolio.subscriptionPlan === 'accelerator'
                        ? 'Syndicate'
                        : 'Free'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && portfolio.isLoggedIn && (
                <div
                  onClick={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50"
                >
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block truncate">{portfolio.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-mono block truncate">
                      {portfolio.email}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.2 rounded-full text-[9px] uppercase font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {portfolio.subscriptionPlan.toUpperCase()} TIER
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-700 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>View & Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenPricing();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2 text-indigo-700 font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Upgrade / Invoices</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      onOpenAuth();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-600 font-medium"
                  >
                    <LogIn className="w-4 h-4 text-slate-400" />
                    <span>Switch User / Demo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tablet / Sub-desktop horizontal navigation scroll strip */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[8px] font-extrabold px-1 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
