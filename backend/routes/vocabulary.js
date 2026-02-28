import express from 'express';
import Vocabulary from '../models/Vocabulary.js';

const router = express.Router();

// GET all vocabulary entries (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search, userId = 'default-user' } = req.query;
    
    let query = { userId };
    
    if (search) {
      query.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } },
        { example: { $regex: search, $options: 'i' } }
      ];
    }
    
    const vocabulary = await Vocabulary.find(query).sort({ dateAdded: -1 });
    res.json({ success: true, data: vocabulary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single vocabulary entry
router.get('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id);
    if (!vocabulary) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    res.json({ success: true, data: vocabulary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new vocabulary entry
router.post('/', async (req, res) => {
  try {
    const { word, meaning, example, userId = 'default-user' } = req.body;
    
    if (!word || !word.trim()) {
      return res.status(400).json({ success: false, message: 'Word is required' });
    }
    
    const vocabulary = new Vocabulary({
      word: word.trim(),
      meaning: meaning?.trim() || '',
      example: example?.trim() || '',
      userId
    });
    
    await vocabulary.save();
    res.status(201).json({ success: true, data: vocabulary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update vocabulary entry
router.put('/:id', async (req, res) => {
  try {
    const { word, meaning, example } = req.body;
    
    if (!word || !word.trim()) {
      return res.status(400).json({ success: false, message: 'Word is required' });
    }
    
    const vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      {
        word: word.trim(),
        meaning: meaning?.trim() || '',
        example: example?.trim() || ''
      },
      { new: true, runValidators: true }
    );
    
    if (!vocabulary) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    res.json({ success: true, data: vocabulary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE vocabulary entry
router.delete('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);
    
    if (!vocabulary) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    res.json({ success: true, message: 'Entry deleted successfully' });
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
    
    const vocabularyEntries = entries.map(entry => ({
      word: entry.word?.trim() || '',
      meaning: entry.meaning?.trim() || '',
      example: entry.example?.trim() || '',
      dateAdded: entry.dateAdded || new Date(),
      userId
    })).filter(entry => entry.word);
    
    const result = await Vocabulary.insertMany(vocabularyEntries, { ordered: false });
    res.status(201).json({ success: true, data: result, count: result.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
