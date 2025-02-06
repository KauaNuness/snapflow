const express = require("express");
const router = express.Router();

const { register } = require("../controllers/UserController");

const validate = require("../middlewares/handleValidation");

router.post("/register", validate, register);

module.exports = router;