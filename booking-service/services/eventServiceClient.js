const axios = require("axios");

exports.validateEvent = async (eventId) => {
  const eventServiceUrl = process.env.EVENT_URL || "http://event-service:4000";
  try {
    const response = await axios.get(`${eventServiceUrl}/events/${eventId}`);
    console.log("Validating event_id:", eventId);
    console.log("Event response:", response.data);
    if (response.status === 200 && response.data && response.data._id) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.log("Error validating event_id:", eventId, error.message);
    return null;
  }
};
