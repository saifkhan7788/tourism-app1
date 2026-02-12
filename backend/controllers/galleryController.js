const Gallery = require('../models/Gallery');

exports.createGallery = async (req, res) => {
  try {
    const galleryId = await Gallery.create(req.body);
    res.status(201).json({ success: true, message: 'Gallery image added successfully', galleryId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllGallery = async (req, res) => {
  try {
    const images = await Gallery.getAll();
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateGallery = async (req, res) => {
  try {
    const affectedRows = await Gallery.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }
    res.json({ success: true, message: 'Gallery image updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const affectedRows = await Gallery.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Gallery image not found' });
    }
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
