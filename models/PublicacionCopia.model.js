const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const publicacionSchema = new Schema(
  {
    photo: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "username",
    },

    username: String,

    comment: {
      type: String,
    },

    picture: {
      type: String,
    },

    cuadroDia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cuadro",
    },
    fechaHora: String,
  },
  {
    timestamps: true,
  }
);

const PublicacionCopia = model("PublicacionCopia", publicacionSchema);

module.exports = PublicacionCopia;
