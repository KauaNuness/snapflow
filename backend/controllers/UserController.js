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
    
    const {nome, email, senha} = req.body
    const user = await User.findOne({email})

    if(user){
        res.status(422).json({errors: ["Já existe uma conta com este email"]});
        return
    }

    // Gerando hash para a senha
    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(senha, salt);

    const newUser = await User.create({
        nome,
        email,
        senha: senhaHash
    })

    if(!newUser){
        res.status(422).json({errors: ["Houve um erro, por favor tente novamente."]});
        return
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    })

};

module.exports = {
    register
};