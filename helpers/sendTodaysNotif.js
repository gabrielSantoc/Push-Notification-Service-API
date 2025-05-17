
const moment = require('moment-timezone');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const config = require('../utils/config')
// Supabase client initialization
const supabase = createClient(config.supabase.url, config.supabase.apiKey);

// Helper function to get today's date
const getTodayDate = () => moment().tz(config.timezone).format('YYYY-MM-DD');
const { optionsBuilder } = require('../utils/notifOptionBuilder');

// Function to get today's events and send notifications
const sendTodaysEventNotifications = async () => {
  try {
    const currentDate = getTodayDate();
    const { data, error } = await supabase
      .from("tbl_calendar")
      .select("*")
      .eq('date', currentDate)
      .order("date", { ascending: true });

    if (error) throw new Error(`Supabase error: ${error.message}`);

    if (data.length === 0) {
      console.log('No events found for today.');
      return;
    }

    for (const event of data) {
      const notificationBody = {
        app_id: config.oneSignal.appId,
        headings: { "en": event.event_name },
        contents: { "en": event.event_description },
        included_segments: ["All"],
        content_available: true,
        ttl: config.notifications.ttl
      };

      const options = optionsBuilder("POST", "notifications", notificationBody);
      const response = await axios(options);
      console.log(`Notification sent for event: ${event.event_name}, ID: ${response.data.id}`);
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

module.exports = sendTodaysEventNotifications;