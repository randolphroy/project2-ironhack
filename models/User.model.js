const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, 'Username is required.'], 
    },
    email: {
      type: String,
      unique: [true, 'Username is required.'],
    },
    position: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: 'https://res.cloudinary.com/sebastien-zachary/image/upload/v1657764651/project2-posts/pcgrvhspnguyipnachdg.png'
    },
      password: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;