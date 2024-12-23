const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userManagementModel");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

//const SECRET_KEY = "your_jwt_secret_key"; // Replace with a secure key in production

// Authenticate user and generate JWT
async function authenticateUser(username, password) {
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid username or password.");
    }   

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password.");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expiration time
    );

    return { token, user };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
}

module.exports = {
  authenticateUser,
  verifyToken,
};
