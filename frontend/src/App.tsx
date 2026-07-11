// src/App.tsx
import { useState, useEffect } from 'react';
import type { Transaction } from './types/finance';
import { DashboardView } from './views/DashboardView';
import { CalendarView } from './views/CalendarView';
import { TransactionsView } from './views/TransactionsView';
import { AuthView } from './views/AuthView';
import { Navbar } from './components/Navbar';
import { BottomModal } from './components/BottomModal';

const monthsList = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface DashboardData {
  timeframe_totals: { week: number; month: number; year: number };
  bar_chart: { date_label: string; amount: number }[];
  last_transaction: {
    id: string;
    amount: number;
    category: string;
    description: string;
    payment_method: string;
    created_at: string;
  } | null;
}

const initialDashboardData: DashboardData = {
  timeframe_totals: { week: 0, month: 0, year: 0 },
  bar_chart: [
    { date_label: "6th", amount: 0 },
    { date_label: "7th", amount: 0 },
    { date_label: "8th", amount: 0 },
    { date_label: "9th", amount: 0 },
    { date_label: "10th", amount: 0 }
  ],
  last_transaction: null,
};

const initialTransactions: Record<string, Transaction[]> = {
  "2026-06-01": [{ id: '1', category: 'Food & Dining', title: 'Snacks', amount: 390, time: '04:12 PM', type: 'expense' }],
  "2026-06-02": [{ id: '2', category: 'Salary', title: 'Freelance Payout', amount: 1250, time: '10:00 AM', type: 'credit' }],
  "2026-06-03": [{ id: '3', category: 'Investment', title: 'Dividend Recieved', amount: 500, time: '11:30 AM', type: 'credit' }],
  "2026-06-04": [{ id: '4', category: 'Utilities', title: 'Mobile Recharge', amount: 230, time: '01:15 PM', type: 'expense' }],
  "2026-06-05": [{ id: '5', category: 'Transfer', title: 'From Friend', amount: 850, time: '09:00 PM', type: 'credit' }],
  "2026-06-07": [{ id: '6', category: 'Investment', title: 'Cashback App', amount: 755, time: '03:40 AM', type: 'credit' }],
  "2026-06-08": [{ id: '7', category: 'Shopping', title: 'New T-Shirt', amount: 500, time: '07:22 PM', type: 'expense' }],
  "2026-06-10": [{ id: '8', category: 'Utilities', title: 'Gas Bill Reward', amount: 80, time: '05:50 PM', type: 'credit' }],
  "2026-06-11": [
    { id: '9', category: 'Food & Dining', title: 'Lunch at Cafe', amount: 150, time: '12:45 PM', type: 'expense' },
    { id: '10', category: 'Transport', title: 'Auto Ride', amount: 80, time: '02:15 PM', type: 'expense' },
    { id: '11', category: 'Food & Dining', title: 'Evening Snacks', amount: 60, time: '06:30 PM', type: 'expense' },
    { id: '12', category: 'Entertainment', title: 'Movie Ticket', amount: 100, time: '09:10 PM', type: 'expense' }
  ],
  "2026-06-18": [{ id: '13', category: 'Shopping', title: 'Shoes procurement', amount: 600, time: '02:00 PM', type: 'expense' }],
  "2026-06-19": [{ id: '14', category: 'Utilities', title: 'Electricity Bill', amount: 1150, time: '08:15 PM', type: 'expense' }],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'transactions'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editingDateKey, setEditingDateKey] = useState<string | null>(null);

  const [transactionsState, setTransactionsState] = useState<Record<string, Transaction[]>>(initialTransactions);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({ "2026-06-11": true });
  const [activeInlineRowMenu, setActiveInlineRowMenu] = useState<string | null>("10");

  const [selectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [selectedDay, setSelectedDay] = useState(11);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const [txType, setTxType] = useState<'expense' | 'credit'>('expense');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [category, setCategory] = useState('Food & Dining');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [customDate, setCustomDate] = useState('2026-06-11');

  const [timeframe, setTimeframe] = useState<'W' | 'M' | 'Y'>('M');
  const [currentMonthName, setCurrentMonthName] = useState('June');
  const [daysArray, setDaysArray] = useState<{ dayLabel: string; isCurrent: boolean }[]>([]);

  // User Authentication State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  // Dashboard Metrics API State
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardData>(initialDashboardData);

  const fetchDashboardMetrics = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setDashboardMetrics(initialDashboardData);
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/v1/expenses/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardMetrics(data);
      }
    } catch (error) {
      console.error("Error syncing dashboard data:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchDashboardMetrics();
    } else {
      setDashboardMetrics(initialDashboardData);
    }
  }, [username]);

  useEffect(() => {
    const now = new Date();
    setCurrentMonthName(monthsList[now.getMonth()]);

    const tempDays = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayNum = d.getDate();
      let suffix = 'th';
      if (dayNum === 1 || dayNum === 21 || dayNum === 31) suffix = 'st';
      else if (dayNum === 2 || dayNum === 22) suffix = 'nd';
      else if (dayNum === 3 || dayNum === 23) suffix = 'rd';

      tempDays.push({
        dayLabel: `${dayNum}${suffix}`,
        isCurrent: i === 0
      });
    }
    setDaysArray(tempDays);
  }, []);

  useEffect(() => {
    if (modalMode === 'add') {
      const formattedMonth = String(selectedMonth + 1).padStart(2, '0');
      const formattedDay = String(selectedDay).padStart(2, '0');
      setCustomDate(`${selectedYear}-${formattedMonth}-${formattedDay}`);
    }
  }, [selectedDay, selectedMonth, selectedYear, modalMode]);

  const getFormattedDateKey = (day: number) => {
    const mm = String(selectedMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${selectedYear}-${mm}-${dd}`;
  };

  const getDaySummary = (day: number) => {
    const key = getFormattedDateKey(day);
    const dayTxs = transactionsState[key] || [];
    if (dayTxs.length === 0) return null;

    const isCredit = dayTxs.some(t => t.type === 'credit');
    const total = dayTxs.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      type: isCredit ? 'credit' : 'expense',
      label: `₹${total.toLocaleString('en-IN')}`
    };
  };

  const generateGridDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const matrix = [];
    for (let p = 27; p <= 31; p++) {
      matrix.push({ num: p, currentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      matrix.push({ num: d, currentMonth: true });
    }
    return matrix;
  };

  const currentSelectedKey = getFormattedDateKey(selectedDay);
  const activeDayTransactions = transactionsState[currentSelectedKey] || [];
  const activeDayTotalSpent = activeDayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const getDayNetNumericTotal = (txs: Transaction[]) => {
    return txs.reduce((sum, t) => sum + t.amount, 0);
  };

  const getFriendlyDateLabel = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const mName = monthsList[dateObj.getMonth()];
    return `${d} ${mName} ${y}, ${dayName}`;
  };

  const handleOpenEditModal = (dateKey: string, tx: Transaction) => {
    setModalMode('edit');
    setEditingTxId(tx.id);
    setEditingDateKey(dateKey);
    setTxType(tx.type);
    setCategory(tx.category);
    setDescription(tx.title);
    setAmount(tx.amount.toString());
    setCustomDate(dateKey);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (dateKey: string, txId: string) => {
    const updatedDayTxs = (transactionsState[dateKey] || []).filter(t => t.id !== txId);
    const updatedState = { ...transactionsState };
    if (updatedDayTxs.length === 0) {
      delete updatedState[dateKey];
    } else {
      updatedState[dateKey] = updatedDayTxs;
    }
    setTransactionsState(updatedState);
    if (activeInlineRowMenu === txId) setActiveInlineRowMenu(null);
  };

  // ASYNC FORM SUBMISSION WITH API INTEGRATION
  const handleFormSubmit = async () => {
    if (!amount || !description) return;

    const parsedAmount = parseFloat(amount) || 0;
    const token = localStorage.getItem('token');

    // 1. If adding a new expense, intercept and push to the FastAPI backend route
    if (modalMode === 'add') {
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/expenses', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: parsedAmount,
              category: category,
              description: description,
              payment_method: 'UPI', // Hardcoded to UPI as expected by the backend schema
              created_at: customDate
            })
          });

          if (!response.ok) {
            console.error("Failed to add transaction to server");
          }
        } catch (error) {
          console.error("Network error adding transaction:", error);
        }
      }
    }

    // 2. Fallback / Update local state for offline view safety
    const updatedState = { ...transactionsState };

    if (modalMode === 'edit' && editingTxId && editingDateKey) {
      updatedState[editingDateKey] = (updatedState[editingDateKey] || []).filter(t => t.id !== editingTxId);
      if (updatedState[editingDateKey].length === 0) delete updatedState[editingDateKey];

      const updatedTx: Transaction = {
        id: editingTxId,
        category,
        title: description,
        amount: parsedAmount,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: txType
      };

      updatedState[customDate] = [updatedTx, ...(updatedState[customDate] || [])];
    } else {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        category,
        title: description,
        amount: parsedAmount,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: txType
      };
      updatedState[customDate] = [newTx, ...(updatedState[customDate] || [])];
    }

    setTransactionsState(updatedState);
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setDescription('');
    setAmount('');
    
    // 3. Immediately pull updated calculations down to sync layout views instantly
    if (username) {
      await fetchDashboardMetrics();
    }
  };

  const toggleDateAccordion = (dateKey: string) => {
    setExpandedDates(prev => ({ ...prev, [dateKey]: !prev[dateKey] }));
  };

  return (
    <div className="h-screen w-full bg-black text-white font-sans flex justify-center items-center antialiased overflow-hidden selection:bg-indigo-500/20">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full max-w-md h-full max-h-screen bg-black px-6 pt-8 pb-6 flex flex-col justify-between relative overflow-hidden">
        
        {isAuthOpen ? (
          <AuthView 
            onClose={() => setIsAuthOpen(false)} 
            onAuthSuccess={(loggedInUsername) => {
              setUsername(loggedInUsername);
              const savedEmail = localStorage.getItem('userEmail');
              if (savedEmail) setUserEmail(savedEmail);
              setTimeout(() => fetchDashboardMetrics(), 50);
            }}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <DashboardView
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                currentMonthName={currentMonthName}
                daysArray={daysArray}
                onViewAllClick={() => setActiveTab('transactions')}
                onProfileClick={() => setIsAuthOpen(true)}
                username={username}
                metrics={dashboardMetrics}
                onRefreshMetrics={fetchDashboardMetrics}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                setSelectedMonth={setSelectedMonth}
                isMonthDropdownOpen={isMonthDropdownOpen}
                setIsMonthDropdownOpen={setIsMonthDropdownOpen}
                monthsList={monthsList}
                generateGridDays={generateGridDays}
                getDaySummary={getDaySummary}
                activeDayTransactions={activeDayTransactions}
                activeDayTotalSpent={activeDayTotalSpent}
                onBackClick={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                transactionsState={transactionsState}
                expandedDates={expandedDates}
                toggleDateAccordion={toggleDateAccordion}
                getFriendlyDateLabel={getFriendlyDateLabel}
                getDayNetNumericTotal={getDayNetNumericTotal}
                activeInlineRowMenu={activeInlineRowMenu}
                setActiveInlineRowMenu={setActiveInlineRowMenu}
                handleOpenEditModal={handleOpenEditModal}
                handleDeleteTransaction={handleDeleteTransaction}
                onBackClick={() => setActiveTab('home')}
              />
            )}

            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsMonthDropdownOpen={setIsMonthDropdownOpen}
              onAddClick={() => { setModalMode('add'); setIsModalOpen(true); }}
              selectedMonthName={monthsList[selectedMonth]}
              selectedDay={selectedDay}
            />

            <BottomModal
              isOpen={isModalOpen}
              onClose={() => { setIsModalOpen(false); setIsDropdownOpen(false); }}
              modalMode={modalMode}
              txType={txType}
              setTxType={setTxType}
              category={category}
              setCategory={setCategory}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              customDate={customDate}
              setCustomDate={setCustomDate}
              description={description}
              setDescription={setDescription}
              amount={amount}
              setAmount={setAmount}
              onSubmit={handleFormSubmit}
              selectedMonthName={monthsList[selectedMonth]}
              selectedDay={selectedDay}
            />
          </>
        )}
      </div>
    </div>
  );
}