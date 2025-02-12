const { body } = require("express-validator");

const userCreateValidation = () => {
    return [
        body("nome").isString().withMessage("O nome é obrigatório"),
        body("email")
            .isString().withMessage("O e-mail é obrigatório")
            .isEmail().withMessage("Coloque um e-mail válido"),
        body("senha")
            .isString().withMessage("A senha é obrigatória")
            .isLength({ min: 8 }).withMessage("A senha precisa ter pelo menos 8 caracteres"),
        body("confirmsenha")
            .isString().withMessage("A confirmação de senha é obrigatória")
            .custom((value, { req }) => {
                if (value !== req.body.senha) {
                    throw new Error("As senhas não são iguais");
                }
                return true;
            })
    ];
}

module.exports = {
    userCreateValidation
};