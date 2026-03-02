import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//middleware
app.use(cors());
app.use(express.json());

//api endpoints


app.get("/", (req, res) => {
  res.send("Api working ");
});

app.listen(port, () => console.log("Server Started", port));
