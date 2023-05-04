const { validationResult } = require('express-validator');
const db = require('../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': (req, res) => {
        db.Genre.findAll()
            .then(genres => {
                res.render('genresList.ejs', { genres })
            }).catch(error => console.log(error));
    },
    'detail': (req, res) => {
        db.Genre.findByPk(req.params.id, {
            include: ["peliculas"]
        })
            .then(genre => {
                //res.send(genre)
                res.render('genresDetail.ejs', { genre });
            }).catch(error => console.log(error));;
    },
    'add': (req, res) => {

        return res.render('genresAdd')

    },
    'store': (req, res) => {
        const errors = validationResult(req);
        const { name } = req.body
        //const { count } = db.Genre.findAndCountAll()
       /* db.Genre.findAll().then( genres => {
            const lastRanking = genres.length
            return res.send(lastRanking /* count )
        }
        )
        */
         if (errors.isEmpty()) {
            db.Genre.findAll().then( genres =>{      
            db.Genre.create({
                ...req.body,
                name:name.trim(),
                ranking: genres.length + 1
            }).then(newGenre => {
                console.log(newGenre);

                return res.redirect('/genres')
            })
        }).catch(error => console.log(error));
        } else {
            return res.render('genresAdd',{
                    errors: errors.mapped(),
                    old: req.body,
                }
            )
        }
    },
    'edit': function (req, res) {
        db.Genre.findByPk(req.params.id)
            .then(genre => {
                // return res.send(actorToUpdate)
                // res.send(actorToUpdate.release_date.toISOString())
                //.split("T")[0] res.send([actorToUpdate,allMovies])
                return res.render('genresEdit', {
                    genre
                })
            })
            .catch(error => console.log(error));
    },
    'update': function (req,res) {
        const errors = validationResult(req);
        const { name } = req.body
        //const { count } = db.Genre.findAndCountAll()
       /* db.Genre.findAll().then( genres => {
            const lastRanking = genres.length
            return res.send(lastRanking /* count )
        }
        )
        */
         if (errors.isEmpty()) {
                  
            db.Genre.update({
                ...req.body,
                name:name.trim(),                
            },{
                where:{
                    id : req.params.id,
                }
            }).then(updatedGenre => {
                console.log(updatedGenre);

                return res.redirect('/genres')
            }).catch(error => console.log(error));
        } else {
            db.Genre.findByPk(req.params.id)
            .then(genre => {
                // return res.send(actorToUpdate)
                // res.send(actorToUpdate.release_date.toISOString())
                //.split("T")[0] res.send([actorToUpdate,allMovies])
                return res.render('genresEdit', {
                    genre,
                    errors: errors.mapped(),
                    old: req.body,
                })
            })
            .catch(error => console.log(error));
        }
    },
    'delete': function (req, res) {
        const { id } = req.params
        db.Genre.findByPk(id)

            
            .then((genre) => {
                // return res.send(Movie)
                // .split("T")[0] res.send([movie,allGenres])
                return res.render('genresDelete', { genre } )
            })
            .catch(error => console.log(error));
    },
    'destroy': function (req, res) {
        const { id } = req.params
        db.Genre.destroy({
            where: { id: id }
        })
            .then(() => {
                return res.redirect('/genres')
            })
            .catch(error => console.log(error));
    }

}

module.exports = genresController;