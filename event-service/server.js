import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import eventRouter from "./routes/event.route.js";
import { swaggerUi, specs } from "./config/swagger.js";

// import connectCloudinary from "./config/cloudinary.js";

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//middleware
app.use(cors());
app.use(express.json());

//api endpoints
app.use("/events", eventRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Api working ");
});

app.listen(port, () => {
  console.log("Server Started", port);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
