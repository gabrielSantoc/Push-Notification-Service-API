const { sendNotificationController } = require('../controllers/sendNotificationController');

const handleSendNotification = async( req, res ) => {
  try {
    const { event_name, event_description } = req.body;
    const data = await sendNotificationController({ event_name, event_description })

    res.json({
      message: "Notification send successfully",
      id: data.id
    });

  }catch(error) {
    res.status(500).json({
      message: "Error sending notification",
      error: error.response ? error.response.data : "Unknown error"
    });
  }
}

module.exports = { handleSendNotification };