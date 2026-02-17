import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import { sendBookingConfirmation, sendAdminNotification, sendStatusUpdateEmail } from '../utils/emailService.js';

const createBooking = async (req, res) => {
  try {
    const bookingId = await Booking.create(req.body);
    
    // Send response immediately
    res.status(201).json({ success: true, message: 'Booking created successfully', bookingId });
    
    // Send emails asynchronously (don't block response)
    Tour.getById(req.body.tour_id).then(tour => {
      sendBookingConfirmation({
        customer_name: req.body.customer_name,
        customer_email: req.body.customer_email,
        tour_title: tour.title,
        booking_date: req.body.booking_date,
        number_of_people: req.body.number_of_people,
        total_price: req.body.total_price
      }).catch(err => console.error('Email error:', err));
      
      sendAdminNotification({
        customer_name: req.body.customer_name,
        customer_email: req.body.customer_email,
        customer_phone: req.body.customer_phone,
        tour_title: tour.title,
        booking_date: req.body.booking_date,
        number_of_people: req.body.number_of_people,
        total_price: req.body.total_price,
        special_requests: req.body.special_requests
      }).catch(err => console.error('Email error:', err));
    }).catch(err => console.error('Tour fetch error:', err));
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
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

const getBookingById = async (req, res) => {
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

const updateBookingStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const affectedRows = await Booking.updateStatus(req.params.id, status);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, message: 'Booking status updated successfully' });
    
    // Send email asynchronously
    Booking.getById(req.params.id).then(booking => {
      return Tour.getById(booking.tour_id).then(tour => ({ booking, tour }));
    }).then(({ booking, tour }) => {
      sendStatusUpdateEmail({
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        tour_title: tour.title,
        booking_date: booking.booking_date,
        number_of_people: booking.number_of_people,
        total_price: booking.total_price
      }, status, remarks).catch(err => console.error('Email error:', err));
    }).catch(err => console.error('Fetch error:', err));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getBookingsByEmail = async (req, res) => {
  try {
    const bookings = await Booking.getByEmail(req.params.email);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteBooking = async (req, res) => {
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


export default { createBooking, getAllBookings, getBookingById, updateBookingStatus, getBookingsByEmail, deleteBooking };