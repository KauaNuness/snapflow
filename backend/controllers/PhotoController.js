const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

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


module.exports = {
    insertPhoto,
    deletePhoto
}