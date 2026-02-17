-- Add composite index for availability checking
CREATE INDEX idx_tour_date ON bookings(tour_id, booking_date);
