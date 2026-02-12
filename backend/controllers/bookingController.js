const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const { sendBookingConfirmation, sendAdminNotification, sendStatusUpdateEmail } = require('../utils/emailService');

exports.createBooking = async (req, res) => {
  try {
    const bookingId = await Booking.create(req.body);
    
    // Get tour details for email
    const tour = await Tour.getById(req.body.tour_id);
    
    // Send emails
    try {
      await sendBookingConfirmation({
        customer_name: req.body.customer_name,
        customer_email: req.body.customer_email,
        tour_title: tour.title,
        booking_date: req.body.booking_date,
        number_of_people: req.body.number_of_people,
        total_price: req.body.total_price
      });
      
      await sendAdminNotification({
        customer_name: req.body.customer_name,
        customer_email: req.body.customer_email,
        customer_phone: req.body.customer_phone,
        tour_title: tour.title,
        booking_date: req.body.booking_date,
        number_of_people: req.body.number_of_people,
        total_price: req.body.total_price,
        special_requests: req.body.special_requests
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.status(201).json({ success: true, message: 'Booking created successfully', bookingId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const result = await Booking.getAll(page, limit, search);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.getById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const affectedRows = await Booking.updateStatus(req.params.id, status);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Get booking and tour details for email
    const booking = await Booking.getById(req.params.id);
    const tour = await Tour.getById(booking.tour_id);
    
    // Send status update email
    try {
      await sendStatusUpdateEmail({
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        tour_title: tour.title,
        booking_date: booking.booking_date,
        number_of_people: booking.number_of_people,
        total_price: booking.total_price
      }, status, remarks);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.json({ success: true, message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const bookings = await Booking.getByEmail(req.params.email);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const affectedRows = await Booking.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
