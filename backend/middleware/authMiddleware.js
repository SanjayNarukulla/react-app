const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, "secretKey", (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Save user info to request
    next();
  });
}

module.exports = authenticateToken;
