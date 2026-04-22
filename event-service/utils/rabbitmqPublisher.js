import amqp from "amqplib";

let channel;

export async function initializePublisher() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("event.created", { durable: true });
    console.log("✓ RabbitMQ Publisher initialized");
  } catch (error) {
    console.error("❌ RabbitMQ Publisher  error:", error);
    throw error;
  }
}

export async function publishEventCreated(eventData) {
  try {
    console.log(
      "📤 publishEventCreated called with organizer_email:",
      eventData.organizer_email,
    );

    if (!eventData.organizer_email) {
      console.warn("⚠️ WARNING: organizer_email is missing from eventData!");
    }

    channel.sendToQueue(
      "event.created",
      Buffer.from(JSON.stringify(eventData)),
      { persistent: true },
    );
    console.log("✓ Event successfully sent to RabbitMQ queue");
  } catch (error) {
    console.error("❌ Error publishing event:", error);
  }
}
