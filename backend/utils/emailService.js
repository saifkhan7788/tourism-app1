import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendBookingConfirmation = async (bookingDetails) => {
  const { customer_name, customer_email, tour_title, booking_date, number_of_people, total_price } = bookingDetails;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customer_email,
    subject: 'Booking Confirmation - Arabian Adventure',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B1538;">Booking Confirmation</h2>
        <p>Dear ${customer_name},</p>
        <p>Thank you for booking with Arabian Adventure! Your booking has been received and is pending confirmation.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B1538; margin-top: 0;">Booking Details</h3>
          <p><strong>Tour:</strong> ${tour_title}</p>
          <p><strong>Date:</strong> ${booking_date}</p>
          <p><strong>Number of People:</strong> ${number_of_people}</p>
          <p><strong>Total Price:</strong> ${total_price} QAR</p>
        </div>
        
        <p>We will contact you shortly to confirm your booking.</p>
        <p>📞 Phone: +974 7780 7165<br>
        📧 Email: info@arabianadventure.com</p>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>Arabian Adventure Team</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendAdminNotification = async (bookingDetails) => {
  const { customer_name, customer_email, customer_phone, tour_title, booking_date, number_of_people, total_price, special_requests } = bookingDetails;

  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || 'admin@arabianadventure.com',
    subject: 'New Booking - Arabian Adventure',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B1538;">New Booking Received</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B1538; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${customer_name}</p>
          <p><strong>Email:</strong> ${customer_email}</p>
          <p><strong>Phone:</strong> ${customer_phone}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B1538; margin-top: 0;">Booking Details</h3>
          <p><strong>Tour:</strong> ${tour_title}</p>
          <p><strong>Date:</strong> ${booking_date}</p>
          <p><strong>Number of People:</strong> ${number_of_people}</p>
          <p><strong>Total Price:</strong> ${total_price} QAR</p>
          ${special_requests ? `<p><strong>Special Requests:</strong> ${special_requests}</p>` : ''}
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendStatusUpdateEmail = async (bookingDetails, status, remarks) => {
  const { customer_name, customer_email, tour_title, booking_date, number_of_people, total_price } = bookingDetails;

  let subject, message, color;
  
  if (status === 'confirmed') {
    subject = 'Booking Confirmed - Arabian Adventure';
    message = 'Great news! Your booking has been confirmed.';
    color = '#28a745';
  } else if (status === 'cancelled') {
    subject = 'Booking Cancelled - Arabian Adventure';
    message = 'Your booking has been cancelled.';
    color = '#dc3545';
  } else if (status === 'completed') {
    subject = 'Thank You - Arabian Adventure';
    message = 'Thank you for choosing Arabian Adventure! We hope you enjoyed your tour.';
    color = '#8B1538';
  } else {
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customer_email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${color};">Booking Status Update</h2>
        <p>Dear ${customer_name},</p>
        <p>${message}</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B1538; margin-top: 0;">Booking Details</h3>
          <p><strong>Tour:</strong> ${tour_title}</p>
          <p><strong>Date:</strong> ${new Date(booking_date).toLocaleDateString()}</p>
          <p><strong>Number of People:</strong> ${number_of_people}</p>
          <p><strong>Total Price:</strong> ${total_price} QAR</p>
          <p><strong>Status:</strong> <span style="color: ${color}; text-transform: uppercase; font-weight: bold;">${status}</span></p>
        </div>
        
        ${remarks ? `<div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0;"><strong>Message from Arabian Adventure:</strong></p>
          <p style="margin: 10px 0 0 0;">${remarks}</p>
        </div>` : ''}
        
        ${status === 'confirmed' ? '<p>We look forward to seeing you on your tour date!</p>' : ''}
        ${status === 'cancelled' ? '<p>If you have any questions, please contact us.</p>' : ''}
        
        <p>📞 Phone: +974 7780 7165<br>
        📧 Email: info@arabianadventure.com</p>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>Arabian Adventure Team</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendContactReply = async ({ to, name, subject, replyMessage }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B1538;">Arabian Adventure</h2>
        <p>Dear ${name},</p>
        <p>Thank you for contacting us. Here is our response to your inquiry:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${replyMessage.split('\n').map(line => `<p style="margin: 10px 0;">${line}</p>`).join('')}
        </div>
        
        <p>If you have any further questions, please don't hesitate to contact us.</p>
        <p>📞 Phone: +974 7780 7165<br>
        📧 Email: info@arabianadventure.com</p>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>Arabian Adventure Team</strong></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export { sendBookingConfirmation, sendAdminNotification, sendStatusUpdateEmail, sendContactReply };
