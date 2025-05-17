const config = require('../utils/config')

// Helper function to build OneSignal API options
const optionsBuilder = (method, path, body) => ({
  method,
  url: `${config.oneSignal.baseUrl}/${path}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${config.oneSignal.apiKey}`,
  },
  data: body ? body : null,
});

module.exports = { optionsBuilder };