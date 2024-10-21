const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const moment = require('moment-timezone');
const cron = require('node-cron');

const app = express();
app.use(express.json());

// OneSignal configuration
const API_KEY = "***REMOVED***";
const ONESIGNAL_APP_ID = "***REMOVED***";
const BASE_URL = "https://onesignal.com/api/v1";

// Supabase configuration
const supabaseUrl = "***REMOVED***";
const supabaseKey = "***REMOVED***";
const supabase = createClient(supabaseUrl, supabaseKey);

const TIMEZONE = 'Asia/Manila';

// Helper function to get today's date
const getTodayDate = () => moment().tz(TIMEZONE).format('YYYY-MM-DD');

// Helper function to build OneSignal API options
const optionsBuilder = (method, path, body) => ({
  method,
  url: `${BASE_URL}/${path}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${API_KEY}`,
  },
  data: body ? body : null,
});


// Ping route for the cron job
app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});


// Endpoint to get today's calendar events
app.get('/events/today', async (req, res) => {
  try {
    const currentDate = getTodayDate();
    const { data, error } = await supabase
      .from("tbl_calendar")
      .select("*")
      .eq('date', currentDate)
      .order("date", { ascending: true });

    if (error) throw new Error(`Supabase error: ${error.message}`);

    res.json({ message: "Today's events fetched successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's events", error: error.message });
  }
});

// Endpoint to send a notification
app.post('/notifications', async (req, res) => {
  try {
    const { event_name, event_description } = req.body;
    const notificationBody = {
      app_id: ONESIGNAL_APP_ID,
      headings: { "en": event_name },
      contents: { "en": event_description },
      included_segments: ["All"],
      content_available: true,
      small_icon: "ic_notification_icon",
    };

    const options = optionsBuilder("POST", "notifications", notificationBody);
    const response = await axios(options);

    res.json({ message: "Notification sent successfully", id: response.data.id });
  } catch (error) {
    res.status(500).json({ message: "Error sending notification", error: error.response ? error.response.data : 'Unknown error' });
  }
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
        app_id: ONESIGNAL_APP_ID,
        headings: { "en": event.event_name },
        contents: { "en": event.event_description },
        included_segments: ["All"],
        content_available: true,
        small_icon: "ic_notification_icon",
      };

      const options = optionsBuilder("POST", "notifications", notificationBody);
      const response = await axios(options);
      console.log(`Notification sent for event: ${event.event_name}, ID: ${response.data.id}`);
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

// Schedule daily notification at 5:30 AM
cron.schedule('00 17 * * *', () => {
  console.log(`Cron job running at ${moment().tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')} in PHT`);
  sendTodaysEventNotifications();
}, {
  timezone: TIMEZONE,
  scheduled: true,
});


// Cron job to keep the server alive
cron.schedule('*/5 * * * *', async () => {

  try {
    const response = await axios.get('http://localhost:3000/ping');
    if(response.status == 200) {

      console.log('Server pinged successfully');

    } else {

      console.error(`Failed to ping server. Status code: ${response.status}`);

    }
  } catch (error) {

    console.error('Error pinging server:', error.message);

  }
  
}, {
  timezone: TIMEZONE,
  scheduled: true,
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

