import amqp from "amqplib";
import { sendEventCreatedEmail } from "../services/emailService.js";
import { broadcastToAllUsers } from "../services/notificationService.js";

let connection;
let channel;

export async function initializeRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert queues exist
    await channel.assertQueue("event.created", { durable: true });
    await channel.assertQueue("booking.confirmed", { durable: true });
    await channel.assertQueue("review.submitted", { durable: true });
    await channel.assertQueue("user.registered", { durable: true });

    console.log("✓ RabbitMQ connected and queues asserted");

    // Start all consumers
    startEventConsumer();
    startBookingConsumer();
    startReviewConsumer();
    startUserConsumer();
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
    throw error;
  }
}

async function startEventConsumer() {
  try {
    channel.consume("event.created", async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(
          "📨 Event created message received:",
          JSON.stringify(data, null, 2),
        );
        console.log("  - organizer_email:", data.organizer_email);
        console.log("  - event_name:", data.event_name);

        if (!data.organizer_email) {
          console.warn(
            "⚠️ WARNING: organizer_email is missing! Email will not be sent.",
          );
        } else {
          console.log("✓ Sending email to organizer:", data.organizer_email);
        }

        // Send email to organizer
        await sendEventCreatedEmail(data);

        // Broadcast to all logged-in users
        broadcastToAllUsers({
          type: "event.created",
          message: `New event created: ${data.event_name}`,
          event: {
            id: data.eventId,
            title: data.event_name,
            start: data.start,
            location: data.location,
          },
          timestamp: new Date(),
        });

        channel.ack(msg);
      }
    });
    console.log("✓ Event consumer started");
  } catch (error) {
    console.error("❌ Event consumer error:", error);
  }
}

export async function startBookingConsumer() {
  try {
    const { sendBookingConfirmedEmail } =
      await import("../services/emailService.js");
    channel.consume("booking.confirmed", async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log("📨 Booking confirmed message received:", data);
        await sendBookingConfirmedEmail(data);
        channel.ack(msg);
      }
    });
    console.log("✓ Booking consumer started");
  } catch (error) {
    console.error("❌ Booking consumer error:", error);
  }
}

export async function startReviewConsumer() {
  try {
    const { sendReviewSubmittedEmail } =
      await import("../services/emailService.js");
    channel.consume("review.submitted", async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log("📨 Review submitted message received:", data);
        await sendReviewSubmittedEmail(data);
        channel.ack(msg);
      }
    });
    console.log("✓ Review consumer started");
  } catch (error) {
    console.error("❌ Review consumer error:", error);
  }
}

export async function startUserConsumer() {
  try {
    const { sendWelcomeEmail } = await import("../services/emailService.js");
    channel.consume("user.registered", async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log("📨 User registered message received:", data);
        await sendWelcomeEmail(data);
        channel.ack(msg);
      }
    });
    console.log("✓ User consumer started");
  } catch (error) {
    console.error("❌ User consumer error:", error);
  }
}
