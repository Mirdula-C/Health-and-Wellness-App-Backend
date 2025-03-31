const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token;

  // ✅ Support both Authorization header and x-auth-token
  const authHeader = req.header("Authorization");
  const tokenHeader = req.header("x-auth-token");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];  // Extract token from Bearer format
  } else if (tokenHeader) {
    token = tokenHeader;  // Use x-auth-token if available
  }

  console.log("🛡️ Received Token:", token || "No token provided");

  // ✅ Handle missing token
  if (!token) {
    console.warn("❌ No token provided.");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // ✅ Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check token expiration (JWT handles it internally)
    console.log("✅ Authenticated User:", decoded);

    // ✅ Attach decoded user info to the request object
    req.user = decoded;

    // ✅ Proceed to the next middleware
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);

    // ✅ Handle JWT-specific errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }

    // ✅ General server error
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
