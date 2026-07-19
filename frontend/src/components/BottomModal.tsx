import React, { useEffect } from 'react';
import { X, ArrowDown, ArrowUp, ChevronDown, Utensils, Car, ShoppingBag, Zap, Film } from 'lucide-react';

interface BottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: 'add' | 'edit';
  txType: 'expense' | 'credit';
  setTxType: (type: 'expense' | 'credit') => void;
  category: string;
  setCategory: (cat: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  customDate: string;
  setCustomDate: (date: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  amount: string;
  setAmount: (amt: string) => void;
  onSubmit: () => void;
  selectedMonthName: string;
  selectedDay: number;
}

export const BottomModal: React.FC<BottomModalProps> = ({
  isOpen,
  onClose,
  modalMode,
  txType,
  setTxType,
  category,
  setCategory,
  isDropdownOpen,
  setIsDropdownOpen,
  customDate,
  setCustomDate,
  description,
  setDescription,
  amount,
  setAmount,
  onSubmit,
  selectedMonthName,
  selectedDay,
}) => {
  
  // Hook to catch modal openings and enforce the local current system date fallback
  useEffect(() => {
    if (isOpen && modalMode === 'add') {
      // Generate YYYY-MM-DD template matching local calendar zone configuration safely
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedCurrentDate = `${year}-${month}-${day}`;
      
      // If the string is completely empty or defaults back to the June 11 lock ('2026-06-11' or similar variant), override it
      if (!customDate || customDate.endsWith('06-11')) {
        setCustomDate(formattedCurrentDate);
      }
    }
  }, [isOpen, modalMode, setCustomDate]);

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
    <>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute left-0 right-0 bottom-0 bg-[#0F0F11] border-t border-zinc-800 rounded-t-[32px] px-6 pt-5 pb-8 z-50 transition-transform duration-300 transform flex flex-col justify-between max-h-[88vh] overflow-y-auto no-scrollbar ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mb-5" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold tracking-wide text-white">
            {modalMode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 flex-1">
          <div className="w-full bg-[#17171C] rounded-2xl p-1 flex border border-zinc-800/80">
            <button
              type="button" onClick={() => setTxType('expense')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                txType === 'expense' ? 'bg-[#3A46E6] text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ArrowDown className="w-4 h-4" /> Expense
            </button>
            <button
              type="button" onClick={() => setTxType('credit')}
              className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                txType === 'credit' ? 'bg-[#3A46E6] text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ArrowUp className="w-4 h-4" /> Credit
            </button>
          </div>

          <div className="relative">
            <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Category</label>
            <button
              type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#121214] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#23233B] border border-indigo-500/20 flex items-center justify-center">
                  {getCategoryIcon(category)}
                </div>
                <span className="text-white text-base font-medium">{category}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-[#17171C] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-60">
                {['Food & Dining', 'Transport', 'Shopping', 'Utilities', 'Entertainment'].map((cat) => (
                  <button
                    key={cat} type="button"
                    onClick={() => { setCategory(cat); setIsDropdownOpen(false); }}
                    className="w-full px-5 py-3.5 flex items-center gap-4 text-left text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-white border-b border-zinc-800/40 last:border-0 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#23233B] flex items-center justify-center">{getCategoryIcon(cat)}</div>
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Transaction Date</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:border-zinc-700 font-medium text-sm scheme-dark"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Description</label>
            <div className="relative bg-[#121214] border border-zinc-800 rounded-2xl focus-within:border-zinc-700 transition-colors p-4">
              <textarea
                maxLength={100} value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
                className="w-full bg-transparent resize-none text-white placeholder-zinc-600 focus:outline-none text-base h-20"
              />
              <span className="absolute bottom-3 right-4 text-xs font-light text-zinc-600">{description.length}/100</span>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Amount</label>
            <div className="w-full bg-[#121214] border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 focus-within:border-zinc-700 transition-colors">
              <span className="text-zinc-500 text-lg font-medium">₹</span>
              <input
                type="number" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-transparent text-white placeholder-zinc-600 focus:outline-none text-base"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onSubmit}
            className="w-full h-14 bg-[#3A46E6] hover:bg-indigo-600 text-white font-semibold text-base rounded-2xl shadow-xl transition-all"
          >
            {modalMode === 'edit' ? 'Edit Expense' : `Add to ${selectedMonthName} ${selectedDay}`}
          </button>
        </div>
      </div>
    </>
  );
};