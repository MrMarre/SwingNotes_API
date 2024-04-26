const jwt = require("jsonwebtoken");
//  Researcha vettig struktur för middleware

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, error: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Bearer token is missing" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    console.log(decoded);
    req.user = decoded;
    next();
  });
};

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Authorization header is missing" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { authenticate, validateToken };
