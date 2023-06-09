const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actorsController');
const actorValidator = require('../../validations/actorValidator');

router.get('/actors', actorsController.list);
router.get('/actors/recommended', actorsController.recomended);
router.get('/actors/detail/:id', actorsController.detail);
//Rutas exigidas para la creación del CRUD
router.get('/actors/add', actorsController.add);
router.post('/actors/create', actorValidator, actorsController.create);
router.get('/actors/edit/:id', actorsController.edit);
router.post('/actors/update/:id', actorValidator, actorsController.update);
router.get('/actors/delete/:id', actorsController.delete);
router.post('/actors/delete/:id', actorsController.destroy);

module.exports = router;