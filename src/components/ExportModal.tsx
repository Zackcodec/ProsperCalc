import React from 'react';
import { CalculationResults, Currency, CalculatorInputs, UserPortfolio } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Printer, Download, X, CheckCircle, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CalculationResults;
  inputs: CalculatorInputs;
  portfolio: UserPortfolio;
  currency: Currency;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  results,
  inputs,
  portfolio,
  currency,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Monthly Earning & Financial Plan Statement
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-slate-900 text-xs">
          {/* Header Statement Lockup */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900">ProsperCalc</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Executive Monthly Earning & Cashflow Statement
              </p>
              <div className="mt-2 text-slate-700">
                <span className="font-semibold">{portfolio.fullName}</span> ·{' '}
                <span>{portfolio.headline}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Statement Date</span>
              <span className="font-semibold text-slate-700">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                Currency: {currency.code} ({currency.symbol})
              </span>
            </div>
          </div>

          {/* Core Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Monthly Gross Inflow
              </span>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                {formatCurrency(results.monthlyGross, currency.symbol)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Net Take-Home
              </span>
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 mt-0.5">
                {formatCurrency(results.monthlyNet, currency.symbol)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Positivity Score
              </span>
              <div className="text-base font-bold font-mono tabular-nums text-indigo-600 mt-0.5 truncate">
                {results.positivity.score}/100 <span className="text-xs font-semibold">({results.positivity.tier})</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Emergency Runway
              </span>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                {results.positivity.runwayMonths} Months
              </div>
            </div>
          </div>

          {/* Cashflow Allocation Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Monthly Cashflow Allocation
            </h4>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Monthly Amount</th>
                  <th className="py-2.5 px-3 text-right">Annualized</th>
                  <th className="py-2.5 px-3 text-right">% of Gross</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-800">
                    Gross Revenue Inflow
                  </td>
                  <td className="py-2 px-3 text-right font-bold">
                    {formatCurrency(results.monthlyGross, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {formatCurrency(results.annualGross, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right">100%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-rose-700">Estimated Taxes</td>
                  <td className="py-2 px-3 text-right text-rose-700">
                    -{formatCurrency(results.monthlyTax, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right text-rose-700">
                    -{formatCurrency(results.monthlyTax * 12, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {((results.monthlyTax / Math.max(1, results.monthlyGross)) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-amber-700">Living Costs Overhead</td>
                  <td className="py-2 px-3 text-right text-amber-700">
                    -{formatCurrency(results.monthlyExpenses, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right text-amber-700">
                    -{formatCurrency(results.monthlyExpenses * 12, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {((results.monthlyExpenses / Math.max(1, results.monthlyGross)) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-emerald-700">Target Monthly Savings</td>
                  <td className="py-2 px-3 text-right text-emerald-700">
                    {formatCurrency(results.monthlySavings, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-700">
                    {formatCurrency(results.monthlySavings * 12, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {((results.monthlySavings / Math.max(1, results.monthlyGross)) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2 px-3 font-sans text-indigo-900">
                    Net Discretionary Free Cash
                  </td>
                  <td className="py-2 px-3 text-right text-indigo-900">
                    {formatCurrency(results.monthlyDiscretionary, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right text-indigo-900">
                    {formatCurrency(results.monthlyDiscretionary * 12, currency.symbol)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {((results.monthlyDiscretionary / Math.max(1, results.monthlyGross)) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Active Streams Schedule */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Income Portfolio Schedule
            </h4>
            <div className="space-y-1.5">
              {portfolio.streams.map((stream) => (
                <div
                  key={stream.id}
                  className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{stream.title}</span>{' '}
                    <span className="text-slate-500">({stream.category})</span>
                    {stream.notes && <div className="text-[11px] text-slate-400">{stream.notes}</div>}
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(stream.monthlyGross, currency.symbol)}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Health Insights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Strategic Growth & Positivity Recommendations
            </h4>
            <div className="space-y-1.5">
              {results.positivity.actionableInsights.map((ins, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
