const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Gerando token de usuário
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret,{
        expiresIn: "7d"
    });
};

// Registrando usuário e logando
const register = async(req, res) => {
    res.send("Registro");
};

module.exports = {
    register
};