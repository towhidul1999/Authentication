require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
require("./config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./models/User");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    //   cookie: { secure: true }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});

//get register page
app.get("/register", (req, res) => {
  res.render("register");
});

//post register
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(400).json("User already exists");
    }

    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = await User({
        username: req.body.username,
        password: hash,
      });
      await newUser.save();
      res.status(201).redirect("/login");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//login get page
app.get("/login", (req, res) => {
  res.render("login");
});

//   login post
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "profile",
  })
);

//get profile page
app.get("/profile", (req, res) => {
  res.render("profile");
});

// logout
app.get("/logout", (req, res) => {
  res.redirect("/");
});

module.exports = app;
