const express = require("express")
const passport = require('passport')

const User = require('../models/user')

// Create a router for handling our application and sign-up flow
const router = express.Router()


// Signing up as a new user
router.get('/signup', function( req, res ) {

  res.render('signup', {})

}).post('/signup', function( req, res ) {

  User.register(new User({
    username: req.body.username
  }), req.body.password, function( err, account ) {
    if ( err ) {
      console.log( err )
      // return res.render('signup', { err })
      return res.render('signup', { account: account })
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/')
    })

  })

})

// Loging in as an existing user
router.get('/login', function( req, res ) {

  res.render('login', { user: req.user })

}).post('/login',
  passport.authenticate('local'),
  function( req, res ) {
    res.redirect('/')
  }
)

// Logging out
router.get('/logout', function ( req, res ) {
  req.logout()
  res.redirect('/')
})

module.exports = router