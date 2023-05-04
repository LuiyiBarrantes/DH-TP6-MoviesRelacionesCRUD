const { check, body } = require('express-validator');

module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({ min: 2 }).withMessage('Mínimo de dos letras').bail()
        .isAlpha('es-ES', {
            ignore: " "
        }).withMessage('Solo caracteres alfabéticos'),
    check('active')
        .notEmpty().withMessage('Elegir una opcion').bail(),

]