const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/UserController");

const validate = require("../middlewares/handleValidation");
const { userCreateValidation, loginValidation } = require("../middlewares/userValidation");

router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

module.exports = router;