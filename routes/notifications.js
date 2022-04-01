const express = require('express')
const router = express.Router()

const {
  createNotification,
} = require('../controllers/notifications')

router.route('/').post(createNotification)

module.exports = router
