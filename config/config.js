const dotenv = require('dotenv');
dotenv.config();

const config = {
  TIMEZONE :'Asia/Manila',
  SERVER_URL : 'https://push-notification-service-fk87.onrender.com/ping',

  // Cron job to keep the server alive every 5 minutes
  PING_INTERVAL : '*/5 * * * *',

  // Schedule daily notification at 5:30 AM
  DAILY_NOTIFICATION_TIME : '30 5 * * *',
  PORT: process.env.PORT || 3000,

  // OneSignal configuration
  API_KEY : process.env.ONE_SINGAL_API_KEY,
  ONE_SIGNAL_APP_ID : process.env.ONE_SIGNAL_APP_ID,
  BASE_URL : "https://onesignal.com/api/v1",
}

module.exports = config;