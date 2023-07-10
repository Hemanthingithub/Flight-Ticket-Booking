const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    token: { type: String },
    expiresAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("session", sessionSchema, "sessions");
