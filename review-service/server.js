require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { swaggerUi, specs } = require("./config/swagger");
const { initializePublisher } = require("./utils/rabbitmqPublisher");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(bodyParser.json());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Review Service API is running");
});

// Health check endpoint for ECS
app.get("/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    status: mongoose.connection.readyState === 1 ? "OK" : "UNHEALTHY",
  };

  if (mongoose.connection.readyState === 1) {
    res.status(200).json(healthcheck);
  } else {
    res.status(503).json(healthcheck);
  }
});

const reviewRoutes = require("./routes/reviewRoutes");
app.use("/reviews", reviewRoutes);

// Initialize RabbitMQ Publisher on startup
initializePublisher()
  .then(() => {
    console.log("✓ RabbitMQ publisher initialized successfully");
  })
  .catch((error) => {
    console.error("❌ Failed to initialize RabbitMQ publisher:", error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Review Service running on port ${PORT}`);
});
