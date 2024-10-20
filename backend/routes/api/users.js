const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Validation Middleware
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Invalid email")
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required"),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors,
];

// Sign Up Route
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  // Check if a user with the same email or username already exists
  const existingUserEmail = await User.findOne({ where: { email } });
  const existingUserUsername = await User.findOne({ where: { username } });

  const errors = {};
  if (existingUserEmail) {
    errors.email = "User with that email already exists";
  }
  if (existingUserUsername) {
    errors.username = "User with that username already exists";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(403).json({
      message: "User already exists",
      errors,
    });
  }

  // If no existing user, proceed with user creation
  try {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, user);
    return res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      errors: { server: "An unexpected error occurred" },
    });
  }
});

module.exports = router;
