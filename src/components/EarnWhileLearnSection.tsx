import React, { useState } from 'react';
import { SkillRoadmapItem, Currency } from '../types';
import { HIGH_EARNING_SKILLS, formatCurrency } from '../utils/calculator';
import { formatWealthCurrency } from '../utils/wealthPlanner';
import {
  GraduationCap,
  Clock,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';

interface EarnWhileLearnSectionProps {
  currency: Currency;
  onApplySkillRate: (hourlyRate: number, skillName: string) => void;
  onNavigateToLifePlan?: () => void;
}

export const EarnWhileLearnSection: React.FC<EarnWhileLearnSectionProps> = ({
  currency,
  onApplySkillRate,
  onNavigateToLifePlan,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'AI & Data',
    'Engineering',
    'Design & Media',
    'Growth & Marketing',
    'Cloud & Security',
  ];

  const filteredSkills =
    selectedCategory === 'All'
      ? HIGH_EARNING_SKILLS
      : HIGH_EARNING_SKILLS.filter((s) => s.category === selectedCategory);

  const toggleMilestone = (skillId: string, milestoneIndex: number) => {
    const key = `${skillId}-${milestoneIndex}`;
    setCompletedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Marketing Banner for Life Wealth Plan */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Accelerated Skill ROI
            </span>
            <span className="text-xs text-slate-400 font-mono">Starter Investment: ₹2,000</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            Monetize What You Learn Fast with the ₹2,000 Starter Life Plan
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Don&apos;t wait until you finish 50 tutorials. Our 4-phase wealth blueprint shows how to invest ₹2,000 in your first production domain and API keys to win paid client pilots in your first 3 weeks.
          </p>
        </div>

        {onNavigateToLifePlan && (
          <button
            onClick={onNavigateToLifePlan}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>View 4-Phase Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Editorial Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Monetization Blueprint</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How to Earn While You Learn High-Leverage Skills
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            You do not need years of theoretical study to earn your first dollar. The modern earning playbook relies on solving real, targeted micro-problems for actual clients while progressively mastering your craft.
          </p>
        </div>

        {/* 4 Golden Rules Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">1. One-Chapter Ahead</span>
            <p className="text-xs text-slate-500 leading-normal">
              You only need to know 10% more than the client who has zero time to learn the tool.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">2. Risk-Free Pilot Offer</span>
            <p className="text-xs text-slate-500 leading-normal">
              Deliver 1 micro-task for free or $100 to build confidence and secure a case study.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">3. Public Proof of Work</span>
            <p className="text-xs text-slate-500 leading-normal">
              Document your learning publicly with video teardowns; clients hire demonstrable outcomes.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">4. Shift to Retainers</span>
            <p className="text-xs text-slate-500 leading-normal">
              Convert one-off project fixes into ongoing $500–$2,000/mo maintenance retainers.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition-all space-y-5"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{skill.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{skill.difficulty}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{skill.title}</h3>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 whitespace-nowrap">
                  {skill.demandLevel} Demand
                </span>
              </div>

              {/* Rate & Timeline Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 mt-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Time to 1st $</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ~{skill.timeToFirstDollarWeeks} weeks
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Hourly Range</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {currency.isINR ? (
                      <>
                        ₹{skill.entryHourlyRateINR} – ₹{skill.proHourlyRateINR}/hr
                      </>
                    ) : (
                      <>
                        {currency.symbol}{skill.entryHourlyRateUSD} – {currency.symbol}{skill.proHourlyRateUSD}/hr
                      </>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Monthly Potential</span>
                  <span className="font-bold text-emerald-600 font-mono">
                    {currency.isINR
                      ? `₹${(skill.monthlyPotentialMinINR / 1000).toFixed(0)}k – ₹${(
                          skill.monthlyPotentialMaxINR / 100000
                        ).toFixed(1)}L+`
                      : `${currency.symbol}${Math.round(skill.monthlyPotentialMinINR / 87.5)}+`}
                  </span>
                </div>
              </div>

              {/* Earn While Learn Strategy Block */}
              <div className="mt-4 p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/40">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Earn-While-Learn Tactical Playbook:
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {skill.earnWhileLearnStrategy}
                </p>
              </div>

              {/* Beginner Milestones */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Actionable Milestones
                </span>
                <div className="space-y-1.5">
                  {skill.beginnerMilestones.map((m, idx) => {
                    const isDone = completedMilestones[`${skill.id}-${idx}`];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleMilestone(skill.id, idx)}
                        className="w-full flex items-start gap-2 text-left p-1.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer group text-xs"
                      >
                        <CheckCircle
                          className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                            isDone ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300 group-hover:text-slate-400'
                          }`}
                        />
                        <span className={isDone ? 'line-through text-slate-400' : 'text-slate-700'}>
                          {m}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions & Platforms */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Where to find gigs:</span>
                <span className="truncate">{skill.recommendedPlatforms.join(', ')}</span>
              </div>

              <button
                onClick={() =>
                  onApplySkillRate(
                    currency.isINR ? skill.entryHourlyRateINR : skill.entryHourlyRateUSD,
                    skill.title
                  )
                }
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
              >
                <span>Test Rate in Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
