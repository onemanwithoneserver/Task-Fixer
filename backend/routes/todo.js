import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET all todos (with optional search and filter)
router.get('/', async (req, res) => {
  try {
    const { search, completed, userId = 'default-user' } = req.query;
    
    let query = { userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    
    const todos = await Todo.find(query).sort({ dateAdded: -1 });
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new todo
router.post('/', async (req, res) => {
  try {
    const { title, action, priority, userId = 'default-user' } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    const todo = new Todo({
      title: title.trim(),
      action: action?.trim() || '',
      priority: priority || 'medium',
      userId
    });
    
    await todo.save();
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update todo
router.put('/:id', async (req, res) => {
  try {
    const { title, action, completed, priority } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (action !== undefined) updateData.action = action.trim();
    if (completed !== undefined) {
      updateData.completed = completed;
      updateData.completedAt = completed ? new Date() : null;
    }
    if (priority !== undefined) updateData.priority = priority;
    
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST bulk import (for migrating from localStorage)
router.post('/bulk', async (req, res) => {
  try {
    const { entries, userId = 'default-user' } = req.body;
    
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, message: 'Entries array is required' });
    }
    
    const todoEntries = entries.map(entry => ({
      title: entry.text || entry.title || '',
      action: entry.action || '',
      completed: entry.completed || false,
      priority: entry.priority || 'medium',
      dateAdded: entry.dateAdded || new Date(),
      completedAt: entry.completedAt || (entry.completed ? new Date() : null),
      userId
    })).filter(entry => entry.title.trim());
    
    const result = await Todo.insertMany(todoEntries, { ordered: false });
    res.status(201).json({ success: true, data: result, count: result.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
