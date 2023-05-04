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
    /* check('favorite_movie_id')
        .notEmpty().withMessage('Debes elegir una categoría'),
    check('actors_id')
        .notEmpty().withMessage('Debes elegir al menos un actor'), */   /*
    .isNumeric({ no_symbols: true }).withMessage('Ingresar solo numeros').bail()
    */
]