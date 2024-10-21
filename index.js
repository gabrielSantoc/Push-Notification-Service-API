const { default: axios } = require('axios');
const { createClient } =  require('@supabase/supabase-js');

var cron = require('node-cron');
const moment = require('moment-timezone');


const API_KEY = "***REMOVED***";
const ONESIGNAL_APP_ID = "***REMOVED***";
const BASE_URL = "https://onesignal.com/api/v1";

// SUPABASE
const supabaseUrl = "***REMOVED***";
const supabaseKey = "***REMOVED***";
const supabase = createClient(supabaseUrl, supabaseKey);

const getTodaysCalendarEvents = async ()=>  {   

  const currentDate = moment().tz(TIMEZONE).format('YYYY-MM-DD');
  console.log(`Fetching events for date: ${currentDate}`);
  
  try {

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
    
    // SEND NOTIFICATION
    data.forEach(async (e)=>{
      console.log(`Event Title : ${e.event_name}` );
      console.log(`Event Description : ${e.event_description}`);
      console.log(`Event Date : ${e.date}`);

      const notificationBody = {
        app_id: ONESIGNAL_APP_ID,
        headings : { "en" : e.event_name }, // TITLE 
        contents: { "en" : e.event_description }, // Description
        included_segments : ["All"],
        content_available: true,
        small_icon : "ic_notification_icon",
      };
      
      await createNotification(notificationBody);

    })

  } catch (e) {
    console.log(`EROOR ::: ${e}`)
  }

}

const optionsBuilder = (method, path, body) => {
  return {
    method,
    url: `${BASE_URL}/${path}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${API_KEY}`,
    },
    data: body ? body : null,  
  };
}

const createNotification = async (body) => {
  const options = optionsBuilder("POST", "notifications", body);
  console.log(options);

  try {

    const response = await axios(options);
    console.log(response.data);
    // Assuming you want to access the notification ID
    if (response.data.id) {
      viewNotification(response.data.id);
    }
  } catch (error) {

    console.error('Error creating notification:', error);
    throw new Error(error.response ? error.response.data : 'Unknown error');

  }
}

const viewNotification = (id) => {
  console.log(`Notification ID: ${id}`);
};

// SCHEDULE NOTIFICATION EVERY 5 AM
const TIMEZONE = 'Asia/Manila';
console.log('Setting up cron job...');
console.log(`Time Check ::: ${moment().tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')} in PHT`);

cron.schedule('30 5 * * *', () => {
  const currentTime = moment().tz(TIMEZONE).format('YYYY-MM-DD');
  console.log(`Cron job running at ${currentTime} in PHT`);

  getTodaysCalendarEvents();
  console.log('Push Notification Sent');

}, {

  timezone: TIMEZONE,
  scheduled: true,

});

setInterval(() => {
  console.log('Process is still running...');
}, 60000);
