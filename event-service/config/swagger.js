import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Service API",
      version: "1.0.0",
      description: "API documentation for the Event Service",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/eventRoutes.js"],
};

const specs = swaggerJsdoc(options);



export { swaggerUi, specs };
