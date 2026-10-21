import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Compass,
  Briefcase,
  User,
  MoreHorizontal,
  X,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Sparkles,
  HelpCircle,
  Download,
  Settings,
  LogIn,
  LogOut,
} from 'lucide-react';
import { UserPortfolio } from '../types';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  portfolio: UserPortfolio;
  onOpenPricing: () => void;
  onOpenExport: () => void;
  onOpenAuth: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  portfolio,
  onOpenPricing,
  onOpenExport,
  onOpenAuth,
  isAdminMode,
  setIsAdminMode,
}) => {
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'calculator', label: 'Calculator', icon: TrendingUp },
    { id: 'trading', label: 'Trading', icon: BarChart3 },
    { id: 'wealthplan', label: 'Life Plan', icon: Compass, badge: '₹2,000' },
    { id: 'industries', label: 'Industries', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMoreDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Bottom Floating Bar for Mobile & Tablet screens */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-1.5 flex items-center justify-around safe-area-pb"
      >
        {mainTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {item.badge && (
                <span className="absolute -top-1 right-0 text-[8px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                  {item.badge}
                </span>
              )}

              {item.id === 'profile' && portfolio.isLoggedIn ? (
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {portfolio.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              ) : (
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              )}

              <span className="text-[10px] leading-tight mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More Options Button */}
        <button
          onClick={() => setIsMoreDrawerOpen(!isMoreDrawerOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            isMoreDrawerOpen
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] leading-tight mt-0.5 tracking-tight">More</span>
        </button>
      </nav>

      {/* "More" Drawer Modal for Mobile & Tablet */}
      {isMoreDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl max-h-[80vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  P
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">All Sections & Tools</h3>
                  <p className="text-[11px] text-slate-500">Quick access on mobile and tablet</p>
                </div>
              </div>
              <button
                onClick={() => setIsMoreDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Account Quick Card in Drawer */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {portfolio.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{portfolio.fullName}</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      {portfolio.subscriptionPlan}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono truncate block max-w-[180px]">
                    {portfolio.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMoreDrawerOpen(false);
                  onOpenAuth();
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>
            </div>

            {/* Additional Navigation Links */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSelectTab('positivity')}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-colors ${
                  activeTab === 'positivity'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Financial Positivity</span>
              </button>

              <button
                onClick={() => handleSelectTab('learn')}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-colors ${
                  activeTab === 'learn'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Earn While Learn</span>
              </button>

              <button
                onClick={() => handleSelectTab('portfolio')}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-colors ${
                  activeTab === 'portfolio'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Portfolio Ledger</span>
              </button>

              <button
                onClick={() => handleSelectTab('faq')}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-colors ${
                  activeTab === 'faq'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
                <span>FAQ & Knowledge</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setIsMoreDrawerOpen(false);
                  onOpenPricing();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Software Pricing & ₹2,000 Starter Activation</span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsMoreDrawerOpen(false);
                    onOpenExport();
                  }}
                  className="py-2 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Statement</span>
                </button>

                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`py-2 px-3 border rounded-xl font-semibold flex items-center justify-center gap-1.5 ${
                    isAdminMode
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{isAdminMode ? 'Admin Mode ON' : 'Toggle Admin'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
