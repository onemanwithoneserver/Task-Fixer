import express from 'express';
import MoneyTracker from '../models/MoneyTracker.js';

const router = express.Router();

// GET all money tracker entries
router.get('/', async (req, res) => {
  try {
    const { search, userId = 'default-user' } = req.query;
    
    let query = { userId };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const entries = await MoneyTracker.find(query).sort({ dateAdded: -1 });
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await MoneyTracker.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new entry
router.post('/', async (req, res) => {
  try {
    const { name, amount, date, gateway, userId = 'default-user' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Lender name is required' });
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }
    
    const entry = new MoneyTracker({
      name: name.trim(),
      amount: parsedAmount,
      date: date || new Date().toISOString().split("T")[0],
      gateway: gateway || 'UPI / GPay',
      originalAmount: parsedAmount,
      remainingAmount: parsedAmount,
      payments: [],
      userId
    });
    
    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update entry
router.put('/:id', async (req, res) => {
  try {
    const { name, amount, date, gateway, remainingAmount } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid amount is required' });
      }
      updateData.amount = parsedAmount;
      updateData.originalAmount = parsedAmount;
    }
    if (date !== undefined) updateData.date = date;
    if (gateway !== undefined) updateData.gateway = gateway;
    if (remainingAmount !== undefined) updateData.remainingAmount = remainingAmount;
    
    const entry = await MoneyTracker.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST payment for an entry
router.post('/:id/payment', async (req, res) => {
  try {
    const { amount, date } = req.body;
    
    const payment = parseFloat(amount);
    if (isNaN(payment) || payment <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }
    
    const entry = await MoneyTracker.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    if (payment > entry.remainingAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Payment amount cannot exceed remaining balance of ₹${entry.remainingAmount}` 
      });
    }
    
    entry.remainingAmount = Math.max(0, entry.remainingAmount - payment);
    entry.payments.push({
      date: date || new Date().toLocaleDateString(),
      amount: payment
    });
    
    await entry.save();
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await MoneyTracker.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    res.json({ success: true, message: 'Entry deleted successfully' });
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
    
    const moneyEntries = entries.map(entry => {
      const parsedAmount = parseFloat(entry.amount || entry.originalAmount);
      const parsedRemaining = parseFloat(entry.remainingAmount);
      
      return {
        name: entry.name,
        amount: parsedAmount,
        date: entry.date,
        gateway: entry.gateway || 'UPI / GPay',
        originalAmount: parsedAmount,
        remainingAmount: isNaN(parsedRemaining) ? parsedAmount : parsedRemaining,
        payments: entry.payments || [],
        dateAdded: entry.dateAdded || new Date(),
        userId
      };
    }).filter(entry => entry.name && !isNaN(entry.amount));
    
    const result = await MoneyTracker.insertMany(moneyEntries, { ordered: false });
    res.status(201).json({ success: true, data: result, count: result.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
