// Import necessary modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { initializePublisher } = require("./utils/rabbitmqPublisher");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors(['http://localhost:3000','http://localhost:3002']));
app.use(bodyParser.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Booking Service running");
});

// Booking routes
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/bookings", bookingRoutes);

// Start server with RabbitMQ initialization
async function startServer() {
  try {
    // Initialize RabbitMQ publisher
    await initializePublisher();
    console.log("✓ RabbitMQ Publisher initialized");
  } catch (error) {
    console.error("❌ Failed to initialize RabbitMQ:", error);
    process.exit(1);
  }
}

// Initialize before test routes
startServer();

// Swagger setup
const { swaggerUi, specs } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
//my server file
