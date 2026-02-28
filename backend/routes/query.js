import express from 'express';
import Query from '../models/Query.js';

const router = express.Router();

// GET all queries
router.get('/', async (req, res) => {
  try {
    const { search, resolved, userId = 'default-user' } = req.query;
    
    let query = { userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }
    
    const queries = await Query.find(query).sort({ dateAdded: -1 });
    res.json({ success: true, data: queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single query
router.get('/:id', async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    res.json({ success: true, data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new query
router.post('/', async (req, res) => {
  try {
    const { title, desc, date, userId = 'default-user' } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    const query = new Query({
      title: title.trim(),
      desc: desc?.trim() || '',
      date: date || new Date().toLocaleDateString(),
      userId
    });
    
    await query.save();
    res.status(201).json({ success: true, data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update query
router.put('/:id', async (req, res) => {
  try {
    const { title, desc, resolved } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (desc !== undefined) updateData.desc = desc.trim();
    if (resolved !== undefined) updateData.resolved = resolved;
    
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    
    res.json({ success: true, data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE query
router.delete('/:id', async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    
    res.json({ success: true, message: 'Query deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST bulk import
router.post('/bulk', async (req, res) => {
  try {
    const { entries, userId = 'default-user' } = req.body;
    
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, message: 'Entries array is required' });
    }
    
    const queryEntries = entries.map(entry => ({
      title: entry.title,
      desc: entry.desc || '',
      date: entry.date,
      dateAdded: entry.dateAdded || new Date(),
      userId
    })).filter(entry => entry.title);
    
    const result = await Query.insertMany(queryEntries, { ordered: false });
    res.status(201).json({ success: true, data: result, count: result.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
