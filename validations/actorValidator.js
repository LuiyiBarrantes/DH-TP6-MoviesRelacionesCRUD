const { check, body } = require('express-validator');

module.exports = [
    check('first_name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({ min: 2 }).withMessage('Mínimo de dos letras').bail()
        .isAlpha('es-ES', {
            ignore: " "
        }).withMessage('Solo caracteres alfabéticos'),
    check('last_name')
        .notEmpty().withMessage('El apellido es obligatorio').bail()
        .isLength({ min: 2 }).withMessage('Mínimo de dos letras').bail()
        .isAlpha('es-ES', {
            ignore: " "
        }).withMessage('Solo caracteres alfabéticos'),
    check('rating')
        .notEmpty().withMessage('El rating es obligatorio').bail(),
    
]