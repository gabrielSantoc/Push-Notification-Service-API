const {checkSupabaseConn} = require('../helpers/checkSupabaseCon');

const healthCheckController = async () => {

  const startTime = Date.now();

  try {

    const dbStatus = await checkSupabaseConn();

    const healthStatus = {
      timestamp: new Date().toISOString(),
      service: {
        status: 'up',
        environment: process.env.NODE_ENV || 'development',
      },
      database: dbStatus,
      responseTime: `${Date.now() - startTime}ms`
    }

    const isHealthy = dbStatus.status === 'connected';

    return { 
      statusCode: isHealthy ? 200 : 503,
      data: healthStatus
    }

  }catch(error) {
    return {
      statusCode: 500,
      data: {
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message,
        responseTime: `${Date.now() - startTime}ms`
      }
    }
  }

}

module.exports = {healthCheckController}