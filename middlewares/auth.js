const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    req.user = {
      ...user,
      userId: decoded.userId,
    };
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = requireSignIn;
