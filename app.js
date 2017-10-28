var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport")
var LocalStrategy = require("passport-local")
var passportLocalMongoose = require("passport-local-mongoose")
var bodyParser = require("body-parser");
const User = require("./models/user");
var expressSession = require("express-session");

mongoose.connect("mongodb://localhost/authdemo");


var app=express();

app.set("view engine", "ejs");

app.use(expressSession({
    secret: "This is used to decrypt the encrypted session files",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser())

// passport.use(new LocalStrategy(User.authenticate()));

//reading a session tasking data from session thats encoded and unencoding it (deserialize does this) and
// encoding it and puting it back in the session (serialize does this)
// this serialise and deserialize are added automatically by passport mongoose used in user.js file
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// const User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home")
})

app.get("/secret", function (req, res) {
    res.render("secret")
})

app.listen(3000, "localhost", function(){
    console.log("==================")
    console.log("||Auth app started")
    console.log("==================")
})