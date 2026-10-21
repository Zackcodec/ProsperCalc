import React, { useState } from 'react';
import { UserPortfolio, Currency, CURRENCIES } from '../types';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onLoginSuccess: (userData: Partial<UserPortfolio>) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currency,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up inputs
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupHeadline, setSignupHeadline] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupTargetGoal, setSignupTargetGoal] = useState<number>(250000);
  const [signupPhone, setSignupPhone] = useState('');
  const [signupLocation, setSignupLocation] = useState('Bengaluru, India');
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Construct user profile
      const userPayload: Partial<UserPortfolio> = {
        email: loginEmail,
        fullName: loginEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Active Trader',
        isLoggedIn: true,
      };
      onLoginSuccess(userPayload);
      onClose();
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to terms of service.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userPayload: Partial<UserPortfolio> = {
        fullName: signupName.trim(),
        email: signupEmail.trim(),
        headline: signupHeadline.trim() || 'Freelance & Career Builder',
        phone: signupPhone.trim() || '+91 98000 00000',
        location: signupLocation.trim() || 'India',
        targetMonthlyGoal: Number(signupTargetGoal) || 200000,
        subscriptionPlan: 'free',
        isLoggedIn: true,
      };
      onLoginSuccess(userPayload);
      onClose();
    }, 700);
  };

  const handleQuickDemoLogin = (type: 'arjun' | 'priya' | 'rohan' | 'vikram') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      let demoData: Partial<UserPortfolio> = {};

      if (type === 'arjun') {
        demoData = {
          fullName: 'Arjun Patel',
          email: 'arjun.patel@prospercalc.io',
          headline: 'Senior Freelance AI Solutions Architect & Quant Consultant',
          phone: '+91 98201 45892',
          location: 'Bengaluru, India',
          role: 'freelancer',
          targetMonthlyGoal: 250000,
          targetRetirementAge: 42,
          monthlySavingsPercent: 35,
          emergencyFundMonths: 6,
          riskProfile: 'Barbell Strategy',
          subscriptionPlan: 'starter',
          isLoggedIn: true,
        };
      } else if (type === 'priya') {
        demoData = {
          fullName: 'Priya Sharma',
          email: 'priya.sharma@saasgrowth.dev',
          headline: 'B2B Micro-SaaS Founder & Growth Engineer',
          phone: '+91 99342 11045',
          location: 'Mumbai, India',
          role: 'founder',
          targetMonthlyGoal: 500000,
          targetRetirementAge: 38,
          monthlySavingsPercent: 45,
          emergencyFundMonths: 9,
          riskProfile: 'Aggressive Growth',
          subscriptionPlan: 'pro',
          isLoggedIn: true,
        };
      } else if (type === 'rohan') {
        demoData = {
          fullName: 'Rohan Verma',
          email: 'rohan.starter@gmail.com',
          headline: 'Junior Web Dev & ₹2,000 Starter Seed Builder',
          phone: '+91 88761 33219',
          location: 'Pune, India',
          role: 'student',
          targetMonthlyGoal: 85000,
          targetRetirementAge: 45,
          monthlySavingsPercent: 25,
          emergencyFundMonths: 3,
          riskProfile: 'Balanced (14% CAGR)',
          subscriptionPlan: 'starter',
          isLoggedIn: true,
        };
      } else {
        demoData = {
          fullName: 'Vikram Malhotra',
          email: 'vikram.trader@alphacapital.in',
          headline: 'Algorithmic Financial Engineer & High-Ticket Consultant',
          phone: '+91 98110 55432',
          location: 'New Delhi, India',
          role: 'pro_trader',
          targetMonthlyGoal: 1000000,
          targetRetirementAge: 40,
          monthlySavingsPercent: 50,
          emergencyFundMonths: 12,
          riskProfile: 'Barbell Strategy',
          subscriptionPlan: 'accelerator',
          isLoggedIn: true,
        };
      }

      onLoginSuccess(demoData);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>ProsperCalc Wealth Account</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {mode === 'signin' && 'Welcome Back to ProsperCalc'}
            {mode === 'signup' && 'Create Your Wealth Profile'}
            {mode === 'demo' && 'Quick 1-Click Demo Profiles'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'signin' && 'Sign in to access personalized cashflows, ₹2,000 life plans & reports.'}
            {mode === 'signup' && 'Personalize your financial trajectory and unlock tailored career roadmaps.'}
            {mode === 'demo' && 'Instantly preview real verified portfolios without entering passwords.'}
          </p>

          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-1.5 mt-5 p-1 bg-white/10 backdrop-blur-xs rounded-xl text-xs font-medium">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setMode('demo');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                mode === 'demo'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-emerald-300 hover:text-emerald-200'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>1-Click Demo</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN TAB */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. arjun.patel@prospercalc.io"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-bold">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email!')}
                    className="text-[11px] text-indigo-600 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm mt-3 cursor-pointer"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-[11px]">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Create a free profile
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 2. SIGN UP TAB */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Arjun Patel"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="arjun@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Professional Focus / Role</label>
                  <input
                    type="text"
                    value={signupHeadline}
                    onChange={(e) => setSignupHeadline(e.target.value)}
                    placeholder="e.g. AI Consultant & Freelance Architect"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Monthly Freedom Goal ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={signupTargetGoal}
                    onChange={(e) => setSignupTargetGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Region</label>
                  <input
                    type="text"
                    value={signupLocation}
                    onChange={(e) => setSignupLocation(e.target.value)}
                    placeholder="Bengaluru, India"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Create Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-slate-600 text-[11px]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                  />
                  <span>
                    I agree to the ProsperCalc Wealth Planning Terms and authorize customized career and life roadmap generation.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm mt-3 cursor-pointer"
              >
                {isLoading ? (
                  <span>Creating Your Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Profile & Generate Life Plan</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-slate-500 text-[11px]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* 3. QUICK 1-CLICK DEMO ACCOUNTS */}
          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                Select any verified demo profile below to instantly experience custom rates, tailored life plans, and editable credentials:
              </p>

              {/* Demo Profile 1: Arjun Patel */}
              <div
                onClick={() => handleQuickDemoLogin('arjun')}
                className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    AP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Arjun Patel</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ₹2,000 Starter Plan
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 block">
                      AI Solutions Architect · ₹2.5L/mo Target · Bengaluru
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shrink-0">
                  Switch
                </button>
              </div>

              {/* Demo Profile 2: Priya Sharma */}
              <div
                onClick={() => handleQuickDemoLogin('priya')}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    PS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Priya Sharma</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        Pro Trader Tier
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 block">
                      Micro-SaaS Founder · ₹5.0L/mo Target · Mumbai
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 group-hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0">
                  Switch
                </button>
              </div>

              {/* Demo Profile 3: Rohan Verma */}
              <div
                onClick={() => handleQuickDemoLogin('rohan')}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    RV
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Rohan Verma</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        ₹2k Starter Student
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 block">
                      Junior Web Dev · ₹85,000/mo Target · Pune
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 group-hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0">
                  Switch
                </button>
              </div>

              {/* Demo Profile 4: Vikram Malhotra */}
              <div
                onClick={() => handleQuickDemoLogin('vikram')}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    VM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">Vikram Malhotra</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        Elite Syndicate
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 block">
                      Quant Financial Engineer · ₹10.0L/mo Target · New Delhi
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 group-hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0">
                  Switch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
