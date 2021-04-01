const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID  = require('mongodb').ObjectID;
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('server is working!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@test.0kqsr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productCollection = client.db("techZone").collection("products");
    const orderCollection = client.db("techZone").collection("orders");
    
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/products', (req, res) => {
        productCollection.find()
        .toArray((err, products) => {
            res.send(products)
        })
    })

    app.get('/product/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productCollection.find({ _id: id })
        .toArray((err, products) => {
            res.send(products[0]);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/orders', (req, res) => {
        orderCollection.find({email: req.query.email})
        .toArray((err, products) => {
            res.send(products);
        })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        productCollection.findOneAndDelete({ _id: id })
        .then(result => {
            res.send(result.ok > 0);
        })
    })
});


app.listen(process.env.PORT || 4000)