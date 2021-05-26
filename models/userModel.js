const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: ["User must have an username"],
        unique: true
    },
    password: {
        type: String,
        require: ["User must have a password"]
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;