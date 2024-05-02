require("dotenv").config();
const express = require("express");
const app = express();

const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swagger/swagger.js");

const noteController = require("./controllers/notes");
const userController = require("./controllers/users");

app.use(express.json());
app.use("/api", noteController);
app.use("/api", userController);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(process.env.PORT, process.env.BASE_URL, () => {
  console.log(
    `Server running at http://${process.env.BASE_URL}:${process.env.PORT}`
  );
});
