const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const FieldSchema = new Schema(
  {
    fieldname: {
      type: String
    },
    address: {
      type: String
    },
    hours: {
        type: String
    },
    contact: {
        type: String
    },
    imageUrl: String
    
  },
);

const soccerField = model('Field', FieldSchema);

module.exports = soccerField;
