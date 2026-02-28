
const DB_NAME = 'LakshyaTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'dailyRecords';
const BACKUP_KEY = 'lakshya_backup';

class StorageService {
  constructor() {
    this.db = null;
    this.useIndexedDB = typeof indexedDB !== 'undefined';
  }

  // Initialize IndexedDB
  async init() {
    if (!this.useIndexedDB) {
      console.warn('IndexedDB not available, using localStorage fallback');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        this.useIndexedDB = false;
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create daily records store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          objectStore.createIndex('date', 'date', { unique: true });
          objectStore.createIndex('cycleDay', 'cycleDay', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Save daily record
  async saveDailyRecord(record) {
    const recordWithTimestamp = {
      ...record,
      timestamp: Date.now(),
      date: this.getDateKey(new Date()),
    };

    if (this.useIndexedDB && this.db) {
      return this.saveToIndexedDB(recordWithTimestamp);
    } else {
      return this.saveToLocalStorage(recordWithTimestamp);
    }
  }

  // Save to IndexedDB
  async saveToIndexedDB(record) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      
      // Check if record for this date exists
      const index = objectStore.index('date');
      const getRequest = index.get(record.date);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          // Update existing record
          const updateRequest = objectStore.put({ ...record, id: getRequest.result.id });
          updateRequest.onsuccess = () => resolve(updateRequest.result);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          // Add new record
          const addRequest = objectStore.add(record);
          addRequest.onsuccess = () => resolve(addRequest.result);
          addRequest.onerror = () => reject(addRequest.error);
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Save to localStorage (fallback)
  saveToLocalStorage(record) {
    try {
      const records = this.getAllRecordsFromLocalStorage();
      const existingIndex = records.findIndex(r => r.date === record.date);

      if (existingIndex >= 0) {
        records[existingIndex] = { ...records[existingIndex], ...record };
      } else {
        records.push(record);
      }

      localStorage.setItem(STORE_NAME, JSON.stringify(records));
      this.createBackup(records);
      return Promise.resolve(record.date);
    } catch (error) {
      console.error('LocalStorage save error:', error);
      return Promise.reject(error);
    }
  }

  // Get all daily records
  async getAllRecords() {
    if (this.useIndexedDB && this.db) {
      return this.getAllFromIndexedDB();
    } else {
      return Promise.resolve(this.getAllRecordsFromLocalStorage());
    }
  }

  // Get all from IndexedDB
  async getAllFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all from localStorage
  getAllRecordsFromLocalStorage() {
    try {
      const data = localStorage.getItem(STORE_NAME);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('LocalStorage read error:', error);
      return [];
    }
  }

  // Get record by date
  async getRecordByDate(date) {
    const dateKey = typeof date === 'string' ? date : this.getDateKey(date);
    
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('date');
        const request = index.get(dateKey);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } else {
      const records = this.getAllRecordsFromLocalStorage();
      return Promise.resolve(records.find(r => r.date === dateKey) || null);
    }
  }

  // Delete record by date
  async deleteRecord(date) {
    const dateKey = typeof date === 'string' ? date : this.getDateKey(date);
    
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const index = objectStore.index('date');
        
        // First get the record to find its key
        const getRequest = index.getKey(dateKey);
        
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            const deleteRequest = objectStore.delete(getRequest.result);
            deleteRequest.onsuccess = () => resolve(true);
            deleteRequest.onerror = () => reject(deleteRequest.error);
          } else {
            resolve(false); // Record not found
          }
        };
        
        getRequest.onerror = () => reject(getRequest.error);
      });
    } else {
      try {
        const records = this.getAllRecordsFromLocalStorage();
        const filteredRecords = records.filter(r => r.date !== dateKey);
        
        if (records.length === filteredRecords.length) {
          return Promise.resolve(false); // Record not found
        }
        
        localStorage.setItem(STORE_NAME, JSON.stringify(filteredRecords));
        this.createBackup(filteredRecords);
        return Promise.resolve(true);
      } catch (error) {
        console.error('LocalStorage delete error:', error);
        return Promise.reject(error);
      }
    }
  }

  // Get records in date range
  async getRecordsByDateRange(startDate, endDate) {
    const allRecords = await this.getAllRecords();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return allRecords.filter(record => {
      const recordTime = new Date(record.date).getTime();
      return recordTime >= start && recordTime <= end;
    });
  }

  // Create backup
  createBackup(records) {
    try {
      const backup = {
        version: DB_VERSION,
        timestamp: Date.now(),
        records: records || this.getAllRecordsFromLocalStorage(),
      };
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Backup creation error:', error);
    }
  }

  // Restore from backup
  async restoreFromBackup() {
    try {
      const backupData = localStorage.getItem(BACKUP_KEY);
      if (!backupData) return null;

      const backup = JSON.parse(backupData);
      
      // Restore to current storage
      for (const record of backup.records) {
        await this.saveDailyRecord(record);
      }

      return backup.records.length;
    } catch (error) {
      console.error('Backup restoration error:', error);
      return null;
    }
  }

  // Export data (for multi-device sync preparation)
  async exportData() {
    const records = await this.getAllRecords();
    return {
      version: DB_VERSION,
      timestamp: Date.now(),
      recordCount: records.length,
      data: records,
    };
  }

  // Import data (for multi-device sync)
  async importData(exportedData) {
    if (!exportedData || !exportedData.data) {
      throw new Error('Invalid import data');
    }

    let imported = 0;
    for (const record of exportedData.data) {
      try {
        await this.saveDailyRecord(record);
        imported++;
      } catch (error) {
        console.error('Error importing record:', error);
      }
    }

    return imported;
  }

  // Helper: Get date key (YYYY-MM-DD)
  getDateKey(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // Clear all data (use with caution)
  async clearAllData() {
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      localStorage.removeItem(STORE_NAME);
      return Promise.resolve();
    }
  }
}

// Create singleton instance
const storageService = new StorageService();

export default storageService;
