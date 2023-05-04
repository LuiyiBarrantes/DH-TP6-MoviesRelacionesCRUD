const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genresController');
const genreValidator = require('../../validations/genreValidator');

router.get('/genres', genresController.list);
router.get('/genres/detail/:id', genresController.detail);
router.get('/genres/add', genresController.add)
router.post('/genres/create', genreValidator, genresController.store)
router.get('/genres/edit/:id', genresController.edit)
router.post('/genres/update/:id', genreValidator, genresController.update)
router.get('/genres/delete/:id', genresController.delete);
router.post('/genres/delete/:id', genresController.destroy);



module.exports = router;