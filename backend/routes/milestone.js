import express from 'express';
import Milestone from '../models/Milestone.js';

const router = express.Router();

// GET all milestones
router.get('/', async (req, res) => {
  try {
    const { userId = 'default-user' } = req.query;
    const milestones = await Milestone.find({ userId }).sort({ dateAdded: -1 });
    res.json({ success: true, data: milestones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single milestone
router.get('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    res.json({ success: true, data: milestone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new milestone
router.post('/', async (req, res) => {
  try {
    const { text, confidence, date, userId = 'default-user' } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Achievement text is required' });
    }
    
    if (!confidence || confidence < 1 || confidence > 10) {
      return res.status(400).json({ success: false, message: 'Confidence level must be between 1 and 10' });
    }
    
    const milestone = new Milestone({
      text: text.trim(),
      confidence: Number(confidence),
      date: date || new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }),
      userId
    });
    
    await milestone.save();
    res.status(201).json({ success: true, data: milestone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update milestone
router.put('/:id', async (req, res) => {
  try {
    const { text, confidence, date } = req.body;
    
    const updateData = {};
    if (text !== undefined) updateData.text = text.trim();
    if (confidence !== undefined) {
      if (confidence < 1 || confidence > 10) {
        return res.status(400).json({ success: false, message: 'Confidence level must be between 1 and 10' });
      }
      updateData.confidence = Number(confidence);
    }
    if (date !== undefined) updateData.date = date;
    
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    res.json({ success: true, data: milestone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE milestone
router.delete('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }
    
    res.json({ success: true, message: 'Milestone deleted successfully' });
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
    
    const milestoneEntries = entries.map(entry => ({
      text: entry.text,
      confidence: Number(entry.confidence),
      date: entry.date,
      dateAdded: entry.dateAdded || new Date(),
      userId
    })).filter(entry => entry.text && entry.confidence);
    
    const result = await Milestone.insertMany(milestoneEntries, { ordered: false });
    res.status(201).json({ success: true, data: result, count: result.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
