const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const moment = require('moment-timezone');
const axios = require('axios');
const config = require('../config/config');

// Helper function to get today's date
const getTodayDate = () => moment().tz(config.TIMEZONE).format('YYYY-MM-DD');

// Helper function to build OneSignal API options
const optionsBuilder = (method, path, body) => ({
  method,
  url: `${config.BASE_URL}/${path}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${config.API_KEY}`,
  },
  data: body ? body : null,
});

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
        app_id: config.ONE_SIGNAL_APP_ID,
        headings: { "en": event.event_name },
        contents: { "en": event.event_description },
        included_segments: ["All"],
        content_available: true,
        ttl : 43200
      };

      const options = optionsBuilder("POST", "notifications", notificationBody);
      const response = await axios(options);
      console.log(`Notification sent for event: ${event.event_name}, ID: ${response.data.id}`);
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

module.exports = { sendTodaysEventNotifications, optionsBuilder };