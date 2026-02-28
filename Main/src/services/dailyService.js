import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = `${API_BASE_URL}/daily`;

/**
 * Get today's daily record from MongoDB
 */
export const getToday = async () => {
  try {
    const response = await axios.get(`${API}/today`);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's record:", error);
    throw error;
  }
};

/**
 * Get all daily records (for analytics/history)
 */
export const getAllRecords = async () => {
  try {
    const response = await axios.get(`${API}/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all records:", error);
    throw error;
  }
};

/**
 * Get specific date record
 */
export const getRecordByDate = async (date) => {
  try {
    const response = await axios.get(`${API}/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching record for ${date}:`, error);
    throw error;
  }
};

/**
 * Submit day with all data (marks as submitted)
 */
export const submitDay = async (data) => {
  try {
    const response = await axios.post(`${API}/submit`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting day:", error);
    throw error;
  }
};

/**
 * Update day data without submitting
 */
export const updateDay = async (date, data) => {
  try {
    const response = await axios.put(`${API}/${date}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating day:", error);
    throw error;
  }
};

/**
 * Auto-save progress without submitting
 */
export const autoSaveDay = async (data) => {
  try {
    const response = await axios.post(`${API}/autosave`, data);
    return response.data;
  } catch (error) {
    console.error("Error auto-saving:", error);
    throw error;
  }
};

/**
 * Delete a record (admin/debugging)
 */
export const deleteRecord = async (date) => {
  try {
    const response = await axios.delete(`${API}/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

export default {
  getToday,
  getAllRecords,
  getRecordByDate,
  submitDay,
  updateDay,
  autoSaveDay,
  deleteRecord,
};
