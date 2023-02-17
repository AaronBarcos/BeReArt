const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const publicacionSchema = new Schema(
  {
    foto: {
      type: String,
      required: true,
    },
    propietario: {
      type: String,
      ref: "user"
    },
    cuadro: {
      type: String,
      required: true
    },
    ubicacion: {
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