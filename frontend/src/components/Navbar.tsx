import React from 'react';
import { List, Calendar } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'calendar' | 'transactions';
  setActiveTab: (tab: 'home' | 'calendar' | 'transactions') => void;
  setIsMonthDropdownOpen: (open: boolean) => void;
  onAddClick: () => void;
  selectedMonthName: string;
  selectedDay: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  setIsMonthDropdownOpen,
  onAddClick,
  selectedMonthName,
  selectedDay,
}) => {
  const handleTabChange = (tab: 'home' | 'calendar' | 'transactions') => {
    setActiveTab(tab);
    setIsMonthDropdownOpen(false);
  };

  if (activeTab === 'home' || activeTab === 'transactions') {
    return (
      <div className="w-full h-20 flex items-center justify-between px-2 relative z-30 bg-black border-t border-zinc-900/30 mt-auto">
        <button
          onClick={() => handleTabChange('home')}
          className={`flex-1 transition-colors flex items-center justify-center ${activeTab === 'home' ? 'text-white' : 'text-white/40 hover:text-white'}`}
        >
          <List className="w-8 h-8 stroke-[2.5]" />
        </button>

        <div className="flex-[2] px-4 flex items-center justify-center">
          <button
            onClick={onAddClick}
            className="w-full h-[52px] rounded-2xl bg-gradient-to-b from-[#FFA868] via-[#FF5F2E] to-[#D82A00] flex items-center justify-center text-white font-semibold text-base tracking-wider shadow-lg shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden relative ring-1 ring-white/20"
          >
            Add
          </button>
        </div>

        <button
          onClick={() => handleTabChange('calendar')}
          className="flex-1 transition-colors flex items-center justify-center text-white hover:text-white/40"
        >
          <Calendar className="w-8 h-8 stroke-[2]" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-black border-t border-zinc-900/40 px-6 flex items-center justify-center z-30 pb-4">
      <button
        onClick={onAddClick}
        className="w-full h-14 bg-gradient-to-r from-[#2937D3] to-[#3A46E6] hover:opacity-95 active:scale-[0.99] text-white text-base font-medium rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all border border-indigo-500/20"
      >
        <span className="text-xl font-light">+</span> Add for {selectedMonthName} {selectedDay}
      </button>
    </div>
  );
};