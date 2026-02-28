import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { todoAPI, checkBackendConnection, syncLocalStorageToMongoDB } from "../services/todoService";

const STORAGE_KEY = "todolist_v1";

export default function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [action, setAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, completed
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", action: "" });
  const [useBackend, setUseBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [syncStatus, setSyncStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await checkBackendConnection();
      setUseBackend(isAvailable);
      setBackendStatus(isAvailable ? 'connected' : 'offline');
      
      if (isAvailable) {
        // Load data from MongoDB
        try {
          const data = await todoAPI.getAll();
          setTodos(data);
          // Clear localStorage when using MongoDB to avoid conflicts
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          console.error('Failed to load from MongoDB:', error);
          setBackendStatus('error');
          setUseBackend(false);
        }
      } else {
        // Load from localStorage if backend unavailable
        const savedTodos = localStorage.getItem(STORAGE_KEY);
        if (savedTodos && todos.length === 0) {
          try {
            const parsed = JSON.parse(savedTodos);
            setTodos(parsed);
          } catch (e) {
            console.error('Failed to load todos:', e);
          }
        }
      }
    };
    
    checkBackend();
  }, []);

  // Persist todos to localStorage whenever they change (fallback)
  useEffect(() => {
    if (!useBackend && todos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, useBackend]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newTodo = {
      title: title.trim(),
      action: action.trim() || "",
      completed: false,
      dateAdded: new Date().toISOString(),
    };

    if (useBackend) {
      // Add to MongoDB
      try {
        const savedTodo = await todoAPI.create(newTodo);
        setTodos([savedTodo, ...todos]);
      } catch (error) {
        console.error('Failed to add to MongoDB:', error);
        // Fallback to localStorage
        newTodo.id = Date.now();
        setTodos([newTodo, ...todos]);
      }
    } else {
      // Add to localStorage
      newTodo.id = Date.now();
      setTodos([newTodo, ...todos]);
    }
    
    setTitle("");
    setAction("");
    setIsDialogOpen(false);
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => (useBackend ? t._id : t.id) === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    if (useBackend) {
      try {
        const result = await todoAPI.update(id, { completed: updatedTodo.completed });
        setTodos(todos.map(t => (t._id === id ? result : t)));
      } catch (error) {
        console.error('Failed to update MongoDB:', error);
      }
    } else {
      setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
    }
  };

  const startEdit = (todo) => {
    setEditingId(useBackend ? todo._id : todo.id);
    setEditData({
      title: todo.title,
      action: todo.action || "",
    });
  };

  const saveEdit = async () => {
    if (!editData.title.trim()) return;

    if (useBackend) {
      try {
        const updated = await todoAPI.update(editingId, editData);
        setTodos(todos.map(t => (t._id === editingId ? updated : t)));
      } catch (error) {
        console.error('Failed to update MongoDB:', error);
      }
    } else {
      setTodos(todos.map(t => 
        t.id === editingId ? { ...t, ...editData } : t
      ));
    }
    
    setEditingId(null);
    setEditData({ title: "", action: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", action: "" });
  };

  const deleteTodo = async (id) => {
    if (useBackend) {
      try {
        await todoAPI.delete(id);
        setTodos(todos.filter(t => t._id !== id));
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Failed to delete from MongoDB:', error);
        alert('Failed to delete task. Please try again.');
      }
    } else {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  const handleSyncToMongoDB = async () => {
    setSyncStatus('syncing');
    const result = await syncLocalStorageToMongoDB();
    setSyncStatus(result.synced ? 'success' : 'error');
    
    if (result.synced) {
      setTimeout(() => setSyncStatus(''), 3000);
      // Reload from MongoDB
      const data = await todoAPI.getAll();
      setTodos(data);
      setUseBackend(true);
      setBackendStatus('connected');
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (todo.title || "").toLowerCase().includes(query) ||
      (todo.action || "").toLowerCase().includes(query);
    
    if (filterStatus === "active") return matchesSearch && !todo.completed;
    if (filterStatus === "completed") return matchesSearch && todo.completed;
    return matchesSearch;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
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
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-white">Task Manager</h1>
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Organize Your Daily Actions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Task List */}
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
                  Tasks
                </h2>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                  title="Add New Task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {stats.active} active
              </span>
            </div>
            
            {/* Backend Status & Sync */}
            <div className="flex items-center gap-3">
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
              
              {!useBackend && backendStatus !== 'checking' && todos.length > 0 && (
                <button
                  onClick={handleSyncToMongoDB}
                  disabled={syncStatus === 'syncing'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    syncStatus === 'syncing' 
                      ? 'bg-emerald-500/20 text-emerald-400 cursor-wait'
                      : syncStatus === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : syncStatus === 'error'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
              placeholder="🔍 Search tasks..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors"
            />
            
            <div className="flex gap-2">
              {['all', 'active', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterStatus(filter)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filterStatus === filter
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => {
                const todoId = useBackend ? todo._id : todo.id;
                const isEditing = editingId === todoId;

                return (
                  <motion.div
                    key={todoId}
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
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          placeholder="Task Title"
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm font-semibold text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors"
                        />
                        <textarea
                          value={editData.action}
                          onChange={(e) => setEditData({ ...editData, action: e.target.value })}
                          placeholder="Action items / Details"
                          rows="2"
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors resize-none"
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
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTodo(todoId)}
                          className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 mt-1 ${
                            todo.completed
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-slate-600 hover:border-emerald-400"
                          }`}
                        >
                          {todo.completed && (
                            <motion.svg 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              className="w-3.5 h-3.5 text-slate-900 stroke-3" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </motion.svg>
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base font-bold leading-tight mb-2 ${
                            todo.completed 
                              ? "line-through text-slate-500" 
                              : "text-white"
                          }`}>
                            {todo.title}
                          </h3>
                          {todo.action && (
                            <p className={`text-sm font-medium leading-relaxed ${
                              todo.completed 
                                ? "line-through text-slate-600" 
                                : "text-slate-300"
                            }`}>
                              {todo.action}
                            </p>
                          )}
                          {todo.dateAdded && (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-2">
                              Added {new Date(todo.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(todo)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTodo(todoId)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredTodos.length === 0 && todos.length > 0 && (
              <div className="w-full text-center py-10 opacity-30">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No matching tasks found</p>
              </div>
            )}
            
            {todos.length === 0 && (
              <div className="w-full text-center py-10 opacity-30">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Stats & Info */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {/* Statistics */}
          <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-black italic uppercase tracking-widest text-white mb-4 flex items-center gap-3">
              <span className="text-2xl">📊</span>
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-emerald-400 text-3xl font-black">{stats.completed}</p>
                <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mt-1">Completed</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-400 text-3xl font-black">{stats.active}</p>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mt-1">Active</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-purple-400 text-3xl font-black">{stats.total}</p>
                <p className="text-purple-300 text-xs font-bold uppercase tracking-wider mt-1">Total Tasks</p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-black italic uppercase tracking-widest text-white mb-4 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              Quick Tips
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex gap-3">
                <span className="text-emerald-400">✓</span>
                <p>Click the <strong className="text-white">+</strong> button to add tasks quickly</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>Edit tasks by clicking the <strong className="text-white">edit</strong> icon</p>
              </div>
              <div className="flex gap-3">
                <span className="text-purple-400">✓</span>
                <p>Check off tasks as you complete them</p>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-400">✓</span>
                <p>Use filters to view specific task groups</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Task Dialog */}
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
                    Add New Task
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
                <form onSubmit={addTodo} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Task Title *
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter task title"
                      autoFocus
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Action Items / Details
                    </label>
                    <textarea
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      placeholder="Add action items or details (optional)"
                      rows="3"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-emerald-500 transition-colors resize-none"
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
                      className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
                    >
                      Add Task
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
