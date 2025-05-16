const dotenv = require('dotenv');
dotenv.config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
  },
  
  // OneSignal configurationnotifications
  oneSignal: {
    apiKey: process.env.ONE_SIGNAL_API_KEY,
    appId: process.env.ONE_SIGNAL_APP_ID,
    baseUrl: "https://onesignal.com/api/v1",
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    apiKey: process.env.SUPABASE_API_KEY,
  },
  
  // Timezone settings
  timezone: 'Asia/Manila',
  
  // Notification settings
  notifications: {
    ttl: 43200, // 12 hours
  },
  
  // Cron job schedules
  cronJobs: {
    dailyNotification: '30 5 * * *', // 5:30 AM
    serverPing: '*/5 * * * *', // Every 5 minutes
  },
  
  // URLs
  urls: {
    serverPing: 'https://push-notification-service-fk87.onrender.com/ping',
  }
};

module.exports = config