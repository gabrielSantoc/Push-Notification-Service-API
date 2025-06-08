const config = require('../utils/config');

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['notif-api-key'];

  if(!apiKey || apiKey !== config.notifications.apiKey) {
    return res.status(403).json({message: 'FORBIDDEN - invalid or missing API key'});
  }

  next();

}

module.exports = verifyApiKey 