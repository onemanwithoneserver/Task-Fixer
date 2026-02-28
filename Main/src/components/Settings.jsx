import React, { useState } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Settings() {
  const [notifications, setNotifications] = useState(
    localStorage.getItem('notifications') !== 'false'
  );
  const [autoSave, setAutoSave] = useState(
    localStorage.getItem('autoSave') !== 'false'
  );
  const [cycleLength, setCycleLength] = useState(
    parseInt(localStorage.getItem('cycleLength') || '31')
  );

  const handleNotificationsChange = (value) => {
    setNotifications(value);
    localStorage.setItem('notifications', value.toString());
  };

  const handleAutoSaveChange = (value) => {
    setAutoSave(value);
    localStorage.setItem('autoSave', value.toString());
  };

  const handleCycleLengthChange = (value) => {
    const length = parseInt(value) || 31;
    setCycleLength(length);
    localStorage.setItem('cycleLength', length.toString());
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      if (window.indexedDB) {
        window.indexedDB.databases().then((databases) => {
          databases.forEach((db) => {
            if (db.name === 'LakshyaTrackerDB') {
              window.indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }
      window.location.reload();
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            ⚙️ Settings
          </h1>
          <p className="text-slate-400 text-lg">
            Customize your LakshyaTracker experience
          </p>
        </motion.div>

        {/* General Settings */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
            <span className="text-3xl">🎛️</span>
            General
          </h2>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Notifications</h3>
                <p className="text-sm text-slate-400">
                  Enable browser notifications for reminders
                </p>
              </div>
              <button
                onClick={() => handleNotificationsChange(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <motion.div
                  animate={{ x: notifications ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Auto Save</h3>
                <p className="text-sm text-slate-400">
                  Automatically save your progress
                </p>
              </div>
              <button
                onClick={() => handleAutoSaveChange(!autoSave)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  autoSave ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <motion.div
                  animate={{ x: autoSave ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            {/* Cycle Length */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Cycle Length</h3>
                <p className="text-sm text-slate-400">
                  Number of days in each growth cycle
                </p>
              </div>
              <input
                type="number"
                min="1"
                max="365"
                value={cycleLength}
                onChange={(e) => handleCycleLengthChange(e.target.value)}
                className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
            <span className="text-3xl">💾</span>
            Data Management
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Export Data</h3>
              <p className="text-sm text-slate-400 mb-4">
                Download all your data as a JSON file for backup or transfer
              </p>
              <button
                onClick={() => {
                  // This will be implemented by the storage service
                  const data = {
                    settings: {
                      notifications,
                      autoSave,
                      cycleLength,
                    },
                    exportDate: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `lakshya-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Export Data
              </button>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Import Data</h3>
              <p className="text-sm text-slate-400 mb-4">
                Restore your data from a backup file
              </p>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const data = JSON.parse(event.target.result);
                        if (data.settings) {
                          if (data.settings.notifications !== undefined) {
                            handleNotificationsChange(data.settings.notifications);
                          }
                          if (data.settings.autoSave !== undefined) {
                            handleAutoSaveChange(data.settings.autoSave);
                          }
                          if (data.settings.cycleLength !== undefined) {
                            handleCycleLengthChange(data.settings.cycleLength);
                          }
                        }
                        alert('Settings imported successfully!');
                      } catch (error) {
                        alert('Error importing data. Please check the file format.');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          variants={itemVariants}
          className="bg-red-900/10 border border-red-900/50 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            Danger Zone
          </h2>

          <div className="p-4 bg-slate-900/50 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Clear All Data</h3>
            <p className="text-sm text-slate-400 mb-4">
              Permanently delete all your data including settings, records, and progress. This action cannot be undone.
            </p>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center gap-3">
            <span className="text-3xl">ℹ️</span>
            About
          </h2>
          <div className="space-y-2 text-slate-400">
            <p className="text-lg font-semibold text-slate-200">LakshyaTracker</p>
            <p className="text-sm">Your 31-Day Growth System</p>
            <p className="text-sm">Version 1.0.0</p>
            <p className="text-xs mt-4">
              Track your daily activities, learning, habits, and productivity with compound growth calculations.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
