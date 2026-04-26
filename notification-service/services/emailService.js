import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter;

export async function initializeEmailService() {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("✓ Email service initialized successfully");
  } catch (error) {
    console.error("❌ Email service initialization error:", error.message);
    throw error;
  }
}

export async function sendEmail(to, subject, htmlContent) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${to}, Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    throw error;
  }
}

export async function sendEventCreatedEmail(data) {
  const { organizer_email, event_name, start, location } = data;
  const subject = `Your Event '${event_name}' Has Been Created`;

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .event-detail { margin: 10px 0; padding: 10px; background: #f0f0f0; border-left: 4px solid #4CAF50; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>✓ Event Created Successfully</h1></div>
            <div class="content">
              <p>Hello,</p>
              <p>Your event has been successfully created! Here are the details:</p>
              <div class="event-detail">
                <strong>Event Title:</strong> ${event_name}
              </div>
              <div class="event-detail">
                <strong>Start Date & Time:</strong> ${new Date(start).toLocaleString()}
              </div>
              <div class="event-detail">
                <strong>Location:</strong> ${location || "Not specified"}
              </div>
              <p>You can now start managing bookings and attendees from your dashboard.</p>
              <p>Best regards,<br>EventHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(organizer_email, subject, htmlContent);
  } catch (error) {
    console.error("Error sending event created email:", error.message);
  }
}

export async function sendBookingConfirmedEmail(data) {
  const {
    user_email,
    event_name,
    booking_date,
    bookingId,
    seat_number,
    ticket_price,
    customer_name,
  } = data;
  const subject = `Booking Confirmed for '${event_name}'`;

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .booking-detail { margin: 10px 0; padding: 10px; background: #f0f0f0; border-left: 4px solid #2196F3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>✓ Booking Confirmed</h1></div>
            <div class="content">
              <p>Hello ${customer_name},</p>
              <p>Your booking has been confirmed! Here are your booking details:</p>
              <div class="booking-detail">
                <strong>Event:</strong> ${event_name}
              </div>
              <div class="booking-detail">
                <strong>Booking ID:</strong> ${bookingId}
              </div>
              <div class="booking-detail">
                <strong>Seat:</strong> ${seat_number || "General"}
              </div>
              <div class="booking-detail">
                <strong>Price:</strong> LKR ${ticket_price}
              </div>
              <div class="booking-detail">
                <strong>Booking Date:</strong> ${new Date(booking_date).toLocaleString()}
              </div>
              <p>Please arrive 15 minutes before the event. Your ticket has been sent to this email.</p>
              <p>Best regards,<br>EventHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(user_email, subject, htmlContent);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error.message);
  }
}

export async function sendReviewSubmittedEmail(data) {
  const { organizer_email, event_title, reviewer_name, rating, comment } = data;
  const subject = `New Review for '${event_title}'`;

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .header { background: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .review-detail { margin: 10px 0; padding: 10px; background: #f0f0f0; border-left: 4px solid #FF9800; }
            .rating { color: #FFB300; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>✓ New Review Received</h1></div>
            <div class="content">
              <p>Hello,</p>
              <p>You've received a new review for your event:</p>
              <div class="review-detail">
                <strong>Event:</strong> ${event_title}
              </div>
              <div class="review-detail">
                <strong>Reviewer:</strong> ${reviewer_name}
              </div>
              <div class="review-detail">
                <strong>Rating:</strong> <span class="rating">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span> (${rating}/5)
              </div>
              <div class="review-detail">
                <strong>Comment:</strong> <em>"${comment}"</em>
              </div>
              <p>Thank you for creating great events!</p>
              <p>Best regards,<br>EventHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(organizer_email, subject, htmlContent);
  } catch (error) {
    console.error("Error sending review notification email:", error.message);
  }
}

export async function sendWelcomeEmail(data) {
  const { email, firstName, lastName } = data;
  const fullName = `${firstName} ${lastName}`.trim();
  const subject = "Welcome to EventHub!";

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .header { background: #9C27B0; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .feature-list { margin: 20px 0; }
            .feature { margin: 10px 0; padding: 10px; background: #f0f0f0; border-left: 4px solid #9C27B0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Welcome to EventHub! 🎉</h1></div>
            <div class="content">
              <p>Hello ${fullName},</p>
              <p>Thank you for joining EventHub! We're excited to have you on board.</p>
              <p>Here's what you can do:</p>
              <div class="feature-list">
                <div class="feature">✓ Create and manage events</div>
                <div class="feature">✓ Manage bookings and attendee list</div>
                <div class="feature">✓ Track real-time analytics</div>
                <div class="feature">✓ Collect reviews from attendees</div>
                <div class="feature">✓ Communicate with your audience</div>
              </div>
              <p>Get started by creating your first event today!</p>
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Best regards,<br>EventHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, subject, htmlContent);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
  }
}
