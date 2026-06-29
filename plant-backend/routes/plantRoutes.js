const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');

// POST: Add a new plant to the database
router.post('/add', async (req, res) => {
  try {
    const { name, botanicalName, waterStatus, image } = req.body;

    const newPlant = new Plant({
      name,
      botanicalName,
      waterStatus,
      image
    });

    await newPlant.save();
    res.status(201).json({ success: true, message: 'New Plant Added Successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Fetch all plants from the database and send to frontend
router.get('/all', async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT: Update the water status of a plant by ID
router.put('/update-status/:id', async (req, res) => {
  try {
    const { waterStatus } = req.body;

    // Find the plant by ID and update only the waterStatus field
    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      { waterStatus: waterStatus },
      { new: true }
    );

    res.status(200).json({ success: true, plant: updatedPlant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE: Remove a plant permanently from the database by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Plant Deleted Successfully from Cloud!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;