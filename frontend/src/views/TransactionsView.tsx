import React from 'react';
import { Search, SlidersHorizontal, ChevronUp, ChevronDown, Edit2, Trash2, Car, ShoppingBag, Zap, Film, Utensils } from 'lucide-react';
import { Transaction } from '../types/finance';
import { TopHeader } from '../components/TopHeader';

interface TransactionsViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  transactionsState: Record<string, Transaction[]>;
  expandedDates: Record<string, boolean>;
  toggleDateAccordion: (dateKey: string) => void;
  getFriendlyDateLabel: (dateStr: string) => string;
  getDayNetNumericTotal: (txs: Transaction[]) => number;
  activeInlineRowMenu: string | null;
  setActiveInlineRowMenu: (id: string | null) => void;
  handleOpenEditModal: (dateKey: string, tx: Transaction) => void;
  handleDeleteTransaction: (dateKey: string, txId: string) => void;
  onBackClick: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  searchQuery,
  setSearchQuery,
  transactionsState,
  expandedDates,
  toggleDateAccordion,
  getFriendlyDateLabel,
  getDayNetNumericTotal,
  activeInlineRowMenu,
  setActiveInlineRowMenu,
  handleOpenEditModal,
  handleDeleteTransaction,
  onBackClick,
}) => {
  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Travel':
      case 'Transport': return <Car className="w-5 h-5 text-white" />;
      case 'Shopping': return <ShoppingBag className="w-5 h-5 text-white" />;
      case 'Utilities': return <Zap className="w-5 h-5 text-white" />;
      case 'Entertainment': return <Film className="w-5 h-5 text-white" />;
      default: return <Utensils className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col no-scrollbar overflow-hidden pb-[88px]">
      <TopHeader title="Transactions" showBackButton={true} onBackClick={onBackClick} />

      <div className="relative w-full mb-6">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-zinc-500" />
        </span>
        <input
          type="text"
          placeholder="Search transaction..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 bg-[#0C0C0E] border border-zinc-900 rounded-xl pl-12 pr-12 text-white font-normal text-sm focus:outline-none focus:border-zinc-800 tracking-wide placeholder-zinc-600"
        />
        <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500">
          <SlidersHorizontal className="w-4 h-4" />
        </span>
      </div>

      <p className="text-zinc-400 text-sm font-normal tracking-wide mb-4">Recent Transactions</p>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pb-4">
        {Object.keys(transactionsState)
          .sort((a, b) => b.localeCompare(a))
          .map((dateKey) => {
            const dayTransactions = transactionsState[dateKey] || [];
            const filteredTxs = dayTransactions.filter(tx =>
              tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tx.amount.toString().includes(searchQuery)
            );

            if (filteredTxs.length === 0) return null;

            const isExpanded = !!expandedDates[dateKey];
            const totalDaySpent = getDayNetNumericTotal(filteredTxs);

            return (
              <div key={dateKey} className="w-full">
                <div
                  onClick={() => toggleDateAccordion(dateKey)}
                  className="w-full flex justify-between items-center py-2.5 px-1 cursor-pointer select-none"
                >
                  <span className="text-[#4E5FFF] text-sm font-medium tracking-wide">
                    {getFriendlyDateLabel(dateKey)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#4E5FFF] text-sm font-semibold">
                      ₹ {totalDaySpent.toLocaleString('en-IN')}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#4E5FFF]" /> : <ChevronDown className="w-4 h-4 text-[#4E5FFF]" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 space-y-2.5 pl-0.5">
                    {filteredTxs.map((tx) => {
                      const isMenuRowActive = activeInlineRowMenu === tx.id;

                      return (
                        <div
                          key={tx.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveInlineRowMenu(isMenuRowActive ? null : tx.id);
                          }}
                          className={`w-full bg-[#0C0C0F] border rounded-[20px] transition-all overflow-hidden ${
                            isMenuRowActive ? 'border-[#333DC1]' : 'border-zinc-900/50'
                          }`}
                        >
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-xl bg-[#1A1A2E] flex items-center justify-center border border-zinc-800/40">
                                {getCategoryIcon(tx.category)}
                              </div>
                              <div>
                                <h4 className="text-white text-base font-medium tracking-wide">{tx.category}</h4>
                                <p className="text-zinc-500 text-xs mt-0.5 font-light">{tx.title}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-base font-medium tracking-wide ${tx.type === 'credit' ? 'text-[#00E676]' : 'text-[#FF4A4A]'}`}>
                                {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                              </p>
                              <p className="text-[10px] text-zinc-600 mt-0.5 font-light">{tx.time}</p>
                            </div>
                          </div>

                          {isMenuRowActive && (
                            <div className="flex border-t border-zinc-900 bg-black/40 h-12">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditModal(dateKey, tx);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 text-sm text-indigo-400 font-medium hover:bg-zinc-900/40 transition-colors border-r border-zinc-900"
                              >
                                <Edit2 className="w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTransaction(dateKey, tx.id);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 text-sm text-red-500 font-medium hover:bg-zinc-900/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};