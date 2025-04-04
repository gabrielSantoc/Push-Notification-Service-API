const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const notificationRouter = require('./routes/notification')
const pingRouter = require('./routes/ping')
const { sendTodaysEventNotifications }  = require('./utils/sendNotif')
const { initializeCronJobs } = require('./utils/cronUtils')
const config = require('./config/config');
const logger = require('./middleware/logger')

app.use(logger)
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(notificationRouter);
app.use(pingRouter);

// Crons
initializeCronJobs(sendTodaysEventNotifications);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});