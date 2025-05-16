const express = require('express');
const cors = require('cors');
const config = require('./utils/config');
const axios = require('axios');
const moment = require('moment-timezone');
const cron = require('node-cron');
const logger = require('./middlewares/logger');
const notificationRouter = require('./routes/notification');

const sendTodaysEventNotifications = require('./helpers/sendTodaysNotif');

const app = express();
app.use(express.json());
app.use(logger);
app.use(cors());

app.use(notificationRouter);

// Schedule daily notification at 5:30 AM
cron.schedule(config.cronJobs.dailyNotification, () => {
  console.log(`Cron job running at ${moment().tz(config.timezone).format('YYYY-MM-DD HH:mm:ss')} in PHT`);
  sendTodaysEventNotifications();
}, {
  timezone: config.timezone,
  scheduled: true,
});

// Cron job to keep the server alive
cron.schedule(config.cronJobs.serverPing, async () => {
  try {
    const response = await axios.get(config.urls.serverPing);
    if(response.status == 200) {
      console.log('Server pinged successfully');
    } else {
      console.error(`Failed to ping server. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error pinging server:', error.message);
  }
}, {
  timezone: config.timezone,
  scheduled: true,
});

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});