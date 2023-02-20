const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const cuadroSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    image: {
        type: String,
    }
      
     
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
    
);

const Cuadro = model("Cuadro", cuadroSchema);

module.exports = Cuadro;