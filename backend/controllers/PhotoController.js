const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
const { update } = require("./UserController");

const insertPhoto = async(req, res) => {
    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.nome,

    });

    if(!newPhoto) {
        res.status(422).json({
            errors: ["Houve um problema, por favor tente novamente"]
        });
        return ;

    }

    res.status(201).json(newPhoto)
}

const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const reqUser = req.user;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ errors: ["ID inválido"] });
        }

        // Buscar foto no banco
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] });
        }

        // Verifica se a foto pertence ao usuário requisitante
        if (photo.userId.toString() !== reqUser._id.toString()) {
            return res.status(403).json({ errors: ["Você não tem permissão para excluir esta foto"] });
        }

        // Deleta a foto do banco
        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso" });

    } catch (error) {
        console.error("Erro no deletePhoto:", error);
        res.status(500).json({ errors: ["Erro ao excluir a foto"] });
    }
};

const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);
}

const getUserPhotos = async(req, res) => {
    const {id} = req.params;

    const photos = await Photo.find({ userId: id}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);
}

const getPhotoById = async (req, res) => {
    const { id } = req.params;

    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] });
        }

        res.status(200).json(photo);
    } catch (error) {
        res.status(400).json({ errors: ["ID inválido"] });
    }
};

const updatePhoto = async(req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada"]})
        return
    }

    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({errors: ["Ocorreu um erro, tente novamente"]})
        return;
    }

    if(title) {
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({photo, message: "Foto atualizado com sucesso"})
}

const likePhoto = async (req, res) => {
    const { id } = req.params;
    const reqUser = req.user;

    try {
        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] });
        }

        if (photo.likes.includes(reqUser._id)) {
            return res.status(422).json({ errors: ["Você já curtiu essa foto"] });
        }

        photo.likes.push(reqUser._id);
        await photo.save();

        return res.status(200).json({ 
            photoId: id, 
            userId: reqUser._id, 
            message: "A foto foi curtida" 
        });

    } catch (error) {
        res.status(500).json({ errors: ["Erro ao curtir a foto"] });
        return;
    }
    
};

const commentPhoto = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const reqUser = req.user;

    try {
        const user = await User.findById(reqUser._id);
        if (!user) {
            return res.status(404).json({ errors: ["Usuário não encontrado"] });
        }

        const photo = await Photo.findById(id);
        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada"] });
        }

        const userComment = {
            comment,
            userName: user.nome,
            userImage: user.profileImage,
            userId: user._id,
        };

        if (!photo.comments) {
            photo.comments = [];
        }

        photo.comments.push(userComment);
        await photo.save();

        return res.status(200).json({
            comment: userComment,
            message: "O comentário foi adicionado",
        });

    } catch (error) {
        return res.status(500).json({ errors: ["Erro ao adicionar comentário"] });
    }
};

const searchPhotos = async(req, res) => {

    const {q} = req.query;

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

    res.status(200).json(photos);

}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos
}