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

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
    secret: "This is used to decrypt the encrypted session files",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

//reading a session tasking data from session thats encoded and unencoding it (deserialize does this) and
// encoding it and puting it back in the session (serialize does this)
// this serialise and deserialize are added automatically by passport mongoose used in user.js file
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home")
})

app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret")
})

app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err){
            console.log(err);
            res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    })
    // res.send("registered")

})

app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/register",
}), function(req, res){

})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }res.redirect("/login")
}

app.listen(3000, "localhost", function(){
    console.log("==================")
    console.log("||Auth app started")
    console.log("==================")
})