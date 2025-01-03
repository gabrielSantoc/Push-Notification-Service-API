const express = require("express");
const axios = require('axios');
const notificationRouter = express.Router()
const dotenv = require('dotenv');
dotenv.config();
const config = require('../config/config');
const { optionsBuilder } = require('../utils/sendNotif')



// Endpoint to send a notification
notificationRouter.post('/notifications', async (req, res) => {
  try {
    const { event_name, event_description } = req.body;
    const notificationBody = {
      app_id: config.ONE_SIGNAL_APP_ID,
      headings: { "en": event_name },
      contents: { "en": event_description },
      included_segments: ["All"],
      content_available: true,
      ttl : 43200 // 12 hours
    };

    const options = optionsBuilder("POST", "notifications", notificationBody);
    const response = await axios(options);
    

    res.json({ message: "Notification sent successfully", id: response.data.id });
  } catch (error) {
    res.status(500).json({ message: "Error sending notification", error: error.response ? error.response.data : 'Unknown error' });
  }
});

module.exports =  notificationRouter;