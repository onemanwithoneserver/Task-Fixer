import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoricalReview = ({ records = [], updateRecord, deleteRecord }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, all
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  // Handle delete record
  const handleDeleteRecord = async (date) => {
    if (window.confirm('Are you sure you want to delete this record? This cannot be undone.')) {
      const result = await deleteRecord(date);
      if (result.success) {
        setSelectedRecord(null);
        setEditingRecord(null);
      }
    }
  };

  // Handle save edited record
  const handleSaveEdit = async (date, updates) => {
    const result = await updateRecord(date, updates);
    if (result.success) {
      setEditingRecord(null);
      setSelectedRecord(null);
    }
    return result;
  };

  // Filter records by period
  const getFilteredRecords = () => {
    const now = new Date();
    const filtered = records.filter(record => {
      const recordDate = new Date(record.date);
      const diffDays = Math.floor((now - recordDate) / (1000 * 60 * 60 * 24));

      if (selectedPeriod === 'week') return diffDays <= 7;
      if (selectedPeriod === 'month') return diffDays <= 30;
      return true; // all
    });

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredRecords = getFilteredRecords();

  if (records.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">No Historical Data</h3>
        <p className="text-slate-500">Complete daily activities to build your history</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'week', label: 'This Week', icon: '📅' },
          { key: 'month', label: 'This Month', icon: '📆' },
          { key: 'all', label: 'All Time', icon: '🏆' }
        ].map(period => (
          <button
            key={period.key}
            onClick={() => setSelectedPeriod(period.key)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedPeriod === period.key
                ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="mr-2">{period.icon}</span>
            {period.label}
          </button>
        ))}
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredRecords.map((record, index) => (
            <RecordCard
              key={record.date}
              record={record}
              index={index}
              isSelected={selectedRecord?.date === record.date}
              onClick={() => setSelectedRecord(selectedRecord?.date === record.date ? null : record)}
            />
          ))}
        </AnimatePresence>

        {filteredRecords.length === 0 && (
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-400">No records found for this period</p>
          </div>
        )}
      </div>

      {/* Selected Record Details */}
      <AnimatePresence>
        {selectedRecord && (
          <RecordDetails 
            record={selectedRecord} 
            onClose={() => {
              setSelectedRecord(null);
              setEditingRecord(null);
            }}
            onDelete={handleDeleteRecord}
            onEdit={() => setEditingRecord(selectedRecord)}
            isEditing={editingRecord?.date === selectedRecord.date}
            onSave={handleSaveEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Record Card Component
const RecordCard = ({ record, index, isSelected, onClick }) => {
  const totalCompleted = (record.tasksCompleted + record.habitsCompleted + (record.learningItemsCompleted || 0));
  const totalItems = (record.totalTasks + record.totalHabits + (record.totalLearningItems || 0));
  const completionRate = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`border rounded-2xl p-5 cursor-pointer transition-all ${
        isSelected 
          ? 'border-amber-500/50 bg-linear-to-br from-amber-500/10 to-orange-500/5 shadow-lg' 
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/70'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Date and Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">
              {completionRate >= 80 ? '🎯' : completionRate >= 60 ? '✅' : completionRate >= 40 ? '📝' : '⚠️'}
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-200">{formatDate(record.date)}</h4>
              <p className="text-sm text-slate-400">Day {record.cycleDay} • {record.dayType}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <QuickStat 
              label="Tasks" 
              value={`${record.tasksCompleted}/${record.totalTasks}`}
              color="emerald"
            />
            <QuickStat 
              label="Habits" 
              value={`${record.habitsCompleted}/${record.totalHabits}`}
              color="blue"
            />
            <QuickStat 
              label="Learning" 
              value={`${record.learningItemsCompleted || 0}/${record.totalLearningItems || 0}`}
              color="purple"
            />
          </div>
        </div>

        {/* Right: Completion Summary */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="text-center">
              <span className="text-lg font-bold text-emerald-400">
                {(record.tasksCompleted + record.habitsCompleted + (record.learningItemsCompleted || 0))}
              </span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-sm font-semibold text-slate-400">
                {(record.totalTasks + record.totalHabits + (record.totalLearningItems || 0))}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 mt-2">Total Done</span>
        </div>
      </div>

      {/* Reflection Preview */}
      {record.reflection && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-sm text-slate-400 line-clamp-2 italic">
            "{record.reflection}"
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Quick Stat Component
const QuickStat = ({ label, value, color }) => {
  const colors = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="bg-slate-800/30 rounded-lg p-2 text-center">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-sm font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
};

// Record Details Modal
const RecordDetails = ({ record, onClose, onDelete, onEdit, isEditing, onSave }) => {
  const [editedReflection, setEditedReflection] = useState(record.reflection || '');
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await onSave(record.date, { reflection: editedReflection });
    setIsSaving(false);
    if (result.success) {
      // Close edit mode but keep modal open
      onEdit(); // Toggle off edit mode
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-100 mb-1">{formatDate(record.date)}</h2>
            <p className="text-slate-400">Day {record.cycleDay} of your growth journey</p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={onEdit}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm font-semibold"
                  title="Edit Record"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(record.date)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm font-semibold"
                  title="Delete Record"
                >
                  🗑️ Delete
                </button>
              </>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all text-sm font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : '💾 Save'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-2xl leading-none ml-2"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tasks */}
        {record.tasks && record.tasks.length > 0 && (
          <DetailSection title="📋 Tasks" items={record.tasks} />
        )}

        {/* Habits */}
        {record.habits && record.habits.length > 0 && (
          <DetailSection title="🎯 Habits" items={record.habits} />
        )}

        {/* Learning */}
        {record.learning && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-200 mb-3">📚 Learning</h3>
            <div className="space-y-2">
              {record.learning.mern?.length > 0 && (
                <LearningCategory title="MERN Stack" items={record.learning.mern} />
              )}
              {record.learning.dsa?.length > 0 && (
                <LearningCategory title="DSA" items={record.learning.dsa} />
              )}
              {record.learning.ui?.length > 0 && (
                <LearningCategory title="UI/UX" items={record.learning.ui} />
              )}
            </div>
          </div>
        )}

        {/* Reflection */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-bold text-slate-200 mb-2">💭 Reflection</h3>
          {isEditing ? (
            <textarea
              value={editedReflection}
              onChange={(e) => setEditedReflection(e.target.value)}
              placeholder="Add your reflection for this day..."
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-none h-32"
            />
          ) : (
            <p className="text-slate-300 italic">
              {record.reflection ? `"${record.reflection}"` : 'No reflection added yet'}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-700">
          <MetaData label="Streak" value={`${record.streak} days`} />
          <MetaData label="Day Type" value={record.dayType} />
          <MetaData label="Queries" value={`${record.unresolvedQueries}/${record.totalQueries}`} />
          <MetaData label="Total Done" value={`${(record.tasksCompleted + record.habitsCompleted + (record.learningItemsCompleted || 0))}/${(record.totalTasks + record.totalHabits + (record.totalLearningItems || 0))}`} />
        </div>
      </motion.div>
    </motion.div>
  );
};

const DetailSection = ({ title, items }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-slate-200 mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
          item.done ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800/30 border border-slate-700'
        }`}>
          <span className="text-lg">{item.done ? '✅' : '⬜'}</span>
          <div className="flex-1">
            <p className={`text-sm ${item.done ? 'text-slate-200' : 'text-slate-400'}`}>
              {item.task || item.time}
            </p>
            {item.time && <p className="text-xs text-slate-500 mt-1">{item.time}</p>}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const LearningCategory = ({ title, items }) => (
  <div className="bg-slate-800/30 rounded-lg p-3">
    <h4 className="text-sm font-semibold text-slate-300 mb-2">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`text-xs px-2 py-1 rounded ${
          item.done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-400'
        }`}>
          {item.topic || item.name}
        </span>
      ))}
    </div>
  </div>
);

const MetaData = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-200">{value}</p>
  </div>
);

export default HistoricalReview;
