const swaggerJsdoc = require("swagger-jsdoc");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Notes Application",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from notes.",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
