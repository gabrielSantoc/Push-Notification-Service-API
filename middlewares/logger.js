const moment = require('moment');

const logger = (req, res, next) => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
} 

module.exports = logger;