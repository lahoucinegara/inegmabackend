const express = require('express')
const mongoose = require('mongoose')
const Users = require("./models/config");
const app = express()
const port = 5000
const cors = require("cors");

app.use(express.json())
app.use(cors());

app.get('/', (req, res)=>{
    res.send('Hello')
})

// -------------get All users --------------
app.get('/users', async (req, res) => {
    let users = await Users.find();
    if(users.length>0) {
        res.send(users)
    } 
    else {
        res.send({result: 'No users found'})
    }
})

// -----------add new user-----------------

app.post('/newuser', async (req, res)=>{
    let newUser = new Users(req.body)
    //save
    let result = await newUser.save()
    res.send(result)
})

// ----------- get one user ---------------

app.get('/user/:id', async (req, res) => {
    let result = await Users.findOne({_id: req.params.id})
    if(result){
         res.send(result)
    }
    else {
         res.send({result: 'this product not existe'})
    }
 })



mongoose
.connect('mongodb+srv://inegma:inegma@myfirstnodejs.zupjduf.mongodb.net/inegma?retryWrites=true&w=majority')
.then(()=>{
    app.listen(port, ()=>{
        console.log({success:'Im listen to http://localhost:5000'})
    })
})
.catch((err)=>{
    console.log('error', err)
})

