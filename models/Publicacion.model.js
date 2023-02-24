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

    userPhoto: String,

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

    hora: String,

    comentarios: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Publicacion = model("Publicacion", publicacionSchema);

module.exports = Publicacion;
