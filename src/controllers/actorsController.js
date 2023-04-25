const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const Actor = require('../database/models/Actor');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const actorsController = {
    'list': (req, res) => {
        db.Actor.findAll()
            .then(actors => {
                res.render('actorsList.ejs', {actors})
            })
            .catch(error=>console.log(error));
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,{
            include:["genero","actores"]
        })
            .then(movie => {
                //res.send(movie)
                res.render('moviesDetail.ejs', {movie});
            })
            .catch(error=>console.log(error));;
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            })
            .catch(error=>console.log(error));;
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            })
            .catch(error=>console.log(error));;
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        //res.send(db.Genre)
        const allGenres = db.Genre.findAll()
        const allActors = db.Actor.findAll()
        
        Promise.all([allGenres,allActors])
            .then(([allGenres,allActors]) => {
                // res.send(movie.release_date.toISOString())
                //.split("T")[0] res.send([movie,allGenres])
                 return res.render('moviesAdd', {                    
                    allGenres,
                    allActors})
            })
        .then(allGenres=>
            res.render('moviesAdd',{
            allGenres
        }))
        .catch(error=>console.log(error));
    },
    create: function (req,res) {

        const {title} = req.body;

        db.Movie.create({
            ...req.body,
            title : title.trim()
        })
        .then(newMovie=>{
            console.log(newMovie);
            return res.redirect('/movies')
        })
        .catch(error=>console.log(error));
    },
    edit: function(req,res) {
        const movie = db.Movie.findByPk(req.params.id,{
            include:["genero","actores"]
        })

        const allGenres = db.Genre.findAll()

        const allActors = db.Actor.findAll()
        
        Promise.all([movie,allGenres,allActors])
            .then(([movie,allGenres,allActors]) => {
                // return res.send(movie)
                // res.send(movie.release_date.toISOString())
                //.split("T")[0] res.send([movie,allGenres])
                 return res.render('moviesEdit', {
                    Movie:movie,
                    allGenres,
                    allActors})
            })
            .catch(error=>console.log(error));
    },
    update: function (req,res) {
        const {id}=req.params
        //return res.send(req.body)
        Movies.update({
            ...req.body,
            title : req.body.title.trim()
        },{
            where: {
            id : id
        }})
        .then(result=>{
            console.log(result);
            
            return res.redirect('/movies/detail/'+id)
        })
        .catch(error=>console.log(error))
    },
    delete: function (req,res) {
        const {id} = req.params
        /* const movie =  */db.Movie.findByPk(id)

        /* const allGenres = db.Genre.findAll()

        Promise.all([movie,allGenres]) */
            .then((/* [movie,allGenres] */Movie) => { 
                // return res.send(Movie)
                // .split("T")[0] res.send([movie,allGenres])
                 return res.render('moviesDelete', {Movie} /* {Movie:movie,                allGenres} */)
            })
            .catch(error=>console.log(error));
    },
    destroy: function (req,res) {
        const {id}= req.params
        db.Movie.destroy({
            where:{id:id}
        })
        .then(()=>{
            return res.redirect('/movies')
        })
        .catch(error=>console.log(error));
    }
}

module.exports = actorsController;