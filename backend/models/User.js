const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    nome: String,
    email: String,
    senha: String,
    profileImage: String,
    bio: String
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;