import React from 'react';
import { ChevronDown, Car, ShoppingBag, Zap, Film, Utensils } from 'lucide-react';
import { Transaction } from '../types/finance';
import { TopHeader } from '../components/TopHeader';

interface CalendarViewProps {
  selectedMonth: number;
  selectedYear: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  isMonthDropdownOpen: boolean;
  setIsMonthDropdownOpen: (open: boolean) => void;
  monthsList: string[];
  yearsList?: number[];
  monthlyTotalSpent: number;
  generateGridDays: () => { num: number; currentMonth: boolean }[];
  getDaySummary: (day: number) => { type: string; label: string } | null;
  activeDayTransactions: Transaction[];
  activeDayTotalSpent: number;
  onBackClick: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedMonth,
  selectedYear,
  selectedDay,
  setSelectedDay,
  setSelectedMonth,
  setSelectedYear,
  isMonthDropdownOpen,
  setIsMonthDropdownOpen,
  monthsList,
  yearsList = [2024, 2025, 2026, 2027],
  monthlyTotalSpent,
  generateGridDays,
  getDaySummary,
  activeDayTransactions,
  activeDayTotalSpent,
  onBackClick,
}) => {
  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Travel':
      case 'Transport':
        return <Car className="w-5 h-5 text-white" />;
      case 'Shopping':
        return <ShoppingBag className="w-5 h-5 text-white" />;
      case 'Utilities':
        return <Zap className="w-5 h-5 text-white" />;
      case 'Entertainment':
        return <Film className="w-5 h-5 text-white" />;
      default:
        return <Utensils className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between no-scrollbar overflow-y-auto pb-[88px]">
      <div>
        <TopHeader title="Calendar" showBackButton={true} onBackClick={onBackClick} />

        {/* Total Spent Banner & Dropdown Header */}
        <div className="w-full bg-gradient-to-b from-[#1C2682] via-[#11164D] to-black rounded-[28px] p-5 shadow-xl flex items-center justify-between mb-5 h-24 relative">
          <div>
            <p className="text-zinc-400 text-xs font-normal tracking-wide">
              Total spent in {monthsList[selectedMonth]} {selectedYear}
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              ₹ {monthlyTotalSpent.toLocaleString('en-IN')}
            </h3>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="bg-[#181824] border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 font-medium flex items-center gap-2 hover:border-zinc-700 transition-colors"
            >
              {monthsList[selectedMonth]} {selectedYear} <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>

            {isMonthDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl z-50 p-2">
                {/* Year Selection Row */}
                <div className="mb-2 pb-2 border-b border-zinc-800 flex justify-between items-center px-2">
                  <span className="text-xs text-zinc-500 font-medium">Year:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-[#181824] border border-zinc-700 rounded px-2 py-1 text-xs text-white outline-none"
                  >
                    {yearsList.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Selection List */}
                <div className="max-h-48 overflow-y-auto no-scrollbar space-y-1">
                  {monthsList.map((mName, mIdx) => (
                    <button
                      key={mIdx}
                      onClick={() => {
                        setSelectedMonth(mIdx);
                        setIsMonthDropdownOpen(false);
                        setSelectedDay(1);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors block ${
                        mIdx === selectedMonth
                          ? 'bg-[#2532C2] text-white font-medium'
                          : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}
                    >
                      {mName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs font-medium text-zinc-500 mb-3 tracking-wide">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-3.5 text-center mb-5">
          {generateGridDays().map((day, index) => {
            const hasData = day.currentMonth ? getDaySummary(day.num) : null;
            const isDaySelected = day.currentMonth && selectedDay === day.num;

            return (
              <div
                key={index}
                onClick={() => day.currentMonth && setSelectedDay(day.num)}
                className="flex flex-col items-center justify-center min-h-[44px] relative cursor-pointer select-none"
              >
                {isDaySelected ? (
                  <div className="w-10 h-12 bg-[#2532C2] rounded-full flex flex-col items-center justify-center shadow-lg border border-indigo-400/30 transition-all transform scale-105">
                    <span className="text-sm font-semibold text-white">{day.num}</span>
                    <span className="text-[8px] font-medium text-indigo-200 mt-0.5">
                      {hasData ? hasData.label : '₹0'}
                    </span>
                  </div>
                ) : (
                  <>
                    <span
                      className={`text-sm ${
                        day.currentMonth
                          ? 'text-zinc-300 font-normal'
                          : 'text-zinc-700 font-light pointer-events-none'
                      }`}
                    >
                      {day.num}
                    </span>
                    {hasData && (
                      <span
                        className={`text-[8px] mt-0.5 font-medium tracking-tight ${
                          hasData.type === 'credit' ? 'text-[#00E676]' : 'text-[#FF4A4A]'
                        }`}
                      >
                        {hasData.label}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Transaction Details Card */}
        <div className="bg-[#0C0C0E] border border-zinc-900 rounded-[28px] p-4 flex flex-col justify-between shadow-xl mb-4">
          <div className="flex justify-between items-center mb-4 px-1">
            <h4 className="text-lg font-medium text-white tracking-wide">
              {selectedDay} {monthsList[selectedMonth]} {selectedYear}
            </h4>
            <div>
              <span className="text-zinc-500 text-xs font-normal block text-right">Total spent</span>
              <span className="text-[#5E6EFF] text-lg font-bold block mt-0.5">
                ₹ {activeDayTotalSpent.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {activeDayTransactions.length > 0 ? (
              activeDayTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="w-full bg-[#131317] rounded-xl p-3 flex items-center justify-between border border-zinc-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1C1C30] flex items-center justify-center">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.category}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{tx.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        tx.type === 'credit' ? 'text-[#00E676]' : 'text-[#FF4A4A]'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{tx.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-zinc-600 text-sm font-light tracking-wide border border-dashed border-zinc-900 rounded-xl">
                No logged transactions for this date.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};