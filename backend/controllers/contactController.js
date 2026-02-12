const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const contactId = await Contact.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully', contactId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAll();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const affectedRows = await Contact.updateStatus(req.params.id, status);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const affectedRows = await Contact.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.replyContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.getById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    await Contact.reply(req.params.id, replyMessage);
    
    // Send email (using existing email service if available)
    try {
      const { sendContactReply } = require('../utils/emailService');
      await sendContactReply({
        to: contact.email,
        name: contact.name,
        subject: `Re: ${contact.subject}`,
        replyMessage
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
