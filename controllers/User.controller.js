const UserModel = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const keys = require("../config/keys");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    try {
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists." });
      }
      const user = await UserModel.create({ name, email, password });
      user.password = await bcrypt.hash(password, 10); // Hash the password
      await user.save();
      res.status(200).json({
        success: true,
        user,
        message: "User created successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        customMessage: "Could not create",
        error: err,
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "Email, Name and Password is required",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const user = await UserModel.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password); // Compare password
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid Password" });
        }

        const payload = { id: user._id, email: user.email, name: user.name };
        const token = jwt.sign(payload, keys.jwtSecret, { expiresIn: "1d" });
        res.status(200).json({
          success: true,
          user,
          message: "User logged in successfully",
          token,
        });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res
      .status(500)
      .json({ success: false, message: "Email and Password is required" });
  }
};

module.exports = { register, login };
