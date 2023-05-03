const { check, body } = require('express-validator');

module.exports = [
    check('title')
        .notEmpty().withMessage('El título es obligatorio').bail()
        .isLength({ min: 2 }).withMessage('Mínimo de dos letras').bail()
        .isAlpha('es-ES', {
            ignore: " "
        }).withMessage('Solo caracteres alfabéticos'),
    check('rating')
        .notEmpty().withMessage('El rating es obligatorio').bail(),
    check('awards')
        .notEmpty().withMessage('Los premios son obligatorios').bail(),
    check('release_date')
        .notEmpty().withMessage('Debes elegir la fecha de estreno'),
    check('length')
        .notEmpty().withMessage('La duracion es obligatoria').bail(),
    check('genre_id')
        .notEmpty().withMessage('Debes elegir una categoría'),
    check('actors_id')
        .notEmpty().withMessage('Debes elegir al menos un actor'),   /*
    .isNumeric({ no_symbols: true }).withMessage('Ingresar solo numeros').bail()
    */
]