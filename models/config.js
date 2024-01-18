const mongoose = require('mongoose')

const Schema = mongoose.Schema

// define schema
const userSchema = new Schema({
    name: String,
    email: String,
    sponsorName: String,
    sponsorId: String,
    password: String,
    nationality: String,
    birth: String,
    identity: String,
    country: String,
    postalCode: String,
    address1: String,
    address2: String,
    city: String,
    region: String,
    phoneNumber: String
})

// Create model
const Users = mongoose.model('users', userSchema)
//export model
module.exports = Users