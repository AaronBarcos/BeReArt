const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const cuadroSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Cuadro = model("Cuadro", cuadroSchema);

module.exports = Cuadro;
