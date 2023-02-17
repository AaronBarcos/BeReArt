const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const cuadroSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      unique: true
    },
    descripción: {
      type: String,
      required: true,
      unique: true,
    },
    autor: {
      type: String,
      required: true
    },
    año: {
      type: String,
      required: true
    },
    image: {
        type: String,
    }
      
     
  },
    
);

const Cuadro = model("User", userSchema);

module.exports = Cuadro;