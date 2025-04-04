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
    const currentTime = moment().tz(config.TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
    console.log(`[CRON] Daily notification job triggered at ${currentTime} in ${config.TIMEZONE}`);


    sendTodaysEventNotifications()
    .then(() => console.log(`[CRON] Daily notification job completed at ${moment().tz(config.TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}`))
    .catch(err => console.error(`[CRON] Error in notification job: ${err.message}`));
    
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