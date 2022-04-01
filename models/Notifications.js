const mongoose = require('mongoose')

const NotificationsSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: [true, 'must provide templateId'],
  },
  messageContent: {
    type: String,
    required: [true, 'must provide messageContent'],
  },
})

module.exports = mongoose.model('Notifications', NotificationsSchema)
