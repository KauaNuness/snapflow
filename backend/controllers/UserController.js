const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const mongoose = require("mongoose");

// Gerando token de usuário
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d"
    });
};

// Registrando usuário e logando
const register = async (req, res) => {

    const { nome, email, senha } = req.body
    const user = await User.findOne({ email })

    if (user) {
        res.status(422).json({ errors: ["Já existe uma conta com este email"] });
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

    if (!newUser) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente novamente."] });
        return
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    })

};

const login = async (req, res) => {

    const { email, senha } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ errors: ["Usuário não encontrado."] });
        return
    }

    if (!(await bcrypt.compare(senha, user.senha))) {
        res.status(422).json({ errors: ["Senha inválida"] })
        return
    }

    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    })

}

const getCurrentUser = async(req, res) => {
    const user = req.user;

    res.status(200).json(user);
}

const update = async(req, res) => {
    
    const {nome, senha, bio} = req.body

    let profileImage = null

    if(req.file) {
        profileImage = req.file.filename
    }

    const reqUser = req.user

    // Corrigido: usaremos 'new mongoose.Types.ObjectId'
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-senha")

    if(nome) {
        user.nome = nome
    }

    if(senha) {
        const salt = await bcrypt.genSalt();
        const senhaHash = await bcrypt.hash(senha, salt);

        user.senha = senhaHash
    }

    if(profileImage){
        user.profileImage = profileImage
    }

    if(bio){
        user.bio = bio
    }

    await user.save()

    res.status(200).json(user);

}

const getUserById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ errors: ["ID inválido"] });
    }

    try {
        const user = await User.findById(id).select("-senha");

        if (!user) {
            return res.status(404).json({ errors: ["Usuário não encontrado"] });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ errors: ["Erro interno do servidor"] });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById
};
