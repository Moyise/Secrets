require('dotenv').config()

const express = require('express')
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });



const User = mongoose.model("User", userSchema);


app.get('/', (req, res) => {
  
    res.render("home");
})

app.get('/login', (req, res) => {
  
    res.render("login");
})

app.get('/register', (req, res) => {
  
    res.render("register");
})


app.post('/register', function (req, res) {
  
    
    const userX = new User({
        email: req.body.username,
        password: req.body.password
    })
    userX.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});


app.post('/login', function (req, res) {
  
    const userName = req.body.username;
    const userPassword = req.body.password;
    
    User.findOne({email: userName}, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === userPassword) {
                    console.log("User found!");                   
                    res.render("secrets");
                } else {
                    console.log("Password incorrect!");
                }
            } else {
                console.log("User not found");
            }
        }
    })
})



app.listen(port, () => console.log(`listening on port 3000!`));