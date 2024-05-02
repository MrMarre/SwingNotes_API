const swaggerDocument = require("./docs.json");
const swaggerUi = require("swagger-ui-express");

const swaggerInitiate = (app, PORT) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
};

module.exports = swaggerInitiate;
// apis: ["./docs/*.json"],
