const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  try {
    const id = await Announcement.create(req.body);
    res.status(201).json({ success: true, message: 'Announcement created successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getActiveAnnouncement = async (req, res) => {
  try {
    const announcements = await Announcement.getActive();
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.getAll();
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const affectedRows = await Announcement.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const affectedRows = await Announcement.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
