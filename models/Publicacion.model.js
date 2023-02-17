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
      type: String,
      ref: "user"
    },
    picture: {
      type: String,
      required: true
    },
    ubication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cuadro"
    },
     
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Publicacion = model("Publicacion", publicacionSchema);

module.exports = Publicacion;