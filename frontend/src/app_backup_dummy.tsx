import { useState } from 'react';
import type { AppTab, ModalMode, Transaction } from './types/finance';
import { DashboardView } from './views/DashboardView';
import { CalendarView } from './views/CalendarView';
import  { TransactionsView } from './views/TransactionsView';
import { BottomModal } from './components/BottomModal';
import { Navbar } from './components/Navbar';

const initialData: Record<string, Transaction[]> = {
  "2026-06-11": [
    { id: '10', category: 'Transport', title: 'Auto Ride', amount: 80, time: '02:15 PM', type: 'expense' },
    { id: '11', category: 'Food & Dining', title: 'Evening Snacks', amount: 60, time: '06:30 PM', type: 'expense' }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>(initialData);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [targetDateKey, setTargetDateKey] = useState<string>('2026-06-11');

  // Calendar metrics
  const [day, setDay] = useState(11);
  const [month, setMonth] = useState(5);

  const handleEditTrigger = (dateKey: string, tx: Transaction) => {
    setModalMode('edit');
    setSelectedTx(tx);
    setTargetDateKey(dateKey);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (dateKey: string, txId: string) => {
    const updated = { ...transactions };
    updated[dateKey] = (updated[dateKey] || []).filter(t => t.id !== txId);
    if (updated[dateKey].length === 0) delete updated[dateKey];
    setTransactions(updated);
  };

  const handleModalSubmit = (payload: any) => {
    const updated = { ...transactions };
    if (modalMode === 'edit' && selectedTx) {
      updated[targetDateKey] = (updated[targetDateKey] || []).filter(t => t.id !== selectedTx.id);
      const updatedRecord: Transaction = {
        ...selectedTx,
        title: payload.description,
        amount: payload.amount,
        type: payload.type
      };
      updated[payload.date] = [updatedRecord, ...(updated[payload.date] || [])];
    } else {
      const newRecord: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        category: payload.category,
        title: payload.description,
        amount: payload.amount,
        time: '12:00 PM',
        type: payload.type
      };
      updated[payload.date] = [newRecord, ...(updated[payload.date] || [])];
    }
    setTransactions(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen w-full bg-black text-white flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-md h-full bg-black px-6 pt-8 pb-6 flex flex-col justify-between relative">
        
        {activeTab === 'home' && <DashboardView onViewAll={() => setActiveTab('transactions')} />}
        
        {activeTab === 'calendar' && (
          <CalendarView 
            transactionsState={transactions} 
            onBack={() => setActiveTab('home')}
            selectedDay={day} setSelectedDay={setDay}
            selectedMonth={month} setSelectedMonth={setMonth}
            selectedYear={2026}
            onAddForDate={() => { setModalMode('add'); setSelectedTx(null); setIsModalOpen(true); }}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView 
            transactionsState={transactions} 
            onBack={() => setActiveTab('home')} 
            onEdit={handleEditTrigger} 
            onDelete={handleDeleteTrigger}
          />
        )}

        {activeTab !== 'calendar' && (
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => { setModalMode('add'); setSelectedTx(null); setIsModalOpen(true); }} />
        )}

        <BottomModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          mode={modalMode} 
          initialTx={selectedTx} 
          initialDate={targetDateKey} 
          onSubmit={handleModalSubmit} 
        />
      </div>
    </div>
  );
}