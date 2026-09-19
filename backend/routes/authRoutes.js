
const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const sendResetEmail = require("../utils/emailService");

const router = express.Router();

// ==========================================
// REGISTER
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration successful",

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ==========================================
// GET USER PROFILE
// ==========================================
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("GET PROFILE REQUEST:", userId);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        bio:
          user.bio ||
          "I manage my expenses and keep track of my financial goals.",
      },
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE USER PROFILE
// ==========================================
router.put("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      name,
      email,
      phone,
      bio,
    } = req.body;

    console.log("UPDATE PROFILE REQUEST:", userId);
    console.log("NAME:", name);
    console.log("EMAIL:", email);
    console.log("PHONE:", phone);
    console.log("BIO:", bio);

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check if another account already uses this email
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already being used by another account",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : "",
        bio: bio ? bio.trim() : "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        bio: updatedUser.bio || "",
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==========================================
// CHANGE PASSWORD
// ==========================================
router.put("/change-password/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    console.log(
      "CHANGE PASSWORD REQUEST:",
      userId
    );

    // Check required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check current password
    const isPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Check new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // Save new password
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message:
        "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==========================================
// FORGOT PASSWORD
// ==========================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your email",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    // Create a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires after 15 minutes
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    // Save reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;

    await user.save();

    // Reset password page
    const resetLink =
      `http://localhost:5173/reset-password/${resetToken}`;

    // Send reset email
    await sendResetEmail(
      user.email,
      resetLink
    );

    res.status(200).json({
      message:
        "Password reset link has been sent to your email",
    });

  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to send password reset email",
    });
  }
});
// ==========================================
// RESET PASSWORD
// ==========================================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Check password
    if (!newPassword) {
      return res.status(400).json({
        message: "Please enter a new password",
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Find user with matching token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    // Token invalid or expired
    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    user.password = hashedPassword;

    // Remove reset token after successful reset
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
   }
  });

// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;

