import React, { useState } from 'react';
import { PricingPlan, Currency, UserPortfolio, CURRENCIES } from '../types';
import {
  SOFTWARE_PRICING_PLANS,
  formatWealthCurrency,
  exchangeCurrencyAmount,
} from '../utils/wealthPlanner';
import {
  ShieldCheck,
  Check,
  Zap,
  CreditCard,
  QrCode,
  Lock,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
  Tag,
  Building,
  Globe,
  Download,
  FileText,
  Repeat,
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  portfolio: UserPortfolio;
  onUpgradePlan: (
    plan: PricingPlan['id'],
    planName: string,
    amount: number,
    paymentMethod: string
  ) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currency,
  portfolio,
  onUpgradePlan,
}) => {
  // Default to the ₹2,000 Starter Wealth Blueprint
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(SOFTWARE_PRICING_PLANS[1]);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'paypal'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8921 7734 8891');
  const [cardHolder, setCardHolder] = useState(portfolio.fullName || 'Alex Vance');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('429');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPct, setAppliedDiscountPct] = useState(0);
  const [couponStatus, setCouponStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<{
    id: string;
    date: string;
    amount: number;
    plan: string;
  } | null>(null);

  if (!isOpen) return null;

  // Price in current currency
  const basePrice = currency.isINR
    ? selectedPlan.priceINR
    : exchangeCurrencyAmount(selectedPlan.priceINR, 'INR', currency.code);

  const discountAmount = Math.round(basePrice * (appliedDiscountPct / 100));
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'WEALTH2026' || clean === 'STARTER20') {
      setAppliedDiscountPct(20);
      setCouponStatus('Coupon applied! 20% discount granted.');
    } else if (clean === 'PROSPER50') {
      setAppliedDiscountPct(50);
      setCouponStatus('VIP 50% discount applied!');
    } else {
      setCouponStatus('Invalid coupon code. Try WEALTH2026');
    }
  };

  const handleProceedToPayment = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    if (plan.id === 'free') {
      onUpgradePlan('free', plan.name, 0, 'Community Tier');
      onClose();
      return;
    }
    setIsCheckoutStep(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const dateStr = new Date().toISOString().split('T')[0];

      const methodLabel =
        paymentMethod === 'upi'
          ? `UPI (${upiApp.toUpperCase()} - ${upiId})`
          : paymentMethod === 'card'
          ? 'Credit Card (Visa/RuPay)'
          : paymentMethod === 'netbanking'
          ? `Net Banking (${selectedBank})`
          : 'Stripe / PayPal';

      setCompletedInvoice({
        id: txnId,
        date: dateStr,
        amount: finalPrice,
        plan: selectedPlan.name,
      });

      onUpgradePlan(selectedPlan.id, selectedPlan.name, finalPrice, methodLabel);

      setTimeout(() => {
        setIsSuccess(false);
        setIsCheckoutStep(false);
        onClose();
      }, 3000);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">
              {isCheckoutStep ? 'Secure Payment & Wealth Activation' : 'ProsperCalc Software Pricing & Wealth Access'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!isCheckoutStep ? (
            /* STEP 1: Plan Comparison Cards */
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Fair Pricing For Career Growth
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Select Your Wealth Growth Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Start with the ₹2,000 Starter Wealth Blueprint or upgrade to Pro Trader & Elite Accelerator with lifetime updates.
                </p>
              </div>

              {/* Dynamic Currency Exchange Info Pill */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 py-2 px-4 rounded-xl max-w-md mx-auto border border-slate-200">
                <Repeat className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  Pricing converted to <strong>{currency.name} ({currency.symbol})</strong> at current market rate.
                </span>
              </div>

              {/* 3 Main Paid Tiers + Free Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {SOFTWARE_PRICING_PLANS.slice(1).map((plan) => {
                  const isCurrent = portfolio.subscriptionPlan === plan.id;
                  const planPrice = currency.isINR
                    ? plan.priceINR
                    : exchangeCurrencyAmount(plan.priceINR, 'INR', currency.code);

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-2xl p-6 border flex flex-col justify-between transition-all relative ${
                        plan.isPopular
                          ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20 bg-indigo-50/20'
                          : plan.id === 'starter'
                          ? 'border-emerald-500/80 shadow-xs bg-emerald-50/10'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {plan.badge && (
                        <div
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs ${
                            plan.id === 'starter' ? 'bg-emerald-600' : 'bg-indigo-600'
                          }`}
                        >
                          {plan.badge}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{plan.tagline}</p>
                        </div>

                        {/* Price */}
                        <div className="pt-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                              {formatWealthCurrency(planPrice, currency)}
                            </span>
                            <span className="text-xs text-slate-500 font-sans">
                              {plan.billingCadence}
                            </span>
                          </div>
                          {currency.code !== 'INR' && (
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              (Base: ₹{plan.priceINR.toLocaleString('en-IN')})
                            </span>
                          )}
                        </div>

                        {/* Feature Checklist */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-slate-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6">
                        {isCurrent ? (
                          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold text-center">
                            Currently Active Plan
                          </div>
                        ) : (
                          <button
                            onClick={() => handleProceedToPayment(plan)}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                              plan.id === 'starter'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            <span>Activate {plan.name.split(' ')[0]}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Free Community Option */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => handleProceedToPayment(SOFTWARE_PRICING_PLANS[0])}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline cursor-pointer"
                >
                  Continue with Free Community Preview (Limited functionality)
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: CHECKOUT & PAYMENT PAGE */
            <div className="space-y-6">
              {isSuccess && completedInvoice ? (
                /* Success Celebration State */
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Payment Successful!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your account has been upgraded to <strong>{completedInvoice.plan}</strong>. All financial blueprints, trading indicators, and export features are now unlocked.
                  </p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Invoice ID:</span>
                      <span className="font-bold text-slate-900">{completedInvoice.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid:</span>
                      <span className="font-bold text-emerald-600">
                        {formatWealthCurrency(completedInvoice.amount, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-700 font-bold">Completed (Tax Invoice Generated)</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Payment Form */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Order Summary & Coupon */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Order Summary
                        </span>
                        <button
                          onClick={() => setIsCheckoutStep(false)}
                          className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                        >
                          Change Plan
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                          <span>{selectedPlan.name}</span>
                          <span className="font-mono">
                            {formatWealthCurrency(basePrice, currency)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{selectedPlan.tagline}</p>

                        {appliedDiscountPct > 0 && (
                          <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold pt-1">
                            <span>Discount ({appliedDiscountPct}% off):</span>
                            <span className="font-mono">
                              -{formatWealthCurrency(discountAmount, currency)}
                            </span>
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-extrabold text-slate-900">
                          <span>Total Amount:</span>
                          <span className="font-mono text-emerald-600 text-lg tabular-nums">
                            {formatWealthCurrency(finalPrice, currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Code Input */}
                    <form
                      onSubmit={handleApplyCoupon}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                    >
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Have a Promo Coupon?</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. WEALTH2026"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponStatus && (
                        <p
                          className={`text-[11px] ${
                            appliedDiscountPct > 0 ? 'text-emerald-600 font-bold' : 'text-rose-500'
                          }`}
                        >
                          {couponStatus}
                        </p>
                      )}
                    </form>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 p-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>256-Bit SSL Encrypted & Bank-Grade Security</span>
                    </div>
                  </div>

                  {/* Right Column: Payment Gateway Selector & Form */}
                  <div className="lg:col-span-7 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">
                      Select Payment Method
                    </h4>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'upi'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>UPI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'netbanking'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Building className="w-4 h-4" />
                        <span>NetBanking</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'paypal'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        <span>Stripe/Pay</span>
                      </button>
                    </div>

                    <form onSubmit={handleExecutePayment} className="space-y-4 pt-2">
                      {/* UPI Option */}
                      {paymentMethod === 'upi' && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">
                              Instant UPI Autopay / QR Scan
                            </span>
                            <div className="flex items-center gap-1">
                              {(['gpay', 'phonepe', 'paytm', 'cred'] as const).map((app) => (
                                <button
                                  key={app}
                                  type="button"
                                  onClick={() => setUpiApp(app)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                    upiApp === app
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-white border text-slate-600'
                                  }`}
                                >
                                  {app}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                            {/* Visual QR Code Generator */}
                            <div className="w-24 h-24 bg-slate-900 rounded-lg flex items-center justify-center text-white p-2 shrink-0">
                              <QrCode className="w-20 h-20 text-white" />
                            </div>
                            <div className="space-y-1 text-xs text-center sm:text-left">
                              <span className="font-bold text-slate-900 block">
                                Scan with any UPI app
                              </span>
                              <p className="text-[11px] text-slate-500">
                                Google Pay, PhonePe, Paytm, or Cred
                              </p>
                              <span className="text-[11px] font-mono font-bold text-indigo-600 block">
                                VPA: prospercalc@okhdfcbank
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Or Enter Your UPI ID (VPA):
                            </label>
                            <input
                              type="text"
                              required
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. yourname@oksbi"
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Card Option */}
                      {paymentMethod === 'card' && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              required
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Card Number (RuPay, Visa, Mastercard)
                            </label>
                            <input
                              type="text"
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                Expiry (MM/YY)
                              </label>
                              <input
                                type="text"
                                required
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                CVV
                              </label>
                              <input
                                type="password"
                                maxLength={4}
                                required
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Net Banking Option */}
                      {paymentMethod === 'netbanking' && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <label className="text-[11px] font-bold text-slate-600 block">
                            Select Your Bank
                          </label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="State Bank of India">State Bank of India (SBI)</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          </select>
                          <p className="text-[11px] text-slate-500">
                            You will be safely routed to your bank's secure netbanking portal.
                          </p>
                        </div>
                      )}

                      {/* International Stripe/PayPal */}
                      {paymentMethod === 'paypal' && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <span className="font-bold text-slate-800 block">
                            International Multi-Currency Checkout
                          </span>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Supports international cards, Apple Pay, Google Pay, and PayPal from 140+ countries. Converted automatically to your local banking currency.
                          </p>
                        </div>
                      )}

                      {/* Submit / Pay Button */}
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing Secure Payment...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>
                              Pay {formatWealthCurrency(finalPrice, currency)} & Activate Plan
                            </span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
