const { healthCheckController } = require('../controllers/healthCheckController')

const healthCheckHandler = async (req, res) => {

  try{
    const result = await healthCheckController();
    res.status(result.statusCode).json(result.data)
  }catch(error) {
    res.status(500).json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: 'Health check handler error',
      details: error.message
    });
  }

}

module.exports = { healthCheckHandler }