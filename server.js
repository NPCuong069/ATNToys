// server.js
//console.log('May Node be with you')
const crypto = require("crypto")
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://92176099:Bunoi123@cluster0.eohy8jn.mongodb.net/atntoys'

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        // (1a) CREATE: client -> create -> database -> 'star-wars-quotes'
        // -> create -> collection -> 'quotes'
        const db = client.db('atn-toys')
        const toysCollection = db.collection('toys')
        
        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs') 
        
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // To make the 'public' folder accessible to the public
        app.use(express.static('public'))

        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'quotes' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('toys').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { toys: results })
                })
                .catch(/* ... */)
        })
        app.get('/create', (req, res) => {
            db.collection('toys').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('create.ejs', { toys: results })
                })
                .catch(/* ... */)
        })
        app.get('/home', (req, res) => {
            db.collection('toys').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('home.ejs', { toys: results })
                })
                .catch(/* ... */)
        })
        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        // -> post -> '/quotes' -> collection -> insert -> result
        app.post('/toys', (req, res) => {
            req.body.toyId=crypto.randomUUID().toString;
            toysCollection.insertOne(req.body)
            .then(result => {
                
                // results -> server -> console
                console.log(result)

                // -> redirect -> '/'
                res.redirect('/')
             })
            .catch(error => console.error(error))
        })

        app.post('/delete', (req, res) => {
            toysCollection.deleteOne(
                { _id: new mongodb.ObjectId(req.body._id) }
            )
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))
        })
        app.post('/update', (req, res) => {
            toysCollection.findOne(
                { _id: new mongodb.ObjectId(req.body._id) }
            )
            .then(result => {
                console.log(result)
                res.render('update.ejs', { toy: result })
            })
            .catch(error => console.error(error))
        })
        app.post('/updateData', (req, res) => {
            toysCollection.findOneAndUpdate(
                { _id: new mongodb.ObjectId(req.body._id) },
                {
                    $set: {
                        name: req.body.name,
                        price:req.body.price,
                        description: req.body.description,
                        imageurl: req.body.imageurl
                    }
                }
            )
            .then(result => {
                console.log(result)
                res.redirect('/')
               })
            .catch(error => console.error(error))
        })
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, function() {
            console.log('listening on 4000')
        })
    })


