const axios = require('axios');
const config = require('../utils/config');
const optionsBuilder = require('../utils/notifOptionBuilder');


async function sendNotificationController({ event_name, event_description }) {
  try {
    const notificationBody = {
      app_id: config.oneSignal.appId,
      headings: { en: event_name },
      contents: { en: event_description },
      included_segments: ["All"],
      content_available: true,
      ttl: config.notifications.ttl
    };

    const options = optionsBuilder("POST", "notifications", notificationBody);
    const response = await axios(options);

    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error.response?.data || error.message);
    throw error; 
  }
}

module.exports = { sendNotificationController };