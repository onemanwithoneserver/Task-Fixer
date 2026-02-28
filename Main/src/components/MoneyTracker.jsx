import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { moneyTrackerAPI, checkBackendConnection, syncMoneyTrackerToMongoDB } from "../services/moneyTrackerService";

const STORAGE_KEY = "task_fixer_money_tracker_v1";

export default function MoneyTracker() {
  const navigate = useNavigate();
  const [moneyList, setMoneyList] = useState([]);
  const [useBackend, setUseBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [syncStatus, setSyncStatus] = useState('');
  
  const [search, setSearch] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [activeEntry, setActiveEntry] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [debtType, setDebtType] = useState("given"); // 'given' or 'taken'

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    gateway: "UPI / GPay",
    type: "given", // 'given' or 'taken'
  });

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await checkBackendConnection();
      setUseBackend(isAvailable);
      setBackendStatus(isAvailable ? 'connected' : 'offline');
      
      if (isAvailable) {
        try {
          const data = await moneyTrackerAPI.getAll();
          setMoneyList(data);
        } catch (error) {
          console.error('Failed to load from MongoDB:', error);
          setBackendStatus('error');
          setUseBackend(false);
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setMoneyList(JSON.parse(saved));
        }
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setMoneyList(JSON.parse(saved));
      }
    };
    
    checkBackend();
  }, []);

  useEffect(() => {
    if (!useBackend && moneyList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(moneyList));
    }
  }, [moneyList, useBackend]);

  const addEntry = async () => {
    setError("");
    setSuccess("");
    
    if (!formData.name.trim() || !formData.amount) {
      setError("Please fill in both name and amount");
      setTimeout(() => setError(""), 5000);
      return;
    }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero");
      setTimeout(() => setError(""), 5000);
      return;
    }
    
    const newEntry = { 
      ...formData, 
      amount,
      originalAmount: amount,
      remainingAmount: amount,
      payments: []
    };

    if (useBackend) {
      try {
        const savedEntry = await moneyTrackerAPI.create(newEntry);
        setMoneyList([savedEntry, ...moneyList]);
      } catch (error) {
        console.error('Failed to add to MongoDB:', error);
        setMoneyList([{ ...newEntry, id: Date.now() }, ...moneyList]);
      }
    } else {
      setMoneyList([{ ...newEntry, id: Date.now() }, ...moneyList]);
    }
    
    setFormData({ 
      name: "", 
      amount: "", 
      date: new Date().toISOString().split("T")[0], 
      gateway: "UPI / GPay",
      type: "given"
    });
    setIsDialogOpen(false);
    setSuccess("Debt record added successfully");
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleRepayment = async (id) => {
    setError("");
    const payment = parseFloat(payAmount);
    if (isNaN(payment) || payment <= 0) {
      setError("Please enter a valid payment amount");
      setTimeout(() => setError(""), 5000);
      return;
    }

    const targetEntry = moneyList.find(e => (e._id || e.id) === id);
    if (payment > targetEntry.remainingAmount) {
      setError(`Payment amount cannot exceed remaining balance of ₹${targetEntry.remainingAmount.toLocaleString('en-IN')}`);
      setTimeout(() => setError(""), 5000);
      return;
    }

    const paymentData = {
      date: new Date().toISOString(),
      amount: payment
    };

    if (useBackend) {
      try {
        const updatedEntry = await moneyTrackerAPI.addPayment(id, paymentData);
        setMoneyList(prev => prev.map(entry => 
          (entry._id || entry.id) === id ? updatedEntry : entry
        ));
      } catch (error) {
        console.error('Failed to add payment to MongoDB:', error);
        setMoneyList(prev => prev.map(entry => {
          if ((entry._id || entry.id) === id) {
            const newRemaining = Math.max(0, entry.remainingAmount - payment);
            return {
              ...entry,
              remainingAmount: newRemaining,
              payments: [...entry.payments, { date: new Date().toLocaleDateString(), amount: payment }]
            };
          }
          return entry;
        }));
      }
    } else {
      setMoneyList(prev => prev.map(entry => {
        if ((entry._id || entry.id) === id) {
          const newRemaining = Math.max(0, entry.remainingAmount - payment);
          return {
            ...entry,
            remainingAmount: newRemaining,
            payments: [...entry.payments, { date: new Date().toLocaleDateString(), amount: payment }]
          };
        }
        return entry;
      }));
    }

    setPayAmount("");
    setActiveEntry(null);
    setSuccess(`Payment of ₹${payment.toLocaleString('en-IN')} recorded successfully`);
    setTimeout(() => setSuccess(""), 4000);
  };

  const deleteEntry = async (id) => {
    if (useBackend) {
      try {
        await moneyTrackerAPI.delete(id);
        setMoneyList(prev => prev.filter(e => (e._id || e.id) !== id));
      } catch (error) {
        console.error('Failed to delete from MongoDB:', error);
        setMoneyList(prev => prev.filter(e => (e._id || e.id) !== id));
      }
    } else {
      setMoneyList(prev => prev.filter(e => (e._id || e.id) !== id));
    }
  };

  const handleSyncToMongoDB = async () => {
    setSyncStatus('syncing');
    try {
      await syncMoneyTrackerToMongoDB(moneyList);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(''), 3000);
      const data = await moneyTrackerAPI.getAll();
      setMoneyList(data);
      setUseBackend(true);
      setBackendStatus('connected');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  // Filter by type and search
  const givenDebts = moneyList.filter(e => 
    (e.type === 'given' || !e.type) && 
    e.name.toLowerCase().includes(search.toLowerCase())
  );
  const takenDebts = moneyList.filter(e => 
    e.type === 'taken' && 
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  // Statistics
  const givenStats = {
    total: givenDebts.length,
    totalAmount: givenDebts.reduce((s, e) => s + e.originalAmount, 0),
    totalPaid: givenDebts.reduce((s, e) => s + (e.originalAmount - e.remainingAmount), 0),
    remaining: givenDebts.reduce((s, e) => s + e.remainingAmount, 0),
    fullyPaid: givenDebts.filter(e => e.remainingAmount === 0).length,
  };

  const takenStats = {
    total: takenDebts.length,
    totalAmount: takenDebts.reduce((s, e) => s + e.originalAmount, 0),
    totalPaid: takenDebts.reduce((s, e) => s + (e.originalAmount - e.remainingAmount), 0),
    remaining: takenDebts.reduce((s, e) => s + e.remainingAmount, 0),
    fullyPaid: takenDebts.filter(e => e.remainingAmount === 0).length,
  };

  const renderDebtCard = (e) => {
    const entryId = e._id || e.id;
    const isPaid = e.remainingAmount === 0;
    const isGiven = e.type === 'given' || !e.type;
    
    return (
      <motion.div
        key={entryId}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`group relative backdrop-blur-xl rounded-3xl p-6 transition-all shadow-2xl border ${
          isPaid 
            ? isGiven
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-blue-500/10 border-blue-500/30'
            : isGiven
              ? 'bg-white/5 border-white/10 hover:border-emerald-500/30'
              : 'bg-white/5 border-white/10 hover:border-blue-500/30'
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-xl ${
              isPaid 
                ? isGiven
                  ? 'bg-emerald-500/20 border-2 border-emerald-400/50' 
                  : 'bg-blue-500/20 border-2 border-blue-400/50'
                : isGiven
                  ? 'bg-emerald-400/10 border-2 border-emerald-400/30' 
                  : 'bg-blue-400/10 border-2 border-blue-400/30'
            }`}>
              {isPaid ? "✓" : isGiven ? "💸" : "💳"}
            </div>
            <div>
              <p className="font-black text-white text-lg">{e.name}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {e.date}
                </span>
                <span className="text-slate-600">•</span>
                <span>{e.gateway}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => deleteEntry(entryId)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl backdrop-blur-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300"
            title="Delete entry"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Amount Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Original</p>
            <p className="text-lg font-black text-slate-300">₹{e.originalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className={`backdrop-blur-xl rounded-2xl p-4 border ${
            isPaid 
              ? isGiven
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-blue-500/10 border-blue-500/30'
              : 'bg-white/5 border-white/10'
          }`}>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Remaining</p>
            <p className={`text-2xl font-black ${
              isPaid 
                ? isGiven ? 'text-emerald-400' : 'text-blue-400'
                : 'text-white'
            }`}>₹{e.remainingAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {e.originalAmount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Payment Progress</span>
              <span className={`font-black ${isGiven ? 'text-emerald-400' : 'text-blue-400'}`}>
                {Math.round((1 - e.remainingAmount / e.originalAmount) * 100)}%
              </span>
            </div>
            <div className="h-3 w-full bg-slate-950/50 rounded-full overflow-hidden backdrop-blur-xl border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(1 - e.remainingAmount / e.originalAmount) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full ${
                  isGiven
                    ? 'bg-linear-to-r from-emerald-500 to-emerald-400'
                    : 'bg-linear-to-r from-blue-500 to-blue-400'
                } shadow-lg`}
              />
            </div>
          </div>
        )}

        {/* Payment History */}
        {e.payments && e.payments.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payment History
            </p>
            <div className="flex flex-wrap gap-2">
              {e.payments.map((p, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-2">
                  <span className={`font-black ${isGiven ? 'text-emerald-400' : 'text-blue-400'}`}>₹{p.amount.toLocaleString('en-IN')}</span>
                  <span className="text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {p.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Form */}
        {!isPaid && (
          <>
            {activeEntry === entryId ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex gap-3 items-center pt-4 border-t border-white/10"
              >
                <input
                  autoFocus
                  type="number"
                  placeholder="Amount"
                  value={payAmount}
                  onChange={ev => setPayAmount(ev.target.value)}
                  className={`flex-1 backdrop-blur-xl bg-white/5 border rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none focus:ring-2 transition-all ${
                    isGiven
                      ? 'border-emerald-400/30 focus:border-emerald-500 focus:ring-emerald-400/20'
                      : 'border-blue-400/30 focus:border-blue-500 focus:ring-blue-400/20'
                  }`}
                  min="1"
                  max={e.remainingAmount}
                  step="0.01"
                />
                <button
                  onClick={() => handleRepayment(entryId)}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase transition-all shadow-lg ${
                    isGiven
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
                      : 'bg-blue-500 hover:bg-blue-400 text-white'
                  }`}
                >
                  ✓ Pay
                </button>
                <button
                  onClick={() => { setActiveEntry(null); setPayAmount(""); }}
                  className="text-slate-400 hover:text-white px-4 py-2 font-bold uppercase text-xs"
                >
                  Cancel
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setActiveEntry(entryId)}
                className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all backdrop-blur-xl ${
                  isGiven
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30 hover:bg-emerald-500 hover:text-slate-900'
                    : 'bg-blue-500/10 text-blue-400 border-blue-400/30 hover:bg-blue-500 hover:text-white'
                }`}
              >
                💸 Make Payment
              </button>
            )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-450 mx-auto w-full px-6 pb-20"
    >
      {/* Notifications */}
      <div aria-live="polite" aria-atomic="true" className="fixed top-24 right-6 z-50 space-y-3">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              role="alert"
              className="min-w-80 p-5 rounded-2xl backdrop-blur-xl bg-red-500/20 border border-red-500/50 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-sm font-black uppercase text-red-200 mb-1">Error</h3>
                  <p className="text-sm font-bold text-white leading-relaxed">{error}</p>
                </div>
                <button onClick={() => setError("")} className="text-white hover:text-red-200 font-bold text-lg">✕</button>
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              role="status"
              className="min-w-80 p-5 rounded-2xl backdrop-blur-xl bg-emerald-500/20 border border-emerald-500/50 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div className="flex-1">
                  <h3 className="text-sm font-black uppercase text-emerald-200 mb-1">Success</h3>
                  <p className="text-sm font-bold text-white leading-relaxed">{success}</p>
                </div>
                <button onClick={() => setSuccess("")} className="text-white hover:text-emerald-200 font-bold text-lg">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header with Back Button */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6 mb-8"
      >
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-2xl backdrop-blur-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <h1 className="text-4xl font-black italic uppercase tracking-widest text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-blue-400 to-violet-400">
          💰 Debt Records
        </h1>
      </motion.div>

      {/* Backend Status & Search */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 mb-8 shadow-xl"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border backdrop-blur-xl ${
            backendStatus === 'connected' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : backendStatus === 'checking'
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-slate-800/50 border-slate-700 text-slate-500'
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 
              backendStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 
              'bg-slate-600'
            }`}></span>
            {backendStatus === 'connected' ? 'MongoDB Connected' : 
             backendStatus === 'checking' ? 'Checking...' : 
             'Using Local Storage'}
          </div>
          
          {!useBackend && backendStatus !== 'checking' && moneyList.length > 0 && (
            <button
              onClick={handleSyncToMongoDB}
              disabled={syncStatus === 'syncing'}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-xl ${
                syncStatus === 'syncing' 
                  ? 'bg-emerald-500/20 text-emerald-400 cursor-wait border border-emerald-500/30'
                  : syncStatus === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : syncStatus === 'error'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30'
              }`}
            >
              {syncStatus === 'syncing' ? '⏳ Syncing...' :
               syncStatus === 'success' ? '✓ Synced!' :
               syncStatus === 'error' ? '✗ Failed' :
               '⬆ Sync to MongoDB'}
            </button>
          )}

          <div className="flex-1 min-w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search by name..."
              className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] gap-8">
        {/* Left Column - Money I Lent & Money I Borrowed */}
        <div className="flex flex-col gap-8">
          {/* Money I Lent (Given) */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="relative rounded-[2.5rem] backdrop-blur-xl bg-emerald-500/5 border border-emerald-500/20 p-8 shadow-2xl"
          >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
                Money I Lent
              </h2>
              <button
                onClick={() => {
                  setFormData({ ...formData, type: 'given' });
                  setIsDialogOpen(true);
                }}
                className="p-2 rounded-xl backdrop-blur-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 shadow-lg border border-emerald-400/30"
                title="Add Money Lent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {givenStats.total} total
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {givenDebts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4 opacity-20">💸</div>
                  <p className="font-bold text-sm text-slate-500">
                    {search 
                      ? "No matching records"
                      : "No money lent yet"}
                  </p>
                </motion.div>
              ) : (
                givenDebts.map(e => renderDebtCard(e))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

          {/* Money I Borrowed (Taken) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-[2.5rem] backdrop-blur-xl bg-blue-500/5 border border-blue-500/20 p-8 shadow-2xl"
          >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
                Money I Borrowed
              </h2>
              <button
                onClick={() => {
                  setFormData({ ...formData, type: 'taken' });
                  setIsDialogOpen(true);
                }}
                className="p-2 rounded-xl backdrop-blur-xl bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shadow-lg border border-blue-400/30"
                title="Add Money Borrowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              {takenStats.total} total
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {takenDebts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4 opacity-20">💳</div>
                  <p className="font-bold text-sm text-slate-500">
                    {search 
                      ? "No matching records"
                      : "No money borrowed yet"}
                  </p>
                </motion.div>
              ) : (
                takenDebts.map(e => renderDebtCard(e))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        </div>

        {/* Right Column - Statistics */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Money Lent Stats */}
          <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💸</span>
              <h3 className="text-lg font-black italic uppercase tracking-wider text-emerald-400">Money Lent</h3>
            </div>
            <div className="space-y-3">
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-black text-emerald-400">₹{givenStats.remaining.toLocaleString('en-IN')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">To Receive</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="text-xl font-black text-white">{givenStats.total}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Entries</div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="text-xl font-black text-emerald-400">{givenStats.fullyPaid}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cleared</div>
                </div>
              </div>
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-slate-300">₹{givenStats.totalAmount.toLocaleString('en-IN')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Lent</div>
              </div>
            </div>
          </div>

          {/* Money Borrowed Stats */}
          <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💳</span>
              <h3 className="text-lg font-black italic uppercase tracking-wider text-blue-400">Money Borrowed</h3>
            </div>
            <div className="space-y-3">
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-black text-blue-400">₹{takenStats.remaining.toLocaleString('en-IN')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">To Repay</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="text-xl font-black text-white">{takenStats.total}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Entries</div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="text-xl font-black text-blue-400">{takenStats.fullyPaid}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cleared</div>
                </div>
              </div>
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-slate-300">₹{takenStats.totalAmount.toLocaleString('en-IN')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Borrowed</div>
              </div>
            </div>
          </div>

          {/* Finance Tips */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-black italic uppercase tracking-wider text-white">Finance Tips</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Track all debts to maintain clarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Make regular payments to reduce interest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>Prioritize high-interest debts first</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Review payment history monthly</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Add Debt Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md backdrop-blur-xl bg-slate-900/90 border border-slate-700 rounded-3xl p-8 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black italic uppercase text-white">
                  {formData.type === 'given' ? '💸 Money Lent' : '💳 Money Borrowed'}
                </h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 rounded-xl backdrop-blur-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setFormData({...formData, type: 'given'})}
                  className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all backdrop-blur-xl ${
                    formData.type === 'given'
                      ? 'bg-emerald-600 text-white border border-emerald-500/50'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  💸 Lent
                </button>
                <button
                  onClick={() => setFormData({...formData, type: 'taken'})}
                  className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all backdrop-blur-xl ${
                    formData.type === 'taken'
                      ? 'bg-blue-600 text-white border border-blue-500/50'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  💳 Borrowed
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    {formData.type === 'given' ? 'Borrower Name' : 'Lender Name'}
                  </label>
                  <input
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. John / ABC Bank"
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="10000"
                    min="1"
                    step="0.01"
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Payment Gateway
                  </label>
                  <input
                    value={formData.gateway}
                    onChange={(e) => setFormData({...formData, gateway: e.target.value})}
                    placeholder="UPI / GPay"
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold uppercase tracking-wider backdrop-blur-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addEntry}
                    disabled={!formData.name.trim() || !formData.amount}
                    className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                      formData.type === 'given'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500/50'
                        : 'bg-blue-600 text-white hover:bg-blue-500 border border-blue-500/50'
                    }`}
                  >
                    Add Record
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
