const express = require('express')
const hbs  = require('express-handlebars')
const request = require('request')

const app = express()

app.use( express.static('public') )

app.engine('handlebars', hbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')


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


