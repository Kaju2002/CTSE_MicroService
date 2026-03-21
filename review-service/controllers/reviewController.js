
const Review = require("../models/reviewModel");
const { validateUser } = require("../utils/userServiceClient");

// // Create a new review
// exports.createReview = async (req, res) => {
//   try {
//     const review = new Review(req.body);
//     await review.save();
//     res.status(201).json(review);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


// Create a new review
exports.createReview = async (req, res) => {
  try {
    // 1. Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // extract "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 2. Validate the token and get user details from User Service
    const user = await validateUser(token);

    if (!user) {
      return res.status(401).json({ error: "Invalid token or user not found." });
    }

    // 3. Construct the user_name from firstName and lastName (handling nulls)
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous User";

    // 4. Create the review object with user details populated automatically
    const reviewData = {
      ...req.body, // existing fields like event_id, event_name, rating, comment
      user_id: user.id,
      user_name: userName,
      email: user.email,
    };

    const review = new Review(reviewData);
    await review.save();
    
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// Get all reviews for a particular event
exports.getAllReviewsByEvent = async (req, res) => {
  try {
    const reviews = await Review.find({ event_id: req.params.eventId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews by a particular user
exports.getAllReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.params.userId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a review by ID
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ review_id: req.params.id });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
