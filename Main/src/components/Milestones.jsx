import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { milestoneAPI, checkBackendConnection, syncMilestonesToMongoDB } from "../services/milestoneService";

export default function Milestones({ state, setState }) {
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState("");
  const [confidence, setConfidence] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterConfidence, setFilterConfidence] = useState("all"); // all, high, medium, low
  const [useBackend, setUseBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [syncStatus, setSyncStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const milestones = state.milestones || [];

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await checkBackendConnection();
      setUseBackend(isAvailable);
      setBackendStatus(isAvailable ? 'connected' : 'offline');
      
      if (isAvailable) {
        try {
          const data = await milestoneAPI.getAll();
          setState((prev) => ({
            ...prev,
            milestones: data,
          }));
        } catch (error) {
          console.error('Failed to load from MongoDB:', error);
          setBackendStatus('error');
          setUseBackend(false);
        }
      }
    };
    
    checkBackend();
  }, []);

  const logMilestone = async (e) => {
    e.preventDefault();
    if (!achievement.trim() || !confidence) return;

    const newMilestone = {
      text: achievement.trim(),
      confidence: Number(confidence),
      date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    if (useBackend) {
      try {
        const savedMilestone = await milestoneAPI.create(newMilestone);
        setState((prev) => ({
          ...prev,
          milestones: [savedMilestone, ...prev.milestones],
        }));
      } catch (error) {
        console.error('Failed to add to MongoDB:', error);
        setState((prev) => ({
          ...prev,
          milestones: [
            { id: Date.now(), ...newMilestone },
            ...prev.milestones,
          ],
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        milestones: [
          { id: Date.now(), ...newMilestone },
          ...prev.milestones,
        ],
      }));
    }

    setAchievement("");
    setConfidence("");
    setIsDialogOpen(false);
  };

  const deleteMilestone = async (id) => {
    if (useBackend) {
      try {
        await milestoneAPI.delete(id);
        setState((prev) => ({
          ...prev,
          milestones: prev.milestones.filter((m) => (m._id || m.id) !== id),
        }));
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    } else {
      setState((prev) => ({
        ...prev,
        milestones: prev.milestones.filter((m) => (m._id || m.id) !== id),
      }));
    }
  };

  const handleSyncToMongoDB = async () => {
    setSyncStatus('syncing');
    try {
      await syncMilestonesToMongoDB(milestones);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(''), 3000);
      const data = await milestoneAPI.getAll();
      setState((prev) => ({ ...prev, milestones: data }));
      setUseBackend(true);
      setBackendStatus('connected');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  // Filter and search
  const filteredMilestones = milestones.filter(m => {
    const matchesSearch = m.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterConfidence === "all" ? true :
      filterConfidence === "high" ? m.confidence >= 8 :
      filterConfidence === "medium" ? m.confidence >= 5 && m.confidence < 8 :
      m.confidence < 5;
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    total: milestones.length,
    avgConfidence: milestones.length > 0 
      ? (milestones.reduce((sum, m) => sum + m.confidence, 0) / milestones.length).toFixed(1)
      : 0,
    highConfidence: milestones.filter(m => m.confidence >= 8).length,
  };

 return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto w-full px-6 pb-20"
    >
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </motion.button>
        
        <div className="flex-1">
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-white">🏆 Milestones</h1>
          <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Track Your Growth Journey</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Milestone List */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
                  Achievements
                </h2>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                  title="Log New Milestone"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                {stats.total} total
              </span>
            </div>
            
            {/* Backend Status & Sync */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                backendStatus === 'connected' 
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                  : backendStatus === 'checking'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-purple-500' : 
                  backendStatus === 'checking' ? 'bg-yellow-500' : 
                  'bg-slate-600'
                }`}></span>
                {backendStatus === 'connected' ? 'MongoDB Connected' : 
                 backendStatus === 'checking' ? 'Checking...' : 
                 'Using Local Storage'}
              </div>
              
              {!useBackend && backendStatus !== 'checking' && milestones.length > 0 && (
                <button
                  onClick={handleSyncToMongoDB}
                  disabled={syncStatus === 'syncing'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    syncStatus === 'syncing' 
                      ? 'bg-purple-500/20 text-purple-400 cursor-wait'
                      : syncStatus === 'success'
                      ? 'bg-purple-500/20 text-purple-400'
                      : syncStatus === 'error'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
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

          {/* Search and Filter */}
          <div className="mb-6 space-y-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search milestones..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-purple-500 transition-colors"
            />
            
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "high", label: "High (8-10)" },
                { key: "medium", label: "Medium (5-7)" },
                { key: "low", label: "Low (1-4)" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterConfidence(filter.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    filterConfidence === filter.key
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Milestone List */}
          <div className="space-y-4 max-h-150 overflow-y-auto custom-scroll pr-2">
            <AnimatePresence mode="popLayout">
              {filteredMilestones.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 text-slate-500"
                >
                  <div className="text-6xl mb-4 opacity-20">🏆</div>
                  <p className="font-bold text-sm">
                    {searchQuery || filterConfidence !== "all" 
                      ? "No milestones match your filters"
                      : "No milestones logged yet"}
                  </p>
                </motion.div>
              ) : (
                filteredMilestones.map((m) => {
                  const milestoneId = m._id || m.id;
                  const confidenceColor = 
                    m.confidence >= 8 ? 'emerald' :
                    m.confidence >= 5 ? 'yellow' :
                    'orange';
                  
                  return (
                    <motion.div
                      key={milestoneId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all"
                    >
                      {/* Confidence Badge */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <span className={`text-xs font-black uppercase px-2 py-1 rounded ${
                          m.confidence >= 8 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : m.confidence >= 5
                            ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                            : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                        }`}>
                          Confidence: {m.confidence}/10
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">{m.date}</span>
                          <button
                            onClick={() => deleteMilestone(milestoneId)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300"
                            title="Delete milestone"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Achievement Text */}
                      <p className="text-white font-semibold text-base leading-relaxed mb-4">
                        {m.text}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500 font-medium">Mastery Level</span>
                          <span className={`font-bold ${
                            m.confidence >= 8 ? 'text-emerald-400' :
                            m.confidence >= 5 ? 'text-yellow-400' :
                            'text-orange-400'
                          }`}>{m.confidence * 10}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.confidence * 10}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full shadow-lg ${
                              m.confidence >= 8 
                                ? 'bg-linear-to-r from-emerald-500 to-emerald-400'
                                : confidence >= 5
                                ? 'bg-linear-to-r from-yellow-500 to-yellow-400'
                                : 'bg-linear-to-r from-orange-500 to-orange-400'
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column - Statistics */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="text-4xl font-black text-purple-400 mb-1">{stats.total}</div>
                <div className="text-xs text-slate-400 font-medium">Total Milestones</div>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div>
                <div className="text-4xl font-black text-emerald-400 mb-1">{stats.avgConfidence}</div>
                <div className="text-xs text-slate-400 font-medium">Average Confidence</div>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div>
                <div className="text-4xl font-black text-yellow-400 mb-1">{stats.highConfidence}</div>
                <div className="text-xs text-slate-400 font-medium">High Confidence (8+)</div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-linear-to-br from-purple-900/20 to-slate-900 border border-purple-800/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💡</span>
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Growth Tips</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>• Log achievements immediately while fresh</li>
              <li>• Track both technical and soft skills</li>
              <li>• Review regularly to measure progress</li>
              <li>• Update confidence as you grow</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Add Milestone Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black italic uppercase text-white">Log Milestone</h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={logMilestone} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Achievement
                  </label>
                  <input
                    autoFocus
                    value={achievement}
                    onChange={(e) => setAchievement(e.target.value)}
                    placeholder="e.g. Mastered React Hooks"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Confidence Level (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                    placeholder="8"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 py-3 rounded-xl font-bold uppercase tracking-wider bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!achievement.trim() || !confidence}
                    className="flex-1 py-3 rounded-xl font-bold uppercase tracking-wider bg-purple-600 text-white hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30"
                  >
                    Log
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
}