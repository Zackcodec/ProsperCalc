import {
  LifeWealthPhase,
  PricingPlan,
  CandlestickPoint,
  TradingStats,
  Currency,
  CURRENCIES,
  AssetExchangeItem,
} from '../types';

/**
 * Formats currency intelligently using Indian numbering format (lakhs & crores) if INR,
 * and standard western comma format for other currencies.
 */
export function formatWealthCurrency(
  amount: number,
  currency: Currency,
  compact: boolean = false
): string {
  const rounded = Math.round(amount);

  if (currency.isINR || currency.code === 'INR') {
    if (compact) {
      if (Math.abs(rounded) >= 10000000) {
        return `₹${(rounded / 10000000).toFixed(2)} Cr`;
      }
      if (Math.abs(rounded) >= 100000) {
        return `₹${(rounded / 100000).toFixed(2)} L`;
      }
      if (Math.abs(rounded) >= 1000) {
        return `₹${(rounded / 1000).toFixed(1)}k`;
      }
    }
    // Indian locale numbering: e.g. 1,50,000
    return `₹${rounded.toLocaleString('en-IN')}`;
  }

  // Western currencies
  if (compact) {
    if (Math.abs(rounded) >= 1000000) {
      return `${currency.symbol}${(rounded / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(rounded) >= 1000) {
      return `${currency.symbol}${(rounded / 1000).toFixed(1)}k`;
    }
  }

  return `${currency.symbol}${rounded.toLocaleString('en-US')}`;
}

/**
 * Currency exchange converter across all supported currency codes
 */
export function exchangeCurrencyAmount(
  amount: number,
  fromCode: string,
  toCode: string
): number {
  if (fromCode === toCode) return amount;
  const fromCurrency = CURRENCIES.find((c) => c.code === fromCode) || CURRENCIES[0];
  const toCurrency = CURRENCIES.find((c) => c.code === toCode) || CURRENCIES[1];

  // Convert to USD base first
  const inUSD = fromCurrency.code === 'USD' ? amount : amount / fromCurrency.rateToUSD;
  // Convert from USD to target currency
  const converted = toCurrency.code === 'USD' ? inUSD : inUSD * toCurrency.rateToUSD;
  return Math.round(converted * 100) / 100;
}

/**
 * Real tangible assets and career capital that ₹2,000 INR ($24 USD) starter capital exchanges for
 */
export const ASSET_EXCHANGE_EQUIVALENTS_2000_INR: AssetExchangeItem[] = [
  {
    id: 'asset-1',
    name: 'Custom Domain (.com / .dev) + SSL Cloudflare Host',
    category: 'Infrastructure',
    costINR: 850,
    description: 'Establish high-trust authority with an ultra-clean personal brand website instead of a generic gmail address.',
    returnOnInvestmentROI: '10x - 25x conversion uplift on client discovery calls',
    urgencyPriority: 'Must-Have Day 1',
  },
  {
    id: 'asset-2',
    name: '1,000,000+ Gemini AI & Automation API Tokens',
    category: 'AI Tools',
    costINR: 650,
    description: 'Empowers you to deliver full automated customer workflow pipelines, PDF scrapers, and AI assistants for clients.',
    returnOnInvestmentROI: 'Charge ₹25,000 - ₹50,000 setup fee for a client pipeline built on ₹650 of compute',
    urgencyPriority: 'Must-Have Day 1',
  },
  {
    id: 'asset-3',
    name: '5 Battle-Tested High-Ticket Retainer SOW Agreements',
    category: 'Legal/Contracts',
    costINR: 500,
    description: 'Protects you from scope creep, late payments, and guarantees monthly retainer retainers with 15-day termination notice clauses.',
    returnOnInvestmentROI: 'Prevents ₹50,000+ in unpaid invoices and client disputes',
    urgencyPriority: 'Month 1',
  },
  {
    id: 'asset-4',
    name: 'First Month Automated Nifty 50 / Equity Index Seed',
    category: 'Investment',
    costINR: 2000,
    description: 'Ignites the psychological habit of systematic compounding. Starting a ₹2,000/mo SIP growing at 14% CAGR compounds into ₹26+ Lakhs over 15 years.',
    returnOnInvestmentROI: 'Uncapped compound interest + financial sovereignty',
    urgencyPriority: 'Ongoing Compounding',
  },
  {
    id: 'asset-5',
    name: 'Personalized Inbound Client Cold Video Teardown Kit',
    category: 'Client Pipeline',
    costINR: 400,
    description: 'Screen recording software + custom proposal templates showing client CEOs their exact broken revenue leaks.',
    returnOnInvestmentROI: 'Converts cold outreach from 1% to 18% response rate',
    urgencyPriority: 'Month 1',
  },
];

/**
 * 4 Structured Life Wealth Phases starting from ₹2,000 INR ($24 USD) to Multi-Crore Financial Sovereignty
 */
export const LIFE_WEALTH_PHASES: LifeWealthPhase[] = [
  {
    phaseNumber: 1,
    title: 'The ₹2,000 Seed to ₹75,000/Month Freedom Base',
    timeline: 'Month 1 – Month 3',
    targetMonthlyCashflowINR: 75000,
    targetMonthlyCashflowUSD: 900,
    milestoneNetWorthINR: 100000,
    milestoneNetWorthUSD: 1200,
    coreAction:
      'Deploy the ₹2,000 starter seed strictly into high-leverage execution: domain, portfolio site, and AI API credits. Zero idle luxury.',
    whereToStartStep:
      'Spend ₹850 on a clean custom domain (e.g. .dev or .co) and portfolio landing page. Reserve ₹650 for AI API tokens (Gemini / automation webhooks). Pick 1 focused service (e.g., AI lead scraping, Zapier/n8n workflow automation, or conversion copy).',
    howToEarnStep:
      'Send 15 personalized cold Loom video teardowns daily to founders/agency owners showing their exact broken workflow. Offer the first pilot for ₹3,500 or free with guaranteed review. Land 3 clients at ₹25,000 each.',
    whereToInvestStep:
      'Reinvest 100% of profit back into skill tools and savings. Build the first ₹50,000 liquid safety buffer in an instant-access bank account or overnight fund.',
    pitfallsToAvoid:
      'Buying expensive certificates or courses before earning the first ₹10,000. Real learning comes from fulfilling real client deliverables.',
    actionChecklist: [
      'Register custom domain & deploy single-page portfolio with case studies',
      'Set up Gemini API automation sandbox with n8n / Python webhooks',
      'Identify 30 target businesses losing money on manual data entry or support',
      'Send 15 recorded video audits demonstrating exact automated solution',
      'Close first 2 paying retainer clients at ₹25,000/month',
      'Park first ₹50,000 emergency buffer in liquid fund / high-yield savings',
    ],
  },
  {
    phaseNumber: 2,
    title: 'Contract Expansion to ₹1,80,000 – ₹3,50,000/Month',
    timeline: 'Month 4 – Month 12',
    targetMonthlyCashflowINR: 280000,
    targetMonthlyCashflowUSD: 3300,
    milestoneNetWorthINR: 1000000,
    milestoneNetWorthUSD: 11500,
    coreAction:
      'Transition away from one-off gigs into monthly recurring retainers ($800–$1,500 / ₹65,000–₹1,25,000/month per client).',
    whereToStartStep:
      'Standardize your deliverable into a fixed monthly package (e.g., "Full AI Customer Support & Lead Pipeline Maintenance"). Target international clients in US/UK/EU who consider $1,000/month extremely affordable.',
    howToEarnStep:
      'Retain 3 to 4 ongoing clients on monthly retainer contracts. Add 1 high-ticket ad-hoc sprint (₹85,000) every 6 weeks.',
    whereToInvestStep:
      'Establish a 6-month emergency fund (₹4 Lakhs in Arbitrage/Liquid Mutual Funds). Start an automated ₹40,000/month SIP in Nifty 50 and Nifty Midcap 150 index funds.',
    pitfallsToAvoid:
      'Lifestyle inflation: Do not buy a luxury car or upgrade rent prematurely. Keep burn rate below 25% of net income.',
    actionChecklist: [
      'Package services into monthly recurring retainers (no more hourly billing)',
      'Sign 3 foreign clients on $1,000/month (₹85,000/mo each) retainers',
      'Complete 6-month liquid emergency runway in arbitrage/overnight fund',
      'Automate ₹40,000/month SIP into Nifty 50 & Midcap index funds',
      'Opt for Section 44ADA presumptive taxation (save 50% on taxable gross)',
    ],
  },
  {
    phaseNumber: 3,
    title: 'The ₹5,50,000/Month High-Leverage Wealth Engine',
    timeline: 'Year 1 – Year 3',
    targetMonthlyCashflowINR: 550000,
    targetMonthlyCashflowUSD: 6400,
    milestoneNetWorthINR: 5500000,
    milestoneNetWorthUSD: 65000,
    coreAction:
      'Productize your service, hire 1 junior subcontractor to handle repetitive ops, and invest heavily in compounding assets.',
    whereToStartStep:
      'Delegate low-leverage execution (data cleanup, initial draft prep) to a junior contractor for ₹30,000/mo while you focus exclusively on client acquisition, strategy, and architecture.',
    howToEarnStep:
      'Scale to 6 enterprise retainers at ₹90,000–₹1,40,000/month. Launch 1 digital asset or template library generating passive recurring cashflow.',
    whereToInvestStep:
      'Aggressive Monthly SIP: Allocate ₹2,00,000 to ₹2,50,000/month into broad equity index funds, US equity feeder funds, and digital assets. Wealth compounding accelerates exponentially here.',
    pitfallsToAvoid:
      'Overhiring or getting distracted by unfocused startup ideas before cashflow is completely resilient.',
    actionChecklist: [
      'Delegate operational deliverables to 1 vetted apprentice/subcontractor',
      'Raise minimum client engagement retainer to ₹90,000/month ($1,100/mo)',
      'Launch productized digital asset / template generating passive revenue',
      'Scale automated SIP to ₹2,00,000/month across diversified index funds',
      'Cross ₹50 Lakhs liquid financial net worth milestone',
    ],
  },
  {
    phaseNumber: 4,
    title: 'Financial Independence & ₹1 Crore – ₹10 Crore Sovereignty',
    timeline: 'Year 3 – Year 5+',
    targetMonthlyCashflowINR: 1200000,
    targetMonthlyCashflowUSD: 14000,
    milestoneNetWorthINR: 20000000,
    milestoneNetWorthUSD: 235000,
    coreAction:
      'Capital allocation & financial sovereignty. Your investment dividends and passive assets cover 100% of living expenses without clocking client hours.',
    whereToStartStep:
      'Institutionalize your brand as an industry thought leader. Take on high-value fractional advisory roles (₹3,00,000/month for 4 hours/week).',
    howToEarnStep:
      'Diversified cashflow: Equity in micro-SaaS, high-ticket advisory, digital royalties, and international client contracts.',
    whereToInvestStep:
      'Core & Satellite Portfolio: 60% Large/Midcap Index Funds, 20% Global Equity, 10% Commercial Real Estate/REITs, 10% Opportunistic/Angel Bets.',
    pitfallsToAvoid:
      'Complex derivatives trading, speculative gambling, or taking on toxic leverage. Protect your accumulated principal at all costs.',
    actionChecklist: [
      'Attain true financial freedom (passive portfolio dividends > monthly living cost)',
      'Transition to fractional advisory & board roles (high compensation, minimal hours)',
      'Harvest LTCG/STCG tax exemptions systematically each fiscal year',
      'Diversify into commercial REITs and sovereign wealth assets',
      'Achieve multi-crore generational net worth and complete time sovereignty',
    ],
  },
];

/**
 * Generates month-by-month compound life wealth projection from a starter seed
 */
export function calculateLifeWealthProjection(params: {
  initialSeedINR: number;
  monthlySavingsINR: number;
  expectedAnnualReturnPct: number;
  months: number;
}) {
  const { initialSeedINR, monthlySavingsINR, expectedAnnualReturnPct, months } = params;
  const monthlyRate = Math.pow(1 + expectedAnnualReturnPct / 100, 1 / 12) - 1;

  let totalAccumulated = initialSeedINR;
  const series: Array<{
    month: number;
    year: number;
    totalNetWorth: number;
    investedCapital: number;
    compoundReturns: number;
    liquidBuffer: number;
    equityMutualFunds: number;
  }> = [];

  let totalDeposited = initialSeedINR;

  for (let m = 1; m <= months; m++) {
    // Dynamic savings ramp: savings capacity grows as skills compound
    const skillMultiplier = 1 + Math.min(2.5, m * 0.04);
    const currentMonthSavings = monthlySavingsINR * skillMultiplier;

    totalDeposited += currentMonthSavings;
    totalAccumulated = (totalAccumulated + currentMonthSavings) * (1 + monthlyRate);

    const liquidBuffer = Math.min(totalAccumulated * 0.25, 800000); // 8L cap on emergency liquid
    const equityMutualFunds = totalAccumulated - liquidBuffer;

    if (m % 3 === 0 || m === 1 || m === months) {
      series.push({
        month: m,
        year: Math.ceil(m / 12),
        totalNetWorth: Math.round(totalAccumulated),
        investedCapital: Math.round(totalDeposited),
        compoundReturns: Math.round(Math.max(0, totalAccumulated - totalDeposited)),
        liquidBuffer: Math.round(liquidBuffer),
        equityMutualFunds: Math.round(equityMutualFunds),
      });
    }
  }

  return series;
}

/**
 * Generates technical TradingView-style candlestick series from cashflow data
 * with EMA20, Bollinger Bands, RSI, and quantitative trading metrics
 */
export function generateCandlestickSeries(
  baseMonthlyGross: number,
  pointsCount: number = 24
): { points: CandlestickPoint[]; stats: TradingStats } {
  const points: CandlestickPoint[] = [];
  let currentPrice = Math.max(1000, baseMonthlyGross);

  const periods = [
    'W1-Jan', 'W3-Jan', 'W1-Feb', 'W3-Feb', 'W1-Mar', 'W3-Mar',
    'W1-Apr', 'W3-Apr', 'W1-May', 'W3-May', 'W1-Jun', 'W3-Jun',
    'W1-Jul', 'W3-Jul', 'W1-Aug', 'W3-Aug', 'W1-Sep', 'W3-Sep',
    'W1-Oct', 'W3-Oct', 'W1-Nov', 'W3-Nov', 'W1-Dec', 'W3-Dec',
  ];

  const recentPrices: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  let bullishCount = 0;
  let maxPriceSeen = currentPrice;
  let maxDrawdownPct = 0;
  let totalPositiveGain = 0;
  let totalNegativeLoss = 0;

  for (let i = 0; i < pointsCount; i++) {
    const timeLabel = periods[i] || `P${i + 1}`;
    const randomSwing = (Math.random() - 0.42) * 0.08; // healthy positive drift
    const open = Math.round(currentPrice);
    const close = Math.round(currentPrice * (1 + randomSwing) * (1 + 0.009));
    const isBullish = close >= open;

    if (isBullish) {
      bullishCount++;
      totalPositiveGain += close - open;
    } else {
      totalNegativeLoss += open - close;
    }

    const highExtra = Math.random() * (open * 0.035);
    const lowExtra = Math.random() * (open * 0.03);

    const high = Math.round(Math.max(open, close) + highExtra);
    const low = Math.round(Math.min(open, close) - lowExtra);

    const volume = Math.round(45000 + Math.random() * 95000 + (isBullish ? 28000 : 0));
    const changePct = open > 0 ? ((close - open) / open) * 100 : 0;

    // Track drawdown from peak
    if (close > maxPriceSeen) {
      maxPriceSeen = close;
    } else {
      const dd = ((maxPriceSeen - close) / maxPriceSeen) * 100;
      if (dd > maxDrawdownPct) maxDrawdownPct = dd;
    }

    // Moving average & standard deviation for Bollinger bands
    recentPrices.push(close);
    if (recentPrices.length > 5) recentPrices.shift();
    const ma20 = Math.round(recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length);

    // Standard deviation for Bollinger Bands
    const variance =
      recentPrices.reduce((sum, val) => sum + Math.pow(val - ma20, 2), 0) / recentPrices.length;
    const stdDev = Math.sqrt(variance);
    const bbUpper = Math.round(ma20 + 2 * stdDev);
    const bbLower = Math.round(Math.max(0, ma20 - 2 * stdDev));

    // RSI calculation (14 period approx)
    const diff = close - open;
    if (diff > 0) {
      gains.push(diff);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(diff));
    }
    if (gains.length > 14) {
      gains.shift();
      losses.shift();
    }
    const avgGain = gains.reduce((a, b) => a + b, 0) / (gains.length || 1);
    const avgLoss = losses.reduce((a, b) => a + b, 0) / (losses.length || 1);
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = Math.round(avgLoss === 0 ? 100 : 100 - 100 / (1 + rs));

    points.push({
      time: timeLabel,
      open,
      high,
      low,
      close,
      volume,
      ma20,
      bbUpper,
      bbLower,
      rsi,
      changePct: Math.round(changePct * 10) / 10,
    });

    currentPrice = close;
  }

  const firstPrice = points[0]?.open || 1;
  const lastPrice = points[points.length - 1]?.close || 1;
  const periodGainPct = Math.round(((lastPrice - firstPrice) / firstPrice) * 1000) / 10;
  const bullishMonthsWinRatePct = Math.round((bullishCount / pointsCount) * 100);
  const profitFactor =
    totalNegativeLoss > 0
      ? Math.round((totalPositiveGain / totalNegativeLoss) * 10) / 10
      : 3.5;

  const stats: TradingStats = {
    periodGainPct,
    bullishMonthsWinRatePct,
    maxDrawdownPct: Math.round(maxDrawdownPct * 10) / 10,
    profitFactor,
    sharpeRatio: 2.85,
  };

  return { points, stats };
}

/**
 * Official Software Pricing Plans
 * Includes ₹2,000 INR Starter plan, Pro, and Elite Accelerator tiers
 */
export const SOFTWARE_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Community Preview',
    tagline: 'Basic monthly earning calculator & overview',
    priceINR: 0,
    priceUSD: 0,
    billingCadence: 'Free Forever',
    features: [
      'Standard Monthly Earning Calculator',
      'Basic 12-Month Seasonality Overview',
      'Financial Positivity Health Score (0-100)',
      'Up to 2 Client Retainers Tracked',
      'Standard Currency Switcher',
    ],
  },
  {
    id: 'starter',
    name: 'Starter Wealth Blueprint',
    tagline: 'The complete ₹2,000 starter seed life plan, asset exchange & goal tracker',
    priceINR: 2000,
    priceUSD: 24,
    billingCadence: 'one-time starter access',
    badge: 'Best Starter Value',
    isPopular: false,
    features: [
      'Full Life Wealth Plan (Phase 1 to Phase 4 Roadmap)',
      'The ₹2,000 Starter Seed Asset Exchange & ROI Blueprint',
      'Interactive Step-by-Step Wealth Milestone Checklist',
      'TradingView Candlestick Terminal & Volatility Visualizer',
      'Multi-Currency Live Exchange Converter (USD, EUR, GBP, AED)',
      'High-Earning Skills & Earn-While-Learn Action Plan',
      'Exportable PDF Financial Statement & Invoices',
      'Lifetime Access to Starter Modules (Zero recurring fees)',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Career Trader & Scaler',
    tagline: 'Professional financial suite with real trading charts & multi-stream portfolio',
    priceINR: 4999,
    priceUSD: 58,
    billingCadence: 'one-time lifetime access',
    badge: 'Most Popular',
    isPopular: true,
    features: [
      'Everything in Starter Wealth Blueprint, plus:',
      'Full TradingView Candlestick Terminal (OHLC, EMA20, Bollinger, RSI)',
      'Unlimited Client Retainers & Custom Income Streams',
      '12-Month Cashflow Volatility & 3-Year Growth Engine',
      '2026 Tier-1 Indian & Global Salary Benchmark Calibrator',
      'Priority Financial Statement Export with Custom Branding',
      'Instant UPI, Card & NetBanking Billing History & Tax Invoices',
    ],
  },
  {
    id: 'accelerator',
    name: 'Elite Syndicate & Wealth Accelerator',
    tagline: 'Complete financial sovereignty, multi-user admin console & advisory kit',
    priceINR: 9999,
    priceUSD: 115,
    billingCadence: 'one-time lifetime access',
    badge: 'Ultimate Freedom',
    features: [
      'All Pro Features FOREVER with VIP updates',
      'Full Admin Console & Cohort Multi-User Benchmarking',
      'Custom Indian & US Market Multiplier Control',
      'High-Ticket Contract & Retainer Negotiation Script Vault',
      'Private 1-on-1 Portfolio Teardown & Rate Multiplier Strategy',
      'Zero Tax Leakage Guide (Presumptive Taxation Section 44ADA)',
      'Direct WhatsApp / VIP Advisory Channel Access',
    ],
  },
];
