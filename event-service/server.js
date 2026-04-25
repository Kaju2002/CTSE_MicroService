import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import eventRouter from "./routes/event.route.js";
import { swaggerUi, specs } from "./config/swagger.js";
import { initializePublisher } from "./utils/rabbitmqPublisher.js";

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//middleware
app.use(cors());

// Skip body parsers for multipart/form-data — let multer handle it
app.use((req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return next(); // let multer handle it
  }
  express.json({ limit: "50mb" })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });
});

// Diagnostic middleware for multipart requests
app.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/create") {
    console.log("Request received:");
    console.log("Content-Type:", req.get("content-type"));
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
  }
  next();
});

//api endpoints
app.use("/events", eventRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Hello Welcome to the Event Service !");
});

// Health check endpoint for ALB
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "event-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Initialize RabbitMQ Publisher
    await initializePublisher();
    console.log("✓ RabbitMQ Publisher initialized");
  } catch (error) {
    console.error("❌ RabbitMQ failed, continuing without it:", error);
    // Don't crash — graceful degradation for production
  }
}

async function bootstrap() {
  await startServer();
  
  app.listen(port, "0.0.0.0", () => {
    console.log("Server Started on 0.0.0.0:", port);
    console.log(
      `Swagger docs available at http://localhost:${port}/api-docs`,
    );
  });
}

bootstrap();
