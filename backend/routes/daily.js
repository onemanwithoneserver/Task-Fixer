import express from "express";
import DailyRecord from "../models/DailyRecord.js";

const router = express.Router();

/* Get today's record */
router.get("/today", async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];

    const record = await DailyRecord.findOne({ date });

    if (!record) {
      return res.json(null);
    }

    res.json(record);
  } catch (error) {
    console.error("Error fetching today's record:", error);
    res.status(500).json({ error: error.message });
  }
});

/* Get all records (for history/analytics) */
router.get("/all", async (req, res) => {
  try {
    const records = await DailyRecord.find()
      .sort({ date: -1 })
      .limit(100);

    res.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: error.message });
  }
});

/* Get specific date record */
router.get("/:date", async (req, res) => {
  try {
    const record = await DailyRecord.findOne({ date: req.params.date });

    res.json(record);
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ error: error.message });
  }
});

/* Submit day (create or update + mark as submitted) */
router.post("/submit", async (req, res) => {
  try {
    const data = req.body;

    // Check if already submitted
    let record = await DailyRecord.findOne({ date: data.date });

    if (record?.submitted) {
      return res.status(400).json({ 
        error: "Already submitted",
        message: "This day has already been submitted" 
      });
    }

    // Create or update with submitted flag
    record = await DailyRecord.findOneAndUpdate(
      { date: data.date },
      { ...data, submitted: true },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    console.error("Error submitting day:", error);
    res.status(500).json({ error: error.message });
  }
});

/* Update day data (without submitting) */
router.put("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const updateData = req.body;

    // Check if day is already submitted
    const existing = await DailyRecord.findOne({ date });
    
    if (existing?.submitted) {
      return res.status(400).json({ 
        error: "Day already submitted",
        message: "Cannot update a submitted day" 
      });
    }

    const record = await DailyRecord.findOneAndUpdate(
      { date },
      updateData,
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    console.error("Error updating day:", error);
    res.status(500).json({ error: error.message });
  }
});

/* Auto-save progress (draft save without submitting) */
router.post("/autosave", async (req, res) => {
  try {
    const data = req.body;

    const record = await DailyRecord.findOneAndUpdate(
      { date: data.date },
      { ...data, submitted: false },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    console.error("Error auto-saving:", error);
    res.status(500).json({ error: error.message });
  }
});

/* Delete record (admin/debugging) */
router.delete("/:date", async (req, res) => {
  try {
    const { date } = req.params;

    await DailyRecord.findOneAndDelete({ date });

    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
