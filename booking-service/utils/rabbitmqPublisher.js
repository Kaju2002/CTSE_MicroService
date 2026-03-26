const amqp = require("amqplib");

let connection;
let channel;

// Initialize RabbitMQ connection and publisher
async function initializePublisher() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert the booking.confirmed queue exists (durable)
    await channel.assertQueue("booking.confirmed", { durable: true });

    console.log(
      "✓ RabbitMQ Publisher initialized - booking.confirmed queue ready",
    );
  } catch (error) {
    console.error("❌ RabbitMQ Publisher initialization error:", error);
    throw error;
  }
}

// Publish booking confirmed message
async function publishBookingConfirmed(bookingData) {
  try {
    if (!channel) {
      console.error("❌ RabbitMQ channel not initialized");
      return;
    }

    const message = {
      bookingId: bookingData._id.toString(),
      customer_name: bookingData.customer_name,
      user_email: bookingData.email,
      event_id: bookingData.event_id,
      event_name: bookingData.event_name,
      seat_number: bookingData.seat_number || null,
      ticket_price: bookingData.ticket_price,
      booking_date: bookingData.booking_date,
      booking_time: bookingData.booking_time,
      createdAt: new Date(),
    };

    // Send to queue with persistent flag
    channel.sendToQueue(
      "booking.confirmed",
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );

    console.log("✓ Published to RabbitMQ - booking.confirmed:");
    console.log("  - bookingId:", message.bookingId);
    console.log("  - user_email:", message.user_email);
    console.log("  - event_name:", message.event_name);
    console.log("  - seats:", message.seat_number || "unseated");
  } catch (error) {
    console.error("❌ Error publishing booking message:", error);
  }
}

module.exports = {
  initializePublisher,
  publishBookingConfirmed,
};
