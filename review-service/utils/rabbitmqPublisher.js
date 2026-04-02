const amqp = require("amqplib");

let connection;
let channel;

// Initialize RabbitMQ connection and publisher
async function initializePublisher() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert the review.submitted queue exists (durable)
    await channel.assertQueue("review.submitted", { durable: true });

    console.log(
      "✓ RabbitMQ Publisher initialized - review.submitted queue ready",
    );
  } catch (error) {
    console.error("❌ RabbitMQ Publisher initialization error:", error);
    throw error;
  }
}

// Publish review submitted message to notification service
async function publishReviewSubmitted(reviewData) {
  try {
    if (!channel) {
      console.error("❌ RabbitMQ channel not initialized");
      return;
    }

    // Get organizer email - either from event or from ADMIN_EMAIL env var
    const organizerEmail = reviewData.organizer_email || process.env.ADMIN_EMAIL;

    if (!organizerEmail) {
      console.warn(
        "⚠️ WARNING: No organizer email found for review notification",
      );
      console.warn("  - Please set ADMIN_EMAIL environment variable");
      return;
    }

    const message = {
      organizer_email: organizerEmail,
      event_title: reviewData.event_name || reviewData.event_title,
      reviewer_name: reviewData.user_name || reviewData.reviewer_name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date(),
    };

    // Send to queue with persistent flag
    channel.sendToQueue("review.submitted", Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("✓ Published to RabbitMQ - review.submitted:");
    console.log("  - organizer_email:", message.organizer_email);
    console.log("  - event_title:", message.event_title);
    console.log("  - reviewer_name:", message.reviewer_name);
    console.log("  - rating:", message.rating);
  } catch (error) {
    console.error("❌ Error publishing review message:", error);
  }
}

module.exports = {
  initializePublisher,
  publishReviewSubmitted,
};
