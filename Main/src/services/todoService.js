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

// Todo API methods
export const todoAPI = {
  // Get all todos
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams({ userId: USER_ID });
      if (filters.search) params.append('search', filters.search);
      if (filters.completed !== undefined) params.append('completed', filters.completed);
      
      const response = await fetch(`${API_BASE_URL}/todos?${params}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch todos');
      return data.data;
    } catch (error) {
      console.error('API Error (getAll):', error);
      throw error;
    }
  },

  // Get single todo
  async getOne(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch todo');
      return data.data;
    } catch (error) {
      console.error('API Error (getOne):', error);
      throw error;
    }
  },

  // Create new todo
  async create(todoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todoData, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to create todo');
      return data.data;
    } catch (error) {
      console.error('API Error (create):', error);
      throw error;
    }
  },

  // Update todo
  async update(id, todoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to update todo');
      return data.data;
    } catch (error) {
      console.error('API Error (update):', error);
      throw error;
    }
  },

  // Delete todo
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to delete todo');
      return data;
    } catch (error) {
      console.error('API Error (delete):', error);
      throw error;
    }
  },

  // Bulk import todos
  async bulkImport(entries) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, userId: USER_ID })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to import todos');
      return data;
    } catch (error) {
      console.error('API Error (bulkImport):', error);
      throw error;
    }
  }
};

// Sync localStorage todos to MongoDB
export const syncLocalStorageToMongoDB = async () => {
  try {
    const localData = localStorage.getItem('todolist_v1');
    if (!localData) {
      return { synced: false, message: 'No local data to sync' };
    }

    const todos = JSON.parse(localData);
    if (todos.length === 0) {
      return { synced: false, message: 'No todos to sync' };
    }

    const result = await todoAPI.bulkImport(todos);
    return { synced: true, count: result.count };
  } catch (error) {
    console.error('Sync Error:', error);
    return { synced: false, error: error.message };
  }
};
