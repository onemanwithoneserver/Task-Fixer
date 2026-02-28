// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_ID = 'default-user';

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

// MoneyTracker API methods
export const moneyTrackerAPI = {
  // Get all entries
  async getAll(search = '') {
    try {
      const params = new URLSearchParams({ userId: USER_ID });
      if (search) params.append('search', search);
      
      const response = await fetch(`${API_BASE_URL}/money-tracker?${params}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch entries');
      return data.data;
    } catch (error) {
      console.error('API Error (getAll):', error);
      throw error;
    }
  },

  // Get single entry
  async getOne(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/money-tracker/${id}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch entry');
      return data.data;
    } catch (error) {
      console.error('API Error (getOne):', error);
      throw error;
    }
  },

  // Create new entry
  async create(entryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/money-tracker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entryData, userId: USER_ID })
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
  async update(id, entryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/money-tracker/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to update entry');
      return data.data;
    } catch (error) {
      console.error('API Error (update):', error);
      throw error;
    }
  },

  // Add payment to entry
  async addPayment(id, paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/money-tracker/${id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to add payment');
      return data.data;
    } catch (error) {
      console.error('API Error (addPayment):', error);
      throw error;
    }
  },

  // Delete entry
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/money-tracker/${id}`, {
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

  // Bulk import entries
  async bulkImport(entries) {
    try {
      const response = await fetch(`${API_BASE_URL}/money-tracker/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to import entries');
      return data;
    } catch (error) {
      console.error('API Error (bulkImport):', error);
      throw error;
    }
  }
};

// Sync localStorage entries to MongoDB
export const syncMoneyTrackerToMongoDB = async (entries) => {
  try {
    if (!entries || entries.length === 0) {
      return { synced: false, message: 'No entries to sync' };
    }

    const result = await moneyTrackerAPI.bulkImport(entries);
    return { synced: true, count: result.count };
  } catch (error) {
    console.error('Sync Error:', error);
    return { synced: false, error: error.message };
  }
};
