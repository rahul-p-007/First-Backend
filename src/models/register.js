const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RegisterSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//Genrating token
RegisterSchema.methods.genrateAuthToken = async function () {
  try {
    const tokenJWT = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({token : tokenJWT})
    await this.save();
    return tokenJWT;
 
} catch (error) {
    res.send("The error part ", error);
    console.log("The error part ", error);
  }
};

RegisterSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
 
 
    this.password = await bcrypt.hash(this.password, 10);


    this.confirmpassword = await bcrypt.hash(this.password, 10);;
  }

  next();
});

const RegisterModal = new mongoose.model("register", RegisterSchema);

module.exports = RegisterModal;
