const mongoose = require('mongoose')

const MessagesSchema = new mongoose.Schema({
  notificationId: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false, // false = pending, true = success
  },
  channel: {
    type: Array,
    required: [true, 'must provide channel'],
  },
  senderEmail: {
    type: String,
    required: [true, 'must provide sender email'],
  },
  senderPhone: {
    type: String,
    required: [true, 'must provide sender phone'],
  },
  senderName: {
    type: String,
    required: [true, 'must provide sender name'],
  },
  recipientPhone: {
    type: String,
    required: [true, 'must provide recipient phone'],
  },
  recipientEmail: {
    type: String,
    required: [true, 'must provide recipient email'],
  },
})

module.exports = mongoose.model('MessageQueue', MessagesSchema)
