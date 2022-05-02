const mongoose = require('mongoose');
const db = mongoose.connection;
const url = "mongodb://127.0.0.1:27017/apod";

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser : true})

const Schema = mongoose.Schema
const apodSchema = Schema({
    title: {
        type: String, 
        required: true
    },
    url: {
        type: String, 
        required: true
    }, 
    rating : {
        type: Integer, 
        required: true
    }
}, {collection: 'images'});

const APOD = mongoose.model("APOD", apodSchema);

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const port = process.env.PORT || 3000;

// CODE GOES HERE 

app.get("/", function (req, res) {
    // GET "/" should return a list of all APOD images stored in our database
    APOD.find().exec((error, images) => {
        if (error) {
            console.log(error)
            res.send(500)
        } else {
            res.json(images);
        }
    })
});

app.get("/favorite", function (req, res) {
    // GET "/favorite" should return our favorite image by highest rating
    APOD.find().sort({'rating':'desc'}).exec((error, images) => {
        if (error) {
            console.log(error)
            res.send(500)
        } else {
            res.json({favorite: images[0]})
        }
    })
});

app.post("/add", function (req, res) {
    // POST "/add" adds an APOD image to our database
    APOD.insertOne( {"title" : req.title, "rating" : req.rating, "url" : req.url}).exec((error)) => {
        if (error) {
            console.log(error)
            res.send(500)
        } else {
            res.json({})
        }
    }
});

app.delete("/delete", function (req, res) {
    // DELETE "/delete" deletes an image according to the title 
    APOD.find().deleteOne( {"title" : "desc"}).exec(error, image) => {
        if (error) {
            console.log(error)
            res.send(500)
        } else {
            res.json({})
        }
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});