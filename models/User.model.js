const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  ubication: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "publicacion",
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profilePhoto: {
    type: String,
  },
});

const User = model("User", userSchema);

module.exports = User;
