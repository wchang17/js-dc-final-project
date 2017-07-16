const express = require('express')
const request = require('request')
const mongoose = require("mongoose")
const hbs  = require('express-handlebars')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const routes = require('./routes/index')

const app = express()


//auth stuff
mongoose.connect("mongodb://admin:admin@pokedex-shard-00-00-emqy4.mongodb.net:27017,pokedex-shard-00-01-emqy4.mongodb.net:27017,pokedex-shard-00-02-emqy4.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=pokedex-shard-0&authSource=admin")

app.engine('handlebars', hbs({
  defaultLayout: 'main',
  helpers: {
    equal: function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters")
        if( lvalue != rvalue ) {
            return options.inverse(this)
        } else {
            return options.fn(this)
        }
    }
  }
}))
//end

app.set('view engine', 'handlebars')


//auth stuff
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const User = require('./models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/', routes) //this is for auth route views
//end of auth stuff

//css file
app.use( express.static('public') )

//homepage api request
app.get('/', function(req, res){
  request.get('https://newsapi.org/v1/sources?language=en', ( error, response, body ) => {
    let data = JSON.parse(body)
    res.render('index', {data, user: req.user })
  })
})

//single news source api request
app.get('/source/:id', function(req, res){
  request.get(`https://newsapi.org/v1/articles?source=${req.params.id}&sortBy=top&apiKey=2f94009c02d6422eae47c2195597f437`, ( error, response, body ) => {
    let data = JSON.parse(body)
    // console.log(data)
    res.render('source', {data, user: req.user})
  })
})

//trending articles api request
app.get('/trending', function(req, res){
  request.get('https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=2f94009c02d6422eae47c2195597f437', ( error, response, body ) => {
    let data = JSON.parse(body)
    res.render('trending', {data, user: req.user})
  })
})

//reading list route
// const Article = require('../models/article')
app.get('/list', function(req, res) {
  // Article.findOne({ '_id': req.params.id }, ( err, todo ) => {
  //   article.remove()
  //   res.redirect('/list')
  // })
	res.render('list', {user: req.user})
})

//Posting articles from trending and sources to list
// app.post('/source/:id', function(req, res) {
//   let listItem = new listItem({
//     article: req.body.article
//   })
//   listItem.save()
//   res.redirect('/list')
// })

// app.post('/trending', function(req, res) {
//   let listItem = new listItem({
//     article: req.body.article
//   })
//   listItem.save()
//   res.redirect('/list')
// })



app.listen( 3000)


