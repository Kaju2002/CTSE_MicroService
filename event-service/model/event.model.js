import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["VIP", "Regular", "Balcony", "Economy"],
  },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  available: { type: Number, required: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookingTime: { type: Date },
  seatNumber: { type: String },
  features: [{ type: String }],
});

const SubEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  seats: [SeatSchema],
  coverImage: { type: String },
  galleryImages: [{ type: String }],
});

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
    tags: [{ type: String }],
    capacity: { type: Number },
    mainEvent: { type: Boolean, default: true },
    freeEvent: { type: Boolean, default: false },
    seated: { type: Boolean, default: false },
    noSeated: { type: Boolean, default: false },
    seats: [SeatSchema],
    coverImage: { type: String },
    galleryImages: [{ type: String }],
    subEvents: [SubEventSchema],
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", EventSchema);

export default Event;
