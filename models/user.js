const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const accountSchema = new Schema({
	username: String,
	password: String,
	favoriteArticles: Array
})

accountSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', accountSchema)