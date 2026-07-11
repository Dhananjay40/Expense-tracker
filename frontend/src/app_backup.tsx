// import { useState, useEffect } from 'react';
// import { User, MoreHorizontal, Utensils, Calendar, List, X, ArrowDown, ArrowUp, ChevronDown, ChevronUp, Car, ShoppingBag, Zap, ArrowLeft, Film, Search, Trash2, Edit2, SlidersHorizontal } from 'lucide-react';

// interface Transaction {
//   id: string; // Unique identifier for dynamic state updates
//   category: string;
//   title: string;
//   amount: number;
//   time: string;
//   type: 'expense' | 'credit';
// }

// const monthsList = [
//   "January", "February", "March", "April", "May", "June", 
//   "July", "August", "September", "October", "November", "December"
// ];

// const initialTransactions: Record<string, Transaction[]> = {
//   "2026-06-01": [{ id: '1', category: 'Food & Dining', title: 'Snacks', amount: 390, time: '04:12 PM', type: 'expense' }],
//   "2026-06-02": [{ id: '2', category: 'Salary', title: 'Freelance Payout', amount: 1250, time: '10:00 AM', type: 'credit' }],
//   "2026-06-03": [{ id: '3', category: 'Investment', title: 'Dividend Recieved', amount: 500, time: '11:30 AM', type: 'credit' }],
//   "2026-06-04": [{ id: '4', category: 'Utilities', title: 'Mobile Recharge', amount: 230, time: '01:15 PM', type: 'expense' }],
//   "2026-06-05": [{ id: '5', category: 'Transfer', title: 'From Friend', amount: 850, time: '09:00 PM', type: 'credit' }],
//   "2026-06-07": [{ id: '6', category: 'Investment', title: 'Cashback App', amount: 755, time: '03:40 AM', type: 'credit' }],
//   "2026-06-08": [{ id: '7', category: 'Shopping', title: 'New T-Shirt', amount: 500, time: '07:22 PM', type: 'expense' }],
//   "2026-06-10": [{ id: '8', category: 'Utilities', title: 'Gas Bill Reward', amount: 80, time: '05:50 PM', type: 'credit' }],
//   "2026-06-11": [
//     { id: '9', category: 'Food & Dining', title: 'Lunch at Cafe', amount: 150, time: '12:45 PM', type: 'expense' },
//     { id: '10', category: 'Transport', title: 'Auto Ride', amount: 80, time: '02:15 PM', type: 'expense' },
//     { id: '11', category: 'Food & Dining', title: 'Evening Snacks', amount: 60, time: '06:30 PM', type: 'expense' },
//     { id: '12', category: 'Entertainment', title: 'Movie Ticket', amount: 100, time: '09:10 PM', type: 'expense' }
//   ],
//   "2026-06-18": [{ id: '13', category: 'Shopping', title: 'Shoes procurement', amount: 600, time: '02:00 PM', type: 'expense' }],
//   "2026-06-19": [{ id: '14', category: 'Utilities', title: 'Electricity Bill', amount: 1150, time: '08:15 PM', type: 'expense' }],
// };

// export default function App() {
//   // Navigation Engine
//   const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'transactions'>('home');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
//   const [editingTxId, setEditingTxId] = useState<string | null>(null);
//   const [editingDateKey, setEditingDateKey] = useState<string | null>(null);
  
//   // Mutable Data State
//   const [transactionsState, setTransactionsState] = useState<Record<string, Transaction[]>>(initialTransactions);

//   // Transactions View Interactive UI States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({ "2026-06-11": true });
//   const [activeInlineRowMenu, setActiveInlineRowMenu] = useState<string | null>("10"); // Matching design snapshot highlight defaults

//   // Interactive State for Calendar Selection
//   const [selectedYear, setSelectedYear] = useState(2026);
//   const [selectedMonth, setSelectedMonth] = useState(5); // June (0-indexed)
//   const [selectedDay, setSelectedDay] = useState(11);
//   const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

//   // Form Entry States
//   const [txType, setTxType] = useState<'expense' | 'credit'>('expense');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [category, setCategory] = useState('Food & Dining');
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [customDate, setCustomDate] = useState('2026-06-11');

//   // Timeframe for Dashboard Analytics
//   const [timeframe, setTimeframe] = useState<'W' | 'M' | 'Y'>('M');
//   const [currentMonthName, setCurrentMonthName] = useState('June');
//   const [daysArray, setDaysArray] = useState<{ dayLabel: string; isCurrent: boolean }[]>([]);

//   useEffect(() => {
//     const now = new Date();
//     setCurrentMonthName(monthsList[now.getMonth()]);

//     const tempDays = [];
//     for (let i = 4; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(now.getDate() - i);
//       const dayNum = d.getDate();
//       let suffix = 'th';
//       if (dayNum === 1 || dayNum === 21 || dayNum === 31) suffix = 'st';
//       else if (dayNum === 2 || dayNum === 22) suffix = 'nd';
//       else if (dayNum === 3 || dayNum === 23) suffix = 'rd';

//       tempDays.push({
//         dayLabel: `${dayNum}${suffix}`,
//         isCurrent: i === 0 
//       });
//     }
//     setDaysArray(tempDays);
//   }, []);

//   useEffect(() => {
//     if (modalMode === 'add') {
//       const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
//       const formattedDay = String(selectedDay).padStart(2, '0');
//       setCustomDate(`${selectedYear}-${formattedMonth}-${formattedDay}`);
//     }
//   }, [selectedDay, selectedMonth, selectedYear, modalMode]);

//   const getFormattedDateKey = (day: number) => {
//     const mm = String(selectedMonth + 1).padStart(2, '0');
//     const dd = String(day).padStart(2, '0');
//     return `${selectedYear}-${mm}-${dd}`;
//   };

//   const getDaySummary = (day: number) => {
//     const key = getFormattedDateKey(day);
//     const dayTxs = transactionsState[key] || [];
//     if (dayTxs.length === 0) return null;
    
//     const isCredit = dayTxs.some(t => t.type === 'credit');
//     const total = dayTxs.reduce((acc, curr) => acc + curr.amount, 0);
//     return {
//       type: isCredit ? 'credit' : 'expense',
//       label: `₹${total.toLocaleString('en-IN')}`
//     };
//   };

//   const generateGridDays = () => {
//     const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
//     const matrix = [];
//     for (let p = 27; p <= 31; p++) {
//       matrix.push({ num: p, currentMonth: false });
//     }
//     for (let d = 1; d <= daysInMonth; d++) {
//       matrix.push({ num: d, currentMonth: true });
//     }
//     return matrix;
//   };

//   const currentSelectedKey = getFormattedDateKey(selectedDay);
//   const activeDayTransactions = transactionsState[currentSelectedKey] || [];
//   const activeDayTotalSpent = activeDayTransactions
//     .filter(t => t.type === 'expense')
//     .reduce((sum, t) => sum + t.amount, 0);

//   const getCategoryIcon = (catName: string) => {
//     switch (catName) {
//       case 'Travel': 
//       case 'Transport': return <Car className="w-5 h-5 text-white" />;
//       case 'Shopping': return <ShoppingBag className="w-5 h-5 text-white" />;
//       case 'Utilities': return <Zap className="w-5 h-5 text-white" />;
//       case 'Entertainment': return <Film className="w-5 h-5 text-white" />;
//       default: return <Utensils className="w-5 h-5 text-white" />;
//     }
//   };

//   const getDayNetNumericTotal = (txs: Transaction[]) => {
//     return txs.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum + t.amount, 0);
//   };

//   // Human-friendly date header for the transaction log screen
//   const getFriendlyDateLabel = (dateStr: string) => {
//     const [y, m, d] = dateStr.split('-').map(Number);
//     const dateObj = new Date(y, m - 1, d);
//     const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
//     const mName = monthsList[dateObj.getMonth()];
//     return `${d} ${mName} ${y}, ${dayName}`;
//   };

//   // Trigger Edit Mode and pre-populate states
//   const handleOpenEditModal = (dateKey: string, tx: Transaction) => {
//     setModalMode('edit');
//     setEditingTxId(tx.id);
//     setEditingDateKey(dateKey);
//     setTxType(tx.type);
//     setCategory(tx.category);
//     setDescription(tx.title);
//     setAmount(tx.amount.toString());
//     setCustomDate(dateKey);
//     setIsModalOpen(true);
//   };

//   const handleDeleteTransaction = (dateKey: string, txId: string) => {
//     const updatedDayTxs = (transactionsState[dateKey] || []).filter(t => t.id !== txId);
//     const updatedState = { ...transactionsState };
//     if (updatedDayTxs.length === 0) {
//       delete updatedState[dateKey];
//     } else {
//       updatedState[dateKey] = updatedDayTxs;
//     }
//     setTransactionsState(updatedState);
//     if (activeInlineRowMenu === txId) setActiveInlineRowMenu(null);
//   };

//   const handleFormSubmit = () => {
//     if (!amount || !description) return;

//     const parsedAmount = parseFloat(amount) || 0;
//     const updatedState = { ...transactionsState };

//     if (modalMode === 'edit' && editingTxId && editingDateKey) {
//       // Remove original record
//       updatedState[editingDateKey] = (updatedState[editingDateKey] || []).filter(t => t.id !== editingTxId);
//       if (updatedState[editingDateKey].length === 0) delete updatedState[editingDateKey];

//       // Add as updated record
//       const updatedTx: Transaction = {
//         id: editingTxId,
//         category,
//         title: description,
//         amount: parsedAmount,
//         time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//         type: txType
//       };

//       updatedState[customDate] = [updatedTx, ...(updatedState[customDate] || [])];
//     } else {
//       // Logic for adding a brand new item
//       const newTx: Transaction = {
//         id: Math.random().toString(36).substr(2, 9),
//         category,
//         title: description,
//         amount: parsedAmount,
//         time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//         type: txType
//       };
//       updatedState[customDate] = [newTx, ...(updatedState[customDate] || [])];
//     }

//     setTransactionsState(updatedState);
//     setIsModalOpen(false);
//     setIsDropdownOpen(false);
//     // Reset inputs
//     setDescription('');
//     setAmount('');
//   };

//   const toggleDateAccordion = (dateKey: string) => {
//     setExpandedDates(prev => ({ ...prev, [dateKey]: !prev[dateKey] }));
//   };

//   return (
//     <div className="h-screen w-full bg-black text-white font-sans flex justify-center items-center antialiased overflow-hidden selection:bg-indigo-500/20">
      
//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       {/* FIXED CANVAS WINDOW */}
//       <div className="w-full max-w-md h-full max-h-screen bg-black px-6 pt-8 pb-6 flex flex-col justify-between relative overflow-hidden">
        
//         {/* VIEW 1: DASHBOARD LANDING SCREEN */}
//         {activeTab === 'home' && (
//           <div className="flex-1 flex flex-col justify-between no-scrollbar overflow-y-auto">
//             <div>
//               {/* HEADER */}
//               <div className="flex justify-between items-center mb-5">
//                 <div>
//                   <p className="text-white text-3xl font-normal tracking-tight">Hello</p>
//                   <h1 className="text-3xl font-semibold text-white tracking-wide mt-0.5">Dhananjay</h1>
//                 </div>
//                 <button className="text-white hover:opacity-80 transition-opacity">
//                   <User className="w-8 h-8 stroke-[1.5]" />
//                 </button>
//               </div>

//               {/* TOTAL SPEND METRIC BOX */}
//               <div className="w-full bg-gradient-to-b from-[#1D2B99] via-[#141B54] to-black rounded-[32px] p-6 shadow-2xl relative mb-6 h-[190px] flex flex-col justify-between">
//                 <div className="flex justify-between items-start">
//                   <h2 className="text-5xl font-semibold tracking-tight text-white mt-1">₹ 7,680</h2>
//                   <button className="text-white/60 hover:text-white transition-colors mt-1">
//                     <MoreHorizontal className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <div className="flex justify-between items-end w-full">
//                   <div className="flex items-center gap-2 text-sm font-semibold bg-black/40 p-1 rounded-full border border-white/5">
//                     {['W', 'M', 'Y'].map((t) => (
//                       <button 
//                         key={t}
//                         onClick={() => setTimeframe(t as any)} 
//                         className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${timeframe === t ? 'bg-white text-indigo-950 shadow-md' : 'text-indigo-600 hover:text-indigo-400'}`}
//                       >
//                         {t}
//                       </button>
//                     ))}
//                   </div>
//                   <p className="text-zinc-300 text-sm font-light tracking-wide pb-1.5 pr-1">Spent this month</p>
//                 </div>
//               </div>

//               {/* ANALYTICS SECTION */}
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-normal text-white tracking-wide">Analytics</h3>
//                   <span className="px-4 py-1.5 bg-gradient-to-r from-[#FF5E3A] to-[#FF4500] text-white font-medium text-sm rounded-xl shadow-md">
//                     {currentMonthName}
//                   </span>
//                 </div>

//                 <div className="w-full relative px-1">
//                   <div className="absolute left-0 right-0 h-[135px] bottom-[26px] pointer-events-none flex flex-col justify-between">
//                     <div className="w-full border-b border-zinc-700/30"></div>
//                     <div className="w-full border-b border-zinc-600/40"></div>
//                     <div className="w-full border-b border-zinc-500/60"></div>
//                     <div className="w-full border-b border-zinc-400/90"></div>
//                   </div>

//                   <div className="w-full flex items-end justify-between h-[135px] relative z-10 pb-[1px]">
//                     {[755, 500, 80, 850, 390].map((amt, idx) => (
//                       <div key={idx} className="flex flex-col items-center flex-1">
//                         <span className="text-[11px] font-medium text-zinc-300 mb-1">₹{amt}</span>
//                         <div className={`w-9 rounded-t-md transition-all duration-500 ${
//                           idx === 4 
//                             ? 'h-[65px] bg-gradient-to-b from-[#FF7E40] to-[#FF4500] shadow-lg shadow-orange-600/20' 
//                             : 'bg-gradient-to-b from-[#A5C0FF] via-[#597BE2] to-[#121A46]'
//                         } ${idx === 0 ? 'h-[110px]' : idx === 1 ? 'h-[78px]' : idx === 2 ? 'h-[26px]' : idx === 3 ? 'h-[125px]' : ''}`} />
//                       </div>
//                     ))}
//                   </div>

//                   {/* HORIZONTAL DATES ARRAY LINE ROW */}
//                   <div className="w-full flex justify-between mt-2 relative z-10">
//                     {daysArray.map((dayData, index) => (
//                       <div key={index} className="flex-1 flex justify-center">
//                         <span className={`text-[11px] font-normal tracking-tight ${
//                           dayData.isCurrent ? 'text-orange-400 font-medium' : 'text-zinc-400'
//                         }`}>
//                           {dayData.dayLabel}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* LAST TRANSACTION LOG GROUP */}
//             <div className="flex-1 relative flex flex-col justify-center min-h-[140px] mb-4">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-xl font-normal text-white tracking-wide">Last transaction</h3>
//                 <button 
//                   onClick={() => setActiveTab('transactions')} 
//                   className="text-xs font-light text-zinc-500 hover:text-zinc-400 transition-colors"
//                 >
//                   view all
//                 </button>
//               </div>

//               <div className="relative pt-2">
//                 {/* Foreground Card */}
//                 <div className="w-full bg-gradient-to-r from-[#18227C] via-[#12164A] to-[#0A0D2B] border border-white/5 rounded-[24px] p-5 flex items-center justify-between shadow-2xl relative z-20">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
//                       <Utensils className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-white text-lg tracking-wide">Vada Pav</h4>
//                     </div>
//                   </div>
//                   <span className="text-[#00E676] font-medium text-lg tracking-wider">₹15</span>
//                 </div>

//                 {/* Underlying Stacked Blur Effect Deck Card */}
//                 <div className="w-[90%] mx-auto bg-gradient-to-r from-[#1A258C] to-[#0A0D2F] border-x border-b border-white/10 h-12 rounded-b-[24px] shadow-xl mt-[-16px] opacity-40 blur-[0.4px] relative z-10 pointer-events-none" />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- VIEW 2: CALENDAR DASHBOARD PANEL VIEW --- */}
//         {activeTab === 'calendar' && (
//           <div className="flex-1 flex flex-col justify-between no-scrollbar overflow-y-auto pb-[88px]">
//             <div>
//               <div className="flex justify-between items-center mb-5">
//                 <button onClick={() => setActiveTab('home')} className="text-white hover:opacity-80 transition-opacity">
//                   <ArrowLeft className="w-7 h-7 stroke-[2]" />
//                 </button>
//                 <h2 className="text-2xl font-medium tracking-wide text-white">Calendar</h2>
//                 <button className="text-white hover:opacity-80 transition-opacity">
//                   <User className="w-7 h-7 stroke-[1.5]" />
//                 </button>
//               </div>

//               <div className="w-full bg-gradient-to-b from-[#1C2682] via-[#11164D] to-black rounded-[28px] p-5 shadow-xl flex items-center justify-between mb-5 h-24 relative">
//                 <div>
//                   <p className="text-zinc-400 text-xs font-normal tracking-wide">Total spent in {monthsList[selectedMonth]}</p>
//                   <h3 className="text-3xl font-bold text-white mt-1">₹ 7,680</h3>
//                 </div>
                
//                 <div className="relative">
//                   <button 
//                     onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
//                     className="bg-[#181824] border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 font-medium flex items-center gap-2 hover:border-zinc-700 transition-colors"
//                   >
//                     {monthsList[selectedMonth]} {selectedYear} <ChevronDown className="w-4 h-4 text-zinc-400" />
//                   </button>

//                   {isMonthDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-44 bg-[#121215] border border-zinc-800 rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto no-scrollbar">
//                       {monthsList.map((mName, mIdx) => (
//                         <button
//                           key={mIdx}
//                           onClick={() => {
//                             setSelectedMonth(mIdx);
//                             setIsMonthDropdownOpen(false);
//                             setSelectedDay(1);
//                           }}
//                           className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-zinc-900/50 block last:border-0 ${
//                             mIdx === selectedMonth ? 'bg-[#2532C2] text-white font-medium' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
//                           }`}
//                         >
//                           {mName}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-7 text-center text-xs font-medium text-zinc-500 mb-3 tracking-wide">
//                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
//               </div>

//               <div className="grid grid-cols-7 gap-y-3.5 text-center mb-5">
//                 {generateGridDays().map((day, index) => {
//                   const hasData = day.currentMonth ? getDaySummary(day.num) : null;
//                   const isDaySelected = day.currentMonth && selectedDay === day.num;

//                   return (
//                     <div 
//                       key={index} 
//                       onClick={() => day.currentMonth && setSelectedDay(day.num)}
//                       className="flex flex-col items-center justify-center min-h-[44px] relative cursor-pointer select-none"
//                     >
//                       {isDaySelected ? (
//                         <div className="w-10 h-12 bg-[#2532C2] rounded-full flex flex-col items-center justify-center shadow-lg border border-indigo-400/30 transition-all transform scale-105">
//                           <span className="text-sm font-semibold text-white">{day.num}</span>
//                           <span className="text-[8px] font-medium text-indigo-200 mt-0.5">
//                             {hasData ? hasData.label : '₹0'}
//                           </span>
//                         </div>
//                       ) : (
//                         <>
//                           <span className={`text-sm ${day.currentMonth ? 'text-zinc-300 font-normal' : 'text-zinc-700 font-light pointer-events-none'}`}>
//                             {day.num}
//                           </span>
//                           {hasData && (
//                             <span className={`text-[8px] mt-0.5 font-medium tracking-tight ${hasData.type === 'credit' ? 'text-[#00E676]' : 'text-[#FF4A4A]'}`}>
//                               {hasData.label}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="bg-[#0C0C0E] border border-zinc-900 rounded-[28px] p-4 flex flex-col justify-between shadow-xl mb-4">
//                 <div className="flex justify-between items-center mb-4 px-1">
//                   <h4 className="text-lg font-medium text-white tracking-wide">{selectedDay} {monthsList[selectedMonth]} {selectedYear}</h4>
//                   <div>
//                     <span className="text-zinc-500 text-xs font-normal block text-right">Total spent</span>
//                     <span className="text-[#5E6EFF] text-lg font-bold block mt-0.5">₹ {activeDayTotalSpent.toLocaleString('en-IN')}</span>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   {activeDayTransactions.length > 0 ? (
//                     activeDayTransactions.map((tx, txIdx) => (
//                       <div key={tx.id} className="w-full bg-[#131317] rounded-xl p-3 flex items-center justify-between border border-zinc-900">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-xl bg-[#1C1C30] flex items-center justify-center">
//                             {getCategoryIcon(tx.category)}
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-white">{tx.category}</p>
//                             <p className="text-[11px] text-zinc-500 mt-0.5">{tx.title}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className={`text-sm font-medium ${tx.type === 'credit' ? 'text-[#00E676]' : 'text-[#FF4A4A]'}`}>
//                             {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
//                           </p>
//                           <p className="text-[10px] text-zinc-600 mt-0.5">{tx.time}</p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="py-8 text-center text-zinc-600 text-sm font-light tracking-wide border border-dashed border-zinc-900 rounded-xl">
//                       No logged transactions for this date.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- VIEW 3: ALL TRANSACTIONS DEDICATED PANEL (MATCHING image_48a51f.jpg) --- */}
//         {activeTab === 'transactions' && (
//           <div className="flex-1 flex flex-col no-scrollbar overflow-hidden pb-[88px]">
//             {/* Header Area */}
//             <div className="flex justify-between items-center mb-5">
//               <button onClick={() => setActiveTab('home')} className="text-white hover:opacity-80 transition-opacity">
//                 <ArrowLeft className="w-7 h-7 stroke-[2]" />
//               </button>
//               <h2 className="text-2xl font-semibold tracking-wide text-white">Transactions</h2>
//               <button className="text-white hover:opacity-80 transition-opacity">
//                 <User className="w-7 h-7 stroke-[1.5]" />
//               </button>
//             </div>

//             {/* Verification Search Control Inputs */}
//             <div className="relative w-full mb-6">
//               <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
//                 <Search className="w-5 h-5 text-zinc-500" />
//               </span>
//               <input 
//                 type="text"
//                 placeholder="Search transaction..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full h-12 bg-[#0C0C0E] border border-zinc-900 rounded-xl pl-12 pr-12 text-white font-normal text-sm focus:outline-none focus:border-zinc-800 tracking-wide placeholder-zinc-600"
//               />
//               <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500">
//                 <SlidersHorizontal className="w-4 h-4" />
//               </span>
//             </div>

//             <p className="text-zinc-400 text-sm font-normal tracking-wide mb-4">Recent Transactions</p>

//             {/* Scrollable Accordion Wrapper */}
//             <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pb-4">
//               {Object.keys(transactionsState)
//                 .sort((a, b) => b.localeCompare(a)) // Latest Dates top ordered row
//                 .map((dateKey) => {
//                   const dayTransactions = transactionsState[dateKey] || [];
                  
//                   // Filter transactions based on title/description or amount value metric matches
//                   const filteredTxs = dayTransactions.filter(tx => 
//                     tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                     tx.amount.toString().includes(searchQuery)
//                   );

//                   if (filteredTxs.length === 0) return null;

//                   const isExpanded = !!expandedDates[dateKey];
//                   const totalDaySpent = getDayNetNumericTotal(filteredTxs);

//                   return (
//                     <div key={dateKey} className="w-full">
//                       {/* Accordion Group Header Box Line */}
//                       <div 
//                         onClick={() => toggleDateAccordion(dateKey)}
//                         className="w-full flex justify-between items-center py-2.5 px-1 cursor-pointer select-none"
//                       >
//                         <span className="text-[#4E5FFF] text-sm font-medium tracking-wide">
//                           {getFriendlyDateLabel(dateKey)}
//                         </span>
//                         <div className="flex items-center gap-2">
//                           <span className="text-[#4E5FFF] text-sm font-semibold">
//                             ₹ {totalDaySpent.toLocaleString('en-IN')}
//                           </span>
//                           {isExpanded ? <ChevronUp className="w-4 h-4 text-[#4E5FFF]" /> : <ChevronDown className="w-4 h-4 text-[#4E5FFF]" />}
//                         </div>
//                       </div>

//                       {/* Accordion Inner Drawer Body matching item templates of image_48a51f.jpg */}
//                       {isExpanded && (
//                         <div className="mt-2 space-y-2.5 pl-0.5">
//                           {filteredTxs.map((tx) => {
//                             const isMenuRowActive = activeInlineRowMenu === tx.id;

//                             return (
//                               <div 
//                                 key={tx.id}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setActiveInlineRowMenu(isMenuRowActive ? null : tx.id);
//                                 }}
//                                 className={`w-full bg-[#0C0C0F] border rounded-[20px] transition-all overflow-hidden ${
//                                   isMenuRowActive ? 'border-[#333DC1]' : 'border-zinc-900/50'
//                                 }`}
//                               >
//                                 {/* Core transaction view context summary header banner strip */}
//                                 <div className="p-4 flex items-center justify-between">
//                                   <div className="flex items-center gap-4">
//                                     <div className="w-11 h-11 rounded-xl bg-[#1A1A2E] flex items-center justify-center border border-zinc-800/40">
//                                       {getCategoryIcon(tx.category)}
//                                     </div>
//                                     <div>
//                                       <h4 className="text-white text-base font-medium tracking-wide">{tx.category}</h4>
//                                       <p className="text-zinc-500 text-xs mt-0.5 font-light">{tx.title}</p>
//                                     </div>
//                                   </div>
//                                   <div className="text-right">
//                                     <p className={`text-base font-medium tracking-wide ${tx.type === 'credit' ? 'text-[#00E676]' : 'text-[#FF4A4A]'}`}>
//                                       {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
//                                     </p>
//                                     <p className="text-[10px] text-zinc-600 mt-0.5 font-light">{tx.time}</p>
//                                   </div>
//                                 </div>

//                                 {/* Sliding inline utility editing deck panel inside row context matching display schema configurations */}
//                                 {isMenuRowActive && (
//                                   <div className="flex border-t border-zinc-900 bg-black/40 h-12">
//                                     <button 
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleOpenEditModal(dateKey, tx);
//                                       }}
//                                       className="flex-1 flex items-center justify-center gap-2 text-sm text-indigo-400 font-medium hover:bg-zinc-900/40 transition-colors border-r border-zinc-900"
//                                     >
//                                       <Edit2 className="w-4 h-4" /> Edit
//                                     </button>
//                                     <button 
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleDeleteTransaction(dateKey, tx.id);
//                                       }}
//                                       className="flex-1 flex items-center justify-center gap-2 text-sm text-red-500 font-medium hover:bg-zinc-900/40 transition-colors"
//                                     >
//                                       <Trash2 className="w-4 h-4" /> Delete
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         )}

//         {/* --- DYNAMIC FRAME FOOTER NAVIGATION DOCK --- */}
//         {activeTab === 'home' || activeTab === 'transactions' ? (
//           /* Shared Base System Navigation Dock menu layout configuration matching design standard profiles */
//           <div className="w-full h-20 flex items-center justify-between px-2 relative z-30 bg-black border-t border-zinc-900/30 mt-auto">
//             <button 
//               onClick={() => { setActiveTab('home'); setIsMonthDropdownOpen(false); }} 
//               className={`flex-1 transition-colors flex items-center justify-center ${activeTab === 'home' ? 'text-white' : 'text-[#3F51B5] hover:text-indigo-400'}`}
//             >
//               <List className="w-8 h-8 stroke-[2.5]" />
//             </button>
            
//             <div className="flex-[2] px-4 flex items-center justify-center">
//               <button 
//                 onClick={() => { setModalMode('add'); setIsModalOpen(true); }}
//                 className="w-full h-[52px] rounded-2xl bg-gradient-to-b from-[#FFA868] via-[#FF5F2E] to-[#D82A00] flex items-center justify-center text-white font-semibold text-base tracking-wider shadow-2xl shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10"
//               >
//                 Add
//               </button>
//             </div>

//             <button 
//               onClick={() => { setActiveTab('calendar'); setIsMonthDropdownOpen(false); }} 
//               className={`flex-1 transition-colors flex items-center justify-center ${activeTab === 'calendar' ? 'text-white' : 'text-[#3F51B5] hover:text-indigo-400'}`}
//             >
//               <Calendar className="w-8 h-8 stroke-[2]" />
//             </button>
//           </div>
//         ) : (
//           /* Single dynamic blue overlay element explicitly shown in standard calendar dashboard view rules */
//           <div className="absolute bottom-0 left-0 right-0 h-24 bg-black border-t border-zinc-900/40 px-6 flex items-center justify-center z-30 pb-4">
//             <button 
//               onClick={() => { setModalMode('add'); setIsModalOpen(true); }}
//               className="w-full h-14 bg-gradient-to-r from-[#2937D3] to-[#3A46E6] hover:opacity-95 active:scale-[0.99] text-white text-base font-medium rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all border border-indigo-500/20"
//             >
//               <span className="text-xl font-light">+</span> Add for {monthsList[selectedMonth]} {selectedDay}
//             </button>
//           </div>
//         )}

//         {/* --- DRAWER MODAL MASK OVERLAY --- */}
//         <div 
//           className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
//             isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//           }`}
//           onClick={() => { setIsModalOpen(false); setIsDropdownOpen(false); }}
//         />

//         {/* --- BOTTOM SLIDING FORM ENTRY CONTAINER --- */}
//         <div 
//           className={`absolute left-0 right-0 bottom-0 bg-[#0F0F11] border-t border-zinc-800 rounded-t-[32px] px-6 pt-5 pb-8 z-50 transition-transform duration-300 transform flex flex-col justify-between max-h-[88vh] overflow-y-auto no-scrollbar ${
//             isModalOpen ? 'translate-y-0' : 'translate-y-full'
//           }`}
//         >
//           <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mb-5" />

//           {/* Header context modifications matching conditional status toggles */}
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-2xl font-semibold tracking-wide text-white">
//               {modalMode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
//             </h3>
//             <button 
//               onClick={() => { setIsModalOpen(false); setIsDropdownOpen(false); }}
//               className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="space-y-5 flex-1">
//             <div className="w-full bg-[#17171C] rounded-2xl p-1 flex border border-zinc-800/80">
//               <button 
//                 type="button" onClick={() => setTxType('expense')}
//                 className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
//                   txType === 'expense' ? 'bg-[#3A46E6] text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
//                 }`}
//               >
//                 <ArrowDown className="w-4 h-4" /> Expense
//               </button>
//               <button 
//                 type="button" onClick={() => setTxType('credit')}
//                 className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
//                   txType === 'credit' ? 'bg-[#3A46E6] text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
//                 }`}
//               >
//                 <ArrowUp className="w-4 h-4" /> Credit
//               </button>
//             </div>

//             <div className="relative">
//               <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Category</label>
//               <button
//                 type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="w-full bg-[#121214] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-zinc-700 transition-colors"
//               >
//                 <div className="flex items-center gap-3.5">
//                   <div className="w-10 h-10 rounded-xl bg-[#23233B] border border-indigo-500/20 flex items-center justify-center">
//                     {getCategoryIcon(category)}
//                   </div>
//                   <span className="text-white text-base font-medium">{category}</span>
//                 </div>
//                 <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute left-0 right-0 mt-2 bg-[#17171C] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-60">
//                   {['Food & Dining', 'Transport', 'Shopping', 'Utilities', 'Entertainment'].map((cat) => (
//                     <button
//                       key={cat} type="button"
//                       onClick={() => { setCategory(cat); setIsDropdownOpen(false); }}
//                       className="w-full px-5 py-3.5 flex items-center gap-4 text-left text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-white border-b border-zinc-800/40 last:border-0 transition-colors"
//                     >
//                       <div className="w-8 h-8 rounded-lg bg-[#23233B] flex items-center justify-center">{getCategoryIcon(cat)}</div>
//                       {cat}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Date Selection Control Input Node */}
//             <div>
//               <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Transaction Date</label>
//               <input 
//                 type="date" 
//                 value={customDate}
//                 onChange={(e) => setCustomDate(e.target.value)}
//                 className="w-full bg-[#121214] border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:border-zinc-700 font-medium text-sm scheme-dark"
//               />
//             </div>

//             <div>
//               <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Description</label>
//               <div className="relative bg-[#121214] border border-zinc-800 rounded-2xl focus-within:border-zinc-700 transition-colors p-4">
//                 <textarea
//                   maxLength={100} value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Enter description..."
//                   className="w-full bg-transparent resize-none text-white placeholder-zinc-600 focus:outline-none text-base h-20"
//                 />
//                 <span className="absolute bottom-3 right-4 text-xs font-light text-zinc-600">{description.length}/100</span>
//               </div>
//             </div>

//             <div>
//               <label className="block text-zinc-400 text-sm font-normal mb-2 tracking-wide">Amount</label>
//               <div className="w-full bg-[#121214] border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 focus-within:border-zinc-700 transition-colors">
//                 <span className="text-zinc-500 text-lg font-medium">₹</span>
//                 <input
//                   type="number" value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount"
//                   className="w-full bg-transparent text-white placeholder-zinc-600 focus:outline-none text-base"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-8">
//             <button
//               type="button"
//               onClick={handleFormSubmit}
//               className="w-full h-14 bg-[#3A46E6] hover:bg-indigo-600 text-white font-semibold text-base rounded-2xl shadow-xl transition-all"
//             >
//               {modalMode === 'edit' ? 'Edit Expense' : `Add to ${monthsList[selectedMonth]} ${selectedDay}`}
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }