const express = require("express");
const authControler = require("../controllers/authController");
const User = require("../models/userModel");

const router = express.Router();
router.post("/signup", authControler.signUp);
router.post("/login", authControler.login);

module.exports = router;