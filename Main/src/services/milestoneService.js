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

// Milestone API methods
export const milestoneAPI = {
  // Get all milestones
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones?userId=${USER_ID}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch milestones');
      return data.data;
    } catch (error) {
      console.error('API Error (getAll):', error);
      throw error;
    }
  },

  // Get single milestone
  async getOne(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones/${id}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch milestone');
      return data.data;
    } catch (error) {
      console.error('API Error (getOne):', error);
      throw error;
    }
  },

  // Create new milestone
  async create(milestoneData) {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...milestoneData, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to create milestone');
      return data.data;
    } catch (error) {
      console.error('API Error (create):', error);
      throw error;
    }
  },

  // Update milestone
  async update(id, milestoneData) {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestoneData)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to update milestone');
      return data.data;
    } catch (error) {
      console.error('API Error (update):', error);
      throw error;
    }
  },

  // Delete milestone
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to delete milestone');
      return data;
    } catch (error) {
      console.error('API Error (delete):', error);
      throw error;
    }
  },

  // Bulk import milestones
  async bulkImport(entries) {
    try {
      const response = await fetch(`${API_BASE_URL}/milestones/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to import milestones');
      return data;
    } catch (error) {
      console.error('API Error (bulkImport):', error);
      throw error;
    }
  }
};

// Sync localStorage milestones to MongoDB
export const syncMilestonesToMongoDB = async (milestones) => {
  try {
    if (!milestones || milestones.length === 0) {
      return { synced: false, message: 'No milestones to sync' };
    }

    const result = await milestoneAPI.bulkImport(milestones);
    return { synced: true, count: result.count };
  } catch (error) {
    console.error('Sync Error:', error);
    return { synced: false, error: error.message };
  }
};
