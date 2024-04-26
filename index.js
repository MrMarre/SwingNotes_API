require("dotenv").config();
const express = require("express");
const app = express();

const noteController = require("./controllers/notes");
const userController = require("./controllers/users");
// const router = require(); Kräver config på annat håll

app.use(express.json());
app.use("/api", noteController);
app.use("/api", userController);

app.listen(process.env.PORT, process.env.BASE_URL, () => {
  console.log(
    `Server running at http://${process.env.BASE_URL}:${process.env.PORT}`
  );
});
