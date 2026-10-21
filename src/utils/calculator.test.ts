import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEarnings,
  calculatePositivityScore,
  formatCurrency,
  DEFAULT_CALCULATOR_INPUTS,
} from './calculator';
import { CalculatorInputs } from '../types';

test('calculateEarnings: standard hourly calculation', () => {
  const inputs: CalculatorInputs = {
    earningModel: 'hourly',
    baseHourlyRate: 50,
    hoursPerWeek: 40,
    weeksPerYear: 50,
    monthlySalary: 0,
    retainerClients: [],
    sideGigMonthly: 0,
    passiveIncomeMonthly: 0,
    monthlyExpenses: 3000,
    taxRatePercent: 20,
    savingsTargetPercent: 20,
    currentEmergencyFund: 10000,
    annualBonus: 0,
  };

  const results = calculateEarnings(inputs);
  // Annual gross: 50 * 40 * 50 = 100,000. Monthly gross: 100,000 / 12 = 8,333.33 -> 8333
  assert.equal(results.annualGross, 100000);
  assert.equal(results.monthlyGross, 8333);
  // Tax 20%: 8333.33 * 0.20 = 1666.67 -> 1667
  assert.equal(results.monthlyTax, 1667);
  // Net: 8333 - 1667 = 6667
  assert.equal(results.monthlyNet, 6667);
  // Effective hourly rate
  assert.ok(results.effectiveHourlyRate >= 49 && results.effectiveHourlyRate <= 51);
});

test('calculateEarnings: salary model with bonus', () => {
  const inputs: CalculatorInputs = {
    earningModel: 'salary',
    baseHourlyRate: 0,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    monthlySalary: 8000,
    retainerClients: [],
    sideGigMonthly: 500,
    passiveIncomeMonthly: 200,
    monthlyExpenses: 4000,
    taxRatePercent: 25,
    savingsTargetPercent: 30,
    currentEmergencyFund: 24000,
    annualBonus: 6000, // 500/mo
  };

  const results = calculateEarnings(inputs);
  // Monthly gross: 8000 + 500 (side) + 200 (passive) + 500 (bonus) = 9200
  assert.equal(results.monthlyGross, 9200);
  assert.equal(results.annualGross, 110400);
  // Tax 25%: 9200 * 0.25 = 2300
  assert.equal(results.monthlyTax, 2300);
  // Net: 9200 - 2300 = 6900
  assert.equal(results.monthlyNet, 6900);
  // Monthly savings 30% of net: 6900 * 0.3 = 2070
  assert.equal(results.monthlySavings, 2070);
});

test('calculateEarnings: freelance with retainer clients', () => {
  const inputs: CalculatorInputs = {
    ...DEFAULT_CALCULATOR_INPUTS,
    earningModel: 'freelance',
  };

  const results = calculateEarnings(inputs);
  assert.ok(results.monthlyGross > 0);
  assert.ok(results.positivity.score > 0);
  assert.equal(results.monthlyCashflowSeries.length, 12);
  assert.equal(results.threeYearProjections.length, 3);
});

test('calculatePositivityScore: zero income returns Critical tier', () => {
  const score = calculatePositivityScore({
    monthlyGross: 0,
    monthlyNet: 0,
    monthlyExpenses: 2000,
    monthlySavings: 0,
    currentEmergencyFund: 0,
    hasSideGigs: false,
    activeStreamCount: 0,
  });

  assert.equal(score.score, 0);
  assert.equal(score.tier, 'Critical');
});

test('calculatePositivityScore: high savings, strong runway, multiple streams yields Wealth Velocity or Thriving', () => {
  const score = calculatePositivityScore({
    monthlyGross: 14000,
    monthlyNet: 10500,
    monthlyExpenses: 4000,
    monthlySavings: 3500, // >30% savings ratio
    currentEmergencyFund: 35000, // >8 months runway
    hasSideGigs: true,
    activeStreamCount: 4,
  });

  assert.ok(score.score >= 80, `Expected score >= 80, got ${score.score}`);
  assert.ok(['Thriving', 'Wealth Velocity'].includes(score.tier));
  assert.ok(score.actionableInsights.length > 0);
});

test('formatCurrency utility formats values with symbols', () => {
  assert.equal(formatCurrency(5400, '$'), '$5,400');
  assert.equal(formatCurrency(120000, '€'), '€120,000');
  assert.equal(formatCurrency(0, '£'), '£0');
});
