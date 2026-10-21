import React, { useState } from 'react';
import { CalculationResults, Currency } from '../types';
import { formatCurrency } from '../utils/calculator';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { TradingEarningChart } from './TradingEarningChart';

interface VisualGraphsProps {
  results: CalculationResults;
  currency: Currency;
}

export const VisualGraphs: React.FC<VisualGraphsProps> = ({ results, currency }) => {
  const [activeChart, setActiveChart] = useState<'seasonality' | 'trading' | 'allocation' | 'trajectory' | 'streams'>(
    'trading'
  );
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const { monthlyGross, monthlyNet, monthlyTax, monthlyExpenses, monthlySavings, monthlyDiscretionary } =
    results;

  // Max value in 12-month series for SVG scaling
  const maxMonthGross = Math.max(...results.monthlyCashflowSeries.map((m) => m.gross), 1000);
  const chartHeight = 220;
  const chartWidth = 650;
  const barWidth = 32;
  const paddingX = 40;
  const availableWidth = chartWidth - paddingX * 2;
  const stepX = availableWidth / (results.monthlyCashflowSeries.length - 1);

  // Allocation segments
  const totalAllocatable = Math.max(1, monthlyGross);
  const taxPct = (monthlyTax / totalAllocatable) * 100;
  const expPct = (monthlyExpenses / totalAllocatable) * 100;
  const savPct = (monthlySavings / totalAllocatable) * 100;
  const discPct = Math.max(0, (monthlyDiscretionary / totalAllocatable) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Chart Header & Segmented Switcher */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Financial Projection & Visual Graphs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time cashflow analytics, revenue distribution, and growth trajectory
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveChart('trading')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeChart === 'trading'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Trading View (OHLC)</span>
          </button>
          <button
            onClick={() => setActiveChart('seasonality')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeChart === 'seasonality'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            12-Mo Seasonality
          </button>
          <button
            onClick={() => setActiveChart('allocation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeChart === 'allocation'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cash Allocation
          </button>
          <button
            onClick={() => setActiveChart('streams')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeChart === 'streams'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stream Mix
          </button>
          <button
            onClick={() => setActiveChart('trajectory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeChart === 'trajectory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3-Year Wealth
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* VIEW 0: TradingView Candlestick & Volume Terminal */}
        {activeChart === 'trading' && (
          <TradingEarningChart results={results} currency={currency} />
        )}

        {/* VIEW 1: 12-Month Seasonality & Cashflow Chart */}
        {activeChart === 'seasonality' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                  <span>Gross Earning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                  <span>Net Take-Home</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-400 inline-block" />
                  <span>Living Overhead</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-teal-400 inline-block" />
                  <span>Net Savings</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                Peak: {formatCurrency(maxMonthGross, currency.symbol)}/mo
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[620px]">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
                  className="w-full h-64 overflow-visible"
                >
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = chartHeight - ratio * (chartHeight - 30);
                    const labelVal = Math.round(maxMonthGross * ratio);
                    return (
                      <g key={ratio}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={chartWidth - paddingX}
                          y2={y}
                          stroke="#E2E8F0"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingX - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[10px] fill-slate-400 font-mono"
                        >
                          {currency.symbol}
                          {labelVal > 1000 ? `${Math.round(labelVal / 1000)}k` : labelVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Monthly Bars */}
                  {results.monthlyCashflowSeries.map((item, idx) => {
                    const x = paddingX + idx * stepX;
                    const grossHeight = Math.max(4, (item.gross / maxMonthGross) * (chartHeight - 30));
                    const netHeight = Math.max(4, (item.net / maxMonthGross) * (chartHeight - 30));
                    const expHeight = Math.max(2, (item.expenses / maxMonthGross) * (chartHeight - 30));
                    const savHeight = Math.max(2, (item.savings / maxMonthGross) * (chartHeight - 30));

                    const isHovered = hoveredMonth === idx;

                    return (
                      <g
                        key={item.month}
                        onMouseEnter={() => setHoveredMonth(idx)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        className="cursor-pointer transition-opacity"
                        opacity={hoveredMonth !== null && !isHovered ? 0.6 : 1}
                      >
                        {/* Background column highlight on hover */}
                        {isHovered && (
                          <rect
                            x={x - barWidth / 2 - 4}
                            y={10}
                            width={barWidth + 8}
                            height={chartHeight + 25}
                            fill="#F1F5F9"
                            rx="4"
                          />
                        )}

                        {/* Gross Bar */}
                        <rect
                          x={x - barWidth / 2}
                          y={chartHeight - grossHeight}
                          width={barWidth}
                          height={grossHeight}
                          fill="#4F46E5"
                          rx="3"
                          className="transition-all duration-300"
                        />

                        {/* Net Bar (inner overlay) */}
                        <rect
                          x={x - barWidth / 2 + 4}
                          y={chartHeight - netHeight}
                          width={barWidth - 8}
                          height={netHeight}
                          fill="#10B981"
                          rx="2"
                        />

                        {/* Savings indicator pip */}
                        <circle
                          cx={x}
                          cy={chartHeight - savHeight}
                          r={isHovered ? 4 : 2.5}
                          fill="#14B8A6"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />

                        {/* Month Label */}
                        <text
                          x={x}
                          y={chartHeight + 18}
                          textAnchor="middle"
                          className={`text-xs font-semibold ${
                            isHovered ? 'fill-indigo-600 font-bold' : 'fill-slate-600'
                          }`}
                        >
                          {item.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Hover Tooltip or Active Summary */}
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="font-semibold text-slate-800">
                {hoveredMonth !== null
                  ? `Focusing: ${results.monthlyCashflowSeries[hoveredMonth].month} Projected Cashflow`
                  : 'Hover over any month to inspect individual forecast metrics'}
              </div>
              {hoveredMonth !== null && (
                <div className="flex items-center gap-4 font-mono tabular-nums">
                  <div>
                    <span className="text-slate-500">Gross:</span>{' '}
                    <span className="font-bold text-indigo-700">
                      {formatCurrency(results.monthlyCashflowSeries[hoveredMonth].gross, currency.symbol)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Net:</span>{' '}
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(results.monthlyCashflowSeries[hoveredMonth].net, currency.symbol)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Expenses:</span>{' '}
                    <span className="font-bold text-slate-700">
                      {formatCurrency(results.monthlyCashflowSeries[hoveredMonth].expenses, currency.symbol)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Savings:</span>{' '}
                    <span className="font-bold text-teal-700">
                      {formatCurrency(results.monthlyCashflowSeries[hoveredMonth].savings, currency.symbol)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: Cash Allocation Waterfall Breakdown */}
        {activeChart === 'allocation' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-800">
                  Gross Monthly Revenue Inflow:{' '}
                  <span className="text-indigo-600 font-mono tabular-nums">
                    {formatCurrency(monthlyGross, currency.symbol)}
                  </span>
                </span>
                <span className="text-xs text-slate-500 font-medium">100% Total Allocation</span>
              </div>

              {/* Progress Multi-Bar */}
              <div className="h-7 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${Math.max(2, taxPct)}%` }}
                  className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                  title={`Estimated Taxes: ${formatCurrency(monthlyTax, currency.symbol)} (${taxPct.toFixed(1)}%)`}
                >
                  {taxPct > 8 && `${taxPct.toFixed(0)}% Tax`}
                </div>
                <div
                  style={{ width: `${Math.max(2, expPct)}%` }}
                  className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                  title={`Living Expenses: ${formatCurrency(monthlyExpenses, currency.symbol)} (${expPct.toFixed(1)}%)`}
                >
                  {expPct > 8 && `${expPct.toFixed(0)}% Expenses`}
                </div>
                <div
                  style={{ width: `${Math.max(2, savPct)}%` }}
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                  title={`Monthly Savings: ${formatCurrency(monthlySavings, currency.symbol)} (${savPct.toFixed(1)}%)`}
                >
                  {savPct > 8 && `${savPct.toFixed(0)}% Savings`}
                </div>
                <div
                  style={{ width: `${Math.max(2, discPct)}%` }}
                  className="bg-indigo-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                  title={`Discretionary Buffer: ${formatCurrency(monthlyDiscretionary, currency.symbol)} (${discPct.toFixed(1)}%)`}
                >
                  {discPct > 8 && `${discPct.toFixed(0)}% Free Buffer`}
                </div>
              </div>
            </div>

            {/* 4 Detail Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-lg border border-rose-100 bg-rose-50/50">
                <div className="text-xs font-semibold text-rose-800">Estimated Taxes</div>
                <div className="text-lg font-bold text-rose-950 font-mono tabular-nums mt-0.5">
                  {formatCurrency(monthlyTax, currency.symbol)}
                </div>
                <div className="text-[11px] text-rose-700 mt-1">
                  {taxPct.toFixed(1)}% of gross (estimated)
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-amber-100 bg-amber-50/50">
                <div className="text-xs font-semibold text-amber-800">Living Expenses</div>
                <div className="text-lg font-bold text-amber-950 font-mono tabular-nums mt-0.5">
                  {formatCurrency(monthlyExpenses, currency.symbol)}
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  {expPct.toFixed(1)}% fixed living costs
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/50">
                <div className="text-xs font-semibold text-emerald-800">Target Savings</div>
                <div className="text-lg font-bold text-emerald-950 font-mono tabular-nums mt-0.5">
                  {formatCurrency(monthlySavings, currency.symbol)}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  {savPct.toFixed(1)}% wealth compounding
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/50">
                <div className="text-xs font-semibold text-indigo-800">Discretionary Margin</div>
                <div className="text-lg font-bold text-indigo-950 font-mono tabular-nums mt-0.5">
                  {formatCurrency(monthlyDiscretionary, currency.symbol)}
                </div>
                <div className="text-[11px] text-indigo-700 mt-1">
                  {discPct.toFixed(1)}% flexible cashflow
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Income Stream Mix */}
        {activeChart === 'streams' && (
          <div className="space-y-5">
            <p className="text-xs text-slate-600">
              Visual breakdown of income across base client work, retainers, freelance side projects, and passive assets.
            </p>

            <div className="space-y-3">
              {[
                {
                  label: 'Primary Model (Hourly / Salary / Base)',
                  val: results.incomeStreamBreakdown.primary,
                  color: 'bg-indigo-600',
                  textColor: 'text-indigo-900',
                },
                {
                  label: 'Recurring Client Retainers',
                  val: results.incomeStreamBreakdown.retainers,
                  color: 'bg-emerald-600',
                  textColor: 'text-emerald-900',
                },
                {
                  label: 'Freelance Side Gigs',
                  val: results.incomeStreamBreakdown.sideGigs,
                  color: 'bg-sky-600',
                  textColor: 'text-sky-900',
                },
                {
                  label: 'Passive Income & Digital Assets',
                  val: results.incomeStreamBreakdown.passive,
                  color: 'bg-violet-600',
                  textColor: 'text-violet-900',
                },
                {
                  label: 'Performance Bonus (Monthly Equivalent)',
                  val: results.incomeStreamBreakdown.bonusMonthly,
                  color: 'bg-amber-600',
                  textColor: 'text-amber-900',
                },
              ].map((item) => {
                const pct = monthlyGross > 0 ? (item.val / monthlyGross) * 100 : 0;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <div className="flex items-center gap-2 font-mono tabular-nums">
                        <span className="font-bold text-slate-900">
                          {formatCurrency(item.val, currency.symbol)}
                        </span>
                        <span className="text-slate-500 w-12 text-right">({pct.toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: 3-Year Wealth Trajectory */}
        {activeChart === 'trajectory' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.threeYearProjections.map((p) => (
                <div
                  key={p.year}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                      Year {p.year}
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-slate-500">Gross Annual Revenue</div>
                    <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                      {formatCurrency(p.gross, currency.symbol)}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Net Take-Home:</span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">
                        {formatCurrency(p.net, currency.symbol)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cumulative Savings:</span>
                      <span className="font-bold text-emerald-600 font-mono tabular-nums">
                        {formatCurrency(p.cumulativeSavings, currency.symbol)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 italic">
              *Projection models a modest 12-15% annual earning rate expansion through skill compounding and rate increases, plus retained savings accumulation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
