const { body } = require("express-validator");

const userCreateValidation = () => {
    return [
        body("nome").isString().withMessage("O nome é obrigatório"),
        body("email")
            .isString().withMessage("O e-mail é obrigatório")
            .isEmail().withMessage("Coloque um e-mail válido"),
        body("senha")
            .isString().withMessage("A senha é obrigatória")
            .isLength({ min: 3 }).withMessage("A senha precisa ter pelo menos 3 caracteres"),
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

const loginValidation = () => {
    return [
        body("email").isString().withMessage("Insira o e-mail").isEmail().withMessage("Insira um e-mail válido"),
        body("senha").isString().withMessage("Insira a senha")
    ]
}

const userUpdateValidation = () =>{
    return[
        body("nome").optional().isLength({min:3}).withMessage("O nome precisa de pelo menos 3 caracteres"),
        body("senha").optional().isLength({min: 5}).withMessage("A senha precisa ter no mínimo 5 caracteres"),
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
};