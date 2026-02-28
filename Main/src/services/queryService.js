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

// Query API methods
export const queryAPI = {
  // Get all queries
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams({ userId: USER_ID });
      if (filters.search) params.append('search', filters.search);
      if (filters.resolved !== undefined) params.append('resolved', filters.resolved);
      
      const response = await fetch(`${API_BASE_URL}/queries?${params}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch queries');
      return data.data;
    } catch (error) {
      console.error('API Error (getAll):', error);
      throw error;
    }
  },

  // Get single query
  async getOne(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries/${id}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch query');
      return data.data;
    } catch (error) {
      console.error('API Error (getOne):', error);
      throw error;
    }
  },

  // Create new query
  async create(queryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...queryData, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to create query');
      return data.data;
    } catch (error) {
      console.error('API Error (create):', error);
      throw error;
    }
  },

  // Update query
  async update(id, queryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryData)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to update query');
      return data.data;
    } catch (error) {
      console.error('API Error (update):', error);
      throw error;
    }
  },

  // Delete query
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to delete query');
      return data;
    } catch (error) {
      console.error('API Error (delete):', error);
      throw error;
    }
  },

  // Bulk import queries
  async bulkImport(entries) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to import queries');
      return data;
    } catch (error) {
      console.error('API Error (bulkImport):', error);
      throw error;
    }
  }
};

// Sync localStorage queries to MongoDB
export const syncQueriesToMongoDB = async (queries) => {
  try {
    if (!queries || queries.length === 0) {
      return { synced: false, message: 'No queries to sync' };
    }

    const result = await queryAPI.bulkImport(queries);
    return { synced: true, count: result.count };
  } catch (error) {
    console.error('Sync Error:', error);
    return { synced: false, error: error.message };
  }
};
