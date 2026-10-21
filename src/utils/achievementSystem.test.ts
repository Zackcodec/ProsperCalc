import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateAchievements,
  detectNewlyUnlockedBadges,
  MASTERY_LEVELS,
} from './achievementSystem';
import { DEFAULT_USER_PORTFOLIO } from './calculator';
import { UserPortfolio } from '../types';

test('evaluateAchievements: default portfolio unlocks multiple key achievements', () => {
  const result = evaluateAchievements(DEFAULT_USER_PORTFOLIO);

  assert.equal(typeof result.unlockedCount, 'number');
  assert.ok(result.unlockedCount >= 6, 'Default portfolio should unlock at least 6 badges');
  assert.ok(result.totalXp >= 1000, 'Default portfolio should have over 1000 XP');
  assert.ok(result.currentLevel >= 3, 'Default portfolio should be at Level 3+');

  // Verify '10% Savings Guru' is unlocked
  const savingsGuru = result.badges.find((b) => b.id === 'savings-guru-10');
  assert.ok(savingsGuru, 'Should find savings guru badge');
  assert.equal(savingsGuru?.unlocked, true, 'Savings guru should be unlocked');

  // Verify 'First Passive Income Stream' is unlocked (DEFAULT_USER_PORTFOLIO has royalties/digital stream)
  const passiveStream = result.badges.find((b) => b.id === 'first-passive-stream');
  assert.ok(passiveStream, 'Should find passive stream badge');
  assert.equal(passiveStream?.unlocked, true, 'First passive stream should be unlocked');

  // Verify 'Multi-Stream Maestro' is unlocked (DEFAULT_USER_PORTFOLIO has 4 active streams)
  const multiStream = result.badges.find((b) => b.id === 'multi-stream-maestro');
  assert.ok(multiStream, 'Should find multi-stream maestro badge');
  assert.equal(multiStream?.unlocked, true);

  // Verify 'Retainer Titan' has 50% progress (1 of 2 retainers)
  const retainerTitan = result.badges.find((b) => b.id === 'retainer-titan');
  assert.ok(retainerTitan, 'Should find retainer titan badge');
  assert.equal(retainerTitan?.unlocked, false);
  assert.equal(retainerTitan?.progressPct, 50);
});

test('evaluateAchievements: empty/zero portfolio locks milestone badges and calculates progress', () => {
  const emptyPortfolio: UserPortfolio = {
    id: 'user-empty',
    fullName: 'Newbie User',
    email: 'newbie@example.com',
    headline: 'Aspiring Earner',
    targetMonthlyGoal: 100000,
    currentCurrency: 'INR',
    subscriptionPlan: 'free',
    monthlySavingsPercent: 5, // Under 10%
    emergencyFundMonths: 1, // Under 6 months
    riskProfile: 'Conservative',
    streams: [],
    milestones: [],
    paymentHistory: [],
  };

  const result = evaluateAchievements(emptyPortfolio);

  const savingsGuru = result.badges.find((b) => b.id === 'savings-guru-10');
  assert.equal(savingsGuru?.unlocked, false, '5% savings should NOT unlock 10% Savings Guru');
  assert.equal(savingsGuru?.progressPct, 50, 'Progress should be 50% (5 of 10)');

  const passiveStream = result.badges.find((b) => b.id === 'first-passive-stream');
  assert.equal(passiveStream?.unlocked, false);
  assert.equal(passiveStream?.progressPct, 0);

  const centuryClub = result.badges.find((b) => b.id === 'century-club');
  assert.equal(centuryClub?.unlocked, false);
  assert.equal(result.currentLevel, 1, 'Should be Level 1');
});

test('detectNewlyUnlockedBadges: detects newly earned badges', () => {
  const result = evaluateAchievements(DEFAULT_USER_PORTFOLIO);
  const previouslyUnlocked = ['savings-guru-10'];

  const newlyUnlocked = detectNewlyUnlockedBadges(result.badges, previouslyUnlocked);
  assert.ok(newlyUnlocked.length > 0, 'Should detect newly unlocked badges');
  assert.ok(!newlyUnlocked.some((b) => b.id === 'savings-guru-10'), 'Should NOT include previously unlocked');
});
