const { Router } = require("express");
const { findUserByUsername, storeUser } = require("../services/userServices");
const { comparePassword } = require("../middlewares/bcrypt");
const jwt = require("jsonwebtoken");
const router = Router();

router.post("/user/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (user) {
      res
        .status(409)
        .json({ success: false, message: "Username already exists" });
      return;
    }
    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: "All fields (username and password) are required",
      });
      return;
    }
    storeUser(username, password);
    res
      .status(201)
      .json({ success: true, message: "User was successfully created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    // Debugging
    console.log("User object:", user);
    console.log("Password from request:", password);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const passwordCheck = await comparePassword(password, user.password);
    if (!passwordCheck) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }
    // Om alla checks går igenom, skapa token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
