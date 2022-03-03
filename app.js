require("dotenv").config();
const express = require("express");
const app = express(); //create express app

app.set("view engine", "ejs"); //use EJS for view engine
app.use(express.static("public")) //static files served from /public/, (eg. url.com/img/example.png serves from /public/img/example.png)

let session = require('express-session');
app.use(session({secret: "Shh, its a secret!"})); //REPLACE THE SECRET WITH SOMETHING SECURE LATER

let bodyParser = require("body-parser");
app.use(bodyParser.json()); //body parser for json
app.use(bodyParser.urlencoded()); //body parser for urlencoded

const { Router, response } = require("express");

const db = require("./db.js");
const mongoose = require('mongoose')

const { UserRefreshClient } = require("google-auth-library");

//passport middleware
// app.use(passport.initialize());
// app.use(passport.session());


//app.use takes a function that is added to the path of a request. When we call next() it goes to the next function in the path 
app.use(async (req, res, next) => {
    if(req.session.userId) req.user = await (await db.getUserModel()).findOne({_id: mongoose.Types.ObjectId(req.session.userId)}); //if there is a user id, set req.user to that user data object
    console.log(req.session.userId,req.user)
    if (!(req.path.startsWith("/auth") || req.path.startsWith("/login")) && req.user && req.user.roles.length == 0) { //make sure that the user completes the auth flow, people without roles are bad and arent allowed to do anything
        res.redirect("/login?firstTimeFlow");
        return;
    }
    next();
})

//routes
app.use("/tutee", require("./routes/tutee.js")); //anything send to /tutee... will be sent to tutee.js
app.use("/summary", require("./routes/summary.js"));
app.use("/auth", require("./routes/auth.js"));
app.use("/autocomplete", require("./routes/autocomplete.js"));
app.use("/board", require("./routes/board.js"));
app.use("/parent", require("./routes/parent.js"));
app.use("/export", require("./routes/export.js"));
app.use("/profile", require("./routes/profile.js"));
app.get("/", (req,res) => {
    res.render("index.ejs", {user: req.user});
})

app.get("/login", (req,res) => {
    res.render("login.ejs");
})

app.post("/login", (req,res) => {
    // need to get done
})

app.get("/register", (req,res) => {
    res.render("register.ejs")
})

app.post("/register", async (req,res) => {
    // need to get done
})

//error handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).render("error", {code: 500, description: "Internal Server Error"})
})

app.use((req,res,next) => {
    res.status(404).render("error", {code: 404, description: "The Requested Page Was Not Found"})
})

app.listen(8080, () => {console.log("Listening on port 8080")});
