const express = require("express");
const mongoose = require("mongoose");
const Users = require("./models/config");
const Products = require('./models/product')
const JWT = require('jsonwebtoken');
const jwtkey = 'e-commerce';

const app = express();
const port = 5000;
const cors = require("cors");

const link = "mongodb+srv://gara123:gara123@myfirstnodejs.zupjduf.mongodb.net/e-commerce?retryWrites=true&w=majority";

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello gara");
});

//-------------------------register---------------------------//
app.post("/register", async (req, res) => {
  //create a new doc(users)
  let newUser = new Users(req.body);
  // save
  let result = await newUser.save();
  result = result.toObject();
  delete result.password;
  JWT.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
    if(err) {
        res.send({ result: "Something went wrong, Please try afer 2min" });
    }
    res.send({result, auth: token});
  })
});

//-------------------------login---------------------------//
app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await Users.findOne(req.body).select("-password");
    if (user) {
      JWT.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if(err) {
            res.send({ result: "Something went wrong, Please try afer 2min" });
        }
        res.send({user, auth: token});
      })
    } else {
      res.send({ result: "No user found" });
    }
  } else {
    res.send({ result: "No user found" });
  }
});


//----------------------Add product---------------------------//
app.post('/add-product', async (req, res) => {
    //create a new doc(product)
    let newProduct = new Products(req.body)
    // save
    let result = await newProduct.save();
    res.send(result)
})

//----------------------All product---------------------------//
app.get('/products', async (req, res) => {
    let products = await Products.find();
    if(products.length>0) {
        res.send(products)
    } 
    else {
        res.send({result: 'No Products found'})
    }
})

//----------------------Delete product---------------------------//
app.delete('/product/:id', async (req, res) => {
    let result = await Products.deleteOne({_id: req.params.id})
    res.send(result)
})

//----------------------get one product---------------------------//
app.get('/product/:id', async (req, res) => {
   let result = await Products.findOne({_id: req.params.id})
   if(result){
        res.send(result)
   }
   else {
        res.send({result: 'this product not existe'})
   }
})

//----------------------update product---------------------------//
app.put('/product/:id', async (req, res) => {
    try {
        const id = {_id: req.params.id};
        const updateData =  {$set: req.body};

        let result = await Products.updateOne(
            id,
            updateData,
        )
        if (!result) {
            return res.status(404).json({ error: 'Document not found' });
        }    
        res.send(result)
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
})


//----------------------search---------------------------//
app.get('/search/:key', async (req, res) =>{
    let result = await Products.find({
        "$or": [
            {name: { $regex: req.params.key }},
            {company: { $regex: req.params.key }},
            {price: { $regex: req.params.key }},
            {category: { $regex: req.params.key }}
        ]
    })
    res.send(result)
})

mongoose
  .connect(link)
  .then(() => {
    app.listen(port, () => {
      console.log("Im listen to http://localhost:5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

