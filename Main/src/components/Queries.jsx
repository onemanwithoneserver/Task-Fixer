import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { queryAPI, checkBackendConnection, syncQueriesToMongoDB } from "../services/queryService";

export default function Queries({ state, setState }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, unresolved
  const [useBackend, setUseBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [syncStatus, setSyncStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queries = state.queries || [];

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await checkBackendConnection();
      setUseBackend(isAvailable);
      setBackendStatus(isAvailable ? 'connected' : 'offline');
      
      if (isAvailable) {
        try {
          const data = await queryAPI.getAll();
          setState((prev) => ({
            ...prev,
            queries: data,
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

  const addQuery = async () => {
    if (!title.trim()) return;

    const newQuery = { 
      title: title.trim(), 
      desc: desc.trim(), 
      date: new Date().toLocaleDateString() 
    };

    if (useBackend) {
      try {
        const savedQuery = await queryAPI.create(newQuery);
        setState((prev) => ({
          ...prev,
          queries: [savedQuery, ...prev.queries],
        }));
      } catch (error) {
        console.error('Failed to add to MongoDB:', error);
        setState((prev) =>({
          ...prev,
          queries: [
            { id: Date.now(), ...newQuery },
            ...prev.queries,
          ],
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        queries: [
          { id: Date.now(), ...newQuery },
          ...prev.queries,
        ],
      }));
    }

    setTitle("");
    setDesc("");
    setIsDialogOpen(false);
  };

  const resolveQuery = async (id) => {
    if (useBackend) {
      try {
        await queryAPI.delete(id);
        setState((prev) => ({
          ...prev,
          queries: prev.queries.filter((q) => (q._id || q.id) !== id),
        }));
      } catch (error) {
        console.error('Failed to delete from MongoDB:', error);
      }
    } else {
      setState((prev) => ({
        ...prev,
        queries: prev.queries.filter((q) => (q._id || q.id) !== id),
      }));
    }
  };

  const handleSyncToMongoDB = async () => {
    setSyncStatus('syncing');
    try {
      await syncQueriesToMongoDB(queries);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(''), 3000);
      const data = await queryAPI.getAll();
      setState((prev) => ({ ...prev, queries: data }));
      setUseBackend(true);
      setBackendStatus('connected');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  // Filter and search
  const filteredQueries = queries.filter(q => {
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.desc && q.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Statistics
  const stats = {
    total: queries.length,
    active: queries.length,
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
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-white">🔍 Queries</h1>
          <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Track Learning Gaps</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Query List */}
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
                  Knowledge Gaps
                </h2>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-all active:scale-95 shadow-lg shadow-orange-900/20"
                  title="Log New Query"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                {stats.active} active
              </span>
            </div>
            
            {/* Backend Status & Sync */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                backendStatus === 'connected' 
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                  : backendStatus === 'checking'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-orange-500' : 
                  backendStatus === 'checking' ? 'bg-yellow-500' : 
                  'bg-slate-600'
                }`}></span>
                {backendStatus === 'connected' ? 'MongoDB Connected' : 
                 backendStatus === 'checking' ? 'Checking...' : 
                 'Using Local Storage'}
              </div>
              
              {!useBackend && backendStatus !== 'checking' && queries.length > 0 && (
                <button
                  onClick={handleSyncToMongoDB}
                  disabled={syncStatus === 'syncing'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    syncStatus === 'syncing' 
                      ? 'bg-orange-500/20 text-orange-400 cursor-wait'
                      : syncStatus === 'success'
                      ? 'bg-orange-500/20 text-orange-400'
                      : syncStatus === 'error'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-orange-600 hover:bg-orange-500 text-white'
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

          {/* Search */}
          <div className="mb-6">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search queries..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Query List */}
          <div className="space-y-4 max-h-150 overflow-y-auto custom-scroll pr-2">
            <AnimatePresence mode="popLayout">
              {filteredQueries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 text-slate-500"
                >
                  <div className="text-6xl mb-4 opacity-20">✅</div>
                  <p className="font-bold text-sm">
                    {searchQuery 
                      ? "No queries match your search"
                      : "No learning gaps tracked"}
                  </p>
                </motion.div>
              ) : (
                filteredQueries.map((q) => {
                  const queryId = q._id || q.id;
                  
                  return (
                    <motion.div
                      key={queryId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                      className="group relative bg-slate-950 border border-slate-800 hover:border-orange-500/30 rounded-2xl p-6 transition-all"
                    >
                      {/* Left Border Accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-500 to-orange-700 rounded-l-2xl"></div>

                      <div className="pl-3 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Date Badge */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-orange-400/60 tabular-nums">{q.date}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-black text-white mb-2 leading-tight">
                            {q.title}
                          </h3>

                          {/* Description */}
                          {q.desc && (
                            <p className="text-sm text-slate-400 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 italic">
                              "{q.desc}"
                            </p>
                          )}
                        </div>

                        {/* Resolve Button */}
                        <button
                          onClick={() => resolveQuery(queryId)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-white shadow-lg"
                          title="Mark as resolved"
                        >
                          ✓ Resolve
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column - Statistics and Tips */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {/* Stats Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="text-4xl font-black text-orange-400 mb-1">{stats.total}</div>
                <div className="text-xs text-slate-400 font-medium">Total Queries</div>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div>
                <div className="text-4xl font-black text-red-400 mb-1">{stats.active}</div>
                <div className="text-xs text-slate-400 font-medium">Unresolved</div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-linear-to-br from-orange-900/20 to-slate-900 border border-orange-800/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💡</span>
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-400">Learning Tips</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>• Document gaps as soon as you notice them</li>
              <li>• Break complex topics into smaller queries</li>
              <li>• Set deadlines for resolution</li>
              <li>• Review regularly to track progress</li>
            </ul>
          </div>

          {/* Priority Indicator */}
          {queries.length > 5 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-red-400">Action Required</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have {queries.length} unresolved queries. Focus on resolving a few before adding more.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Query Dialog */}
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
                <h3 className="text-2xl font-black italic uppercase text-white">Log Query</h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Subject / Topic
                  </label>
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addQuery()}
                    placeholder="e.g. Redux Middleware"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Description (Optional)
                  </label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describe the learning gap..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-orange-500 transition-colors h-32 resize-none custom-scroll"
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
                    onClick={addQuery}
                    disabled={!title.trim()}
                    className="flex-1 py-3 rounded-xl font-bold uppercase tracking-wider bg-orange-600 text-white hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-900/30"
                  >
                    Add Query
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
