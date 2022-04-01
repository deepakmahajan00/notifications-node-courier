const mongoose = require('mongoose')

const OutboundQueriesSchema = new mongoose.Schema({
  messageId: {
    type: Number,
    required: [true, 'must provide message id'],
  },
  type: {
    type: String,
    required: [true, 'must provide channel'], // Value should be IN/OUT only
  },
  data: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  httpResponseCode: {
    type: Number,
    required: [true, 'must provide http response code'],
  },
  requestTime: {
    type: String,
    required: [true, 'must provide request time'],
  },
  responseTime: {
    type: String,
    required: [true, 'must provide response time'],
  },
})

module.exports = mongoose.model('OutboundQueries', OutboundQueriesSchema)
