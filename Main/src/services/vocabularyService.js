// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_ID = 'default-user'; // Can be replaced with actual user authentication

// Check if backend is available
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Vocabulary API methods
export const vocabularyAPI = {
  // Get all entries
  async getAll(searchQuery = '') {
    try {
      const url = searchQuery 
        ? `${API_BASE_URL}/vocabulary?search=${encodeURIComponent(searchQuery)}&userId=${USER_ID}`
        : `${API_BASE_URL}/vocabulary?userId=${USER_ID}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch vocabulary');
      return data.data;
    } catch (error) {
      console.error('API Error (getAll):', error);
      throw error;
    }
  },

  // Get single entry
  async getOne(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/${id}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch entry');
      return data.data;
    } catch (error) {
      console.error('API Error (getOne):', error);
      throw error;
    }
  },

  // Create new entry
  async create(vocabularyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...vocabularyData, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to create entry');
      return data.data;
    } catch (error) {
      console.error('API Error (create):', error);
      throw error;
    }
  },

  // Update entry
  async update(id, vocabularyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vocabularyData)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to update entry');
      return data.data;
    } catch (error) {
      console.error('API Error (update):', error);
      throw error;
    }
  },

  // Delete entry
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to delete entry');
      return data;
    } catch (error) {
      console.error('API Error (delete):', error);
      throw error;
    }
  },

  // Bulk import (for migrating from localStorage)
  async bulkImport(entries) {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to import entries');
      return data.data;
    } catch (error) {
      console.error('API Error (bulkImport):', error);
      throw error;
    }
  }
};

// Helper function to sync localStorage to MongoDB
export const syncLocalStorageToMongoDB = async () => {
  try {
    const savedVault = localStorage.getItem('vocabulary_vault');
    if (!savedVault) return { synced: false, message: 'No local data to sync' };
    
    const localData = JSON.parse(savedVault);
    if (localData.length === 0) return { synced: false, message: 'No entries to sync' };
    
    // Check if backend is available
    const isBackendAvailable = await checkBackendConnection();
    if (!isBackendAvailable) {
      return { synced: false, message: 'Backend not available' };
    }
    
    // Import to MongoDB
    await vocabularyAPI.bulkImport(localData);
    
    return { synced: true, message: `Synced ${localData.length} entries to MongoDB` };
  } catch (error) {
    console.error('Sync Error:', error);
    return { synced: false, message: error.message };
  }
};
