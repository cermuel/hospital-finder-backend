const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const authHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, keys.jwtSecret);
    req.user = payload;
    next();
  } else {
    res.status(401).json({
      success: false,
      message: `Token is required`,
    });
  }
};

module.exports = authHandler;
