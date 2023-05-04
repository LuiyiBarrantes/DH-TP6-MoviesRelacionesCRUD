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
            include: ["peliculas","favorite_movie"]
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
        const { first_name,last_name } = req.body;

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
        const movie = db.Movie.findByPk(req.params.id, {
            include: ["genero", "actores"]
        })

        const allGenres = db.Genre.findAll()

        const allActors = db.Actor.findAll()

        Promise.all([movie, allGenres, allActors])
            .then(([movie, allGenres, allActors]) => {
                // return res.send(movie)
                // res.send(movie.release_date.toISOString())
                //.split("T")[0] res.send([movie,allGenres])
                return res.render('moviesEdit', {
                    Movie: movie,
                    allGenres,
                    allActors
                })
            })
            .catch(error => console.log(error));
    },
    'update': function (req, res) {
        const { id } = req.params
        //return res.send(req.body)
        db.Movie.update({
            ...req.body,
            title: req.body.title.trim()
        }, {
            where: {
                id: id
            }
        })
            .then(result => {
                console.log(result);

                return res.redirect('/movies/detail/' + id)
            })
            .catch(error => console.log(error))
    },
    'delete': function (req, res) {
        const { id } = req.params
        /* const movie =  */db.Movie.findByPk(id)

            /* const allGenres = db.Genre.findAll()
    
            Promise.all([movie,allGenres]) */
            .then((/* [movie,allGenres] */Movie) => {
                // return res.send(Movie)
                // .split("T")[0] res.send([movie,allGenres])
                return res.render('moviesDelete', { Movie } /* {Movie:movie,                allGenres} */)
            })
            .catch(error => console.log(error));
    },
    'destroy': function (req, res) {
        const { id } = req.params
        db.Movie.destroy({
            where: { id: id }
        })
            .then(() => {
                return res.redirect('/movies')
            })
            .catch(error => console.log(error));
    }
}

module.exports = actorsController;