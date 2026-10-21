import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatWealthCurrency,
  generateCandlestickSeries,
  calculateLifeWealthProjection,
  LIFE_WEALTH_PHASES,
  SOFTWARE_PRICING_PLANS,
  exchangeCurrencyAmount,
  ASSET_EXCHANGE_EQUIVALENTS_2000_INR,
} from './wealthPlanner';
import { Currency } from '../types';

const inrCurrency: Currency = { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 87.5, isINR: true };
const usdCurrency: Currency = { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1 };

test('formatWealthCurrency: formats Indian lakhs and crores correctly', () => {
  assert.equal(formatWealthCurrency(150000, inrCurrency, false), '₹1,50,000');
  assert.equal(formatWealthCurrency(150000, inrCurrency, true), '₹1.50 L');
  assert.equal(formatWealthCurrency(12000000, inrCurrency, true), '₹1.20 Cr');
  assert.equal(formatWealthCurrency(5000, inrCurrency, true), '₹5.0k');
});

test('formatWealthCurrency: formats USD standard and compact', () => {
  assert.equal(formatWealthCurrency(12500, usdCurrency, false), '$12,500');
  assert.equal(formatWealthCurrency(1500000, usdCurrency, true), '$1.50M');
  assert.equal(formatWealthCurrency(75000, usdCurrency, true), '$75.0k');
});

test('generateCandlestickSeries: builds valid OHLC data with MA20, RSI, Bollinger Bands, and quantitative stats', () => {
  const { points, stats } = generateCandlestickSeries(185000, 24);
  assert.equal(points.length, 24);

  for (const candle of points) {
    assert.ok(candle.high >= candle.open, 'High must be >= open');
    assert.ok(candle.high >= candle.close, 'High must be >= close');
    assert.ok(candle.low <= candle.open, 'Low must be <= open');
    assert.ok(candle.low <= candle.close, 'Low must be <= close');
    assert.ok(candle.volume > 0, 'Volume must be positive');
    assert.ok(candle.ma20 > 0, 'MA20 must be positive');
    assert.ok(candle.rsi !== undefined && candle.rsi >= 0 && candle.rsi <= 100, 'RSI in 0-100');
  }

  assert.ok(stats.bullishMonthsWinRatePct >= 0 && stats.bullishMonthsWinRatePct <= 100);
  assert.ok(stats.maxDrawdownPct >= 0);
  assert.ok(stats.profitFactor > 0);
});

test('exchangeCurrencyAmount: accurately converts amounts across currencies', () => {
  const convertedUSD = exchangeCurrencyAmount(87.5, 'INR', 'USD');
  assert.equal(convertedUSD, 1);

  const convertedINR = exchangeCurrencyAmount(100, 'USD', 'INR');
  assert.equal(convertedINR, 8750);

  const same = exchangeCurrencyAmount(500, 'USD', 'USD');
  assert.equal(same, 500);
});

test('ASSET_EXCHANGE_EQUIVALENTS_2000_INR contains high-ROI tangible career assets', () => {
  assert.ok(ASSET_EXCHANGE_EQUIVALENTS_2000_INR.length >= 4);
  const totalCost = ASSET_EXCHANGE_EQUIVALENTS_2000_INR.reduce((sum, a) => sum + a.costINR, 0);
  assert.ok(totalCost > 1500);
});

test('calculateLifeWealthProjection: compounds starter seed over 36 months', () => {
  const result = calculateLifeWealthProjection({
    initialSeedINR: 2000,
    monthlySavingsINR: 25000,
    expectedAnnualReturnPct: 14,
    months: 36,
  });

  assert.ok(result.length > 0);
  const finalPoint = result[result.length - 1];
  assert.ok(finalPoint.totalNetWorth > 2000);
  assert.ok(finalPoint.equityMutualFunds > 0);
  assert.ok(finalPoint.liquidBuffer > 0);
});

test('LIFE_WEALTH_PHASES has 4 structured progressive phases with action checklists', () => {
  assert.equal(LIFE_WEALTH_PHASES.length, 4);
  assert.equal(LIFE_WEALTH_PHASES[0].phaseNumber, 1);
  assert.equal(LIFE_WEALTH_PHASES[3].phaseNumber, 4);
  assert.ok(LIFE_WEALTH_PHASES[3].targetMonthlyCashflowINR > LIFE_WEALTH_PHASES[0].targetMonthlyCashflowINR);
  assert.ok(LIFE_WEALTH_PHASES[0].actionChecklist.length > 0);
});

test('SOFTWARE_PRICING_PLANS defines ₹2,000 INR Starter plan, Pro, and Elite tiers', () => {
  assert.equal(SOFTWARE_PRICING_PLANS.length, 4);
  const [free, starter, pro, accelerator] = SOFTWARE_PRICING_PLANS;
  assert.equal(free.priceINR, 0);
  assert.equal(starter.priceINR, 2000);
  assert.equal(pro.priceINR, 4999);
  assert.equal(accelerator.priceINR, 9999);
});
