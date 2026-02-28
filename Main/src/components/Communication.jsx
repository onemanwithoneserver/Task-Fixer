import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { vocabularyAPI, checkBackendConnection, syncLocalStorageToMongoDB } from "../services/vocabularyService";

export default function Communication({ state, setState }) {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ word: "", meaning: "", example: "" });
  const [useBackend, setUseBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [syncStatus, setSyncStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Syncing with Global State
  const habits = state.communication?.habits || [];
  const vault = state.communication?.vault || [];

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await checkBackendConnection();
      setUseBackend(isAvailable);
      setBackendStatus(isAvailable ? 'connected' : 'offline');
      
      if (isAvailable) {
        // Load data from MongoDB
        try {
          const data = await vocabularyAPI.getAll();
          setState((prev) => ({
            ...prev,
            communication: {
              ...prev.communication,
              vault: data,
            },
          }));
          // Clear localStorage when using MongoDB to avoid conflicts
          localStorage.removeItem('vocabulary_vault');
        } catch (error) {
          console.error('Failed to load from MongoDB:', error);
          setBackendStatus('error');
          setUseBackend(false);
        }
      } else {
        // Load from localStorage if backend unavailable
        const savedVault = localStorage.getItem('vocabulary_vault');
        if (savedVault && vault.length === 0) {
          try {
            const parsed = JSON.parse(savedVault);
            setState((prev) => ({
              ...prev,
              communication: {
                ...prev.communication,
                vault: parsed,
              },
            }));
          } catch (e) {
            console.error('Failed to load vocabulary vault:', e);
          }
        }
      }
    };
    
    checkBackend();
  }, []);

  // Persist vault to localStorage whenever it changes (fallback)
  useEffect(() => {
    if (!useBackend && vault.length > 0) {
      localStorage.setItem('vocabulary_vault', JSON.stringify(vault));
    }
  }, [vault, useBackend]);

  const toggleHabit = (index) => {
    setState((prev) => ({
      ...prev,
      communication: {
        ...prev.communication,
        habits: prev.communication.habits.map((h, i) =>
          i === index ? { ...h, done: !h.done } : h
        ),
      },
    }));
  };

  const addWord = async (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    
    const newEntry = {
      word: word.trim(),
      meaning: meaning.trim() || "",
      example: example.trim() || "",
      dateAdded: new Date().toISOString(),
    };

    if (useBackend) {
      // Add to MongoDB
      try {
        const savedEntry = await vocabularyAPI.create(newEntry);
        setState((prev) => ({
          ...prev,
          communication: {
            ...prev.communication,
            vault: [savedEntry, ...prev.communication.vault],
          },
        }));
      } catch (error) {
        console.error('Failed to add to MongoDB:', error);
        // Fallback to localStorage
        newEntry.id = Date.now();
        setState((prev) => ({
          ...prev,
          communication: {
            ...prev.communication,
            vault: [newEntry, ...prev.communication.vault],
          },
        }));
      }
    } else {
      // Add to localStorage
      newEntry.id = Date.now();
      setState((prev) => ({
        ...prev,
        communication: {
          ...prev.communication,
          vault: [newEntry, ...prev.communication.vault],
        },
      }));
    }
    
    setWord("");
    setMeaning("");
    setExample("");
    setIsDialogOpen(false);
  };

  const startEdit = (entry) => {
    setEditingId(useBackend ? entry._id : entry.id);
    setEditData({
      word: entry.word,
      meaning: entry.meaning || "",
      example: entry.example || "",
    });
  };

  const saveEdit = async () => {
    if (!editData.word.trim()) return;

    if (useBackend) {
      // Update in MongoDB
      try {
        const updated = await vocabularyAPI.update(editingId, editData);
        setState((prev) => ({
          ...prev,
          communication: {
            ...prev.communication,
            vault: prev.communication.vault.map((item) =>
              item._id === editingId ? updated : item
            ),
          },
        }));
      } catch (error) {
        console.error('Failed to update in MongoDB:', error);
      }
    } else {
      // Update in localStorage
      setState((prev) => ({
        ...prev,
        communication: {
          ...prev.communication,
          vault: prev.communication.vault.map((item) =>
            item.id === editingId
              ? { ...item, ...editData, word: editData.word.trim(), meaning: editData.meaning.trim(), example: editData.example.trim() }
              : item
          ),
        },
      }));
    }
    
    setEditingId(null);
    setEditData({ word: "", meaning: "", example: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ word: "", meaning: "", example: "" });
  };

  const removeWord = async (id) => {
    console.log('Attempting to remove word with ID:', id, 'useBackend:', useBackend);
    
    if (useBackend) {
      // Delete from MongoDB
      try {
        const result = await vocabularyAPI.delete(id);
        console.log('Delete result:', result);
        
        // Update local state by filtering out the deleted item
        setState((prev) => ({
          ...prev,
          communication: {
            ...prev.communication,
            vault: prev.communication.vault.filter((item) => {
              const itemId = item._id || item.id;
              const keep = itemId !== id;
              if (itemId === id) {
                console.log('Removing item:', item.word);
              }
              return keep;
            }),
          },
        }));
        
        // Also clear localStorage to prevent conflicts
        localStorage.removeItem('vocabulary_vault');
      } catch (error) {
        console.error('Failed to delete from MongoDB:', error);
        alert('Failed to delete word. Please try again.');
      }
    } else {
      // Delete from localStorage
      setState((prev) => ({
        ...prev,
        communication: {
          ...prev.communication,
          vault: prev.communication.vault.filter((item) => item.id !== id),
        },
      }));
    }
  };

  const handleSyncToMongoDB = async () => {
    setSyncStatus('syncing');
    const result = await syncLocalStorageToMongoDB();
    setSyncStatus(result.synced ? 'success' : 'error');
    
    if (result.synced) {
      setTimeout(() => setSyncStatus(''), 3000);
      // Reload from MongoDB
      const data = await vocabularyAPI.getAll();
      setState((prev) => ({
        ...prev,
        communication: {
          ...prev.communication,
          vault: data,
        },
      }));
      setUseBackend(true);
      setBackendStatus('connected');
    }
  };

  // Filter vault based on search query
  const filteredVault = vault.filter((item) => {
    const query = searchQuery.toLowerCase();
    const itemWord = typeof item === 'string' ? item : item.word || '';
    const itemMeaning = typeof item === 'string' ? '' : item.meaning || '';
    const itemExample = typeof item === 'string' ? '' : item.example || '';
    
    return (
      itemWord.toLowerCase().includes(query) ||
      itemMeaning.toLowerCase().includes(query) ||
      itemExample.toLowerCase().includes(query)
    );
  });

  // Calculate statistics
  const totalWords = vault.length;
  const completedHabits = habits.filter(h => h.done).length;
  const totalHabits = habits.length;
  const habitsCompletionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  
  // Recent additions (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentWords = vault.filter(item => {
    const dateAdded = item.dateAdded ? new Date(item.dateAdded) : null;
    return dateAdded && dateAdded >= sevenDaysAgo;
  }).length;

  return (
    <section className="max-w-450 mx-auto px-6 pb-20 space-y-6">
      {/* Header with Back Button */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6"
      >
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-400 hover:text-teal-400 transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <h1 className="text-4xl font-black italic uppercase tracking-widest text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-cyan-400">
          💬 Communication Hub
        </h1>
      </motion.div>

      {/* Main Content - 2 Column Grid */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] gap-8">
        
        {/* Left Column: Daily Habits & Vocabulary */}
        <div className="flex flex-col gap-8">
          {/* Daily Habits */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="relative rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl"
          >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
              Daily Habits
            </h2>
          </div>

          {/* List */}
          <div className="space-y-3">
            {habits.map((h, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => toggleHabit(i)}
                className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border
                  ${h.done 
                    ? "bg-emerald-500/10 border-emerald-500/20" 
                    : "bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-emerald-500/30"
                  }`}
              >
                {/* Custom Checkbox */}
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                  ${h.done 
                    ? "bg-emerald-500 border-emerald-500" 
                    : "border-slate-600 group-hover:border-emerald-400"
                  }`}>
                   {h.done && (
                     <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3.5 h-3.5 text-slate-900 stroke-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                       <polyline points="20 6 9 17 4 12" />
                     </motion.svg>
                   )}
                </div>

                {/* Text */}
                <span className={`text-sm font-bold tracking-wide transition-all ${
                  h.done 
                    ? "text-emerald-500 line-through opacity-50" 
                    : "text-slate-300 group-hover:text-white"
                }`}>
                  {h.task}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

          {/* Vocabulary Vault */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl"
          >
          {/* Header */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
                  Vocabulary
                </h2>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all active:scale-95 shadow-lg shadow-teal-900/20"
                  title="Add New Word"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
                {vault.length} {vault.length === 1 ? 'word' : 'words'}
              </span>
            </div>
            
            {/* Backend Status & Sync */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                backendStatus === 'connected' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : backendStatus === 'checking'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-emerald-500' : 
                  backendStatus === 'checking' ? 'bg-yellow-500' : 
                  'bg-slate-600'
                }`}></span>
                {backendStatus === 'connected' ? 'MongoDB Connected' : 
                 backendStatus === 'checking' ? 'Checking...' : 
                 'Using Local Storage'}
              </div>
              
              {!useBackend && backendStatus !== 'checking' && vault.length > 0 && (
                <button
                  onClick={handleSyncToMongoDB}
                  disabled={syncStatus === 'syncing'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    syncStatus === 'syncing' 
                      ? 'bg-teal-500/20 text-teal-400 cursor-wait'
                      : syncStatus === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : syncStatus === 'error'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                  title="Sync to MongoDB"
                >
                  {syncStatus === 'syncing' ? '⏳ Syncing...' :
                   syncStatus === 'success' ? '✓ Synced!' :
                   syncStatus === 'error' ? '✗ Failed' :
                   '⬆ Sync to MongoDB'}
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search vocabulary..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Vocabulary List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredVault.map((item) => {
                const entry = typeof item === 'string' ? { id: Math.random(), word: item, meaning: '', example: '', dateAdded: new Date().toISOString() } : item;
                const entryId = useBackend ? entry._id : entry.id;
                const isEditing = editingId === entryId;

                return (
                  <motion.div
                    key={entryId}
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="group p-5 rounded-2xl border bg-slate-800 border-slate-700 hover:border-slate-600 transition-all"
                  >
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          value={editData.word}
                          onChange={(e) => setEditData({ ...editData, word: e.target.value })}
                          placeholder="Word / Phrase"
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm font-semibold text-white placeholder:text-slate-600 outline-none focus:border-teal-500 transition-colors"
                        />
                        <input
                          value={editData.meaning}
                          onChange={(e) => setEditData({ ...editData, meaning: e.target.value })}
                          placeholder="Meaning"
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-teal-500 transition-colors"
                        />
                        <textarea
                          value={editData.example}
                          onChange={(e) => setEditData({ ...editData, example: e.target.value })}
                          placeholder="Example sentence"
                          rows="2"
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-teal-500 transition-colors resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-base font-bold text-white leading-tight">
                            {entry.word}
                          </h3>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(entry)}
                              className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-400 transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeWord(entryId)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {entry.meaning && (
                          <p className="text-sm font-medium text-slate-300 mb-2 leading-relaxed">
                            {entry.meaning}
                          </p>
                        )}
                        
                        {entry.example && (
                          <p className="text-xs font-medium text-slate-400 italic leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            "{entry.example}"
                          </p>
                        )}
                        
                        {entry.dateAdded && (
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-3">
                            Added {new Date(entry.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredVault.length === 0 && vault.length > 0 && (
              <div className="w-full text-center py-10 opacity-30">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No matching words found</p>
              </div>
            )}
            
            {vault.length === 0 && (
              <div className="w-full text-center py-10 opacity-30">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No words collected yet</p>
              </div>
            )}
          </div>
        </motion.div>
        </div>

        {/* Right Column: Statistics Sidebar */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Habits Progress */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-widest text-white">
                Habits Progress
              </h3>
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgb(30 41 59)"
                    strokeWidth="8"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgb(16 185 129)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - habitsCompletionRate / 100) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                {/* Percentage Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-emerald-400">{habitsCompletionRate}%</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Complete</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-2xl font-black text-emerald-400">{completedHabits}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-2xl font-black text-slate-400">{totalHabits - completedHabits}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending</div>
              </div>
            </div>
          </div>

          {/* Vocabulary Stats */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-widest text-white">
                Vocabulary Stats
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <div className="text-3xl font-black text-teal-400">{totalWords}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Words</div>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-3xl font-black text-slate-300">{recentWords}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Added This Week</div>
              </div>

              <div className={`p-4 rounded-xl border ${
                backendStatus === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-slate-800 border-slate-700'
              }`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  backendStatus === 'connected' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  Backend Status
                </div>
                <div className={`text-sm font-bold ${
                  backendStatus === 'connected' ? 'text-emerald-300' : 'text-slate-400'
                }`}>
                  {backendStatus === 'connected' ? '🟢 MongoDB Active' : '🔴 Local Storage'}
                </div>
              </div>
            </div>
          </div>

          {/* Communication Tips */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-xl font-black italic uppercase tracking-widest text-white">
                Tips
              </h3>
            </div>
            <div className="space-y-3 text-xs font-medium text-slate-400 leading-relaxed">
              <p>📝 Review new words daily for better retention</p>
              <p>🎯 Use words in sentences to reinforce learning</p>
              <p>🔄 Consistent habits compound over time</p>
              <p>💬 Practice active listening and clear expression</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Vocabulary Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-8">
                {/* Dialog Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black italic uppercase tracking-widest text-white">
                    Add New Word
                  </h3>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={addWord} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Word / Phrase *
                    </label>
                    <input
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      placeholder="Enter word or phrase"
                      autoFocus
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-600 outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Meaning
                    </label>
                    <input
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      placeholder="Enter meaning (optional)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Example
                    </label>
                    <textarea
                      value={example}
                      onChange={(e) => setExample(e.target.value)}
                      placeholder="Enter example sentence (optional)"
                      rows="3"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-teal-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-teal-900/20"
                    >
                      Add Word
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}
