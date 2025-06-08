const express = require('express');
const router = express.Router();
const { handleSendNotification } = require('../handlers/notificationHandler')
const { pingHandler } = require('../handlers/pingHandler');
const { healthCheckHandler } = require('../handlers/healthCheckHandler');
const verifyApiKey = require('../middlewares/verifyApiKey')


router.post('/notifications', verifyApiKey, handleSendNotification);
router.get('/ping', pingHandler);
router.get('/health', healthCheckHandler);

module.exports = router;