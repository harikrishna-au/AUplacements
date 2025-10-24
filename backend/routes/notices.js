const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { authenticate } = require('../middleware/auth');

// Get all active notices
router.get('/', authenticate, async (req, res) => {
  try {
    const now = new Date();
    
    const notices = await Notice.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    })
    .sort({ priority: -1, createdAt: -1 })
    .limit(10);
    
    res.json({ success: true, data: notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new notice (admin only - for now anyone can create for testing)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, message, type, priority, expiresAt } = req.body;
    
    const notice = new Notice({
      title,
      message,
      type: type || 'info',
      priority: priority || 0,
      expiresAt: expiresAt || null,
      createdBy: req.user.name || 'Admin'
    });
    
    await notice.save();
    
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a notice
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Notice.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
