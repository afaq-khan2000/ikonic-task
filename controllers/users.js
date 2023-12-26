const axios = require("axios");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// register user

exports.registerUser = async function (req, res, next) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// login user

exports.loginUser = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10d" });
    res.status(200).json({ token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// get user profile
exports.getUserProfile = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// update user profile
exports.updateUserProfile = async function (req, res, next) {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findById(req.user.userId);

    const updatedUser = {
      username: username || existingUser.username,
      email: email || existingUser.email,
      password: password ? await bcrypt.hash(password, 10) : existingUser.password,
    };

    await existingUser.updateOne(updatedUser);

    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// delete user profile

exports.deleteUserProfile = async function (req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
