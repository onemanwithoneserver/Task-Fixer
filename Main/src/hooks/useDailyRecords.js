// Daily Record Management Hook
// Handles submission, retrieval, and management of daily records

import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

export function useDailyRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize storage service
  useEffect(() => {
    const init = async () => {
      try {
        await storageService.init();
        setInitialized(true);
        await loadRecords();
      } catch (err) {
        console.error('Failed to initialize storage:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    init();
  }, []);

  // Load all records
  const loadRecords = async () => {
    try {
      setLoading(true);
      const allRecords = await storageService.getAllRecords();
      setRecords(allRecords.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setError(null);
    } catch (err) {
      console.error('Failed to load records:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit daily record
  const submitDailyRecord = async (state) => {
    try {
      const record = {
        date: storageService.getDateKey(new Date()),
        cycleDay: state.cycleDay || 1,
        
        // Tasks
        totalTasks: state.planner?.length || 0,
        tasksCompleted: state.planner?.filter(t => t.done).length || 0,
        tasks: state.planner || [],
        
        // Habits
        totalHabits: state.communication?.habits?.length || 0,
        habitsCompleted: state.communication?.habits?.filter(h => h.done).length || 0,
        habits: state.communication?.habits || [],
        
        // Learning - Count all topics and subtopics
        totalLearningItems: (() => {
          let total = 0;
          ['mern', 'dsa', 'ui'].forEach(key => {
            const items = state.engineering?.[key] || [];
            items.forEach(item => {
              total += 1; // Count the main topic
              if (item.subtopics?.length) {
                total += item.subtopics.length; // Count all subtopics
              }
            });
          });
          return total;
        })(),
        learningItemsCompleted: (() => {
          let completed = 0;
          ['mern', 'dsa', 'ui'].forEach(key => {
            const items = state.engineering?.[key] || [];
            items.forEach(item => {
              if (item.done) completed += 1; // Count completed main topic
              if (item.subtopics?.length) {
                completed += item.subtopics.filter(st => st.done).length; // Count completed subtopics
              }
            });
          });
          return completed;
        })(),
        learning: {
          mern: state.engineering?.mern || [],
          dsa: state.engineering?.dsa || [],
          ui: state.engineering?.ui || [],
        },
        
        // Queries/Knowledge
        unresolvedQueries: state.queries?.filter(q => !q.resolved).length || 0,
        totalQueries: state.queries?.length || 0,
        queries: state.queries || [],
        
        // Milestones
        milestones: state.milestones || [],
        
        // Metadata
        streak: state.streak || 0,
        dayType: state.dayType || 'weekday',
        missedDays: 0, // Can be updated later if tracking missed days
        
        // Placeholder for reflection (to be added by user)
        reflection: '',
        
        // Completion scores
        taskCompletionRate: state.planner?.length ? 
          (state.planner.filter(t => t.done).length / state.planner.length) : 0,
        habitCompletionRate: state.communication?.habits?.length ?
          (state.communication.habits.filter(h => h.done).length / state.communication.habits.length) : 0,
      };

      await storageService.saveDailyRecord(record);
      await loadRecords(); // Reload to get updated list
      
      return { success: true, record };
    } catch (err) {
      console.error('Failed to submit daily record:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Update existing record (e.g., add reflection)
  const updateRecord = async (date, updates) => {
    try {
      const existingRecord = await storageService.getRecordByDate(date);
      if (!existingRecord) {
        throw new Error('Record not found');
      }

      const updatedRecord = { ...existingRecord, ...updates, timestamp: Date.now() };
      await storageService.saveDailyRecord(updatedRecord);
      await loadRecords();
      
      return { success: true, record: updatedRecord };
    } catch (err) {
      console.error('Failed to update record:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Get today's record
  const getTodayRecord = async () => {
    try {
      const today = storageService.getDateKey(new Date());
      return await storageService.getRecordByDate(today);
    } catch (err) {
      console.error('Failed to get today record:', err);
      return null;
    }
  };

  // Get records for date range
  const getRecordsInRange = async (startDate, endDate) => {
    try {
      return await storageService.getRecordsByDateRange(startDate, endDate);
    } catch (err) {
      console.error('Failed to get records in range:', err);
      return [];
    }
  };

  // Delete record
  const deleteRecord = async (date) => {
    try {
      const deleted = await storageService.deleteRecord(date);
      if (deleted) {
        await loadRecords();
        return { success: true };
      }
      return { success: false, error: 'Record not found' };
    } catch (err) {
      console.error('Failed to delete record:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Export all data
  const exportAllData = async () => {
    try {
      return await storageService.exportData();
    } catch (err) {
      console.error('Failed to export data:', err);
      throw err;
    }
  };

  // Import data
  const importData = async (data) => {
    try {
      const count = await storageService.importData(data);
      await loadRecords();
      return { success: true, count };
    } catch (err) {
      console.error('Failed to import data:', err);
      return { success: false, error: err.message };
    }
  };

  // Create backup
  const createBackup = () => {
    try {
      storageService.createBackup(records);
      return { success: true };
    } catch (err) {
      console.error('Failed to create backup:', err);
      return { success: false, error: err.message };
    }
  };

  // Restore from backup
  const restoreBackup = async () => {
    try {
      const count = await storageService.restoreFromBackup();
      if (count === null) {
        return { success: false, error: 'No backup found' };
      }
      await loadRecords();
      return { success: true, count };
    } catch (err) {
      console.error('Failed to restore backup:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    records,
    loading,
    error,
    initialized,
    submitDailyRecord,
    updateRecord,
    deleteRecord,
    getTodayRecord,
    getRecordsInRange,
    loadRecords,
    exportAllData,
    importData,
    createBackup,
    restoreBackup,
  };
}
