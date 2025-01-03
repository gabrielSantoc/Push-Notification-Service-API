const cron = require('node-cron');
const moment = require('moment-timezone');
const axios = require('axios');
const config = require('../config/config')

const pingServer = async() => {

  try {
    const response = await axios.get(config.SERVER_URL);
    if(response.status == 200) {
      console.log('Server pinged successfully');
    } else {
      console.error(`Failed to ping server. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error pinging server:', error.message);
  }

};

const initializeCronJobs = ( sendTodaysEventNotifications ) => {

  // Schedule daily notification at 5:30 AM
  cron.schedule(config.DAILY_NOTIFICATION_TIME, () => {
    console.log(`Cron job running at ${moment().tz(config.TIMEZONE).format('YYYY-MM-DD HH:mm:ss')} in PHT`);
    sendTodaysEventNotifications();
  }, {
    timezone: config.TIMEZONE,
    scheduled: true,
  });

  // Cron job to keep the server alive
  cron.schedule(config.PING_INTERVAL, pingServer, {
    timezone: config.TIMEZONE,
    scheduled: true,
  });

}

module.exports = { initializeCronJobs };