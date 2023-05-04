const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');

const actorsController = {
    'list': (req, res) => {
        db.Actor.findAll({
            order: [
                ['last_name', 'ASC']
            ]
        })
            .then(actors => {
                res.render('actorsList.ejs', { actors })
            })
            .catch(error => console.log(error));
    },
    'detail': (req, res) => {
        db.Actor.findByPk(req.params.id, {
            include: ["peliculas", "favorite_movie"]
        })
            .then(actor => {
                // res.send(actor)
                res.render('actorsDetail.ejs', { actor });
            })
            .catch(error => console.log(error));;
    },
    'recomended': (req, res) => {
        db.Actor.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(actors => {
                res.render('recommendedActors.ejs', { actors });
            })
            .catch(error => console.log(error));;
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    'add': function (req, res) {
        //res.send(db.Genre)
        db.Movie.findAll({
            order: [
                ['title', 'ASC']
            ]
        })
            .then((movies) => {
                // res.send(movie.release_date.toISOString())
                //.split("T")[0] res.send([movie,allGenres])
                return res.render('actorsAdd', {
                    movies
                })
            })
            .catch(error => console.log(error));
    },
    'create': function (req, res) {
        const errors = validationResult(req);
        const { first_name, last_name } = req.body;

        if (errors.isEmpty()) {
            db.Actor.create({
                ...req.body,
                first_name: first_name.trim(),
                last_name: last_name.trim()

            })
                .then(newActor => {
                    console.log(newActor);
                    return res.redirect('/actors')
                })
                .catch(error => console.log(error));
        } else {
            db.Movie.findAll({
                order: [
                    ['title', 'ASC']
                ]
            })
                .then((movies) => {
                    // res.send(movie.release_date.toISOString())
                    //.split("T")[0] res.send([movie,allGenres])
                    return res.render('actorsAdd', {
                        movies,
                        errors: errors.mapped(),
                        old: req.body,
                    })
                })
                .catch(error => console.log(error));
        }
    },
    'edit': function (req, res) {
        const actorToUpdate = db.Actor.findByPk(req.params.id, {
            include: ["favorite_movie"]
        })

        const allMovies = db.Movie.findAll({
            order: [
                ['title', 'ASC']
            ]
        })

        Promise.all([actorToUpdate, allMovies])
            .then(([actorToUpdate, allMovies]) => {
                // return res.send(actorToUpdate)
                // res.send(actorToUpdate.release_date.toISOString())
                //.split("T")[0] res.send([actorToUpdate,allMovies])
                return res.render('actorsEdit', {
                    actor: actorToUpdate,
                    allMovies
                })
            })
            .catch(error => console.log(error));
    },
    'update': function (req, res) {
        const errors = validationResult(req);
        const { id } = req.params
        const { first_name, last_name } = req.body;

        //return res.send(req.body)
        if (errors.isEmpty()) {


            db.Actor.update({
                ...req.body,
                first_name: first_name.trim(),
                last_name: last_name.trim()
            }, {
                where: {
                    id: id
                }
            })
                .then(result => {
                    console.log(result);

                    return res.redirect('/actors')
                })
                .catch(error => console.log(error))
        } else {
            const actorToUpdate = db.Actor.findByPk(req.params.id, {
                include: ["favorite_movie"]
            })

            const allMovies = db.Movie.findAll({
                order: [
                    ['title', 'ASC']
                ]
            })

            Promise.all([actorToUpdate, allMovies])
                .then(([actorToUpdate, allMovies]) => {
                    // return res.send(actorToUpdate)
                    // res.send(actorToUpdate.release_date.toISOString())
                    //.split("T")[0] res.send([actorToUpdate,allMovies])
                    return res.render('actorsEdit', {
                        actor: actorToUpdate,
                        allMovies,
                        errors: errors.mapped(),
                        old: req.body,
                    })
                })
                .catch(error => console.log(error));
        }

    },
    'delete': function (req, res) {
        const { id } = req.params
        db.Actor.findByPk(id)


            .then((actor) => {
                // return res.send(Movie)
                // .split("T")[0] res.send([movie,allGenres])
                return res.render('actorsDelete', { actor })
            })
            .catch(error => console.log(error));
    },
    'destroy': function (req, res) {
        const { id } = req.params
        db.Actor.destroy({
            where: { id: id }
        })
            .then(() => {
                return res.redirect('/actors')
            })
            .catch(error => console.log(error));
    }
}

module.exports = actorsController;