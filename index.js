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

app.get('/userlist', async (req, res) => {
    let users = await Users.find();
    if(users.length>0) {
        res.send(users)
    } 
    else {
        res.send({result: 'No users found'})
    }
})

app.post('/newuser', async (req, res)=>{
    let newUser = new Users(req.body)
    //save
    let result = await newUser.save()
    res.send(result)
})

app.post('/authentication/register', async (req, res)=>{
    let newUser = new Users(req.body)
    //save
    let result = await newUser.save()
    res.send(result)
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

