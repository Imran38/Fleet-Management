const express = require("express");
const { authenticateUser } = require("../services/auth");
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await authenticateUser(username, password);

    // Respond with the JWT token and user details
    res.status(200).json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
