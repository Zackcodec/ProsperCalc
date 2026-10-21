import React, { useState } from 'react';
import { CalculationResults, Currency } from '../types';
import { formatWealthCurrency } from '../utils/wealthPlanner';
import {
  TrendingUp,
  BarChart2,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Crosshair,
  Sliders,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface TradingEarningChartProps {
  results: CalculationResults;
  currency: Currency;
  onNavigateToLifePlan?: () => void;
  onOpenPricing?: () => void;
}

export const TradingEarningChart: React.FC<TradingEarningChartProps> = ({
  results,
  currency,
  onNavigateToLifePlan,
  onOpenPricing,
}) => {
  const [chartType, setChartType] = useState<'candlestick' | 'area' | 'line'>('candlestick');
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('1Y');
  const [showEMA20, setShowEMA20] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fullSeries = results.candlestickSeries;
  // Slice series according to timeframe
  const series =
    timeframe === '1W'
      ? fullSeries.slice(-4)
      : timeframe === '1M'
      ? fullSeries.slice(-8)
      : timeframe === '3M'
      ? fullSeries.slice(-12)
      : timeframe === '6M'
      ? fullSeries.slice(-18)
      : fullSeries;

  const currentCandle =
    hoveredIndex !== null && hoveredIndex < series.length
      ? series[hoveredIndex]
      : series[series.length - 1] || fullSeries[0];

  const highestPrice = Math.max(...series.map((s) => Math.max(s.high, s.bbUpper || s.high)));
  const lowestPrice = Math.min(...series.map((s) => Math.min(s.low, s.bbLower || s.low)));
  const maxVolume = Math.max(...series.map((s) => s.volume), 1000);

  // Layout Dimensions
  const width = 860;
  const mainHeight = 240;
  const volHeight = showVolume ? 60 : 0;
  const rsiHeight = showRSI ? 60 : 0;
  const padX = 55;
  const padTop = 25;
  const totalHeight = mainHeight + volHeight + rsiHeight + 45;

  const usableWidth = width - padX * 2;
  const stepX = series.length > 1 ? usableWidth / (series.length - 1) : usableWidth;
  const candleBodyWidth = Math.max(5, Math.min(22, usableWidth / series.length - 7));

  const priceRange = Math.max(1, highestPrice - lowestPrice);
  const getY = (val: number) => {
    return padTop + (1 - (val - lowestPrice) / priceRange) * (mainHeight - padTop);
  };

  const getVolY = (vol: number) => {
    const volBase = mainHeight + 10;
    const volScale = (vol / maxVolume) * (volHeight - 12);
    return volBase + (volHeight - volScale);
  };

  const getRsiY = (rsiVal: number) => {
    const rsiBase = mainHeight + volHeight + 15;
    const rsiRange = rsiHeight - 10;
    return rsiBase + (1 - Math.min(100, Math.max(0, rsiVal)) / 100) * rsiRange;
  };

  // Paths for Line, Area, EMA20, Bollinger Bands
  const linePath = series
    .map((s, idx) => {
      const x = padX + idx * stepX;
      const y = getY(s.close);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const closedAreaPath = `${linePath} L ${padX + (series.length - 1) * stepX} ${mainHeight} L ${padX} ${mainHeight} Z`;

  const emaPath = series
    .map((s, idx) => {
      const x = padX + idx * stepX;
      const y = getY(s.ma20);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const bbUpperPath = series
    .map((s, idx) => {
      const x = padX + idx * stepX;
      const y = getY(s.bbUpper || s.ma20);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const bbLowerPath = series
    .slice()
    .reverse()
    .map((s, revIdx) => {
      const origIdx = series.length - 1 - revIdx;
      const x = padX + origIdx * stepX;
      const y = getY(s.bbLower || s.ma20);
      return `L ${x} ${y}`;
    })
    .join(' ');

  const bbCorridorPath = `${bbUpperPath} ${bbLowerPath} Z`;

  const rsiPath = series
    .map((s, idx) => {
      const x = padX + idx * stepX;
      const y = getRsiY(s.rsi || 50);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const stats = results.tradingStats;

  return (
    <div className="space-y-4">
      {/* Quant Strategy Marketing Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans text-slate-300 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Quant Career Architecture
            </span>
            <span className="text-slate-400 font-mono">Max Drawdown: -{stats?.maxDrawdownPct || 4.2}%</span>
          </div>
          <h4 className="font-bold text-white text-sm">
            Hedge Career Volatility with the {currency.symbol}2,000 Starter Life Plan
          </h4>
          <p className="text-slate-400 max-w-xl">
            In standard freelancing, cashflow fluctuates between zero and peak rates. Our 4-phase wealth blueprint establishes recurring retainers as an unshakeable floor, compressing drawdown risk while scaling compounding upside.
          </p>
        </div>

        {onNavigateToLifePlan && (
          <button
            onClick={onNavigateToLifePlan}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore 4-Phase Strategy</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono">
      {/* Top Trading Ticker Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold tracking-tight text-white font-sans">
              REVENUE / {currency.code}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              CANDLESTICK TERMINAL
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
              {formatWealthCurrency(currentCandle.close, currency)}
            </span>
            <span
              className={`text-xs font-bold flex items-center gap-0.5 ${
                currentCandle.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {currentCandle.changePct >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {currentCandle.changePct > 0 ? '+' : ''}
              {currentCandle.changePct}%
            </span>
          </div>
        </div>

        {/* OHLCV Live HUD */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400">
          <div>
            <span className="text-slate-500 mr-1 font-sans">Open:</span>
            <span className="text-white font-mono">
              {formatWealthCurrency(currentCandle.open, currency, true)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 mr-1 font-sans">High:</span>
            <span className="text-emerald-400 font-mono">
              {formatWealthCurrency(currentCandle.high, currency, true)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 mr-1 font-sans">Low:</span>
            <span className="text-rose-400 font-mono">
              {formatWealthCurrency(currentCandle.low, currency, true)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 mr-1 font-sans">Close:</span>
            <span className="text-white font-mono">
              {formatWealthCurrency(currentCandle.close, currency, true)}
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-500 mr-1 font-sans">Vol:</span>
            <span className="text-indigo-400 font-mono">{currentCandle.volume.toLocaleString()}</span>
          </div>
          {currentCandle.rsi !== undefined && (
            <div className="hidden md:block">
              <span className="text-slate-500 mr-1 font-sans">RSI(14):</span>
              <span
                className={`font-mono ${
                  currentCandle.rsi >= 70
                    ? 'text-amber-400'
                    : currentCandle.rsi <= 30
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }`}
              >
                {currentCandle.rsi}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quantitative Trader Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-800/80 border-b border-slate-800 bg-slate-950/60 text-xs">
        <div className="p-3">
          <span className="text-[10px] text-slate-500 block font-sans uppercase font-bold">
            Period P&L Return
          </span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
            +{stats.periodGainPct}%
          </span>
        </div>

        <div className="p-3">
          <span className="text-[10px] text-slate-500 block font-sans uppercase font-bold">
            Win Rate (Bullish Months)
          </span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            {stats.bullishMonthsWinRatePct}%
          </span>
        </div>

        <div className="p-3">
          <span className="text-[10px] text-slate-500 block font-sans uppercase font-bold">
            Max Drawdown
          </span>
          <span className="text-sm font-bold text-rose-400 mt-0.5 block">
            -{stats.maxDrawdownPct}%
          </span>
        </div>

        <div className="p-3">
          <span className="text-[10px] text-slate-500 block font-sans uppercase font-bold">
            Profit / Retention Factor
          </span>
          <span className="text-sm font-bold text-indigo-400 mt-0.5 block">
            {stats.profitFactor}x
          </span>
        </div>

        <div className="p-3 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-slate-800">
          <span className="text-[10px] text-slate-500 block font-sans uppercase font-bold">
            Stability (Sharpe Ratio)
          </span>
          <span className="text-sm font-bold text-amber-400 mt-0.5 block">
            {stats.sharpeRatio} (Consistent)
          </span>
        </div>
      </div>

      {/* Chart Toolbar: Timeframes & Technical Indicators */}
      <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Timeframes */}
        <div className="flex items-center gap-1">
          {(['1W', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded transition-colors text-[11px] font-semibold cursor-pointer ${
                timeframe === tf
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart View Modes */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                chartType === 'candlestick'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                chartType === 'area'
                  ? 'bg-slate-800 text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                chartType === 'line'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Line
            </button>
          </div>

          {/* Indicator Toggles */}
          <button
            onClick={() => setShowEMA20(!showEMA20)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
              showEMA20
                ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                : 'border-slate-800 text-slate-600'
            }`}
          >
            EMA-20
          </button>

          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
              showBollinger
                ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                : 'border-slate-800 text-slate-600'
            }`}
          >
            Bollinger Bands
          </button>

          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
              showVolume
                ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10'
                : 'border-slate-800 text-slate-600'
            }`}
          >
            Volume
          </button>

          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
              showRSI
                ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                : 'border-slate-800 text-slate-600'
            }`}
          >
            RSI (14)
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="p-4 overflow-x-auto relative">
        <div className="min-w-[760px]">
          <svg
            viewBox={`0 0 ${width} ${totalHeight}`}
            className="w-full h-96 overflow-visible select-none cursor-crosshair"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Horizontal Price Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padTop + ratio * (mainHeight - padTop);
              const price = Math.round(highestPrice - ratio * priceRange);
              return (
                <g key={ratio}>
                  <line
                    x1={padX}
                    y1={y}
                    x2={width - padX}
                    y2={y}
                    stroke="#1E293B"
                    strokeDasharray="2 4"
                    strokeWidth="1"
                  />
                  <text
                    x={width - padX + 8}
                    y={y + 4}
                    className="text-[10px] fill-slate-500 font-mono"
                  >
                    {formatWealthCurrency(price, currency, true)}
                  </text>
                </g>
              );
            })}

            {/* Bollinger Bands Shaded Corridor */}
            {showBollinger && (
              <g>
                <path d={bbCorridorPath} fill="#06B6D4" fillOpacity="0.06" />
                <path d={bbUpperPath} fill="none" stroke="#06B6D4" strokeDasharray="3 3" strokeWidth="1" />
                <path
                  d={series
                    .map((s, idx) => {
                      const x = padX + idx * stepX;
                      const y = getY(s.bbLower || s.ma20);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#06B6D4"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              </g>
            )}

            {/* Area Chart Mode */}
            {chartType === 'area' && (
              <g>
                <defs>
                  <linearGradient id="areaGradientPro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={closedAreaPath} fill="url(#areaGradientPro)" />
                <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" />
              </g>
            )}

            {/* Line Chart Mode */}
            {chartType === 'line' && (
              <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="2.5" />
            )}

            {/* Candlesticks Mode (OHLC) */}
            {chartType === 'candlestick' &&
              series.map((candle, idx) => {
                const x = padX + idx * stepX;
                const openY = getY(candle.open);
                const closeY = getY(candle.close);
                const highY = getY(candle.high);
                const lowY = getY(candle.low);
                const isBull = candle.close >= candle.open;
                const candleColor = isBull ? '#10B981' : '#F43F5E';
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(3, Math.abs(closeY - openY));

                return (
                  <g
                    key={candle.time}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className="cursor-pointer group"
                  >
                    {/* Wick */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={candleColor}
                      strokeWidth="1.5"
                    />

                    {/* Candle Body */}
                    <rect
                      x={x - candleBodyWidth / 2}
                      y={bodyTop}
                      width={candleBodyWidth}
                      height={bodyHeight}
                      fill={candleColor}
                      rx="1"
                      className="transition-opacity group-hover:opacity-80"
                    />

                    {/* Hover Hit Box */}
                    <rect
                      x={x - stepX / 2}
                      y={padTop}
                      width={stepX}
                      height={mainHeight}
                      fill="transparent"
                    />
                  </g>
                );
              })}

            {/* EMA20 Line */}
            {showEMA20 && (
              <path
                d={emaPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* Volume Section */}
            {showVolume && (
              <g>
                <line
                  x1={padX}
                  y1={mainHeight + 5}
                  x2={width - padX}
                  y2={mainHeight + 5}
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={padX}
                  y={mainHeight + 18}
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  VOLUME (CASH TURNOVER)
                </text>

                {series.map((candle, idx) => {
                  const x = padX + idx * stepX;
                  const y = getVolY(candle.volume);
                  const isBull = candle.close >= candle.open;
                  const barHeight = mainHeight + 10 + volHeight - y;

                  return (
                    <rect
                      key={`vol-${candle.time}`}
                      x={x - candleBodyWidth / 2}
                      y={y}
                      width={candleBodyWidth}
                      height={Math.max(2, barHeight)}
                      fill={isBull ? '#10B981' : '#F43F5E'}
                      fillOpacity={hoveredIndex === idx ? '0.85' : '0.4'}
                      rx="1"
                    />
                  );
                })}
              </g>
            )}

            {/* RSI Oscillator Section */}
            {showRSI && (
              <g>
                const rsiTop = mainHeight + volHeight + 15;
                <line
                  x1={padX}
                  y1={mainHeight + volHeight + 10}
                  x2={width - padX}
                  y2={mainHeight + volHeight + 10}
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={padX}
                  y={mainHeight + volHeight + 22}
                  className="text-[9px] fill-purple-400 font-mono"
                >
                  RSI (14) MOMENTUM
                </text>

                {/* Overbought 70 line */}
                <line
                  x1={padX}
                  y1={getRsiY(70)}
                  x2={width - padX}
                  y2={getRsiY(70)}
                  stroke="#F59E0B"
                  strokeDasharray="2 3"
                  strokeWidth="0.8"
                />
                <text
                  x={width - padX + 8}
                  y={getRsiY(70) + 3}
                  className="text-[8px] fill-amber-400 font-mono"
                >
                  70
                </text>

                {/* Oversold 30 line */}
                <line
                  x1={padX}
                  y1={getRsiY(30)}
                  x2={width - padX}
                  y2={getRsiY(30)}
                  stroke="#10B981"
                  strokeDasharray="2 3"
                  strokeWidth="0.8"
                />
                <text
                  x={width - padX + 8}
                  y={getRsiY(30) + 3}
                  className="text-[8px] fill-emerald-400 font-mono"
                >
                  30
                </text>

                {/* RSI Curve */}
                <path d={rsiPath} fill="none" stroke="#A855F7" strokeWidth="1.8" />
              </g>
            )}

            {/* Time X-Axis Labels */}
            {series.map((candle, idx) => {
              if (idx % 2 !== 0 && series.length > 12) return null;
              const x = padX + idx * stepX;
              return (
                <text
                  key={`lbl-${candle.time}`}
                  x={x}
                  y={totalHeight - 8}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {candle.time}
                </text>
              );
            })}

            {/* Interactive Crosshair & Tooltip */}
            {hoveredIndex !== null && (
              <g>
                {/* Vertical Crosshair Line */}
                <line
                  x1={padX + hoveredIndex * stepX}
                  y1={padTop}
                  x2={padX + hoveredIndex * stepX}
                  y2={totalHeight - 25}
                  stroke="#6366F1"
                  strokeDasharray="2 2"
                  strokeWidth="1.5"
                />

                {/* Active Price Pulse Point */}
                <circle
                  cx={padX + hoveredIndex * stepX}
                  cy={getY(currentCandle.close)}
                  r="4"
                  fill="#6366F1"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Legend & Guide Bar */}
      <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span className="text-[11px]">Bullish Expansion Candle (Growth)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
            <span className="text-[11px]">Bearish Pullback Candle (Buffer Use)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-amber-400 inline-block" />
            <span className="text-[11px]">EMA-20 Trend Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-cyan-400 border-dashed inline-block" />
            <span className="text-[11px]">Bollinger Volatility Bands</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-sans">
          💡 Professional Tip: Use candles to price client retainers during bullish momentum breakouts.
        </div>
      </div>
    </div>
    </div>
  );
};
