const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
      // required: true
    },

    cuadroDia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cuadro",
    },

    hora: String,

    comentarios: [
      {
        type: String
      }
    ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Publicacion = model("Publicacion", publicacionSchema);

module.exports = Publicacion;
