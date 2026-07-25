// src/views/DashboardView.tsx
import React from 'react';
import { RotateCw, Utensils, Car, ShoppingBag, Zap, Film, ShoppingCart, HeartPulse, TrendingUp} from 'lucide-react';
import { TopHeader } from '../components/TopHeader';

interface DashboardViewProps {
  timeframe: 'W' | 'M' | 'Y';
  setTimeframe: (t: 'W' | 'M' | 'Y') => void;
  currentMonthName: string;
  daysArray: { dayLabel: string; isCurrent: boolean }[];
  onViewAllClick: () => void;
  onProfileClick: () => void;
  username: string | null;
  metrics: {
    timeframe_totals: { week: number; month: number; year: number };
    bar_chart: { date_label: string; amount: number }[];
    last_transaction: {
      amount: number;
      category: string;
      description: string;
      created_at: string;
    } | null;
  };
  onRefreshMetrics: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  timeframe,
  setTimeframe,
  currentMonthName,
  daysArray,
  onViewAllClick,
  onProfileClick,
  username,
  metrics,
  onRefreshMetrics,
}) => {
  
  // 1. Resolve dynamic header value matching context tracker frame
  const getDisplayTotal = () => {
    if (timeframe === 'W') return metrics.timeframe_totals.week;
    if (timeframe === 'Y') return metrics.timeframe_totals.year;
    return metrics.timeframe_totals.month;
  };

  const getDisplayLabel = () => {
    if (timeframe === 'W') return "Spent this week";
    if (timeframe === 'Y') return "Spent this year";
    return "Spent this month";
  };

  // 2. Resolve the category icon using your exact configuration mapping rules
  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Travel':
      case 'Transport': return <Car className="w-5 h-5 text-white" />;
      case 'Shopping': return <ShoppingBag className="w-5 h-5 text-white" />;
      case 'Utilities': return <Zap className="w-5 h-5 text-white" />;
      case 'Entertainment': return <Film className="w-5 h-5 text-white" />;
      case 'Groceries': return <ShoppingCart className="w-5 h-5 text-white" />;
      case 'Medical': return <HeartPulse className="w-5 h-5 text-white" />;
      case 'Investment': return <TrendingUp className="w-5 h-5 text-white" />;
      default: return <Utensils className="w-5 h-5 text-white" />;
    }
  };

  // 3. Determine highest bar scale values to balance relative styling constraints dynamically
  const maxAmount = Math.max(...metrics.bar_chart.map(b => b.amount), 1);

  // Timeframe options list and active index for sliding pill offset
  const timeframes: ('W' | 'M' | 'Y')[] = ['W', 'M', 'Y'];
  const activeIndex = timeframes.indexOf(timeframe);

  return (
    <div className="flex-1 flex flex-col justify-between no-scrollbar overflow-y-auto">
      <div>
        <TopHeader onProfileClick={onProfileClick} username={username} />

        {/* TOTAL SPEND METRIC BOX */}
        <div className="w-full bg-gradient-to-b from-[#1D2B99] via-[#141B54] to-black rounded-[32px] p-6 shadow-2xl relative mb-6 h-[190px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-semibold tracking-tight text-white mt-1">
              ₹ {getDisplayTotal().toLocaleString('en-IN')}
            </h2>
            <button 
              onClick={onRefreshMetrics}
              className="text-white/60 hover:text-white active:rotate-45 transition-all mt-2"
            >
              <RotateCw className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
          <div className="flex justify-between items-end w-full">
            
            {/* SLIDABLE TIMEFRAME TOGGLE */}
            <div className="relative flex items-center bg-black/50 p-1 rounded-full border border-white/10 w-[112px] h-10">
              {/* Sliding Active White Pill */}
              <div 
                className="absolute top-1 bottom-1 w-8 bg-white rounded-full transition-transform duration-300 ease-out shadow-md"
                style={{ transform: `translateX(${activeIndex * 32}px)` }}
              />
              
              {/* Toggle Option Buttons */}
              {timeframes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors duration-200 ${
                    timeframe === t ? 'text-indigo-950 font-bold' : 'text-indigo-500 hover:text-indigo-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <p className="text-zinc-300 text-sm font-light tracking-wide pb-1.5 pr-1">{getDisplayLabel()}</p>
          </div>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-normal text-white tracking-wide">Analytics</h3>
            <span className="px-4 py-1.5 bg-gradient-to-r from-[#FF5E3A] to-[#FF4500] text-white font-medium text-sm rounded-xl shadow-md">
              {currentMonthName}
            </span>
          </div>

          <div className="w-full relative px-1">
            <div className="absolute left-0 right-0 h-[135px] bottom-[26px] pointer-events-none flex flex-col justify-between">
              <div className="w-full border-b border-zinc-700/30"></div>
              <div className="w-full border-b border-zinc-600/40"></div>
              <div className="w-full border-b border-zinc-500/60"></div>
              <div className="w-full border-b border-zinc-400/90"></div>
            </div>

            {/* DYNAMIC BAR GRAPH RENDERING */}
            <div className="w-full flex items-end justify-between h-[135px] relative z-10 pb-[1px]">
              {metrics.bar_chart.map((item, idx) => {
                const heightPercentage = (item.amount / maxAmount) * 110;
                const finalHeight = Math.max(heightPercentage, item.amount > 0 ? 15 : 0);

                return (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <span className="text-[10px] font-medium text-zinc-300 mb-1">
                      {item.amount > 0 ? `₹${item.amount}` : '₹0'}
                    </span>
                    <div 
                      style={{ height: `${finalHeight}px` }}
                      className={`w-9 rounded-t-md transition-all duration-500 ${
                        idx === metrics.bar_chart.length - 1
                          ? 'bg-gradient-to-b from-[#FF7E40] to-[#FF4500] shadow-lg shadow-orange-600/20'
                          : 'bg-gradient-to-b from-[#A5C0FF] via-[#597BE2] to-[#121A46]'
                      }`} 
                    />
                  </div>
                );
              })}
            </div>

            <div className="w-full flex justify-between mt-2 relative z-10">
              {(daysArray.length === metrics.bar_chart.length ? daysArray : metrics.bar_chart.map(b => ({ dayLabel: b.date_label, isCurrent: b.date_label.includes("10th") }))).map((dayData, index) => (
                <div key={index} className="flex-1 flex justify-center">
                  <span className={`text-[11px] font-normal tracking-tight ${
                    dayData.isCurrent ? 'text-orange-400 font-medium' : 'text-zinc-400'
                  }`}>
                    {dayData.dayLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LAST TRANSACTION LOG GROUP */}
      <div className="flex-1 relative flex flex-col justify-center min-h-[140px] mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-normal text-white tracking-wide">Last transaction</h3>
          <button
            onClick={onViewAllClick}
            className="text-xs font-light text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            view all
          </button>
        </div>

        <div className="relative pt-2">
          {metrics.last_transaction ? (
            <div className="w-full bg-gradient-to-r from-[#18227C] via-[#12164A] to-[#0A0D2B] border border-zinc-800/60 rounded-[24px] p-5 flex items-center justify-between shadow-2xl relative z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {getCategoryIcon(metrics.last_transaction.category)}
                </div>
                <div>
                  <h4 className="font-medium text-white text-lg tracking-wide">
                    {metrics.last_transaction.description || metrics.last_transaction.category}
                  </h4>
                </div>
              </div>
              <span className="text-[#00E676] font-medium text-lg tracking-wider">
                ₹{metrics.last_transaction.amount}
              </span>
            </div>
          ) : (
            <div className="w-full bg-zinc-900/40 border border-dashed border-zinc-800 rounded-[24px] p-6 text-center relative z-20">
              <p className="text-zinc-500 text-sm font-light">No logged transactions found yet.</p>
            </div>
          )}

          <div className="w-[90%] mx-auto bg-gradient-to-r from-[#1A258C] to-[#0A0D2F] border-b border-white/5 h-12 rounded-b-[24px] shadow-xl mt-[-16px] opacity-40 blur-[0.4px] relative z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};