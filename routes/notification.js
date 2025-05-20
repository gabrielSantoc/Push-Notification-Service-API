const express = require('express');
const router = express.Router();
const { handleSendNotification } = require('../handlers/notificationHandler')
const { pingHandler } = require('../handlers/pingHandler');
const { healthCheckHandler } = require('../handlers/healthCheckHandler');


router.post('/notifications', handleSendNotification);
router.get('/ping', pingHandler);
router.get('/health', healthCheckHandler);

module.exports = router;