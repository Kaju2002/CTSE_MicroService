import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { initializeEmailService } from "./services/emailService.js";
import { initializeRabbitMQ } from "./consumers/eventConsumer.js";
import {
  addUser,
  removeUser,
  getUserCount,
} from "./services/notificationService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Notification Service",
    connectedUsers: getUserCount(),
  });
});

// SSE endpoint for real-time notifications
app.get("/notifications/stream", (req, res) => {
  console.log("🔌 New SSE connection from user");

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Add user to connected users
  addUser(res);

  // Send initial connection message
  res.write(
    `data: ${JSON.stringify({
      type: "connected",
      message: "Connected to notification service",
      timestamp: new Date(),
    })}\n\n`,
  );

  // Handle client disconnect
  req.on("close", () => {
    removeUser(res);
    res.end();
  });

  req.on("error", () => {
    removeUser(res);
    res.end();
  });
});

// Initialize services
async function startServer() {
  try {
    // Initialize email service
    await initializeEmailService();
    console.log("✓ Email service initialized");

    // Initialize RabbitMQ and consumers
    await initializeRabbitMQ();
    console.log("✓ RabbitMQ consumers initialized");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Notification Service running on port ${PORT}`);
      console.log(
        `📥 SSE endpoint: http://localhost:${PORT}/notifications/stream`,
      );
    });
  } catch (error) {
    console.error("❌ Error starting notification service:", error);
    // Don't exit, log the error but continue
    console.warn("⚠️ Service will continue with limited functionality");
  }
}

startServer();
