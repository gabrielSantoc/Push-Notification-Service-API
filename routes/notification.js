const express = require('express');
const router = express.Router();
const { handleSendNotification } = require('../handlers/notificationHandler')
const { pingHandler } = require('../handlers/pingHandler');

router.post('/notifications', handleSendNotification);
router.get('/ping', pingHandler);

module.exports = router;