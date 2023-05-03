const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const Movie = require('../database/models/Movie');
const { validationResult } = require('express-validator');

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            order: [
                ['title', 'ASC']
            ]
        })
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
            .catch(error => console.log(error));
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id, {
            include: ["genero", "actores"]
        })
            .then(movie => {
                //res.send(movie)
                res.render('moviesDetail.ejs', { movie });
            })
            .catch(error => console.log(error));;
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            })
            .catch(error => console.log(error));;
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            })
            .catch(error => console.log(error));;
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    'add': function (req, res) {
        //res.send(db.Genre)
        const allGenres = db.Genre.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
        const allActors = db.Actor.findAll({
            order: [
                ['last_name', 'ASC']
            ]
        })

        Promise.all([allGenres, allActors])
            .then(([allGenres, allActors]) => {
                // res.send(movie.release_date.toISOString())
                //.split("T")[0] res.send([movie,allGenres])
                return res.render('moviesAdd', {
                    allGenres,
                    allActors
                })
            })
            .then(allGenres =>
                res.render('moviesAdd', {
                    allGenres
                }))
            .catch(error => console.log(error));
    },
    'create': function (req, res) {
        const errors = validationResult(req);
        const { title, rating, awards, release_date, length, genre_id } = req.body;
        const actorsId = req.body.actors_id

        if (errors.isEmpty()) {
            db.Movie.create({
                rating,
                awards,
                release_date,
                length,
                genre_id,
                title: title.trim()
            }).then(newMovie => {

                if (actorsId) {
                    if (Array.isArray(actorsId)) {
                        actorsId.forEach(actorId => {
                            db.Actor.findOne({
                                where: {
                                    id: actorId
                                }
                            }).then(actor => {
                                db.Actor_Movie.create({
                                    actor_id: actor.id,
                                    movie_id: newMovie.id
                                })
                            })
                        })
                    } else {
                        db.Actor.findOne({
                            where: {
                                id: actorsId
                            }
                        }).then(actor => {
                            db.Actor_Movie.create({
                                actor_id: actor.id,
                                movie_id: newMovie.id
                            })
                        })
                    }
                }
                /* })
                .then(newMovie=>{ */
                console.log(newMovie);
                return res.redirect('/movies')
            }).catch(error => console.log(error));

        } else { 
            // return res.send( {old:req.body,  errors:errors.mapped()}/**/)
            const allGenres = db.Genre.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })
            const allActors = db.Actor.findAll({
                order: [
                    ['last_name', 'ASC']
                ]
            })

            Promise.all([allGenres, allActors])
                .then(([allGenres, allActors]) => {
                    // res.send(movie.release_date.toISOString())
                    //.split("T")[0] res.send([movie,allGenres])
                    return res.render('moviesAdd', {
                        allGenres,
                        allActors,
                        errors: errors.mapped(),
                        old: req.body,
                    })
                })
                .catch(error => console.log(error));
        }

        //return res.send(req.body)
        /* const newMovie = */
    },
    'edit': function (req, res) {
        const movie = db.Movie.findByPk(req.params.id, {
            include: ["genero", "actores"]
        })

        const allGenres = db.Genre.findAll({
            order: [
                ['name', 'ASC']
            ]
        })

        const allActors = db.Actor.findAll({
            order: [
                ['last_name', 'ASC']
            ]
        })

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
        const errors = validationResult(req);
        const { id } = req.params
        const { title, rating, awards, release_date, length, genre_id, actors_id } = req.body;
        
        //return res.send(req.body)
        if (errors.isEmpty()) {
            
        
        db.Actor_Movie.destroy({
            where: {
                movie_id: id
            }
        })
            .then(() => {
                return db.Movie.update({
                    title: title.trim(),
                    rating: rating,
                    awards: awards,
                    release_date: release_date,
                    length: length,
                    genre_id: genre_id
                }, {
                    where: {
                        id: id
                    }
                })
            })
            .then(result => {
                console.log(result);
                if (actors_id) {
                    if (Array.isArray(actors_id)) {
                        actors_id.forEach(actor_id => {
                            db.Actor.findOne({
                                where: {
                                    id: actor_id
                                }
                            }).then(actor => {
                                db.Actor_Movie.create({
                                    actor_id: actor.id,
                                    movie_id: id
                                });
                            });
                        });
                    } else {
                        db.Actor.findOne({
                            where: {
                                id: actors_id
                            }
                        }).then(actor => {
                            db.Actor_Movie.create({
                                actor_id: actor.id,
                                movie_id: id
                            });
                        });
                    }
                }
                return res.redirect('/movies' /* /detail/' + id */)

            })
            .catch(error => console.log(error))
        } else {
            const movie = db.Movie.findByPk(req.params.id, {
                include: ["genero", "actores"]
            })
    
            const allGenres = db.Genre.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })
    
            const allActors = db.Actor.findAll({
                order: [
                    ['last_name', 'ASC']
                ]
            })
    
            Promise.all([movie, allGenres, allActors])
                .then(([movie, allGenres, allActors]) => {
                    // return res.send(movie)
                    // res.send(movie.release_date.toISOString())
                    //.split("T")[0] res.send([movie,allGenres])
                    return res.render('moviesEdit', {
                        Movie: movie,
                        allGenres,
                        allActors,
                        errors: errors.mapped(),
                        old: req.body,
                    })
                })
                .catch(error => console.log(error));
        }
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

module.exports = moviesController;