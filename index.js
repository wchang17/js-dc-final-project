const express = require('express')
const hbs  = require('express-handlebars')
const mongoose = require("mongoose")
const request = require('request')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const routes = require('./routes/index')

const app = express()


//auth stuff
mongoose.connect("mongodb://admin:admin@pokedex-shard-00-00-emqy4.mongodb.net:27017,pokedex-shard-00-01-emqy4.mongodb.net:27017,pokedex-shard-00-02-emqy4.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=pokedex-shard-0&authSource=admin")

app.engine('handlebars', hbs({
  defaultLayout: 'default',
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
app.use( express.static('public') )
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
//end of auth stuff

app.get('/', function(req, res){
  request.get('https://newsapi.org/v1/sources?language=en', ( error, response, body ) => {
    let data = JSON.parse(body)
    res.render('index', {data})
  })
})

app.get('/source/:id', function(req, res){
  request.get(`https://newsapi.org/v1/articles?source=${req.params.id}&sortBy=top&apiKey=2f94009c02d6422eae47c2195597f437`, ( error, response, body ) => {
    let data = JSON.parse(body)
    console.log(data)
    res.render('source', {data})
  })
})

app.get('/trending', function(req, res){
  request.get('https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=2f94009c02d6422eae47c2195597f437', ( error, response, body ) => {
    let data = JSON.parse(body)
    res.render('trending', {data})
  })
})

app.get('/list', function(req, res) {
	res.render('list')
})

app.listen( 3000)


