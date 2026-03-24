const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Review Service API",
      version: "1.0.0",
      description: "API documentation for the Review Service",
    },
    servers: [
      {
        url: "http://localhost:4002",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Please enter your JWT token from User Service (get from login endpoint)",
        },
      },
      schemas: {
        Review: {
          type: "object",
          properties: {
            review_id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
              description: "Unique identifier for the review",
            },
            user_id: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
              description: "ID of the user who submitted the review",
            },
            user_name: {
              type: "string",
              example: "John Doe",
              description: "Name of the user who submitted the review",
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
              description: "Email address of the user",
            },
            event_id: {
              type: "string",
              example: "507f1f77bcf86cd799439013",
              description: "ID of the event being reviewed",
            },
            event_name: {
              type: "string",
              example: "Tech Conference 2026",
              description: "Name of the event being reviewed",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 5,
              description: "Rating given to the event (1-5)",
            },
            comment: {
              type: "string",
              example: "Great event with excellent speakers and organization!",
              description: "Detailed comment or feedback about the event",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-10T14:30:00Z",
              description: "Timestamp when the review was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-11T09:15:00Z",
              description: "Timestamp when the review was last updated",
            },
          },
          required: [
            "user_id",
            "user_name",
            "email",
            "event_id",
            "event_name",
            "rating",
          ],
        },
        ReviewInput: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
              description: "ID of the user submitting the review",
            },
            user_name: {
              type: "string",
              example: "John Doe",
              description: "Name of the user submitting the review",
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
              description: "Email address of the user",
            },
            event_id: {
              type: "string",
              example: "507f1f77bcf86cd799439013",
              description: "ID of the event to review",
            },
            event_name: {
              type: "string",
              example: "Tech Conference 2026",
              description: "Name of the event to review",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 5,
              description: "Rating for the event (1-5)",
            },
            comment: {
              type: "string",
              example: "Great event!",
              description: "Optional comment/feedback (can be empty string)",
            },
          },
          required: [
            "user_id",
            "user_name",
            "email",
            "event_id",
            "event_name",
            "rating",
          ],
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Invalid request" },
            error: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./routes/reviewRoutes.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
