const Tour = require('../models/Tour');

exports.getAllTours = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const result = await Tour.getAll(page, limit, search);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.getById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tourId = await Tour.create(req.body);
    res.status(201).json({ success: true, message: 'Tour created successfully', tourId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const affectedRows = await Tour.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.json({ success: true, message: 'Tour updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const affectedRows = await Tour.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.searchTours = async (req, res) => {
  try {
    const { keyword } = req.query;
    const tours = await Tour.search(keyword);
    res.json({ success: true, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
