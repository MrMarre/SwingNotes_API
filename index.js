require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const swaggerInitiate = require("./docs/swaggerSetup");

const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./docs/swaggerSetup");

const noteController = require("./controllers/notes");
const userController = require("./controllers/users");

app.use(express.json());
app.use(cors());
app.use("/api", noteController);
app.use("/api", userController);

// Något med CORS

swaggerInitiate(app, process.env.PORT);

app.listen(process.env.PORT, process.env.BASE_URL, () => {
  console.log(
    `Server running at http://${process.env.BASE_URL}:${process.env.PORT}`
  );
});
